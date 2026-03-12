import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AnsweredChartProps {
  data?: { time: string; series1: number; series2: number }[];
}

const AnsweredChart = ({ data }: AnsweredChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
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
          stroke="#9A9A9A" // Slightly lighter for contrast
          strokeWidth={2}
          strokeDasharray="5 5" // Dashed for extra contrast
          dot={{ r: 5, fill: "#9A9A9A" }}
          activeDot={{ r: 7 }}
        />

      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnsweredChart;
