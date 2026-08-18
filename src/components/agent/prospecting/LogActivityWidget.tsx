import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveSession, type SessionInput } from "@/hooks/useTracker";
import { todayIso } from "@/utils/prospectingFormat";

const STEPPERS: Array<{ key: keyof SessionInput; label: string; step?: number }> = [
  { key: "hours", label: "Hours", step: 0.5 },
  { key: "contacts", label: "Contacts" },
  { key: "leads", label: "Leads" },
  { key: "apptsSet", label: "Appts Set" },
  { key: "apptsMet", label: "Appts Met" },
  { key: "listingsTaken", label: "Listings Taken" },
  { key: "underContract", label: "Under Contract" },
  { key: "closed", label: "Closed" },
];

const EMPTY: SessionInput = {
  loggedOn: todayIso(),
  source: null,
  hours: 0,
  contacts: 0,
  leads: 0,
  apptsSet: 0,
  apptsMet: 0,
  listingsTaken: 0,
  underContract: 0,
  closed: 0,
  gci: 0,
  notes: "",
};

export function LogActivityWidget() {
  const [form, setForm] = useState<SessionInput>(EMPTY);
  const save = useSaveSession();

  const setField = (key: keyof SessionInput, value: number | string | null) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const step = (key: keyof SessionInput, delta: number) => {
    setForm((f) => {
      const current = Number(f[key]) || 0;
      const next = Math.max(0, Math.round((current + delta) * 100) / 100);
      return { ...f, [key]: next };
    });
  };

  const contactsPerHour = form.hours > 0 ? (form.contacts / form.hours).toFixed(1) : "—";

  const handleSave = async () => {
    try {
      await save.mutateAsync(form);
      toast.success("Activity saved");
      setForm(EMPTY);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Could not save activity");
    }
  };

  return (
    <Card className="border-2 border-[#FFCA06]">
      <CardHeader>
        <CardTitle>Log activity</CardTitle>
        <CardDescription>
          Manual entry — overrides what the dialer and CRM derived for this day
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Date</Label>
            <Input
              type="date"
              value={form.loggedOn}
              onChange={(e) => setField("loggedOn", e.target.value)}
              className="w-[150px]"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Source / channel</Label>
            <Input
              placeholder="Circle Prospecting, FSBO, ..."
              value={form.source ?? ""}
              onChange={(e) => setField("source", e.target.value || null)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">GCI ($)</Label>
            <Input
              type="number"
              min={0}
              value={form.gci}
              onChange={(e) => setField("gci", Number(e.target.value))}
              className="w-[110px]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {STEPPERS.map(({ key, label, step: stepAmount = 1 }) => (
            <div key={key} className="flex flex-col gap-1">
              <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
              <div className="flex items-center border rounded-[9px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => step(key, -stepAmount)}
                  className="w-7 h-9 bg-muted hover:bg-muted/70 font-bold text-[#B98A00]"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-semibold">{String(form[key])}</span>
                <button
                  type="button"
                  onClick={() => step(key, stepAmount)}
                  className="w-7 h-9 bg-muted hover:bg-muted/70 font-bold text-[#B98A00]"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Notes</Label>
          <Input
            placeholder="Address, name, what worked"
            value={form.notes ?? ""}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={save.isPending} className="bg-[#FFCA06] text-black hover:bg-[#FFCA06]/90">
            {save.isPending ? "Saving..." : "Save entry"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setForm(EMPTY)}>
            Clear
          </Button>
          <span className="text-xs text-muted-foreground">
            {contactsPerHour !== "—" ? `${contactsPerHour} contacts/hour` : "Enter hours and contacts to see a rate"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
