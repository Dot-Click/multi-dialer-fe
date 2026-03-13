import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useEfficiency } from "@/hooks/useAiSidekick";
import { Loader2 } from "lucide-react";

const COLORS = ['#22C55E', '#E5E7EB'];

const Efficiency = () => {
    const { data: effData, isLoading } = useEfficiency();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    const aiHandledData = effData?.aiHandled.data || [];

    return (
        <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex flex-col h-full">
            <h1 className="text-[20px] font-medium dark:text-white text-[#000000] mb-8">Efficiency & Automation</h1>

            <div className="flex justify-between items-center border-b pb-5">
                <div>
                    <h2 className="text-[16px] font-medium dark:text-white text-[#0E1011]">Time Saved via AI</h2>
                    <p className="text-[12px] font-normal dark:text-gray-400 text-[#2B3034] mt-1">Minutes saved from auto-logging, voicemail drops, etc.</p>
                </div>
                <p className="text-[24px] font-semibold text-[#000000] dark:text-white whitespace-nowrap">
                    {effData?.timeSaved || 0} min
                </p>
            </div>

            <div className="grow flex flex-col sm:flex-row gap-5 mt-4">
                <div className="w-full sm:w-1/2 flex flex-col">
                    <h2 className="text-[16px] font-medium dark:text-white text-[#0E1011]">Tasks Automated by AI</h2>
                    <div className="mt-10">
                        <p className="text-[24px] font-semibold text-[#000000] dark:text-white">
                            {effData?.tasksAutomated || 0} tasks
                        </p>
                        <p className="text-[24px] font-semibold text-[#000000] dark:text-white -mt-1">
                            automated
                        </p>
                    </div>
                    <div className="w-full bg-[#EBEDF0] dark:bg-slate-700 rounded-full h-3 ">
                        <div
                            className="bg-[#1EAC22] dark:bg-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${effData?.tasksAutomatedPercentage || 0}%` }}
                        ></div>
                    </div>
                    <p className="text-[12px] font-normal dark:text-gray-400 text-[#2B3034] mt-auto ">
                        Number of CRM updates, follow-ups, summaries handled by AI
                    </p>
                </div>

                <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start">
                    <h2 className="text-[16px] font-medium dark:text-white text-[#0E1011]">AI-Handled Conversations</h2>
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
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {aiHandledData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[24px] font-semibold dark:text-white text-[#000000]">{effData?.aiHandled.percentage || 0}%</span>
                        </div>
                    </div>
                    <p className="text-[12px] font-normal dark:text-gray-400 text-[#2B3034] mt-auto  text-center sm:text-left">
                        % of calls where AI managed parts of the interaction
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Efficiency;