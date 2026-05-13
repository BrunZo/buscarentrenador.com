export interface RateLimiter {
  /** Returns true when the key has exceeded `limit` hits in the trailing `windowMs`. */
  check(key: string, limit: number, windowMs: number): Promise<boolean>;
}

// In-memory sliding window. Each serverless instance maintains its own state —
// for cross-instance enforcement in production, swap in a distributed adapter
// (Vercel KV, Upstash, Redis). The interface is the seam.
class MemoryRateLimiter implements RateLimiter {
  private windows = new Map<string, number[]>();

  async check(key: string, limit: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const timestamps = (this.windows.get(key) ?? []).filter(
      (t) => now - t < windowMs,
    );
    if (timestamps.length >= limit) {
      this.windows.set(key, timestamps);
      return true;
    }
    timestamps.push(now);
    this.windows.set(key, timestamps);
    return false;
  }
}

export const rateLimiter: RateLimiter = new MemoryRateLimiter();

export const RATE_LIMIT_RESPONSE = {
  error: "Demasiados intentos. Intentá de nuevo más tarde.",
};
