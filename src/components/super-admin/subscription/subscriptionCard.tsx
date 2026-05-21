import { useEffect, useMemo, useState } from "react";
import { Check, Edit3, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPlans, updatePlanTier, type Plan } from "@/store/slices/subscriptionSlice";

type DraftFeature = {
  text: string;
  enabled: boolean;
};

type DraftPlan = {
  plan: string;
  displayName: string;
  monthlyAmount: number;
  yearlyAmount: number;
  features: DraftFeature[];
  isActive: boolean;
  isPopular: boolean;
};

const planColor: Record<string, string> = {
  STARTER: "border-t-gray-400",
  PROFESSIONAL: "border-[#2463EB]",
  ENTERPRISE: "border-t-purple-500",
};

const badgeStyles: Record<string, string> = {
  STARTER: "bg-gray-100 text-gray-500",
  PROFESSIONAL: "bg-[#C7DDFF] text-[#2463EB]",
  ENTERPRISE: "bg-[#F1EBFD] text-[#8B52EF]",
};

const toDraft = (plan: Plan): DraftPlan => ({
  plan: plan.stripeProductId || plan.id,
  displayName: plan.displayName || plan.name,
  monthlyAmount: Number(plan.monthlyAmount || 0),
  yearlyAmount: Number(plan.yearlyAmount || 0),
  features: plan.features?.length ? plan.features : [{ text: "", enabled: true }],
  isActive: Boolean(plan.isActive),
  isPopular: Boolean(plan.isPopular),
});

const formatMoney = (amount: number) => `$${Number(amount || 0).toLocaleString()}`;

const SubscriptionCard = () => {
  const dispatch = useAppDispatch();
  const { plans, loading } = useAppSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  if (loading && plans.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#2463EB]" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="w-full rounded-[12px] bg-white dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 px-6 py-10 text-center">
        <h2 className="text-[20px] font-[600] text-[#1D2C45] dark:text-white">
          No Stripe pricing tiers found
        </h2>
        <p className="mt-2 text-[14px] text-[#6575A7] dark:text-gray-400">
          Create subscription Products with recurring Prices in Stripe, then refresh this page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-start items-stretch flex-wrap work-sans gap-3">
      {plans.map((plan) => (
        <PlanCard key={plan.stripeProductId || plan.id} plan={plan} />
      ))}
    </div>
  );
};

