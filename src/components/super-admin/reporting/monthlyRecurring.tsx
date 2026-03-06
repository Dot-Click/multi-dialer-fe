import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jul", value: 45000 },
  { name: "", value: 105000 },
  { name: "Aug", value: 155000 },
  { name: "", value: 195000 },
  { name: "Sep", value: 175000 },
  { name: "", value: 195000 },
  { name: "Oct", value: 225000 },
  { name: "", value: 255000 },
  { name: "Nov", value: 240000 },
  { name: "", value: 210000 },
  { name: "Dec", value: 200000 },
  { name: "", value: 95000 },
  { name: "", value: 115000 },
];

const MonthlyRecurring = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[28px] shadow-sm pt-6 px-6 pb-4 w-full">
      {/* Heading */}
      <h2 className="text-[20px] work-sans font-[500] text-[#000000] dark:text-white mb-6 ">
        Monthly Recurring Revenue Trend
      </h2>

      {/* Chart */}
      <div className="h-[260px] w-full -mx-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              vertical={false}
              stroke="#F1F3F5"
              strokeWidth={1.5}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 13 }}
              dy={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 13 }}
              ticks={[0, 75000, 150000, 225000, 300000]}
              tickFormatter={(v) => (v === 0 ? "0" : `$${v / 1000}k`)}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7E8B99"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#7E8B99", strokeWidth: 0 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyRecurring;
