
const Pipeline = () => {
    // The width of the progress bar
    const accelerationPercentage = 50;

    return (
        <div className="bg-white dark:bg-slate-800  w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px]">
            {/* Main Title */}
            <h2 className="text-[20px] font-[500] text-[500] mb-6">Pipeline Acceleration Index</h2>

            {/* Acceleration Metrics */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[14px] dark:text-gray-400 text-[#495057] font-[500]">Deals Accelerated</p>
                    <p className="text-[16px] font-[500] dark:text-white text-[#000000] mt-1">+10</p>
                </div>
                <div>
                    <p className="text-[14px] dark:text-gray-400 text-[#495057] font-[500]">Average Speed Increase</p>
                    <p className="text-[16px] font-[500] dark:text-white text-[#000000] mt-1">+25%</p>
                </div>
            </div>

            {/* Progress Bar with Value */}
            <div className="flex items-center gap-4">
                {/* Progress Bar Container */}
                <div className="w-full bg-[#EBEDF0] dark:bg-slate-700 rounded-[8px] h-10">
                    {/* Filled part of the bar */}
                    <div
                        className="bg-[#1EAC22] dark:bg-green-500 h-full rounded-[8px]"
                        style={{ width: `${accelerationPercentage}%` }}
                    ></div>
                </div>
                {/* Percentage Value */}
                <span className="font-[500] text-[18px] dark:text-white text-[#000000]">{accelerationPercentage}%</span>
            </div>
        </div>
    );
};

export default Pipeline;