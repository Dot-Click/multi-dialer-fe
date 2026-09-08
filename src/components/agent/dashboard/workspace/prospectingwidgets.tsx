import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { useDashboard, useFunnel } from "@/hooks/useTracker";
import { formatCount, formatHours, formatMoney, formatPct, formatRate, STAGE_LABEL } from "@/utils/prospectingFormat";

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
        // Bars carry their stage name and the conversion into them, per Figma V2.
        // Without the labels this read as a sparkline — no way to tell Leads
        // from Closed. Scrolls horizontally rather than crushing the labels:
        // "Under Contract" does not fit in a seventh of a dashboard widget.
        <div className="overflow-x-auto">
          <div className="flex items-end gap-1 h-32 min-w-max">
            {countable.map((stage, i) => {
              // The step INTO this stage — same lookup the tracker page's
              // ConversionFunnel uses, off the same payload, so the two can
              // never disagree.
              const step = funnel.steps.find((s) => s.to === stage.id);
              return (
                <Fragment key={stage.id}>
                  {i > 0 && step && (
                    <div className="flex flex-col items-center shrink-0 w-12">
                      <div className="flex-1 flex items-end justify-center pb-1">
                        <span className="text-[9px] leading-tight text-muted-foreground whitespace-nowrap">
                          →{" "}
                          {step.display === "pct"
                            ? formatPct(step.value, 1)
                            : formatRate(step.value)}
                        </span>
                      </div>
                      {/* Invisible spacers keep this column's baseline aligned
                          with the value/label rows of the bars either side. */}
                      <span className="text-xs font-semibold invisible">0</span>
                      <span className="text-[9px] invisible">.</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-1 shrink-0 w-16">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full bg-[#FFCA06] rounded-t-md min-h-[4px]"
                        style={{ height: `${Math.max(4, (stage.value / max) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold">{stage.value}</span>
                    <span className="text-[9px] leading-tight text-center text-muted-foreground">
                      {STAGE_LABEL[stage.id]}
                    </span>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
