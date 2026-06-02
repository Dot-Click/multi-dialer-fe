import { useEffect, useState } from "react";

/**
 * Live countdown to a freeze-expiry timestamp.
 *
 * Props:
 *   unfreezeAt  — ISO string or epoch-ms number when the freeze expires.
 *                 Pass null/undefined when the number is not frozen.
 *   onExpired   — optional callback fired the moment the countdown reaches 0.
 *
 * Renders nothing when the number is not frozen (or has already unfrozen).
 * Ticks every second — no page-refresh needed.
 */

interface FreezeCountdownProps {
  unfreezeAt: string | number | null | undefined;
  onExpired?: () => void;
  className?: string;
}

function secondsLeft(unfreezeAt: string | number): number {
  const target =
    typeof unfreezeAt === "number" ? unfreezeAt : new Date(unfreezeAt).getTime();
  return Math.max(0, Math.ceil((target - Date.now()) / 1000));
}

function fmt(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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

    // Sync immediately in case the prop changed
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

/** Returns true if the given unfreezeAt is still in the future (client-side check). */
export function isCurrentlyFrozen(
  unfreezeAt: string | number | null | undefined
): boolean {
  if (!unfreezeAt) return false;
  const target =
    typeof unfreezeAt === "number" ? unfreezeAt : new Date(unfreezeAt).getTime();
  return target > Date.now();
}
