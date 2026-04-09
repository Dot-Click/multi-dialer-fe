import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getNewAccountsOverTime } from "@/store/slices/reportsSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Loader from "@/components/common/Loader";

const NewAccountsOverTime = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { thisMonthChart, lastMonthChart, chartLoading } = useSelector(
    (state: RootState) => state.reports
  );
  
  const [activeTab, setActiveTab] = useState<"this" | "last">("this");

  useEffect(() => {
    // Fetch both on mount to ensure data is ready when switching tabs
    dispatch(getNewAccountsOverTime("THIS_MONTH"));
    dispatch(getNewAccountsOverTime("LAST_MONTH"));
  }, [dispatch]);

  const rawData = activeTab === "this" ? thisMonthChart : lastMonthChart;

  // Transform API data to Recharts format
  const chartData = rawData 
    ? rawData.labels.map((label, index) => ({
        week: label,
        value: rawData.values[index] || 0,
      }))
    : [];

  return (
    <section className="relative mt-3 h-[450px] bg-[#FFFFFF] dark:bg-gray-800 shadow-sm work-sans px-[24px] pt-[18px] pb-[32px] rounded-[32px] w-full md:w-[50%]">
      {chartLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-[32px]">
          <Loader fullPage={false} />
        </div>
      )}
      
      <div>
        <h1 className="text-[#000000] dark:text-white font-[500] text-[20px]">
          New Accounts Over Time
        </h1>

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => setActiveTab("this")}
            className={`text-[14px] font-[500] px-[12px] py-[8px] rounded-[8px] transition ${
              activeTab === "this"
                ? "bg-[#0E1011] dark:bg-gray-600 text-white"
                : "border border-[#EBEDF0] dark:border-gray-600 text-[#0E1011] dark:text-white"
            }`}
          >
            This Month
          </button>

          <button
            onClick={() => setActiveTab("last")}
            className={`text-[14px] font-[500] px-[12px] py-[8px] rounded-[8px] transition ${
              activeTab === "last"
                ? "bg-[#0E1011] dark:bg-gray-600 text-white"
                : "border border-[#EBEDF0] dark:border-gray-600 text-[#0E1011] dark:text-white"
            }`}
          >
            Last Month
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid 
              stroke="#F0F0F0" 
              vertical={false} 
            />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              interval={0}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              domain={[0, 'auto']}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.05)"
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7C838D"
              strokeWidth={2}
              dot={{
                r: 5,
                fill: "#7C838D",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
                fill: "#7C838D",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default NewAccountsOverTime;