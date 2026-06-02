import { useEffect, useState } from "react";

/**
 * Live countdown to a freeze-expiry timestamp.
 *
 * All time arithmetic is done in UTC epoch-milliseconds so the comparison
 * is timezone-independent:
 *
 *   • Date.now()   — always returns UTC epoch-ms regardless of local timezone
 *   • toUtcMs()    — converts any input to UTC epoch-ms:
 *       - number   → treated directly as UTC epoch-ms (what the status API sends)
 *       - string   → parsed as ISO 8601; if the string has no timezone designator
 *                    (no Z / no +HH:MM) we append "Z" before parsing so it is
 *                    always interpreted as UTC, never as local time.
 */

// ─── UTC helpers ──────────────────────────────────────────────────────────────

/**
 * Convert any freeze timestamp to UTC epoch-milliseconds.
 * Safe against strings without a timezone designator.
 */
function toUtcMs(unfreezeAt: string | number): number {
  if (typeof unfreezeAt === "number") return unfreezeAt; // already UTC epoch-ms

  const s = unfreezeAt.trim();
  // If the string already carries timezone info (ends with Z or ±HH:MM / ±HHMM) use as-is.
  // Otherwise append "Z" to force UTC interpretation — never local time.
  const hasTimezone = /Z$|[+-]\d{2}:?\d{2}$/.test(s);
  return new Date(hasTimezone ? s : s + "Z").getTime();
}

/**
 * Seconds remaining until the freeze expires.
 * Returns 0 (not negative) if already expired.
 */
function secondsLeft(unfreezeAt: string | number): number {
  return Math.max(0, Math.ceil((toUtcMs(unfreezeAt) - Date.now()) / 1000));
}

function fmt(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FreezeCountdownProps {
  unfreezeAt: string | number | null | undefined;
  onExpired?: () => void;
  className?: string;
}

export function FreezeCountdown({
  unfreezeAt,
  onExpired,
  className = "",
}: FreezeCountdownProps) {
  const [remaining, setRemaining] = useState<number>(() =>
    unfreezeAt ? secondsLeft(unfreezeAt) : 0
  );

  useEffect(() => {
    if (!unfreezeAt) {
      setRemaining(0);
      return;
    }

    const initial = secondsLeft(unfreezeAt);
    setRemaining(initial);
    if (initial <= 0) {
      onExpired?.();
      return;
    }

    const id = setInterval(() => {
      const secs = secondsLeft(unfreezeAt);
      setRemaining(secs);
      if (secs <= 0) {
        clearInterval(id);
        onExpired?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [unfreezeAt, onExpired]);

  if (!unfreezeAt || remaining <= 0) return null;

  return <span className={className}>{fmt(remaining)}</span>;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the given unfreezeAt timestamp is still in the future.
 * Comparison is always in UTC epoch-ms — timezone-safe.
 */
export function isCurrentlyFrozen(
  unfreezeAt: string | number | null | undefined
): boolean {
  if (!unfreezeAt) return false;
  return toUtcMs(unfreezeAt) > Date.now(); // both sides are UTC epoch-ms
}
