// In-memory sliding window rate limiter.
// NOTE: each serverless instance maintains its own window — for cross-instance
// enforcement in production, back this with a distributed store (Vercel KV, Upstash).

const windows = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (windows.get(key) ?? []).filter(t => now - t < windowMs);
  if (timestamps.length >= limit) return true;
  timestamps.push(now);
  windows.set(key, timestamps);
  return false;
}

export const RATE_LIMIT_RESPONSE = { error: 'Demasiados intentos. Intentá de nuevo más tarde.' };
