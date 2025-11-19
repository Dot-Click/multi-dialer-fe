import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { time: "9:00", series1: 3, series2: 2 },
  { time: "10:00", series1: 38, series2: 15 },
  { time: "11:00", series1: 53, series2: 20 },
  { time: "12:00", series1: 63, series2: 24 },
  { time: "13:00", series1: 56, series2: 21 },
  { time: "14:00", series1: 62, series2: 23 },
  { time: "15:00", series1: 72, series2: 26 },
  { time: "16:00", series1: 78, series2: 29 },
  { time: "17:00", series1: 79, series2: 29 },
  { time: "18:00", series1: 74, series2: 27 },
  { time: "19:00", series1: 66, series2: 25 },
  { time: "20:00", series1: 62, series2: 23 },
  { time: "21:00", series1: 36, series2: 14 },
];

const AnsweredChart = () => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 20, left: -20, bottom: -13 }}
      >
        {/* Soft horizontal grid only */}
        <CartesianGrid stroke="#E5E5E5" strokeDasharray="3 3" vertical={false} />

        {/* X-axis clean */}
        <XAxis
  dataKey="time"
  tick={{ fontSize: 12, fill: "#7A7A7A" }}
  axisLine={false}
  tickLine={false}
  ticks={["9:00", "12:00", "15:00", "18:00", "21:00"]}
  interval={0}
/>

        {/* Y-axis with spacing between numbers and line */}
        <YAxis
          tick={{ fontSize: 12, fill: "#9A9A9A" }}
          axisLine={false}
          tickLine={false}
          ticks={[0, 20, 40, 60, 80, 100]}
          domain={[0, 100]}
          tickMargin={12}  
           // ✅ Gap between numbers (0,20,40...) and line chart
        />

        <Tooltip />

        {/* BOTH LINES SAME COLOR */}
        <Line
          type="monotone"
          dataKey="series1"
          stroke="#6E6E6E"
          strokeWidth={2}
          dot={{ r: 5, fill: "#6E6E6E" }}
          activeDot={{ r: 7 }}
        />

        <Line
          type="monotone"
          dataKey="series2"
          stroke="#6E6E6E"
          strokeWidth={2}
          dot={{ r: 5, fill: "#6E6E6E" }}
          activeDot={{ r: 7 }}
        />

      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnsweredChart;
