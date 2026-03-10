import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#37B5EF",  // Interested
  "#9400BD",  // Follow-Up
  "#FF7F3A",  // No Answer
  "#F91E4A",  // Not Interested
  "#EC7490",  // DNC
  "#3DC269",  // Extra
];

const CallStatisticChart = ({ data }: { data?: { value: number }[] }) => {
  const chartData = data && data.length > 0 ? data : [
    { value: 20 },
    { value: 20 },
    { value: 20 },
    { value: 20 },
    { value: 20 },
    { value: 0 },
  ];
  return (
    <div style={{ width: 170, height: 170 }}>
      <ResponsiveContainer>
        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            innerRadius="50%"
            outerRadius="80%"
            startAngle={90}      // <--- Top se start (90°)
            endAngle={-270}      // <--- Clockwise perfect circle
            paddingAngle={0}     // <--- spacing kam
            stroke="#fff"
            strokeWidth={2}      // <--- thin clean gap
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>


        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CallStatisticChart;
