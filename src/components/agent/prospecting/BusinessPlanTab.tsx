import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlan, usePlanTargets, useSavePlan, type BusinessPlanInputs } from "@/hooks/useTracker";
import { formatCount, formatHours, formatMoney } from "@/utils/prospectingFormat";

const FIELDS: Array<{ key: keyof BusinessPlanInputs; label: string; suffix?: string }> = [
  { key: "netIncomeGoal", label: "Net income goal ($)" },
  { key: "profitMarginPct", label: "Profit margin (%)" },
  { key: "avgPricePoint", label: "Avg price point ($)" },
  { key: "avgCommissionRatePct", label: "Avg commission rate (%)" },
  { key: "contactsPerHour", label: "Contacts / hour" },
  { key: "contactToLeadPct", label: "Contact → Lead (%)" },
  { key: "leadToSetPct", label: "Lead → Set (%)" },
  { key: "setToMetPct", label: "Set → Met (%)" },
  { key: "metToTakenPct", label: "Met → Taken (%)" },
];

const TARGET_ROWS: Array<{ key: "gciNeeded" | "closed" | "underContract" | "listingsTaken" | "apptsMet" | "apptsSet" | "leads" | "contacts" | "hours"; label: string; money?: boolean; hours?: boolean }> = [
  { key: "gciNeeded", label: "GCI needed", money: true },
  { key: "closed", label: "Closings" },
  { key: "underContract", label: "Under contract" },
  { key: "listingsTaken", label: "Listings taken" },
  { key: "apptsMet", label: "Appointments met" },
  { key: "apptsSet", label: "Appointments set" },
  { key: "leads", label: "Leads" },
  { key: "contacts", label: "Contacts" },
  { key: "hours", label: "Hours", hours: true },
];

const SOURCES: Array<{ stage: string; source: string; auto: boolean }> = [
  { stage: "Hours", source: "Dialer session time", auto: true },
  { stage: "Contacts", source: "Connected calls · Contacted", auto: true },
  { stage: "Leads", source: "Contact disposition", auto: false },
  { stage: "Appts set", source: "Contact disposition", auto: false },
  { stage: "Appts met", source: "Contact disposition", auto: false },
  { stage: "Listings taken", source: "Contact disposition", auto: false },
  { stage: "Under contract", source: "Contact disposition", auto: false },
  { stage: "Closed + GCI", source: "Disposition + commission", auto: false },
];

const currentYear = new Date().getUTCFullYear();

export function BusinessPlanTab() {
  const { data: plan, isLoading } = usePlan(currentYear);
  const savePlan = useSavePlan();
  const [inputs, setInputs] = useState<BusinessPlanInputs | null>(null);
  const [targetPeriod, setTargetPeriod] = useState<"yearly" | "monthly" | "weekly" | "daily">("yearly");
  const { data: targets, isLoading: targetsLoading } = usePlanTargets(currentYear, targetPeriod);

  useEffect(() => {
    if (plan) setInputs(plan.inputs);
  }, [plan]);

  if (isLoading || !inputs) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  const setField = (key: keyof BusinessPlanInputs, value: number) => {
    setInputs((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!inputs) return;
    try {
      await savePlan.mutateAsync({ planYear: currentYear, inputs });
      toast.success("Plan saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Could not save plan");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Your numbers</CardTitle>
            <CardDescription>
              Avg commission: {formatMoney(inputs.avgPricePoint * (inputs.avgCommissionRatePct / 100))}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {FIELDS.map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1">
                  <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
                  <Input
                    type="number"
                    value={inputs[key] as number}
                    onChange={(e) => setField(key, Number(e.target.value))}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Working weeks / days</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={inputs.calendar.workingWeeksPerYear}
                    onChange={(e) =>
                      setInputs((prev) =>
                        prev ? { ...prev, calendar: { ...prev.calendar, workingWeeksPerYear: Number(e.target.value) } } : prev
                      )
                    }
                  />
                  <Input
                    type="number"
                    value={inputs.calendar.workingDaysPerWeek}
                    onChange={(e) =>
                      setInputs((prev) =>
                        prev ? { ...prev, calendar: { ...prev.calendar, workingDaysPerWeek: Number(e.target.value) } } : prev
                      )
                    }
                  />
                </div>
              </div>
              {inputs.includeUnderContract ? (
                <>
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Taken → U/C (%)</Label>
                    <Input
                      type="number"
                      value={inputs.takenToUnderContractPct}
                      onChange={(e) => setField("takenToUnderContractPct", Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">U/C → Closed (%)</Label>
                    <Input
                      type="number"
                      value={inputs.underContractToClosedPct}
                      onChange={(e) => setField("underContractToClosedPct", Number(e.target.value))}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Taken → Closed (%)</Label>
                  <Input
                    type="number"
                    value={inputs.takenToClosedPct}
                    onChange={(e) => setField("takenToClosedPct", Number(e.target.value))}
                  />
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.includeUnderContract}
                onChange={(e) => setInputs((prev) => (prev ? { ...prev, includeUnderContract: e.target.checked } : prev))}
                className="accent-[#FFCA06] h-4 w-4"
              />
              <span>
                Track Under Contract as its own stage
                <span className="block text-[11px] font-normal text-muted-foreground">
                  Off = identical to Saleslytics (8 stages)
                </span>
              </span>
            </label>

            <Button onClick={handleSave} disabled={savePlan.isPending} className="w-fit bg-[#FFCA06] text-black hover:bg-[#FFCA06]/90">
              {savePlan.isPending ? "Saving..." : "Save plan"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What that requires</CardTitle>
            <CardDescription>Derived live from the inputs on the left</CardDescription>
            <div className="pt-2">
              <Tabs value={targetPeriod} onValueChange={(v) => setTargetPeriod(v as typeof targetPeriod)}>
                <TabsList>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {targetsLoading || !targets ? (
              <p className="text-sm text-muted-foreground">Computing…</p>
            ) : (
              <div className="flex flex-col">
                {TARGET_ROWS.map((row) => (
                  <div key={row.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-semibold">
                      {row.money
                        ? formatMoney(targets[row.key])
                        : row.hours
                        ? formatHours(targets[row.key])
                        : formatCount(targets[row.key])}
                    </span>
                  </div>
                ))}
                <p className="pt-3 text-[10.5px] text-muted-foreground">
                  Divisors: yearly 1 · monthly 12 · weekly {inputs.calendar.workingWeeksPerYear} · daily{" "}
                  {inputs.calendar.workingWeeksPerYear * inputs.calendar.workingDaysPerWeek}. Working calendar, not 52/365.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Where each stage comes from</CardTitle>
          <CardDescription>Automatic stages fill themselves — Log activity overrides them</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SOURCES.map((s) => (
              <div key={s.stage} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{s.stage}</span>
                  <Badge className={s.auto ? "bg-[#009689] text-white" : "bg-[#104E64] text-white"}>
                    {s.auto ? "AUTO" : "CRM"}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground">{s.source}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
