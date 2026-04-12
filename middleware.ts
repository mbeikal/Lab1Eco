import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { method, url } = request;
  const start = Date.now();

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown IP';
  const userAgent = request.headers.get('user-agent') || 'Unknown User-Agent';

  const response = NextResponse.next();
  const duration = Date.now() - start;

  const logPayload = {
    level: "INFO",
    time: new Date().toISOString(),
    event: "http_request",
    method,
    url,
    status: response.status,
    durationMs: duration,
    clientIp: ip,
    userAgent
  };

  if (process.env.NODE_ENV === "development") {

    console.log(`[HTTP] ${method} ${url} - ${response.status} (${duration}ms) - IP: ${ip}`);
  } else {

    console.log(JSON.stringify(logPayload));
  }

  return response;
}

export const config = {

  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
