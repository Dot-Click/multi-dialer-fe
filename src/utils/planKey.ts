// Mirrors planKeyFromName in multi-dialer-be/src/services/planLimits.service.ts —
// must stay identical so a plan's limits are found by the same key on both sides.
export function planKeyFromName(name: string): string {
  return name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_");
}
