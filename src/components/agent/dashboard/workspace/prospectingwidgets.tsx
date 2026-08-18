import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboard, useFunnel } from "@/hooks/useTracker";
import { formatCount, formatHours, formatMoney } from "@/utils/prospectingFormat";

/**
 * Three cards added to the existing Dashboard per Figma V2, placed alongside
 * Dialer Health and Call Statistics — see workspace.tsx. All three read the
 * same "This Month" dashboard payload the Prospecting Tracker page itself
 * uses, so the numbers here and there never disagree.
 */

function useMonthDashboard() {
  return useDashboard("this_month");
}

export function ProspectingScoreboardWidget() {
  const { data, isLoading } = useMonthDashboard();

  const tiles: Array<{ label: string; actual: string; goal: string }> = data
    ? [
        { label: "Hours", actual: formatHours(data.totals.hours), goal: `goal ${formatHours(data.targets.hours)}` },
        { label: "Contacts", actual: formatCount(data.totals.contacts), goal: `goal ${formatCount(data.targets.contacts)}` },
        { label: "Leads", actual: formatCount(data.totals.leads), goal: `goal ${formatCount(data.targets.leads)}` },
        { label: "GCI", actual: formatMoney(data.totals.gci), goal: `goal ${formatMoney(data.targets.gciNeeded)}` },
      ]
    : [];

  return (
    <section className="bg-white dark:bg-slate-800 rounded-[24px] border-2 border-[#FFCA06] p-5 w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-bold">Prospecting scoreboard</h1>
          <p className="text-xs text-muted-foreground">This month</p>
        </div>
        <Link to="/prospecting-tracker">
          <Button size="sm" className="bg-[#FFCA06] text-black hover:bg-[#FFCA06]/90">
            Log activity
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3">
            {tiles.map((t) => (
              <div key={t.label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t.label}</span>
                <span className="text-lg font-semibold">{t.actual}</span>
                <span className="text-[10px] text-muted-foreground">{t.goal}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs pt-2 border-t">
            <span className="text-muted-foreground">Streak</span>
            <span className="font-semibold text-[#009689]">{data?.streak.length ?? 0} days</span>
            <span className="text-muted-foreground">
              · {data?.coverage.hits ?? 0} of {data?.coverage.weekdays ?? 0} weekdays prospected
            </span>
          </div>
        </>
      )}
    </section>
  );
}

export function ProspectingPaceWidget() {
  const { data, isLoading } = useMonthDashboard();
  const pct = data && data.pace.gciTarget > 0 ? Math.min(100, (data.pace.gciToDate / data.pace.gciTarget) * 100) : 0;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-[24px] border-2 border-[#FFCA06] p-5 w-full flex flex-col gap-3">
      <div>
        <h1 className="text-[16px] font-bold">Pace to goal</h1>
        <p className="text-xs text-muted-foreground">{data ? `${formatMoney(data.pace.gciTarget)} GCI` : "…"}</p>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <Progress value={pct} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span>{data ? `${formatMoney(data.pace.gciToDate)} of ${formatMoney(data.pace.gciTarget)} · ${Math.round(pct)}%` : "—"}</span>
            {data?.pace.onPace !== null && data?.pace.onPace !== undefined && (
              <Badge className={data.pace.onPace ? "bg-[#009689] text-white" : "bg-[#E7000B] text-white"}>
                {data.pace.onPace ? "ON PACE" : "BEHIND"}
              </Badge>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export function ProspectingFunnelWidget() {
  const { data: dashboard } = useMonthDashboard();
  const { data: funnel, isLoading } = useFunnel(dashboard?.period.from ?? "", dashboard?.period.to ?? "");
  const countable = funnel?.stages.filter((s) => s.id !== "hours" && s.id !== "gci") ?? [];
  const max = Math.max(1, ...countable.map((s) => s.value));

  return (
    <section className="bg-white dark:bg-slate-800 rounded-[24px] border-2 border-[#FFCA06] p-5 w-full flex flex-col gap-3">
      <div>
        <h1 className="text-[16px] font-bold">Conversion funnel</h1>
        <p className="text-xs text-muted-foreground">This month</p>
      </div>
      {isLoading || !funnel ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="flex items-end gap-2 h-24">
          {countable.map((stage) => (
            <div key={stage.id} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full bg-[#FFCA06] rounded-t-md min-h-[4px]"
                  style={{ height: `${Math.max(4, (stage.value / max) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-semibold">{stage.value}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
