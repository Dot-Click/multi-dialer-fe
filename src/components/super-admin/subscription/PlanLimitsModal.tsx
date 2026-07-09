import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllPlanLimits, savePlanLimits } from "@/store/slices/planLimitsSlice";
import { planKeyFromName } from "@/utils/planKey";
import { DEFAULT_PLAN_LIMIT_DRAFT, PlanLimitFieldsForm, type PlanLimitDraft } from "./planLimitFields";

interface PlanLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

const PlanLimitsModal = ({ isOpen, onClose, planName }: PlanLimitsModalProps) => {
  const dispatch = useAppDispatch();
  const { rows, saving } = useAppSelector((state) => state.planLimits);
  const [draft, setDraft] = useState<PlanLimitDraft>(DEFAULT_PLAN_LIMIT_DRAFT);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllPlanLimits());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) return;
    const planKey = planKeyFromName(planName);
    const existing = rows.find((r) => r.planKey === planKey);
    setDraft(existing ? { ...DEFAULT_PLAN_LIMIT_DRAFT, ...existing } : { ...DEFAULT_PLAN_LIMIT_DRAFT, displayName: planName });
  }, [isOpen, planName, rows]);

  const handleSave = async () => {
    if (draft.extraAgentSeatPriceCents == null) {
      setShowErrors(true);
      toast.error("Set an extra agent seat price — every plan must support paid overage seats.");
      return;
    }

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

        <div className="p-6">
          <PlanLimitFieldsForm draft={draft} onChange={setDraft} showErrors={showErrors} />
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
