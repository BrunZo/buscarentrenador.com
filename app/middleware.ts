import { NextRequest } from 'next/server';
import { isUser, updateSession } from './auth';

export default function middleware(request: NextRequest) {
  updateSession(request); 
  if (request.nextUrl.pathname === '/soy-entrenador' && !isUser()) {
    return {
      redirect: '/login',
      status: 302
    }
  }
}