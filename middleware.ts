import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('user-token')

  // Если пользователь не авторизован и пытается попасть на защищенные маршруты
  if (!token && pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Если пользователь авторизован и пытается попасть на страницу auth
  if (token && pathname === '/auth') {
    return NextResponse.redirect(new URL('/search-movies', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}