import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllPlanLimits, savePlanLimits, type PlanLimitRow } from "@/store/slices/planLimitsSlice";
import { planKeyFromName } from "@/utils/planKey";

interface PlanLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

const DEFAULT_ROW: Omit<PlanLimitRow, "id" | "planKey"> = {
  displayName: "",
  maxDialerLines: null,
  includedAgentSeats: null,
  maxAgentSeats: null,
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

const NumberField = ({
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

const ToggleRow = ({
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

const PlanLimitsModal = ({ isOpen, onClose, planName }: PlanLimitsModalProps) => {
  const dispatch = useAppDispatch();
  const { rows, saving } = useAppSelector((state) => state.planLimits);
  const [draft, setDraft] = useState(DEFAULT_ROW);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllPlanLimits());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) return;
    const planKey = planKeyFromName(planName);
    const existing = rows.find((r) => r.planKey === planKey);
    setDraft(existing ? { ...DEFAULT_ROW, ...existing } : { ...DEFAULT_ROW, displayName: planName });
  }, [isOpen, planName, rows]);

  const handleSave = async () => {
    try {
      await dispatch(savePlanLimits({ planName, ...draft })).unwrap();
      toast.success("Plan limits saved");
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to save plan limits");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[520px] max-h-[85vh] overflow-y-auto rounded-[24px] shadow-xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-[#111] dark:text-white text-[20px] font-[600]">Plan Limits — {planName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <IoClose className="text-[22px] text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div>
            <h3 className="text-[14px] font-[600] text-[#1D2C45] dark:text-white mb-2">Dialer &amp; Agents</h3>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Max dialer lines"
                hint="Power dialer pacing cap. Leave blank for unlimited."
                value={draft.maxDialerLines}
                onChange={(v) => setDraft({ ...draft, maxDialerLines: v })}
              />
              <NumberField
                label="Included agent seats"
                hint="Hard cap — no auto-billing for extras."
                value={draft.includedAgentSeats}
                onChange={(v) => setDraft({ ...draft, includedAgentSeats: v })}
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
                onChange={(v) => setDraft({ ...draft, includedNumbers: v })}
              />
              <NumberField
                label="Extra number price (cents)"
                hint="e.g. 200 = $2/mo. Blank = use Twilio's live price."
                value={draft.extraNumberPriceCents}
                onChange={(v) => setDraft({ ...draft, extraNumberPriceCents: v })}
              />
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-[600] text-[#1D2C45] dark:text-white mb-2">Features</h3>
            <div className="bg-[#F8FAFC] dark:bg-slate-700 rounded-[12px] px-4 py-1">
              <ToggleRow
                label="Call recording"
                checked={draft.callRecordingEnabled}
                onChange={(v) => setDraft({ ...draft, callRecordingEnabled: v })}
              />
              <ToggleRow
                label="STIR/SHAKEN optimization"
                checked={draft.stirShakenEnabled}
                onChange={(v) => setDraft({ ...draft, stirShakenEnabled: v })}
              />
              <ToggleRow
                label="Smart number rotation"
                checked={draft.smartNumberRotationEnabled}
                onChange={(v) => setDraft({ ...draft, smartNumberRotationEnabled: v })}
              />
              <ToggleRow
                label="Team stats dashboard"
                checked={draft.teamDashboardEnabled}
                onChange={(v) => setDraft({ ...draft, teamDashboardEnabled: v })}
              />
              <ToggleRow
                label="Priority routing"
                checked={draft.priorityRoutingEnabled}
                onChange={(v) => setDraft({ ...draft, priorityRoutingEnabled: v })}
              />
              <ToggleRow
                label="AI call coaching"
                checked={draft.aiCallCoachingEnabled}
                onChange={(v) => setDraft({ ...draft, aiCallCoachingEnabled: v })}
              />
              <ToggleRow
                label="Advanced deliverability controls"
                checked={draft.advancedDeliverabilityEnabled}
                onChange={(v) => setDraft({ ...draft, advancedDeliverabilityEnabled: v })}
              />
            </div>

            <label className="block mt-3">
              <span className="text-[13px] text-[#6575A7] dark:text-gray-300">AI insights level</span>
              <select
                value={draft.aiInsightsLevel}
                onChange={(e) => setDraft({ ...draft, aiInsightsLevel: e.target.value as PlanLimitRow["aiInsightsLevel"] })}
                className="mt-1 w-full h-10 rounded-[10px] bg-[#F8FAFC] dark:bg-slate-700 px-3 text-[14px] outline-none dark:text-white"
              >
                <option value="NONE">None</option>
                <option value="BASIC">Basic</option>
                <option value="FULL">Full</option>
              </select>
            </label>
          </div>
        </div>

        <div className="px-6 py-5 flex gap-3 border-t border-gray-100 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 bg-[#F3F4F6] dark:bg-slate-700 text-[#374151] dark:text-white font-[500] py-3 rounded-[12px] hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#FFCA06] text-[#000000] font-[500] py-3 rounded-[12px] hover:bg-[#eab700] transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Limits"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanLimitsModal;
