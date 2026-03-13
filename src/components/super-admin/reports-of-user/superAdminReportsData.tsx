import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardSummaryStats } from "@/store/slices/reportsSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Loader from "@/components/common/Loader";

const SuperAdminReportsData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardSummaryStats, statsLoading } = useSelector(
    (state: RootState) => state.reports
  );

  useEffect(() => {
    dispatch(getDashboardSummaryStats());
  }, [dispatch]);

  const stats = dashboardSummaryStats;

  const data = [
    {
      id: 1,
      name: "Total Revenue",
      number: `$${stats?.totalRevenue?.value?.toLocaleString() ?? "0"}`,
      data: `${Number(stats?.totalRevenue?.changePercent) > 0 ? "+" : ""}${stats?.totalRevenue?.changePercent ?? 0}% ${stats?.totalRevenue?.comparison ?? "from last month"}`,
    },
    {
      id: 2,
      name: "Active Subscriptions",
      number: stats?.activeSubscriptions?.value?.toLocaleString() ?? "0",
      data: `${Number(stats?.activeSubscriptions?.changePercent) > 0 ? "+" : ""}${stats?.activeSubscriptions?.changePercent ?? 0}% ${stats?.activeSubscriptions?.comparison ?? "from last month"}`,
    },
    {
      id: 3,
      name: "New Signups",
      number: stats?.newSignups?.value?.toLocaleString() ?? "0",
      data: `${Number(stats?.newSignups?.changePercent) > 0 ? "+" : ""}${stats?.newSignups?.changePercent ?? 0}% ${stats?.newSignups?.comparison ?? "from last month"}`,
    },
    {
      id: 4,
      name: "Total Calls Processed",
      number: stats?.totalCallsProcessed?.value?.toLocaleString() ?? "0",
      data: `${Number(stats?.totalCallsProcessed?.changePercent) > 0 ? "+" : ""}${stats?.totalCallsProcessed?.changePercent ?? 0}% ${stats?.totalCallsProcessed?.comparison ?? "from last month"}`,
    },
  ];

  return (
    <section className="relative bg-white dark:bg-slate-800 outfit rounded-[13.48px] shadow-sm px-[12px] py-[14px] lg:px-[28px] w-full lg:py-[24px] min-h-[120px]">
      {statsLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-[13.48px]">
          <Loader fullPage={false} />
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex items-center flex-wrap justify-between gap-6 md:gap-20">
          {data.map((dt) => (
            <div key={dt.id} className="flex flex-col gap-1">
              <span className="text-[8px] md:text-[10px] lg:text-[15.41px] text-[#898989] dark:text-gray-400 font-[400]">
                {dt.name}
              </span>
              <span className="text-[13px] md:text-[24px] text-[#2C2C2C] dark:text-white lg:text-[26.96px] font-[600]">
                {dt.number}
              </span>
              <span className="text-[8px] md:text-[10px] lg:text-[15.41px] text-[#030213] dark:text-gray-400 font-[400] whitespace-nowrap">
                {dt.data}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuperAdminReportsData;