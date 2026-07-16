/** Prefixed, collision-resistant id for client-only local records (loot rolls, log entries, inventory instances, etc). */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}
