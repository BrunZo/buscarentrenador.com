export interface RateLimiter {
  check(key: string, limit: number, windowMs: number): Promise<boolean>;
}

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
