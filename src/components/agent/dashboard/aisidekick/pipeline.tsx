import React from 'react';

const Pipeline = () => {
    // The width of the progress bar
    const accelerationPercentage = 50;

    return (
        <div className="bg-white rounded-2xl w-full shadow-sm p-6 sm:p-6">
            {/* Main Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-6">Pipeline Acceleration Index</h2>

            {/* Acceleration Metrics */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm text-gray-500">Deals Accelerated</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">+10</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Average Speed Increase</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">+25%</p>
                </div>
            </div>

            {/* Progress Bar with Value */}
            <div className="flex items-center gap-4">
                {/* Progress Bar Container */}
                <div className="w-full bg-gray-200 rounded-md h-10">
                    {/* Filled part of the bar */}
                    <div
                        className="bg-green-500 h-10 rounded-md"
                        style={{ width: `${accelerationPercentage}%` }}
                    ></div>
                </div>
                {/* Percentage Value */}
                <span className="font-semibold text-lg text-gray-700">{accelerationPercentage}%</span>
            </div>
        </div>
    );
};

export default Pipeline;