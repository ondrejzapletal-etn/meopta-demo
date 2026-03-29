import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  RateLimiter,
  getApiRateLimiter,
  getClientIp,
  createRateLimitHeaders,
  RATE_LIMITS,
} from '../rate-limit';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests under the limit', () => {
    const limiter = new RateLimiter({ limit: 5, windowMs: 60_000 });
    const result = limiter.check('ip-1');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.limit).toBe(5);
  });

  it('blocks after limit is exceeded', () => {
    const limiter = new RateLimiter({ limit: 3, windowMs: 60_000 });
    limiter.check('flood');
    limiter.check('flood');
    limiter.check('flood');
    const blocked = limiter.check('flood');
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('tracks different IPs independently', () => {
    const limiter = new RateLimiter({ limit: 2, windowMs: 60_000 });
    limiter.check('ip-a');
    limiter.check('ip-a');
    expect(limiter.check('ip-a').success).toBe(false);
    expect(limiter.check('ip-b').success).toBe(true);
  });

  it('resets after window expires', () => {
    const limiter = new RateLimiter({ limit: 2, windowMs: 60_000 });
    limiter.check('ip');
    limiter.check('ip');
    expect(limiter.check('ip').success).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(limiter.check('ip').success).toBe(true);
  });

  it('provides correct resetAt timestamp', () => {
    const limiter = new RateLimiter({ limit: 1, windowMs: 60_000 });
    const first = limiter.check('ip');
    expect(first.success).toBe(true);

    const blocked = limiter.check('ip');
    expect(blocked.success).toBe(false);
    expect(blocked.resetAt).toBeGreaterThan(Date.now());
  });

  it('evicts oldest entries when maxEntries is exceeded', () => {
    const limiter = new RateLimiter({ limit: 100, windowMs: 60_000 }, 5);
    for (let i = 0; i < 10; i++) {
      limiter.check(`ip-${i}`);
    }
    // maxEntries=5, eviction removes 10% (ceil) = 1, so after eviction: at most 5
    // Plus the latest insert that triggered eviction = 6 max
    expect(limiter.size).toBeLessThanOrEqual(6);
  });
});

describe('getApiRateLimiter', () => {
  it('returns a singleton instance', () => {
    const a = getApiRateLimiter();
    const b = getApiRateLimiter();
    expect(a).toBe(b);
  });

  it('uses the api rate limit config', () => {
    const limiter = getApiRateLimiter();
    const result = limiter.check('singleton-test');
    expect(result.limit).toBe(RATE_LIMITS.api.limit);
  });
});

describe('getClientIp', () => {
  it('extracts first IP from x-forwarded-for', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    expect(getClientIp(request)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-real-ip': '9.8.7.6' },
    });
    expect(getClientIp(request)).toBe('9.8.7.6');
  });

  it('returns unknown when no proxy headers', () => {
    const request = new Request('http://localhost');
    expect(getClientIp(request)).toBe('unknown');
  });

  it('handles single IP in x-forwarded-for (no comma)', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '10.0.0.1' },
    });
    expect(getClientIp(request)).toBe('10.0.0.1');
  });
});

describe('createRateLimitHeaders', () => {
  it('includes standard headers on success', () => {
    const headers = createRateLimitHeaders({
      success: true,
      limit: 100,
      remaining: 99,
      resetAt: 1700000000000,
    });
    expect(headers['X-RateLimit-Limit']).toBe('100');
    expect(headers['X-RateLimit-Remaining']).toBe('99');
    expect(headers['X-RateLimit-Reset']).toBeDefined();
    expect(headers['Retry-After']).toBeUndefined();
  });

  it('includes Retry-After on failure', () => {
    const now = Date.now();
    const headers = createRateLimitHeaders({
      success: false,
      limit: 100,
      remaining: 0,
      resetAt: now + 30_000,
    });
    expect(headers['Retry-After']).toBeDefined();
    expect(Number(headers['Retry-After'])).toBeGreaterThan(0);
  });
});
