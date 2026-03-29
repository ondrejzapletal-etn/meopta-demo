/**
 * In-memory rate limiter with sliding window algorithm.
 * No external dependencies — suitable for single-instance deployments.
 *
 * Known limitations:
 * - In multi-instance deployments (e.g. Azure Container Apps with scale-out),
 *   each instance maintains its own independent store, so the effective rate
 *   limit becomes `limit × instance_count`. For stricter guarantees, replace
 *   with a shared store (e.g. Redis/Upstash).
 * - Rate limiting is per client IP, not per API key. Multiple keys from the
 *   same IP share a bucket; clients behind the same NAT also share a limit.
 *   For per-key limiting, key by the API key hash after authentication.
 *
 * Adapted from kamdu project reference implementation.
 */

interface RateLimitRecord {
  count: number;
  timestamps: number[];
  lastAccess: number;
}

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export const RATE_LIMITS = {
  api: { limit: 100, windowMs: 60 * 1000 },
} as const;

export class RateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private config: RateLimitConfig;
  private maxEntries: number;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: RateLimitConfig, maxEntries = 10000) {
    this.config = config;
    this.maxEntries = maxEntries;
    this.startCleanup();
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    let record = this.store.get(identifier);

    if (!record) {
      record = { count: 0, timestamps: [], lastAccess: now };
      this.store.set(identifier, record);
    }

    record.lastAccess = now;
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
    record.count = record.timestamps.length;

    if (record.count >= this.config.limit) {
      const oldestInWindow = record.timestamps.reduce((min, ts) => (ts < min ? ts : min), record.timestamps[0]!);
      const resetAt = oldestInWindow + this.config.windowMs;
      return { success: false, limit: this.config.limit, remaining: 0, resetAt };
    }

    record.timestamps.push(now);
    record.count = record.timestamps.length;

    if (this.store.size > this.maxEntries) {
      this.evictOldest();
    }

    return {
      success: true,
      limit: this.config.limit,
      remaining: this.config.limit - record.count,
      resetAt: now + this.config.windowMs,
    };
  }

  private evictOldest(): void {
    const entries = Array.from(this.store.entries());
    entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    const toRemove = Math.ceil(this.maxEntries * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const entry = entries[i];
      if (entry) this.store.delete(entry[0]);
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const windowStart = now - this.config.windowMs;
      for (const [key, record] of this.store.entries()) {
        record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
        if (record.timestamps.length === 0) {
          this.store.delete(key);
        }
      }
    }, 60 * 1000);

    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  get size(): number {
    return this.store.size;
  }
}

// Singleton
let apiLimiter: RateLimiter | null = null;

export function getApiRateLimiter(): RateLimiter {
  if (!apiLimiter) {
    apiLimiter = new RateLimiter(RATE_LIMITS.api);
  }
  return apiLimiter;
}

/**
 * Extract client IP from request headers.
 *
 * NOTE: X-Forwarded-For is trusted as-is, which is sufficient behind a known
 * reverse proxy (e.g. Azure Container Apps). Without a trusted proxy, clients
 * can spoof this header to bypass per-IP rate limiting.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0];
    return first ? first.trim() : 'unknown';
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString(),
    ...(result.success
      ? {}
      : { 'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString() }),
  };
}
