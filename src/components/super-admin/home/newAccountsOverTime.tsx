import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Data adjusted so labels align exactly under the dots as seen in the image
const thisMonthData = [
  { week: "", value: 5 },
  { week: "Week 1", value: 38 },
  { week: "", value: 52 },
  { week: "", value: 62 },
  { week: "Week 2", value: 56 },
  { week: "", value: 62 },
  { week: "", value: 70 },
  { week: "Week 3", value: 78 },
  { week: "", value: 74 },
  { week: "", value: 66 },
  { week: "", value: 62 },
  { week: "Week 4", value: 36 },
  { week: "", value: 41 },
];

const lastMonthData = [
  { week: "", value: 20 },
  { week: "Week 1", value: 45 },
  { week: "", value: 58 },
  { week: "", value: 50 },
  { week: "Week 2", value: 60 },
  { week: "", value: 65 },
  { week: "", value: 72 },
  { week: "Week 3", value: 68 },
  { week: "", value: 63 },
  { week: "", value: 55 },
  { week: "", value: 48 },
  { week: "Week 4", value: 42 },
  { week: "", value: 45 },
];

const NewAccountsOverTime = () => {
  const [activeTab, setActiveTab] = useState("this");

  const data = activeTab === "this" ? thisMonthData : lastMonthData;

  return (
    // Container and Header kept exactly as your original
    <section className="mt-3 bg-[#FFFFFF] work-sans px-[24px] pt-[18px] pb-[32px] rounded-[32px] w-[50%]">
      <div>
        <h1 className="text-[#000000] font-[500] text-[20px]">
          New Accounts Over Time
        </h1>

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => setActiveTab("this")}
            className={`text-[14px] font-[500] px-[12px] py-[8px] rounded-[8px] transition ${
              activeTab === "this"
                ? "bg-[#0E1011] text-white"
                : "border border-[#EBEDF0] text-[#0E1011]"
            }`}
          >
            This Month
          </button>

          <button
            onClick={() => setActiveTab("last")}
            className={`text-[14px] font-[500] px-[12px] py-[8px] rounded-[8px] transition ${
              activeTab === "last"
                ? "bg-[#0E1011] text-white"
                : "border border-[#EBEDF0] text-[#0E1011]"
            }`}
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Chart Logic Updated to match image */}
      <div className="h-[250px] w-full mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid 
              stroke="#F0F0F0" 
              vertical={false} 
            />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              interval={0} // Ensures all "Week" labels show up
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]} // Matches the image's scale
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
              // Solid gray dots as seen in the image
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