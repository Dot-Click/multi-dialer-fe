
const AdminAgentImprovement = () => {
    // The width of the progress bar, derived from the "Current Performance"
    const currentPerformancePercentage = 15;

    return (
        <div className="bg-white rounded-2xl w-full shadow-sm p-6 sm:p-6">
            {/* Main Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-6">Agent Improvement Score</h2>

            {/* Performance Metrics */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm text-gray-500">Current Performance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">+{currentPerformancePercentage}%</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Target Performance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">+20%</p>
                </div>
            </div>

            {/* Progress Bar with Value */}
            <div className="flex items-center gap-4">
                {/* Progress Bar Container */}
                <div className="w-full bg-gray-200 rounded-md h-10">
                    {/* Filled part of the bar */}
                    <div
                        className="bg-green-500 h-10 rounded-md"
                        style={{ width: `${currentPerformancePercentage}%` }}
                    ></div>
                </div>
                {/* Percentage Value */}
                <span className="font-semibold text-lg text-gray-700">{currentPerformancePercentage}%</span>
            </div>
        </div>
    );
};

export default AdminAgentImprovement;