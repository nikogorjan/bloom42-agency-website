// middleware.ts (or src/middleware.ts)
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

/**
 * Match every request **except**:
 *   • API routes, tRPC, Next.js internals, Vercel internals
 *   • Files that contain a dot (static assets)
 *   • Anything that begins with `/admin`
 */
export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|admin(?:/|$)|.*\\..*).*)',
    //          └──────────────┬──────────────┘
    //            skips /admin and /admin/…
  ],
}
