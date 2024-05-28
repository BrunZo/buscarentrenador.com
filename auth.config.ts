import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      if (nextUrl.pathname.startsWith('/entrenadores')) {
        if (isLoggedIn) return true;
        return false;
      } else if (nextUrl.pathname.startsWith('/soy-entrenador')) {
        if (isLoggedIn) return true;
        return false;
      } else if (nextUrl.pathname.startsWith('/login')) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
      } 
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;