const PlanCard = ({ plan }: { plan: Plan }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.subscriptions);
  const [billing, setBilling] = useState<"Monthly" | "Yearly">("Monthly");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DraftPlan>(() => toDraft(plan));

  useEffect(() => {
    if (!editing) {
      setDraft(toDraft(plan));
    }
  }, [editing, plan]);

  const currentPrice = billing === "Monthly"
    ? { price: formatMoney(plan.monthlyAmount), period: "/mo" }
    : { price: formatMoney(plan.yearlyAmount), period: "/yr" };

  const yearlyDiscount = useMemo(() => {
    if (!plan.monthlyAmount || !plan.yearlyAmount) return "";
    const fullYear = plan.monthlyAmount * 12;
    const discount = Math.round(((fullYear - plan.yearlyAmount) / fullYear) * 100);
    return discount > 0 ? `-${discount}%` : "";
  }, [plan.monthlyAmount, plan.yearlyAmount]);

  const updateFeature = (index: number, patch: Partial<DraftFeature>) => {
    setDraft((current) => ({
      ...current,
      features: current.features.map((feature, idx) =>
        idx === index ? { ...feature, ...patch } : feature,
      ),
    }));
  };

  const removeFeature = (index: number) => {
    setDraft((current) => ({
      ...current,
      features: current.features.filter((_, idx) => idx !== index),
    }));
  };

  const savePlan = async () => {
    try {
      await dispatch(updatePlanTier(draft)).unwrap();
      toast.success("Pricing tier synced to Stripe");
      setEditing(false);
    } catch (error: any) {
      toast.error(error || "Failed to update pricing tier");
    }
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-800 gap-5 md:w-[32%] w-full rounded-[22px] shadow-md border-t-4 
      ${plan.isPopular ? "border-[#2463EB]" : planColor[plan.plan] || "border-t-gray-400"} px-6 py-7 flex flex-col`}
    >
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2463EB] text-white px-[11px] py-[5px] rounded-[75px] text-[15.41px] font-[500] shadow-md">
          Most Popular
        </div>
      )}

      <div className="flex justify-between items-center mb-3.5">
        <h3 className="text-[22px] font-[600] text-[#2C2C2C] dark:text-white">
          {plan.displayName || plan.name}
        </h3>
        <span className={`px-[10px] py-[2px] rounded-[75px] text-[13.53px] ${badgeStyles[plan.plan] || "bg-gray-100 text-gray-500"}`}>
          {plan.plan}
        </span>
      </div>

      <div className="bg-[#F1F5F9] dark:bg-slate-700 p-1 rounded-[12px] flex mb-2">
        {(["Monthly", "Yearly"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setBilling(type)}
            className={`flex-1 py-[8px] text-[15.41px] font-[500] rounded-[12px] ${
              billing === type
                ? "bg-white dark:bg-slate-900 shadow-sm dark:text-white text-[#030213]"
                : "text-[#6575A7] dark:text-gray-400"
            }`}
          >
            {type}
            {type === "Yearly" && yearlyDiscount && (
              <span className="ml-1 text-[12px] text-[#2DC300]">{yearlyDiscount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="text-center mb-2">
        <span className="text-[22px] font-[600] text-[#2C2C2C] dark:text-white">
          {currentPrice.price}
        </span>
        <span className="text-[#54585C] dark:text-gray-400 text-[18px] font-[500]">
          {currentPrice.period}
        </span>
      </div>

      {editing ? (
        <div className="space-y-3">
          <label className="block">
            <span className="text-[13px] text-[#6575A7] dark:text-gray-300">Tier name</span>
            <input
              value={draft.displayName}
              onChange={(event) => setDraft({ ...draft, displayName: event.target.value })}
              className="mt-1 w-full h-10 rounded-[10px] bg-[#F8FAFC] dark:bg-slate-700 px-3 text-[14px] outline-none dark:text-white"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[13px] text-[#6575A7] dark:text-gray-300">Monthly</span>
              <input
                type="number"
                min="1"
                value={draft.monthlyAmount}
                onChange={(event) => setDraft({ ...draft, monthlyAmount: Number(event.target.value) })}
                className="mt-1 w-full h-10 rounded-[10px] bg-[#F8FAFC] dark:bg-slate-700 px-3 text-[14px] outline-none dark:text-white"
              />
            </label>
            <label className="block">
              <span className="text-[13px] text-[#6575A7] dark:text-gray-300">Yearly</span>
              <input
                type="number"
                min="1"
                value={draft.yearlyAmount}
                onChange={(event) => setDraft({ ...draft, yearlyAmount: Number(event.target.value) })}
                className="mt-1 w-full h-10 rounded-[10px] bg-[#F8FAFC] dark:bg-slate-700 px-3 text-[14px] outline-none dark:text-white"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6575A7] dark:text-gray-300">Active</span>
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
              className="size-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6575A7] dark:text-gray-300">Most popular</span>
            <input
              type="checkbox"
              checked={draft.isPopular}
              onChange={(event) => setDraft({ ...draft, isPopular: event.target.checked })}
              className="size-4"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6575A7] dark:text-gray-300">Features</span>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, features: [...draft.features, { text: "", enabled: true }] })}
                className="size-8 inline-flex items-center justify-center rounded-full bg-[#F1F5F9] dark:bg-slate-700 text-[#2463EB]"
              >
                <Plus size={16} />
              </button>
            </div>
            {draft.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={feature.enabled}
                  onChange={(event) => updateFeature(index, { enabled: event.target.checked })}
                  className="size-4"
                />
                <input
                  value={feature.text}
                  onChange={(event) => updateFeature(index, { text: event.target.value })}
                  className="flex-1 h-9 rounded-[10px] bg-[#F8FAFC] dark:bg-slate-700 px-3 text-[13px] outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="size-8 inline-flex items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ul className="space-y-2 mb-4 flex-grow">
          {plan.features.map((feature, idx) => (
            <li key={`${feature.text}-${idx}`} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${feature.enabled ? "bg-[#FFCA06]" : "bg-gray-200"}`}>
                <Check size={14} className="text-white stroke-[2px]" />
              </div>
              <span className={`text-[16px] ${feature.enabled ? "text-[#1D2C45] dark:text-gray-200" : "text-[#1D2C456B] dark:text-gray-500 line-through"}`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-gray-100 dark:border-slate-600 pt-3 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[16px] font-[600] text-[#1D2C45] dark:text-white">Status</p>
            <p className={`text-[14px] font-[500] ${plan.isActive ? "text-[#2DAC2F]" : "text-gray-400"}`}>
              {plan.isActive ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="size-10 inline-flex items-center justify-center rounded-full bg-[#F1F5F9] dark:bg-slate-700 text-[#6575A7]"
                >
                  <X size={17} />
                </button>
                <button
                  onClick={savePlan}
                  disabled={loading}
                  className="size-10 inline-flex items-center justify-center rounded-full bg-[#2463EB] text-white disabled:opacity-60"
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="size-10 inline-flex items-center justify-center rounded-full bg-[#F1F5F9] dark:bg-slate-700 text-[#2463EB]"
              >
                <Edit3 size={17} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#F1F5F9] dark:bg-slate-700 rounded-[12px] py-[11px] px-[19px] flex items-center justify-center gap-2 text-[#9BA4AD] dark:text-gray-400">
        <span className="text-[12px]">Synced with Stripe Products and Prices</span>
      </div>
    </div>
  );
};

export default SubscriptionCard;
