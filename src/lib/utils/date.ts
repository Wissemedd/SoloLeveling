/** Local yyyy-mm-dd — the key used for daily caps, streaks, and mission windows. */
export function localDateIso(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
