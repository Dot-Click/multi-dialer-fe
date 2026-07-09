import type { PlanLimitRow } from "@/store/slices/planLimitsSlice";

export type PlanLimitDraft = Omit<PlanLimitRow, "id" | "planKey">;

export const DEFAULT_PLAN_LIMIT_DRAFT: PlanLimitDraft = {
  displayName: "",
  maxDialerLines: null,
  includedAgentSeats: null,
  maxAgentSeats: null,
  extraAgentSeatPriceCents: null,
  includedNumbers: null,
  extraNumberPriceCents: null,
  callRecordingEnabled: true,
  aiInsightsLevel: "FULL",
  stirShakenEnabled: true,
  smartNumberRotationEnabled: true,
  teamDashboardEnabled: true,
  priorityRoutingEnabled: true,
  aiCallCoachingEnabled: true,
  advancedDeliverabilityEnabled: true,
};

export const NumberField = ({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) => (
  <label className="block">
    <span className="text-[13px] text-[#6575A7] dark:text-gray-300">{label}</span>
    <input
      type="number"
      min={0}
      placeholder="Unlimited"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      className="mt-1 w-full h-10 rounded-[10px] bg-[#F8FAFC] dark:bg-slate-700 px-3 text-[14px] outline-none dark:text-white"
    />
    <span className="text-[11px] text-gray-400">{hint}</span>
  </label>
);

// Unlike NumberField (blank = unlimited), this field has no "unlimited"
// meaning — every plan must offer a paid-overage-seat price, so blank is
// invalid rather than a valid choice. `invalid` drives the error styling;
// validation itself lives in the caller (CreatePlanModal/PlanLimitsModal).
export const RequiredNumberField = ({
  label,
  hint,
  value,
  onChange,
  invalid,
}: {
  label: string;
  hint: string;
  value: number | null;
  onChange: (v: number | null) => void;
  invalid?: boolean;
}) => (
  <label className="block">
    <span className="text-[13px] text-[#6575A7] dark:text-gray-300">
      {label} <span className="text-red-400">*</span>
    </span>
    <input
      type="number"
      min={0}
      placeholder="Required"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      className={`mt-1 w-full h-10 rounded-[10px] bg-[#F8FAFC] dark:bg-slate-700 px-3 text-[14px] outline-none dark:text-white ${
        invalid ? "ring-1 ring-red-400" : ""
      }`}
    />
    <span className={`text-[11px] ${invalid ? "text-red-500" : "text-gray-400"}`}>{hint}</span>
  </label>
);

export const ToggleRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-[13px] text-[#374151] dark:text-gray-200">{label}</span>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4" />
  </div>
);

/** The full limits form body, shared between PlanLimitsModal (edit) and CreatePlanModal (create step 2). */
export const PlanLimitFieldsForm = ({
  draft,
  onChange,
  showErrors,
}: {
  draft: PlanLimitDraft;
  onChange: (next: PlanLimitDraft) => void;
  /** Show required-field errors (e.g. after a failed submit attempt). */
  showErrors?: boolean;
}) => (
  <div className="flex flex-col gap-5">
    <div>
      <h3 className="text-[14px] font-[600] text-[#1D2C45] dark:text-white mb-2">Dialer &amp; Agents</h3>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Max dialer lines"
          hint="Power dialer pacing cap. Leave blank for unlimited."
          value={draft.maxDialerLines}
          onChange={(v) => onChange({ ...draft, maxDialerLines: v })}
        />
        <NumberField
          label="Included agent seats"
          hint="Hard cap once reached — the extra seat price below unlocks paid overage."
          value={draft.includedAgentSeats}
          onChange={(v) => onChange({ ...draft, includedAgentSeats: v })}
        />
        <RequiredNumberField
          label="Extra agent seat price (cents)"
          hint="e.g. 1500 = $15/mo per extra agent seat past the included count."
          value={draft.extraAgentSeatPriceCents}
          onChange={(v) => onChange({ ...draft, extraAgentSeatPriceCents: v })}
          invalid={showErrors && draft.extraAgentSeatPriceCents == null}
        />
      </div>
    </div>

    <div>
      <h3 className="text-[14px] font-[600] text-[#1D2C45] dark:text-white mb-2">Phone Numbers</h3>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Included numbers"
          hint="Free numbers before add-on pricing applies."
          value={draft.includedNumbers}
          onChange={(v) => onChange({ ...draft, includedNumbers: v })}
        />
        <NumberField
          label="Extra number price (cents)"
          hint="e.g. 200 = $2/mo. Blank = use Twilio's live price."
          value={draft.extraNumberPriceCents}
          onChange={(v) => onChange({ ...draft, extraNumberPriceCents: v })}
        />
      </div>
    </div>

    <div>
      <h3 className="text-[14px] font-[600] text-[#1D2C45] dark:text-white mb-2">Features</h3>
      <div className="bg-[#F8FAFC] dark:bg-slate-700 rounded-[12px] px-4 py-1">
        <ToggleRow
          label="Call recording"
          checked={draft.callRecordingEnabled}
          onChange={(v) => onChange({ ...draft, callRecordingEnabled: v })}
        />
        <ToggleRow
          label="STIR/SHAKEN optimization"
          checked={draft.stirShakenEnabled}
          onChange={(v) => onChange({ ...draft, stirShakenEnabled: v })}
        />
        <ToggleRow
          label="Smart number rotation"
          checked={draft.smartNumberRotationEnabled}
          onChange={(v) => onChange({ ...draft, smartNumberRotationEnabled: v })}
        />
        <ToggleRow
          label="Team stats dashboard"
          checked={draft.teamDashboardEnabled}
          onChange={(v) => onChange({ ...draft, teamDashboardEnabled: v })}
        />
        <ToggleRow
          label="Priority routing"
          checked={draft.priorityRoutingEnabled}
          onChange={(v) => onChange({ ...draft, priorityRoutingEnabled: v })}
        />
        <ToggleRow
          label="AI call coaching"
          checked={draft.aiCallCoachingEnabled}
          onChange={(v) => onChange({ ...draft, aiCallCoachingEnabled: v })}
        />
        <ToggleRow
          label="Advanced deliverability controls"
          checked={draft.advancedDeliverabilityEnabled}
          onChange={(v) => onChange({ ...draft, advancedDeliverabilityEnabled: v })}
        />
      </div>

      <label className="block mt-3">
        <span className="text-[13px] text-[#6575A7] dark:text-gray-300">AI insights level</span>
        <select
          value={draft.aiInsightsLevel}
          onChange={(e) => onChange({ ...draft, aiInsightsLevel: e.target.value as PlanLimitDraft["aiInsightsLevel"] })}
          className="mt-1 w-full h-10 rounded-[10px] bg-[#F8FAFC] dark:bg-slate-700 px-3 text-[14px] outline-none dark:text-white"
        >
          <option value="NONE">None</option>
          <option value="BASIC">Basic</option>
          <option value="FULL">Full</option>
        </select>
      </label>
    </div>
  </div>
);
