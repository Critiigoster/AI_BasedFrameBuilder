import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function middleware(request: NextRequest) {
  // Get the IP address of the request
  const ip = request.ip ?? '127.0.0.1'
  
  // Check if the request is for the API route
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip)
      
      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests. Please try again later.',
            reset: reset,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        )
      }

      return NextResponse.next({
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      })
    } catch (error) {
      console.error('Rate limit error:', error)
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
} 