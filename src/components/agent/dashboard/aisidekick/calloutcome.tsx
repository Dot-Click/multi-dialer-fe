import { useCallOutcome } from "@/hooks/useAiSidekick";
import { Loader2 } from "lucide-react";

const CallOutcome = () => {
    const { data, isLoading } = useCallOutcome();

    if (isLoading) {
        return (
            <div className="bg-white w-full dark:bg-slate-800 shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    const keywordData = data?.keywordData || [];
    const outcomes = data?.predictedOutcomes || { appointmentSet: "0%", interested: "0%", notInterested: 0 };

    return (
        <div className="bg-white w-full dark:bg-slate-800 shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px]">
            <div className="space-y-3">
                <h1 className="text-[20px] font-medium text-[#000000] dark:text-white">Call Outcome Intelligence</h1>

                <div className="pb-2 mt-9">
                    <h2 className="text-[16px] font-medium text-[#0E1011] dark:text-white mb-4">AI-Predicted Call Outcome</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center sm:text-left">
                        <div className="flex flex-col gap-1.5">
                            <p className="text-[14px] font-medium text-[#495057]">Appointment Set</p>
                            <p className="text-[16px] font-medium text-[#000000] dark:text-white">{outcomes.appointmentSet}</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <p className="text-[14px] font-medium dark:text-gray-400 text-[#495057]">Interested</p>
                            <p className="text-[16px] font-medium text-[#000000] dark:text-white">{outcomes.interested}</p>
                        </div>
                        <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1 text-center sm:text-left">
                            <p className="text-[14px] font-medium dark:text-gray-400 text-[#495057]">Not Interested</p>
                            <p className="text-[16px] font-medium text-[#000000] dark:text-white">{outcomes.notInterested}</p>
                        </div>
                    </div>
                </div>

                <div className="pb-4">
                    <div className="flex justify-between items-center gap-4">
                        <div>
                            <h2 className="text-[16px] font-medium dark:text-white text-[#0E1011]">Conversation Quality Score</h2>
                            <p className="text-[12px] font-normal dark:text-gray-400 text-[#2B3034] mt-1">AI analysis of engagement depth and relevance</p>
                        </div>
                        <p className="text-[24px] font-semibold text-[#000000] dark:text-white whitespace-nowrap">
                            {data?.qualityScore || 0}<span className="text-[16px] text-[#848C94]">/100</span>
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-[16px] font-medium dark:text-white text-[#0E1011] mb-4">Keyword Optimization Score</h2>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 flex overflow-hidden">
                        {keywordData.map(item => (
                            <div
                                key={item.label}
                                className={`${item.color} h-4 transition-all duration-500`}
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2 mt-4 text-[12px] font-normal dark:text-gray-400 text-[#0E1011]">
                        {keywordData.map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                                <span>{item.label}: {item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallOutcome;