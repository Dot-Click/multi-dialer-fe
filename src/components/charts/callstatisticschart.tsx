import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#37B5EF",  // 1 top
  "#9400BD",  // 2
  "#FF7F3A",  // 3
  "#F91E4A",  // 4
  "#EC7490",  // 5
  "#3DC269",  // 6
];

const data = [
  { value: 20 },
  { value: 20 },
  { value: 20 },
  { value: 20 },
  { value: 20 },
  { value: 20 },
];

const CallStatisticChart = () => {
  return (
    <div style={{ width: 170, height: 170 }}>
      <ResponsiveContainer>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            innerRadius="50%"
            outerRadius="80%"
            startAngle={90}      // <--- Top se start (90°)
            endAngle={-270}      // <--- Clockwise perfect circle
            paddingAngle={0}     // <--- spacing kam
            stroke="#fff"
            strokeWidth={2}      // <--- thin clean gap
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>

         
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CallStatisticChart;
