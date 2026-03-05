// LeadIntelligence.js
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

const pieData = [
    { name: "High", value: 70 },
    { name: "Medium", value: 19 },
    { name: "Low", value: 11 }
];

// UPDATED COLORS (Low = #EB9D34)
const COLORS = ["#9400BD", "#F91E4A", "#ff7f3a"];

// Line chart legend colors unchanged
const lineLegendData = [
    { name: "Positive", color: "#22C55E" },
    { name: "Neutral", color: "#FBBF24" },
    { name: "Negative", color: "#EF4444" }
];

const lineChartData = [
    { name: "Mon", Positive: 20, Neutral: 25, Negative: 50 },
    { name: "Tue", Positive: 48, Neutral: 30, Negative: 33 },
    { name: "Wed", Positive: 64, Neutral: 35, Negative: 25 },
    { name: "Thu", Positive: 70, Neutral: 38, Negative: 22 },
    { name: "Fri", Positive: 85, Neutral: 42, Negative: 15 },
    { name: "Sat", Positive: 74, Neutral: 38, Negative: 21 },
    { name: "Sun", Positive: 52, Neutral: 35, Negative: 32 }
];

const AdminLeadIntelligence = () => {
    const summaryData = [
        { id: 1, name: "Avg AI Lead Score", number: "62%" },
        { id: 2, name: "Engagement Prediction", number: "45%" },
        { id: 3, name: "Urgent Leads", number: "7" }
    ];

    return (
        <section className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm w-full px-[24px] pt-[24px] pb-[32px] flex flex-col gap-4">

            <h1 className="text-[20px] font-[500] text-[#000000] dark:text-white">Lead Intelligence</h1>

            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-6">

                {/* Left Summary */}
                <div className="flex-1 flex flex-col gap-4">
                    {summaryData.map((dt) => (
                        <div key={dt.id}>
                            <p className="text-[14px] text-[#495057] dark:text-gray-400 font-[500]">{dt.name}</p>
                            <p className="text-[16px] font-[500] text-[#000000] dark:text-white">{dt.number}</p>
                        </div>
                    ))}
                </div>

                {/* Right Pie Chart */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h2 className="text-[14px] text-[#495057] dark:text-gray-400 mb-1 md:mr-[45%] font-[500] mr-[25%]">AI Lead Score</h2>

                    <div className="flex items-center gap-3">
                        <div className="w-40 h-40 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>

                                    {/* SHADOW FILTER */}
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

                                    {/* DONUT WITH SHADOW */}
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        dataKey="value"
                                        paddingAngle={1}
                                        filter="url(#shadow)"   // <-- shadow applied here
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index]} />
                                        ))}
                                    </Pie>

                                </PieChart>
                            </ResponsiveContainer>



                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[24px] dark:text-white font-[600] text-[#000000]">72%</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {pieData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: COLORS[index] }}
                                    ></span>
                                    <span className="text-[12px] text-[#0E1011] dark:text-white font-[400]">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Chart Section */}
            <div className="mt-2">

                <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
                    <h2 className="text-[16px] dark:text-white font-[500] text-[#0E1011]">Lead Sentiment Trend</h2>

                    <div className="flex items-center gap-4">
                        {lineLegendData.map((legend) => (
                            <div key={legend.name} className="flex items-center gap-1 text-[12px] text-[#0E1011] dark:text-white font-[400]">
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
                            data={lineChartData}
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
                    <h2 className="text-[16px] font-[500] dark:text-white text-[#495057]">Lead Sentiment Trend</h2>

                    <div className="hidden sm:flex items-center gap-4">
                        <span className="flex items-center gap-1 font-[400] text-[12px] text-[#0E1011] dark:text-white">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#3DC269" }}></span>
                            High
                        </span>
                        <span className="flex items-center gap-1 font-[400] text-[12px] text-[#0E1011] dark:text-white">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#F6BF26" }}></span>
                            Medium
                        </span>
                        <span className="flex items-center gap-1 font-[400] text-[12px] text-[#0E1011] dark:text-white">
                            <span className="w-2 h-2 rounded-full" style={{ background: "#D43435" }}></span>
                            Low
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-md h-7 overflow-hidden">
                        <div
                            className="h-full rounded-md"
                            style={{ width: "90%", background: "#1EAC22" }}
                        ></div>
                    </div>
                    <span className="font-semibold dark:text-white text-gray-900">45%</span>
                </div>
            </div>

        </section>
    );
};

export default AdminLeadIntelligence;
