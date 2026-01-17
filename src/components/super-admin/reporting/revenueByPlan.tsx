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

const data = [
  { name: "Basic", value: 45800, color: "#FFD100" }, // Bright Yellow
  { name: "Standard", value: 128400, color: "#6094FF" }, // Bright Blue
  { name: "Premium", value: 110390, color: "#9F67FF" }, // Bright Purple
];

const RevenueByPlan = () => {
  return (
    <div className="bg-white rounded-[32px] shadow-sm px-8 py-7 w-full lg:w-[65%] border border-gray-100">
      {/* Header & Custom Legend */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <h2 className="text-[22px] font-[600] text-[#2C2C2C]">
          Revenue by Plan
        </h2>

        {/* Legend matching the image layout */}
        <div className="flex items-center gap-6">
          {data.map((item) => (
            <div key={item.name} className="flex items-start gap-2">
              <span
                className="h-[12px] w-[12px] rounded-full mt-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col items-center">
                <span className="text-[#0E1011] text-[12px] font-[400] leading-none">
                  {item.name}
                </span>
                <span className="text-[#0E1011] text-[14px] font-[500]">
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
            data={data} 
            barSize={120} 
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            {/* Dotted grid lines both horizontal and vertical */}
            <CartesianGrid
              strokeDasharray="2 2"
              vertical={true}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#666", fontSize: 14 }}
              axisLine={{ stroke: '#999' }}
              tickLine={false}
              dy={10}
            />
            <YAxis
              domain={[0, 140000]}
              ticks={[0, 35000, 70000, 105000, 140000]}
              tickFormatter={(v) => `$${v / 1000}k`}
              tick={{ fill: "#666", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar
              dataKey="value"
              radius={[15, 15, 0, 0]} // Smooth rounded corners
            >
              {data.map((entry, index) => (
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