'use client';

// Better Auth's React client manages session state internally;
// no context provider is needed.
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
