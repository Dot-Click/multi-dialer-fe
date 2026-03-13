import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useCompliance } from "@/hooks/useAiSidekick";
import { Loader2 } from "lucide-react";

const COLORS = ['#3DC269', '#E5E7EB'];

const Compliance = () => {
    const { data: compData, isLoading } = useCompliance();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    const riskData = compData?.riskData || [];

    return (
        <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex flex-col h-full">
            <h1 className="text-[20px] font-medium dark:text-white text-[#000000] mb-4">Compliance & Risk Monitoring</h1>

            <div className="grow flex flex-col sm:flex-row gap-2">
                <div className="w-full sm:w-1/2 justify-between flex flex-col">
                    <h2 className="text-[16px] font-medium dark:text-white text-[#0E1011]">Compliance Flags Raised</h2>
                    <span>
                        <p className="text-[24px] font-semibold dark:text-white text-[#000000] my-4">
                            {compData?.flags || 0} flags
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                            <div
                                className="bg-[#1EAC22] h-full rounded-full transition-all duration-500"
                                style={{ width: `${compData?.flagsPercentage || 0}%` }}
                            ></div>
                        </div>
                    </span>
                    <p className="text-[12px] font-normal dark:text-gray-400 text-[#2B3034] pt-2">
                        Number of calls monitored to ensure outbound numbers are not marked as spam
                    </p>
                </div>

                <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start">
                    <h2 className="text-[16px] font-medium dark:text-white text-[#0E1011]">Risk Phrase Detection Rate</h2>
                    <div className="w-40 h-40 relative my-5">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={65}
                                    fill="#8884d8"
                                    dataKey="value"
                                    startAngle={90}
                                    paddingAngle={3}
                                    endAngle={-270}
                                >
                                    {riskData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[24px] font-semibold dark:text-white text-[#000000]">{compData?.riskRate || 0}%</span>
                        </div>
                    </div>
                    <p className="text-[12px] font-normal dark:text-gray-400 text-[#2B3034] pt-2 text-center sm:text-left">
                        Frequency of sensitive or non-compliant language
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Compliance;