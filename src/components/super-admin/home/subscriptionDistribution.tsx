import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell } from "recharts";
import { getUserSubscriptionStatus } from "@/store/slices/reportsSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Loader from "@/components/common/Loader";

const SubscriptionDistribution = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptionStatus, subscriptionStatusLoading } = useSelector(
    (state: RootState) => state.reports
  );

  useEffect(() => {
    dispatch(getUserSubscriptionStatus());
  }, [dispatch]);

  const active = subscriptionStatus?.active ?? 0;
  const inactive = subscriptionStatus?.inactive ?? 0;
  const total = active + inactive;
  
  const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

  // Chart data
  const chartData = [
    { name: "Active", value: active || 1 }, // Fallback to 1 for visual if 0
    { name: "Inactive", value: inactive || 0 },
  ];

  const COLORS = ["#9400BD", "#F91E4A"]; 

  return (
    <section className="relative mt-3 bg-[#FFFFFF] dark:bg-slate-800 work-sans flex flex-col gap-4 shadow-sm pt-[23px] rounded-[32px] h-[400px] w-full md:w-[30%]">
      {subscriptionStatusLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-[32px]">
          <Loader fullPage={false} />
        </div>
      )}

      {/* Heading */}
      <div className="flex items-center px-[24px]">
        <h1 className="text-[#000000] dark:text-white font-[500] text-[20px] whitespace-nowrap">
          Subscription Distribution
        </h1>
      </div>

      {/* Donut Chart */}
      <div className="relative flex justify-center items-center py-2">
        <PieChart width={200} height={200}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            startAngle={90}     
            endAngle={450}     
            dataKey="value"
            stroke="none"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>

        {/* Center Circle with percentage */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-[30px] dark:text-white font-[600] text-black ">
            {percentage}%
          </span>
          <span className="text-[12px] text-gray-500 font-[400]">Active</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-4 px-[24px] pb-[30px] mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#9400BD]" />
          <p className="text-[12px] dark:text-white font-[400] text-[#0E1011] opacity-80">
            Active Subscriptions: {active}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F91E4A]" />
          <p className="text-[12px] dark:text-white font-[400] text-[#0E1011] opacity-80">
            Inactive Subscriptions: {inactive}
          </p>
        </div>
      </div>

    </section>
  );
};

export default SubscriptionDistribution;