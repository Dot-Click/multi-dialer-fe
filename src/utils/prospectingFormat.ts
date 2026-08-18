/**
 * Shared formatting for the Prospecting Tracker. Ratios cross the wire as
 * fractions (0.105) and `null` means "not computable" (a zero denominator) —
 * render an em dash, never 0%. A missing ratio and a genuine zero mean very
 * different things to an agent. See BUILD_SPEC.md §4.
 */

export function formatPct(value: number | null, digits = 0): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatRate(value: number | null, digits = 2): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toFixed(digits);
}

export function formatMoney(value: number | null, digits = 0): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatCount(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return Math.round(value).toLocaleString("en-US");
}

export function formatHours(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toFixed(1);
}

export const STAGE_LABEL: Record<string, string> = {
  hours: "Hours",
  contacts: "Contacts",
  leads: "Leads",
  apptsSet: "Appts Set",
  apptsMet: "Appts Met",
  listingsTaken: "Listings Taken",
  underContract: "Under Contract",
  closed: "Closed",
  gci: "GCI",
};

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
