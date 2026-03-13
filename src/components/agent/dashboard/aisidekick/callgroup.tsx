import { useCallGroup } from "@/hooks/useAiSidekick";
import { Loader2 } from "lucide-react";

// Helper function to get tag styles based on tag name
const getTagStyles = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('hot')) {
        return 'bg-[#D434351A]/90 dark:text-red-400 text-[#D43435]';
    } else if (lowerTag.includes('follow') || lowerTag.includes('warm')) {
        return 'bg-[#1D85F01A]/90 dark:text-blue-400 text-[#1D85F0]';
    } else if (lowerTag.includes('interested')) {
        return 'bg-[#1D85F01A]/90 dark:text-green-400 text-[#1EAC22]';
    }
    return 'bg-gray-100 text-gray-700';
};

const CallGroup = () => {
    const { data: leads, isLoading } = useCallGroup();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex flex-col h-[60vh]">
            <h1 className="text-[20px] font-medium dark:text-white text-[#000000] mb-6 shrink-0">Calling Groups</h1>

            <div className="flex flex-col flex-1 min-h-0">
                <div className="grid grid-cols-3 gap-4 text-[12px] font-medium dark:text-gray-400 text-[#848C94] pb-2 border-b shrink-0">
                    <div className="col-span-1">Lead Name</div>
                    <div className="col-span-1 text-center">AI Lead Score</div>
                    <div className="col-span-1 text-right">Notes / Tags</div>
                </div>

                <div className="mt-4 flex-1 h-20 overflow-y-auto custom-scrollbar pr-2">
                    {leads && leads.length > 0 ? (
                        <div className="space-y-4">
                            {leads.map((item) => (
                                <div key={item.id} className="grid grid-cols-3 text-[14px] gap-4 items-center border-b pb-4 last:border-b-0">
                                    <div className="col-span-1 font-medium dark:text-white text-[#000000]">
                                        {item.name}
                                    </div>
                                    <div className="col-span-1 font-normal text-center dark:text-gray-400 text-[#2B3034]">
                                        {item.score}
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <span className={`pr-[6px] pl-[8px] py-[4px] text-[12px] font-medium rounded-[100px] max-w-[100px] min-w-[90px] text-center ${getTagStyles(item.tag)}`}>
                                            {item.tag}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 italic">
                            No high-scoring leads found today
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CallGroup;