import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import downarrow from "@/assets/downarrow.png";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPlans, changeSubscriptionPlan, type Subscription } from "@/store/slices/subscriptionSlice";
import toast from "react-hot-toast";

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onSuccess: () => void;
}

interface PlanOption {
  label: string;
  priceId: string;
  planKey: string;
}

const ChangePlanModal = ({ isOpen, onClose, subscription, onSuccess }: ChangePlanModalProps) => {
  const dispatch = useAppDispatch();
  const { plans, loading: plansLoading } = useAppSelector((state) => state.subscriptions);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PlanOption | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setDropdownOpen(false);
      if (plans.length === 0) dispatch(fetchPlans());
    }
  }, [isOpen, dispatch, plans.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const planOptions: PlanOption[] = plans
    .filter((p) => p.isActive)
    .flatMap((p) => {
      const opts: PlanOption[] = [];
      if (p.monthlyStripePriceId) {
        opts.push({
          label: `${p.displayName || p.name} — Monthly ($${p.monthlyAmount}/mo)`,
          priceId: p.monthlyStripePriceId,
          planKey: p.plan,
        });
      }
      if (p.yearlyStripePriceId) {
        opts.push({
          label: `${p.displayName || p.name} — Yearly ($${p.yearlyAmount}/yr)`,
          priceId: p.yearlyStripePriceId,
          planKey: p.plan,
        });
      }
      return opts;
    });

  const handleConfirm = async () => {
    if (!subscription?.stripeSubscriptionId || !selectedOption) return;

    setSubmitting(true);
    try {
      const result = await dispatch(
        changeSubscriptionPlan({
          subscriptionId: subscription.stripeSubscriptionId,
          newPriceId: selectedOption.priceId,
          newPlan: selectedOption.planKey,
        }),
      );

      if (changeSubscriptionPlan.fulfilled.match(result)) {
        toast.success("Subscription plan updated successfully");
        onSuccess();
        onClose();
      } else {
        toast.error((result.payload as string) || "Failed to update plan");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[420px] rounded-[24px] shadow-xl relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-[#111] dark:text-white text-[20px] font-[600]">Change Plan</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <IoClose className="text-[22px] text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          {/* Current plan */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-3">
            <span className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">User</span>
            <span className="text-[#111] dark:text-white text-[15px]">
              {subscription.user?.fullName || subscription.userId}
            </span>
          </div>

          <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-3">
            <span className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">Current Plan</span>
            <span className="text-[#111] dark:text-white text-[15px] font-[500]">{subscription.plan}</span>
          </div>

          {/* New plan dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-3 cursor-pointer"
            >
              <span className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">New Plan</span>
              <div className="flex justify-between items-center">
                <span className={`text-[15px] ${!selectedOption ? "text-[#9CA3AF]" : "text-[#111] dark:text-white"}`}>
                  {plansLoading ? "Loading plans…" : (selectedOption?.label ?? "Select a plan")}
                </span>
                <img
                  src={downarrow}
                  alt="arrow"
                  className={`h-1.5 transition-transform dark:invert ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {dropdownOpen && (
              <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-slate-800 shadow-2xl rounded-[12px] z-50 border border-gray-100 dark:border-slate-700 overflow-hidden py-1 max-h-48 overflow-y-auto">
                {planOptions.length === 0 ? (
                  <div className="px-4 py-3 text-[13px] text-gray-400">
                    {plansLoading ? "Loading…" : "No active plans found"}
                  </div>
                ) : (
                  planOptions.map((opt) => (
                    <div
                      key={opt.priceId}
                      onClick={() => { setSelectedOption(opt); setDropdownOpen(false); }}
                      className={`px-4 py-2.5 hover:bg-[#F3F4F6] dark:hover:bg-slate-700 cursor-pointer text-[14px] ${
                        selectedOption?.priceId === opt.priceId
                          ? "text-yellow-600 font-semibold"
                          : "text-[#111] dark:text-white"
                      }`}
                    >
                      {opt.label}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {!subscription.stripeSubscriptionId && (
            <p className="text-[12px] text-amber-500">
              This subscription has no Stripe subscription ID — plan changes via Stripe are unavailable.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex gap-3 border-t border-gray-100 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 bg-[#F3F4F6] dark:bg-slate-700 text-[#374151] dark:text-white font-[500] py-3 rounded-[12px] hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || !selectedOption || !subscription.stripeSubscriptionId}
            className="flex-1 bg-[#FFCA06] text-[#000000] font-[500] py-3 rounded-[12px] hover:bg-[#eab700] transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {submitting ? "Updating…" : "Confirm Change"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePlanModal;
