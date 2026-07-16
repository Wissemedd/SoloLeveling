/**
 * Minimal dev-mode logging. Use for unexpected failures worth seeing during
 * development (e.g. a native module throwing) — not for expected/best-effort
 * no-ops (sound playback, splash-screen hide) that should stay silent.
 * A future crash-reporting service (Sentry, etc.) would plug in here.
 */
export function logWarning(context: string, error: unknown): void {
  if (!__DEV__) return;
  console.warn(`[${context}]`, error);
}
