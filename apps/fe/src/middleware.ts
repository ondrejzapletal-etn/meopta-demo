import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { trace } from '@opentelemetry/api';

export const config = {
  matcher: '/((?!_next|_vercel).*)',
};

function checkBasicAuth(request: NextRequest): NextResponse | null {
  const user = process.env.HTTP_BASIC_USER;
  const password = process.env.HTTP_BASIC_PASSWORD;

  if (!user || !password) return null;
  if (request.nextUrl.pathname === '/api/health/live') return null;

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice(6));
    const sep = decoded.indexOf(':');
    if (sep !== -1 && decoded.slice(0, sep) === user && decoded.slice(sep + 1) === password) {
      return null;
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Airbank"' },
  });
}

function addTracing(response: NextResponse): NextResponse {
  const current = trace.getActiveSpan();
  if (current) {
    response.headers.set('server-timing', `traceparent;desc="00-${current.spanContext().traceId}-${current.spanContext().spanId}-01"`);
  }
  return response;
}

export default async function middleware(request: NextRequest) {
  const authResponse = checkBasicAuth(request);
  if (authResponse) return authResponse;

  // API routes and static files — pass through (no i18n routing)
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api') || pathname.startsWith('/test') || pathname.includes('.')) {
    return addTracing(NextResponse.next());
  }

  // Page routes — handle i18n routing
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
  return addTracing(response);
}
