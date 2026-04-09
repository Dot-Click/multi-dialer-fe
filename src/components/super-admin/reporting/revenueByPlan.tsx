import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getRevenueByPlan } from "@/store/slices/reportsSlice";
import Loader from "@/components/common/Loader";

const PLAN_COLORS: Record<string, string> = {
  Starter: "#FFD100",
  Professional: "#6094FF",
  Enterprise: "#9F67FF",
};

const RevenueByPlan = () => {
  const dispatch = useAppDispatch();
  const { revenuePlans, revenueLoading } = useAppSelector(
    (state) => state.reports,
  );

  useEffect(() => {
    dispatch(getRevenueByPlan());
  }, [dispatch]);

  const chartData = (revenuePlans || []).map((item) => ({
    name: item.plan,
    value: item.amount,
    color: PLAN_COLORS[item.plan] || "#666",
  }));

  if (revenueLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm px-8 py-7 w-full lg:w-[65%] border border-gray-100 dark:border-slate-700 flex justify-center items-center h-[380px]">
        <Loader fullPage={false} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm px-8 py-7 w-full lg:w-[65%] border border-gray-100 dark:border-slate-700">
      {/* Header & Custom Legend */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <h2 className="text-[22px] font-[600] text-[#2C2C2C] dark:text-white">
          Revenue by Plan
        </h2>

        {/* Legend matching the image layout */}
        <div className="flex items-center gap-6">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-start gap-2">
              <span
                className="h-[12px] w-[12px] rounded-full mt-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col items-center">
                <span className="text-[#0E1011] dark:text-gray-300 text-[12px] font-[400] leading-none">
                  {item.name}
                </span>
                <span className="text-[#0E1011] dark:text-white text-[14px] font-[500]">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barSize={120}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              vertical={true}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#666", fontSize: 14 }}
              axisLine={{ stroke: "#999" }}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={(v) => `$${v / 1000}k`}
              tick={{ fill: "#666", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar
              dataKey="value"
              radius={[15, 15, 0, 0]} // Smooth rounded corners
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueByPlan;
