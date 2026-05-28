import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/register(.*)',
  '/gallery(.*)',
  '/menunggu(.*)',
  '/api/webhooks(.*)',
  '/api/applications',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isMemberRoute = createRouteMatcher(['/member(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  if (isPublicRoute(req)) return NextResponse.next()

  if (!userId) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Baca role dari Clerk session (tidak pakai fs/storage di edge)
  const role = (sessionClaims?.metadata as any)?.role as string | undefined

  if (isAdminRoute(req)) {
    if (role !== 'ADMIN') return NextResponse.redirect(new URL('/menunggu', req.url))
    return NextResponse.next()
  }

  if (isMemberRoute(req)) {
    if (role === 'ADMIN') return NextResponse.next()
    if (role !== 'MEMBER') return NextResponse.redirect(new URL('/menunggu', req.url))
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
