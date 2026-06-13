import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFailedPayments } from "@/store/slices/subscriptionSlice";
import Loader from "@/components/common/Loader";

const FailedPayment = () => {
  const dispatch = useAppDispatch();
  const { failedPayments, failedPaymentsLoading } = useAppSelector(
    (state) => state.subscriptions,
  );

  useEffect(() => {
    dispatch(fetchFailedPayments());
  }, [dispatch]);

  const formatAmount = (amount: string | null) => {
    if (!amount) return "—";
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="w-full md:w-[50%] bg-white dark:bg-slate-800 work-sans rounded-[22px] pt-5 pb-6 shadow-lg">
      {/* Header */}
      <div className="flex justify-between px-6 items-center mb-3">
        <h3 className="text-[22px] font-[600] text-[#2C2C2C] dark:text-white">
          Failed Payments
        </h3>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 max-h-[200px] px-6 overflow-auto custom-scrollbar">
        {failedPaymentsLoading ? (
          <div className="flex justify-center items-center h-[120px]">
            <Loader fullPage={false} />
          </div>
        ) : failedPayments.length === 0 ? (
          <div className="flex justify-center items-center h-[120px] text-[14px] text-gray-400">
            No failed payments
          </div>
        ) : (
          failedPayments.map((item) => (
            <div
              key={item.id}
              className="bg-[#FEF2F2] dark:bg-red-900/20 rounded-[12px] px-4 py-3.5 flex justify-between items-center"
            >
              <div className="pr-2 min-w-0">
                <p className="text-[16px] font-[600] text-[#1D2C45] dark:text-white truncate">
                  {item.user?.fullName || item.userId}
                </p>
                <p className="text-[14px] font-[400] text-[#1D2C45B5] dark:text-gray-400 truncate">
                  {item.user?.email || "—"} · {item.plan}
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  Failed {new Date(item.failedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <span className="text-[16px] font-[600] text-[#C90007] whitespace-nowrap ml-3">
                {formatAmount(item.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FailedPayment;
