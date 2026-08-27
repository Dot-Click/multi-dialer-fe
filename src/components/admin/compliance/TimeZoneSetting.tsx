import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Company timezone.
 *
 * This is not a display preference. It is the zone the TCPA calling window is
 * evaluated in, and the zone the Prospecting Tracker uses to decide which day
 * a call belongs to. Until this shipped there was no way to set it at all, so
 * it sat on its "UTC" default — which for a Central-time office turns an
 * 8am-9pm rule into 3am-4pm local.
 */

/** Pinned above the full list — the zones a US brokerage actually picks. */
const COMMON_ZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
];

/** Used when Intl.supportedValuesOf is unavailable (older Safari). */
const FALLBACK_ZONES = [
  ...COMMON_ZONES,
  "America/Halifax",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Dublin",
  "Europe/Paris",
  "Europe/Berlin",
  "Australia/Sydney",
  "UTC",
];

function allZones(): string[] {
  try {
    const supported = (Intl as any).supportedValuesOf?.("timeZone") as string[] | undefined;
    if (supported?.length) return supported;
  } catch {
    // Older engines throw rather than returning undefined.
  }
  return FALLBACK_ZONES;
}

/** True only for a zone Intl can actually resolve — "CST" and friends fail. */
function isResolvable(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function timeIn(tz: string): string | null {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      weekday: "short",
    }).format(new Date());
  } catch {
    return null;
  }
}

/** "America/Chicago" reads better as "America / Chicago" in a long list. */
function label(tz: string): string {
  return tz.replace(/_/g, " ").replace("/", " / ");
}

interface Props {
  value?: string;
  /** Resolves when the save has landed; rejects with the API error. */
  onSave: (timeZone: string) => Promise<unknown>;
}

export function TimeZoneSetting({ value, onSave }: Props) {
  const [saving, setSaving] = useState(false);

  const zones = useMemo(() => {
    const every = allZones();
    const rest = every.filter((z) => !COMMON_ZONES.includes(z));
    return { common: COMMON_ZONES.filter(isResolvable), rest };
  }, []);

  const current = value ?? "";
  const currentTime = current ? timeIn(current) : null;

  // Two different problems, two different messages. "CST" is a stored value
  // that cannot be used; "UTC" is a default nobody chose.
  const unresolvable = current !== "" && !isResolvable(current);
  const unset = current === "" || current === "UTC";

  const handleChange = async (tz: string) => {
    setSaving(true);
    try {
      await onSave(tz);
      toast.success(`Timezone set to ${label(tz)}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Could not save the timezone");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
        Timezone
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 max-w-prose">
        Sets the clock for the TCPA calling window below, and the day boundary the
        Prospecting Tracker counts against.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">
            Company timezone
          </Label>
          <Select
            value={current || undefined}
            disabled={saving}
            onValueChange={handleChange}
          >
            <SelectTrigger className="w-full h-10 rounded-lg border-0 bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-slate-600 focus:ring-offset-0 transition-all">
              <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800 dark:border-slate-700 max-h-[320px]">
              {zones.common.map((tz) => (
                <SelectItem key={tz} value={tz} className="dark:text-white hover:dark:bg-slate-700">
                  {label(tz)}
                </SelectItem>
              ))}
              {zones.rest.length > 0 && (
                <div className="px-2 py-1.5 mt-1 border-t border-gray-200 dark:border-slate-700 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  All timezones
                </div>
              )}
              {zones.rest.map((tz) => (
                <SelectItem key={tz} value={tz} className="dark:text-white hover:dark:bg-slate-700">
                  {label(tz)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col justify-end">
          {currentTime && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Local time there is now{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{currentTime}</span>
            </p>
          )}
        </div>
      </div>

      {unresolvable && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-3 py-2">
          <AlertTriangle className="size-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          <p className="text-xs text-red-800 dark:text-red-300">
            <span className="font-semibold">“{current}” is not a usable timezone.</span>{" "}
            Abbreviations have no daylight saving, so anything measured from one is an
            hour out for half the year. Pick a named zone above — Central time is
            America / Chicago.
          </p>
        </div>
      )}

      {!unresolvable && unset && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 px-3 py-2">
          <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            <span className="font-semibold">No timezone set.</span> Calling windows are
            being checked in UTC, which is not your local time — an 8:00 start reads as
            3:00 in Central. Pick your office’s timezone above.
          </p>
        </div>
      )}
    </div>
  );
}

export default TimeZoneSetting;
