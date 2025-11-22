
// Data for the Keyword Optimization Score progress bar and legend
const keywordData = [
    { label: 'Low', percentage: 35, color: 'bg-green-500' },
    { label: 'Medium', percentage: 30, color: 'bg-yellow-400' },
    { label: 'High', percentage: 35, color: 'bg-red-500' },
];

const CallOutcome = () => {
    return (
        <div className="bg-white  w-full  shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px]">
            <div className="space-y-3">
                {/* Main Title */}
                <h1 className="text-[20px] font-[500] text-[#000000]">Call Outcome Intelligence</h1>

                {/* Section 1: AI-Predicted Call Outcome */}
                <div className=" pb-2 mt-9">
                    <h2 className="text-[16px] font-[500] text-[#0E1011] mb-4">AI-Predicted Call Outcome</h2>
                    {/* Responsive Grid: 3 columns on large screens, 1 on small */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center sm:text-left">
                        <div className="flex flex-col gap-1.5">
                            <p className="text-[14px] font-[500] text-[#495057]">Appointment Set</p>
                            <p className="text-[16px] font-[500] text-[#000000]">62%</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <p className="text-[14px] font-[500] text-[#495057]">Interested</p>
                            <p className="text-[16px] font-[500] text-[#000000]">45%</p>
                        </div>
                        {/* Spanning 2 cols on small screens for better centering */}
                        <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1 text-center sm:text-left">
                            <p className="text-[14px] font-[500] text-[#495057]">Not Interested</p>
                            <p className="text-[16px] font-[500] text-[#000000]">7</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Conversation Quality Score */}
                <div className=" pb-4">
                    <div className="flex justify-between items-center gap-4">
                        <div>
                            <h2 className="text-[16px] font-[500] text-[#0E1011]">Conversation Quality Score</h2>
                            <p className="text-[12px] font-[400] text-[#2B3034] mt-1">AI analysis of engagement depth and relevance</p>
                        </div>
                        <p className="text-[24px] font-[600] text-[#000000] whitespace-nowrap">
                            85<span className="text-[16px] text-[#848C94]">/100</span>
                        </p>
                    </div>
                </div>

                {/* Section 3: Keyword Optimization Score */}
                <div>
                    <h2 className="text-[16px] font-[500] text-[#0E1011] mb-4">Keyword Optimization Score</h2>
                    {/* Multi-colored Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
                        {keywordData.map(item => (
                            <div
                                key={item.label}
                                className={`${item.color} h-4`}
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        ))}
                    </div>
                    {/* Legend */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2 mt-4 text-[12px] font-[400] text-[#0E1011]">
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