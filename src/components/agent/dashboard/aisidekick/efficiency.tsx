import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Data for the AI-Handled Conversations donut chart
const aiHandledData = [
    { name: 'Handled', value: 25 },
    { name: 'Not Handled', value: 75 },
];

// Colors for the donut chart segments
const COLORS = ['#22C55E', '#E5E7EB']; // Green for handled, Gray for the rest

const Efficiency = () => {
    const tasksAutomatedPercentage = 65; // Example percentage for the progress bar width

    return (
        <div className="bg-white dark:bg-slate-800  w-full  shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex flex-col h-full">
            {/* Main Title */}
            <h1 className="text-[20px] font-[500] dark:text-white text-[#000000] mb-8">Efficiency & Automation</h1>

            {/* Section 1: Time Saved via AI */}
            <div className="flex justify-between items-center border-b pb-5">
                <div>
                    <h2 className="text-[16px] font-[500] dark:text-white text-[#0E1011]">Time Saved via AI</h2>
                    <p className="text-[12px] font-[400] dark:text-gray-400 text-[#2B3034] mt-1">Minutes saved from auto-logging, voicemail drops, etc.</p>
                </div>
                <p className="text-[24px] font-[600] text-[#000000] dark:text-white whitespace-nowrap">
                    120 min
                </p>
            </div>

            {/* Section 2: Automation Stats (uses flex and will wrap on small screens) */}
            <div className="flex-grow flex flex-col sm:flex-row gap-5 mt-4">
                {/* Left Column: Tasks Automated by AI */}
                <div className="w-full sm:w-1/2 flex flex-col">
                    <h2 className="text-[16px] font-[500] dark:text-white text-[#0E1011]">Tasks Automated by AI</h2>
                    <div className="mt-10">
                        <p className="text-[24px] font-[600] text-[#000000] dark:text-white">
                            45 tasks
                        </p>
                        <p className="text-[24px] font-[600] text-[#000000] dark:text-white -mt-1">
                            automated
                        </p>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#EBEDF0] dark:bg-slate-700 rounded-full h-3 ">
                        <div
                            className="bg-[#1EAC22] dark:bg-green-500 h-3 rounded-full"
                            style={{ width: `${tasksAutomatedPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-[12px] font-[400] dark:text-gray-400 text-[#2B3034] mt-auto ">
                        Number of CRM updates, follow-ups, summaries handled by AI
                    </p>
                </div>

                {/* Right Column: AI-Handled Conversations */}
                <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start">
                    <h2 className="text-[16px] font-[500] dark:text-white text-[#0E1011]">AI-Handled Conversations</h2>
                    {/* Donut Chart */}
                    <div className="w-40 h-40 relative my-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={aiHandledData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={65}
                                    fill="#8884d8"
                                    paddingAngle={3}
                                    dataKey="value"
                                    startAngle={90} // Starts from the top
                                    endAngle={-270} // Goes clockwise
                                >
                                    {aiHandledData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[24px] font-[600] dark:text-white text-[#000000]">25%</span>
                        </div>
                    </div>
                    <p className="text-[12px] font-[400] dark:text-gray-400 text-[#2B3034] mt-auto  text-center sm:text-left">
                        % of calls where AI managed parts of the interaction
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Efficiency;