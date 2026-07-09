import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAppDispatch } from "@/store/hooks";
import { createPlan } from "@/store/slices/subscriptionSlice";
import { savePlanLimits } from "@/store/slices/planLimitsSlice";
import toast from "react-hot-toast";
import { DEFAULT_PLAN_LIMIT_DRAFT, PlanLimitFieldsForm, type PlanLimitDraft } from "./planLimitFields";

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  pricing?: string;
  monthlyAmount?: string;
  yearlyAmount?: string;
  trialDays?: string;
}

const CreatePlanModal = ({ isOpen, onClose }: CreatePlanModalProps) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [yearlyAmount, setYearlyAmount] = useState("");
  const [trialDays, setTrialDays] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Step 2: limits are required before a plan is considered fully created —
  // a plan can never be left without a PlanLimit row (even if intentionally
  // all-unlimited), closing the gap where an unconfigured plan defaults to
  // unrestricted for anyone subscribed to it.
  const [step, setStep] = useState<1 | 2>(1);
  const [limitsDraft, setLimitsDraft] = useState<PlanLimitDraft>(DEFAULT_PLAN_LIMIT_DRAFT);
  const [showLimitErrors, setShowLimitErrors] = useState(false);
  // Set once the Stripe product itself has been created, so a retry after a
  // limits-save failure doesn't try to create the plan a second time.
  const [createdPlanName, setCreatedPlanName] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setDescription("");
    setMonthlyAmount("");
    setYearlyAmount("");
    setTrialDays("");
    setErrors({});
    setStep(1);
    setLimitsDraft(DEFAULT_PLAN_LIMIT_DRAFT);
    setShowLimitErrors(false);
    setCreatedPlanName(null);
  };

  const handleClose = () => {
    // The Stripe product already exists but its limits never saved — closing
    // now would leave exactly the unconfigured, unrestricted plan this whole
    // flow exists to prevent. Make abandoning it a deliberate choice.
    if (createdPlanName) {
      const confirmed = window.confirm(
        `"${createdPlanName}" was created but its limits were never saved, so it will default to unlimited until you configure it from the plan list. Close anyway?`
      );
      if (!confirmed) return;
    }
    reset();
    onClose();
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!name.trim()) e.name = "Plan name is required";

    const monthly = parseFloat(monthlyAmount);
    const yearly = parseFloat(yearlyAmount);
    const hasMonthly = monthlyAmount !== "" && !isNaN(monthly) && monthly > 0;
    const hasYearly = yearlyAmount !== "" && !isNaN(yearly) && yearly > 0;

    if (!hasMonthly && !hasYearly) {
      e.pricing = "Enter at least one price (monthly or yearly)";
    }
    if (monthlyAmount !== "" && (!hasMonthly)) {
      e.monthlyAmount = "Enter a valid monthly price greater than $0";
    }
    if (yearlyAmount !== "" && (!hasYearly)) {
      e.yearlyAmount = "Enter a valid yearly price greater than $0";
    }

    if (trialDays !== "") {
      const days = parseInt(trialDays, 10);
      if (isNaN(days) || days < 1 || days > 730) {
        e.trialDays = "Trial days must be between 1 and 730";
      }
    }

    return e;
  };

  const handleContinueToLimits = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleFinish = async () => {
    if (limitsDraft.extraAgentSeatPriceCents == null) {
      setShowLimitErrors(true);
      toast.error("Set an extra agent seat price — every plan must support paid overage seats.");
      return;
    }

    setSubmitting(true);
    try {
      let planName = createdPlanName;

      // Only create the Stripe product once — a retry after a limits-save
      // failure should just retry the limits save, not create a duplicate plan.
      if (!planName) {
        const monthly = monthlyAmount !== "" ? Math.round(parseFloat(monthlyAmount) * 100) : undefined;
        const yearly = yearlyAmount !== "" ? Math.round(parseFloat(yearlyAmount) * 100) : undefined;

        const result = await dispatch(
          createPlan({
            name: name.trim(),
            description: description.trim() || undefined,
            monthlyAmount: monthly,
            yearlyAmount: yearly,
            currency: "usd",
            trialDays: trialDays !== "" ? parseInt(trialDays, 10) : undefined,
          }),
        );

        if (!createPlan.fulfilled.match(result)) {
          toast.error((result.payload as string) || "Failed to create plan");
          return;
        }
        planName = name.trim();
        setCreatedPlanName(planName);
      }

      const limitsResult = await dispatch(savePlanLimits({ planName, ...limitsDraft }));
      if (!savePlanLimits.fulfilled.match(limitsResult)) {
        toast.error((limitsResult.payload as string) || "Plan created, but saving its limits failed — try again.");
        return;
      }

      toast.success("Plan created with limits and synced to Stripe");
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[460px] rounded-[24px] shadow-xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-[#111] dark:text-white text-[20px] font-[600]">
            {step === 1 ? "Create New Plan" : `Set Limits — ${name.trim()}`}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <IoClose className="text-[22px] text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
        {step === 2 ? (
          <>
            <p className="text-[13px] text-[#6575A7] dark:text-gray-400 -mt-1">
              Every plan needs its limits set before it's usable — leave a field blank for unlimited.
            </p>
            <PlanLimitFieldsForm draft={limitsDraft} onChange={setLimitsDraft} showErrors={showLimitErrors} />
          </>
        ) : (
        <>
          {/* Plan Name */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
              <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">
                Plan Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Professional"
                className="bg-transparent outline-none text-[#111] dark:text-white text-[15px]"
              />
            </div>
            {errors.name && <p className="text-red-500 text-[11px] px-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
            <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short plan description"
              className="bg-transparent outline-none text-[#111] dark:text-white text-[15px]"
            />
          </div>

          {/* Pricing */}
          <div className="flex flex-col gap-2">
            <p className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500] px-1">
              Pricing <span className="text-red-400">*</span>
              <span className="text-gray-400 font-normal ml-1">(set one or both)</span>
            </p>
            {errors.pricing && <p className="text-red-500 text-[11px] px-1">{errors.pricing}</p>}

            <div className="grid grid-cols-2 gap-3">
              {/* Monthly */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
                  <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">
                    Monthly (USD)
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-[#6B7280] dark:text-gray-400 text-[14px]">$</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={monthlyAmount}
                      onChange={(e) => setMonthlyAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent outline-none text-[#111] dark:text-white text-[14px] w-full"
                    />
                  </div>
                </div>
                {errors.monthlyAmount && (
                  <p className="text-red-500 text-[11px] px-1">{errors.monthlyAmount}</p>
                )}
              </div>

              {/* Yearly */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
                  <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">
                    Yearly (USD)
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-[#6B7280] dark:text-gray-400 text-[14px]">$</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={yearlyAmount}
                      onChange={(e) => setYearlyAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent outline-none text-[#111] dark:text-white text-[14px] w-full"
                    />
                  </div>
                </div>
                {errors.yearlyAmount && (
                  <p className="text-red-500 text-[11px] px-1">{errors.yearlyAmount}</p>
                )}
              </div>
            </div>
          </div>

          {/* Trial Days */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
              <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">
                Trial Period <span className="text-gray-400 font-normal">(optional, in days)</span>
              </label>
              <input
                type="number"
                min="1"
                max="730"
                step="1"
                value={trialDays}
                onChange={(e) => setTrialDays(e.target.value)}
                placeholder="e.g. 30"
                className="bg-transparent outline-none text-[#111] dark:text-white text-[15px]"
              />
            </div>
            {errors.trialDays && <p className="text-red-500 text-[11px] px-1">{errors.trialDays}</p>}
          </div>
        </>
        )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex gap-3 border-t border-gray-100 dark:border-slate-700 flex-shrink-0">
          <button
            type="button"
            onClick={step === 2 && !createdPlanName ? () => setStep(1) : handleClose}
            disabled={submitting}
            className="flex-1 bg-[#F3F4F6] dark:bg-slate-700 text-[#374151] dark:text-white font-[500] py-3 rounded-[12px] hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            {step === 2 && !createdPlanName ? "Back" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={step === 1 ? handleContinueToLimits : handleFinish}
            disabled={submitting}
            className="flex-1 bg-[#FFCA06] text-black font-[500] py-3 rounded-[12px] hover:bg-[#eab700] transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {step === 1
              ? "Continue to Limits"
              : submitting
                ? "Saving…"
                : createdPlanName
                  ? "Retry Saving Limits"
                  : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanModal;
