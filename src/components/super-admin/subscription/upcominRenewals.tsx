import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUpcomingRenewals } from "@/store/slices/subscriptionSlice";
import Loader from "@/components/common/Loader";

const daysUntil = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const UpcomingRenewals = () => {
  const dispatch = useAppDispatch();
  const { upcomingRenewals, upcomingRenewalsLoading } = useAppSelector(
    (state) => state.subscriptions,
  );

  useEffect(() => {
    dispatch(fetchUpcomingRenewals());
  }, [dispatch]);

  const formatAmount = (amount: string | null) => {
    if (!amount) return "—";
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="w-full md:w-[50%] bg-white dark:bg-slate-800 work-sans rounded-[22px] py-6 shadow-lg">
      {/* Header */}
      <div className="flex justify-between px-6 items-center mb-3">
        <h3 className="text-[22px] font-[600] text-[#2C2C2C] dark:text-white">
          Upcoming Renewals
        </h3>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 max-h-[200px] px-6 overflow-auto custom-scrollbar">
        {upcomingRenewalsLoading ? (
          <div className="flex justify-center items-center h-[120px]">
            <Loader fullPage={false} />
          </div>
        ) : upcomingRenewals.length === 0 ? (
          <div className="flex justify-center items-center h-[120px] text-[14px] text-gray-400">
            No renewals in the next 30 days
          </div>
        ) : (
          upcomingRenewals.map((item) => {
            const days = daysUntil(item.nextRenewalDate);
            return (
              <div
                key={item.id}
                className="bg-[#FEFCE8] dark:bg-yellow-900/20 rounded-[12px] px-4 py-3.5 flex justify-between items-center"
              >
                <div className="pr-2 min-w-0">
                  <p className="text-[16px] font-[600] text-[#1D2C45] dark:text-white truncate">
                    {item.user?.fullName || item.userId}
                  </p>
                  <p className="text-[14px] font-[400] text-[#1D2C45B5] dark:text-gray-400">
                    {item.plan} · {item.billingCycle === "YEARLY" ? "Yearly" : "Monthly"}
                  </p>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    Renews in {days} day{days !== 1 ? "s" : ""} —{" "}
                    {new Date(item.nextRenewalDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-[16px] font-[600] text-[#7D6405] whitespace-nowrap ml-3">
                  {formatAmount(item.amount)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingRenewals;
