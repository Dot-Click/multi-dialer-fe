import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Loader2 } from "lucide-react";
import { useLeadIntelligence } from "@/hooks/useAiSidekick";

const COLORS = ["#9400BD", "#F91E4A", "#ff7f3a"];

const lineLegendData = [
  { name: "Positive", color: "#22C55E" },
  { name: "Neutral", color: "#FBBF24" },
  { name: "Negative", color: "#EF4444" },
];

const AdminLeadIntelligence = () => {
  // const [data, setData] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState(false);

    const { data, isLoading } = useLeadIntelligence();


  const summaryData = [
    { id: 1, name: "Avg AI Lead Score",     number: data?.summary?.avgLeadScore         ?? "0%" },
    { id: 2, name: "Engagement Prediction", number: data?.summary?.engagementPrediction  ?? "0%" },
    { id: 3, name: "Urgent Leads",          number: data?.summary?.urgentLeads?.toString() ?? "0" },
  ];

  const pieData = data?.pieData ?? [
    { name: "High",   value: 0 },
    { name: "Medium", value: 0 },
    { name: "Low",    value: 0 },
  ];

  const sentimentTrend = data?.sentimentTrend ?? [];
  const overallScore   = data?.overallScore   ?? 0;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm w-full p-6 flex flex-col gap-4 min-h-[500px]">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        Lead Intelligence
      </h1>

      {isLoading ? (
        <div className="grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <>
          {/* Top Section */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* Left Summary */}
            <div className="flex-1 flex flex-col gap-4">
              {summaryData.map((dt) => (
                <div key={dt.id}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {dt.name}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dt.number}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Pie Chart */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <h2 className="text-md text-[#495057] dark:text-gray-300 mb-3 md:mr-[45%] font-[500] mr-[25%]">
                AI Lead Score
              </h2>

              <div className="flex items-center gap-6">
                <div className="w-40 h-40 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <filter id="shadow-admin-li" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="rgba(0,0,0,0.35)" />
                        </filter>
                      </defs>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={70}
                        dataKey="value"
                        paddingAngle={0}
                        filter="url(#shadow-admin-li)"
                      >
                        {pieData.map((_: any, index: number) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {overallScore}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {pieData.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Line Chart Section */}
          <div className="mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
              <h2 className="text-md font-medium text-[#0E1011] dark:text-white">
                Lead Sentiment Trend
              </h2>
              <div className="flex items-center gap-4">
                {lineLegendData.map((legend) => (
                  <div key={legend.name} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: legend.color }} />
                    {legend.name}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={sentimentTrend} margin={{ top: 10, right: 20, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 20, right: 10 }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="Positive" stroke="#22C55E" strokeWidth={3} dot={{ r: 4, fill: "#22C55E" }} />
                  <Line type="monotone" dataKey="Neutral"  stroke="#FBBF24" strokeWidth={3} dot={{ r: 4, fill: "#FBBF24" }} />
                  <Line type="monotone" dataKey="Negative" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: "#EF4444" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-medium text-[#0E1011] dark:text-white">
                Overall Lead Score
              </h2>
              <div className="hidden sm:flex items-center gap-4">
                {[["#3DC269", "High"], ["#F6BF26", "Medium"], ["#D43435", "Low"]].map(([color, label]) => (
                  <span key={label} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-md h-7 overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500"
                  style={{ width: `${overallScore}%`, background: "#1EAC22" }}
                />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {overallScore}%
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AdminLeadIntelligence;