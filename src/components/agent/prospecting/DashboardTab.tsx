import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LogActivityWidget } from "./LogActivityWidget";
import { ConversionFunnel } from "./ConversionFunnel";
import { useDashboard, useFunnel, type ActualKpis, type DashboardPeriod } from "@/hooks/useTracker";
import { formatCount, formatHours, formatMoney, formatPct, formatRate, STAGE_LABEL } from "@/utils/prospectingFormat";

const KPI_ROWS: Array<{ key: keyof ActualKpis; label: string; kind: "pct" | "rate" | "money" }> = [
  { key: "contactsPerHour", label: "Contacts / Hour", kind: "rate" },
  { key: "contactToLead", label: "Contact → Lead", kind: "pct" },
  { key: "leadToSet", label: "Lead → Set", kind: "pct" },
  { key: "setToMet", label: "Set → Met", kind: "pct" },
  { key: "metToTaken", label: "Met → Taken", kind: "pct" },
  { key: "gciPerHour", label: "GCI / Hour", kind: "money" },
  { key: "gciPerContact", label: "GCI / Contact", kind: "money" },
  { key: "contactsPerClosing", label: "Contacts / Closing", kind: "rate" },
];

export function DashboardTab({ period }: { period: DashboardPeriod }) {
  const { data, isLoading } = useDashboard(period);
  const { data: funnel, isLoading: funnelLoading } = useFunnel(data?.period.from ?? "", data?.period.to ?? "");

  return (
    <div className="flex flex-col gap-4">
      <LogActivityWidget />

      <Card>
        <CardHeader>
          <CardTitle>Totals vs goal</CardTitle>
          <CardDescription>{isLoading ? "Loading…" : `${data?.period.from} → ${data?.period.to}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {data?.attainment.map((row) => {
              const pct = row.attainment === null ? 0 : Math.min(100, row.attainment * 100);
              const display = row.stage === "hours" ? formatHours(row.actual) : row.stage === "gci" ? formatMoney(row.actual) : formatCount(row.actual);
              return (
                <div key={row.stage} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{STAGE_LABEL[row.stage]}</span>
                  <span className="text-lg font-semibold">{display}</span>
                  <Progress value={pct} className="h-1" />
                  <span className="text-[10px] text-muted-foreground">
                    {row.attainment === null ? "—" : `${Math.round(row.attainment * 100)}%`} of goal
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <ConversionFunnel funnel={funnel} loading={funnelLoading} />

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pace to goal</CardTitle>
              <CardDescription>{data ? `${formatMoney(data.pace.gciTarget)} GCI` : "…"}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Progress
                value={data && data.pace.gciTarget > 0 ? Math.min(100, (data.pace.gciToDate / data.pace.gciTarget) * 100) : 0}
                className="h-3"
              />
              <div className="flex items-center justify-between text-sm">
                <span>
                  {data ? `${formatMoney(data.pace.gciToDate)} of ${formatMoney(data.pace.gciTarget)}` : "—"}
                </span>
                {data?.pace.onPace !== null && data?.pace.onPace !== undefined && (
                  <Badge className={data.pace.onPace ? "bg-[#009689] text-white" : "bg-[#E7000B] text-white"}>
                    {data.pace.onPace ? "ON PACE" : "BEHIND"}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {data?.pace.projectedGci !== null && data?.pace.projectedGci !== undefined
                  ? `Projected ${formatMoney(data.pace.projectedGci)} at the current run rate`
                  : "Not enough elapsed time to project a pace yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consistency</CardTitle>
              <CardDescription>Last 28 days · prospecting days only</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-[#009689]">{data?.streak.length ?? 0}</span>
                <span className="text-sm text-muted-foreground">
                  of {data?.coverage.weekdays ?? 0} weekdays{data && !data.streak.isActive && data.streak.length > 0 ? " (inactive)" : ""}
                </span>
              </div>
              <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1 max-w-[280px]">
                {data?.coverage.days.map((d) => (
                  <div
                    key={d.date}
                    title={d.date}
                    className={`h-3 w-3 rounded-sm ${
                      d.weekend
                        ? "bg-transparent border border-dashed border-muted-foreground/30"
                        : d.logged
                        ? "bg-[#009689]"
                        : "bg-muted border border-border"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actual KPIs</CardTitle>
          <CardDescription>Measured — "—" means not computable, not zero</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {KPI_ROWS.map((row) => {
              const value = data?.kpis[row.key] ?? null;
              const display = row.kind === "pct" ? formatPct(value, 1) : row.kind === "money" ? formatMoney(value, 2) : formatRate(value);
              return (
                <div key={row.key} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{row.label}</span>
                  <span className="text-lg font-semibold">{display}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
