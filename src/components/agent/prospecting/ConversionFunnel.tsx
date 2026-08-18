import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { FunnelResponse } from "@/hooks/useTracker";
import { formatCount, formatHours, formatMoney, formatPct, formatRate, STAGE_LABEL } from "@/utils/prospectingFormat";

function stageDisplay(id: string, value: number): string {
  if (id === "hours") return formatHours(value);
  if (id === "gci") return formatMoney(value);
  return formatCount(value);
}

export function ConversionFunnel({ funnel, loading }: { funnel?: FunnelResponse; loading?: boolean }) {
  if (loading || !funnel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversion funnel</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Loading…</CardContent>
      </Card>
    );
  }

  const max = Math.max(1, ...funnel.stages.filter((s) => s.id !== "gci" && s.id !== "hours").map((s) => s.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion funnel</CardTitle>
        <CardDescription>Cumulative — total ÷ total, never clamped</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {funnel.stages.map((stage, i) => {
          const step = funnel.steps.find((s) => s.to === stage.id);
          const widthPct = stage.id === "gci" || stage.id === "hours" ? 100 : Math.max(4, (stage.value / max) * 100);
          return (
            <div key={stage.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="w-28 text-sm font-medium shrink-0">{STAGE_LABEL[stage.id]}</span>
                <div className="flex-1 h-6 rounded-md bg-muted overflow-hidden relative">
                  <div
                    className="h-full bg-[#FFCA06] transition-all"
                    style={{ width: `${stage.id === "gci" ? 100 : widthPct}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-2 text-xs font-semibold">
                    {stageDisplay(stage.id, stage.value)}
                  </span>
                </div>
              </div>
              {step && i > 0 && (
                <p className="pl-[124px] text-[11px] text-muted-foreground">
                  {step.display === "pct" ? formatPct(step.value, 1) : formatRate(step.value)} {step.label.toLowerCase()}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
