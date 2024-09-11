import { NextRequest } from 'next/server';
import { updateSession } from './auth';

export default function middleware(request: NextRequest) {
  updateSession(request); 
}