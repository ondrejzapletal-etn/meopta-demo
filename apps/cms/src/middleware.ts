import { trace } from '@opentelemetry/api';
import { NextRequest, NextResponse } from 'next/server';

function checkBasicAuth(request: NextRequest): NextResponse | null {
  const user = process.env.HTTP_BASIC_USER;
  const password = process.env.HTTP_BASIC_PASSWORD;

  if (!user || !password) return null;
  if (request.nextUrl.pathname === '/api/health/live') return null;
  // MCP endpoint has its own auth (Bearer header or ?key= query param)
  if (request.nextUrl.pathname === '/api/mcp') return null;

  const authHeader = request.headers.get('authorization');

  // Allow JWT auth through (Payload CMS API clients)
  if (authHeader?.startsWith('JWT ')) return null;

  // Check Basic Auth
  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice(6));
    const sep = decoded.indexOf(':');
    if (sep !== -1 && decoded.slice(0, sep) === user && decoded.slice(sep + 1) === password) {
      return null;
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Airbank CMS"' },
  });
}

export function middleware(request: NextRequest) {
  const authResponse = checkBasicAuth(request);
  if (authResponse) return authResponse;

  const response = NextResponse.next();
  const current = trace.getActiveSpan();

  if (current) {
    response.headers.set('server-timing', `traceparent;desc="00-${current.spanContext().traceId}-${current.spanContext().spanId}-01"`);
  }
  return response;
}

export const config = {
  matcher: [
    {
      // Match all paths except static files, health checks, and MCP endpoint
      source: '/((?!_next/static|_next/image|favicon.ico|api/health/live|api/mcp).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
