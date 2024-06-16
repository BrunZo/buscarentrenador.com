import { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  if (session?.value)
    var currentUser = JSON.parse(session?.value)

  if (request.nextUrl.pathname.startsWith('/entrenadores')) {
    if (!currentUser)
      return Response.redirect(new URL('/login', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/soy-entrenador')) {
    if (!currentUser)
      return Response.redirect(new URL('/login', request.url))
  }
  
  if (request.nextUrl.pathname.startsWith('/login')) {
    if (currentUser) 
      return Response.redirect(new URL('/', request.nextUrl))
  }
  
  if (request.nextUrl.pathname.startsWith('/cuenta')) {
    if (!currentUser)
      return Response.redirect(new URL('/login', request.url))
  }
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};