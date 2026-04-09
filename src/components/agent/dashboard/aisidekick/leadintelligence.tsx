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
    Tooltip
} from "recharts";
import { useLeadIntelligence } from "@/hooks/useAiSidekick";
import { Loader2 } from "lucide-react";

const COLORS = ["#9400BD", "#F91E4A", "#ff7f3a"];

const lineLegendData = [
    { name: "Positive", color: "#22C55E" },
    { name: "Neutral", color: "#FBBF24" },
    { name: "Negative", color: "#EF4444" }
];

const LeadIntelligence = () => {
    const { data: leadData, isLoading } = useLeadIntelligence();

    if (isLoading) {
        return (
            <section className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm w-full px-[24px] pt-[24px] pb-[32px] flex items-center justify-center min-h-[500px]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </section>
        );
    }

    const summaryData = [
        { id: 1, name: "Avg AI Lead Score", number: leadData?.summary.avgLeadScore || "0%" },
        { id: 2, name: "Engagement Prediction", number: leadData?.summary.engagementPrediction || "0%" },
        { id: 3, name: "Urgent Leads", number: leadData?.summary.urgentLeads?.toString() || "0" }
    ];

    const pieData = leadData?.pieData || [
        { name: "High", value: 0 },
        { name: "Medium", value: 0 },
        { name: "Low", value: 0 }
    ];

    return (
        <section className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm w-full px-[24px] pt-[24px] pb-[32px] flex flex-col gap-4">

            <h1 className="text-[20px] font-medium text-[#000000] dark:text-white">Lead Intelligence</h1>

            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-6">

                {/* Left Summary */}
                <div className="flex-1 flex flex-col gap-4">
                    {summaryData.map((dt) => (
                        <div key={dt.id}>
                            <p className="text-[14px] text-[#495057] dark:text-gray-400 font-medium">{dt.name}</p>
                            <p className="text-[16px] font-medium text-[#000000] dark:text-white">{dt.number}</p>
                        </div>
                    ))}
                </div>

                {/* Right Pie Chart */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h2 className="text-[14px] text-[#495057] dark:text-gray-400 mb-1 md:mr-[45%] font-medium mr-[25%]">AI Lead Score</h2>

                    <div className="flex items-center gap-3">
                        <div className="w-40 h-40 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feDropShadow
                                                dx="0"
                                                dy="0"
                                                stdDeviation="2"
                                                floodColor="rgba(0,0,0,0.35)"
                                            />
                                        </filter>
                                    </defs>

                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        dataKey="value"
                                        paddingAngle={1}
                                        filter="url(#shadow)"
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>

                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[24px] dark:text-white font-semibold text-[#000000]">{leadData?.overallScore || 0}%</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {pieData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></span>
                                    <span className="text-[12px] text-[#0E1011] dark:text-white font-normal">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Chart Section */}
            <div className="mt-2">

                <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
                    <h2 className="text-[16px] dark:text-white font-medium text-[#0E1011]">Lead Sentiment Trend</h2>

                    <div className="flex items-center gap-4">
                        {lineLegendData.map((legend) => (
                            <div key={legend.name} className="flex items-center gap-1 text-[12px] text-[#0E1011] dark:text-white font-normal">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: legend.color }}
                                ></span>
                                {legend.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={leadData?.sentimentTrend}
                            margin={{ top: 10, right: 20, left: -30, bottom: 0 }}
                        >
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

                            <Line
                                type="monotone"
                                dataKey="Positive"
                                stroke="#22C55E"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#22C55E" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Neutral"
                                stroke="#FBBF24"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#FBBF24" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Negative"
                                stroke="#EF4444"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#EF4444" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center mb-4 justify-between">
                    <h2 className="text-[16px] font-medium dark:text-white text-[#495057]">Lead Sentiment Trend</h2>

                    <div className="hidden sm:flex items-center gap-4">
                        <span className="flex items-center gap-1 font-normal text-[12px] text-[#0E1011] dark:text-white">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#3DC269" }}></span>
                            High
                        </span>
                        <span className="flex items-center gap-1 font-normal text-[12px] text-[#0E1011] dark:text-white">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#F6BF26" }}></span>
                            Medium
                        </span>
                        <span className="flex items-center gap-1 font-normal text-[12px] text-[#0E1011] dark:text-white">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#D43435" }}></span>
                            Low
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-md h-7 overflow-hidden">
                        <div
                            className="h-full rounded-md transition-all duration-500"
                            style={{ width: `${leadData?.overallScore || 0}%`, background: "#1EAC22" }}
                        ></div>
                    </div>
                    <span className="font-semibold dark:text-white text-gray-900">{leadData?.overallScore || 0}%</span>
                </div>
            </div>

        </section>
    );
};

export default LeadIntelligence;
