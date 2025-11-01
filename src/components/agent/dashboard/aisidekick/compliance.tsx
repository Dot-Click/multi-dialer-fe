import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Data for the Risk Phrase Detection Rate donut chart
const riskData = [
    { name: 'Detected', value: 25 },
    { name: 'Safe', value: 75 },
];

// Colors for the chart segments
const COLORS = ['#22C55E', '#E5E7EB']; // Green for detected, Gray for the rest

const Compliance = () => {
    // Example percentage for the compliance flags progress bar
    const flagsRaisedPercentage = 40; 

    return (
        <div className="bg-white rounded-2xl w-full  shadow-sm p-6 sm:p-8 flex flex-col h-full">
            {/* Main Title */}
            <h1 className="text-lg font-bold text-gray-800 mb-4">Compliance & Risk Monitoring</h1>

            {/* Main content area */}
            <div className="flex-grow flex flex-col  sm:flex-row gap-2">

                {/* Left Column: Compliance Flags Raised */}
                <div className="w-full sm:w-1/2  justify-between  flex flex-col">
                    <h2 className="text-md font-semibold text-gray-700">Compliance Flags Raised</h2>
                    <span className=''>
                    <p className="text-xl font-bold text-gray-900 my-4">
                        12 flags
                    </p>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${flagsRaisedPercentage}%` }}
                        ></div>
                    </div>
                    </span>
                    {/* Description pushed to the bottom */}
                    <p className="text-xs text-gray-500  pt-2">
                        Number of calls monitored to ensure outbound numbers are not marked as spam
                    </p>
                </div>

                {/* Right Column: Risk Phrase Detection Rate */}
                <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start">
                    <h2 className="text-md font-semibold text-gray-700">Risk Phrase Detection Rate</h2>
                    {/* Donut Chart */}
                    <div className="w-40 h-40 relative my-4">
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
                                    endAngle={-270}
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-800">25%</span>
                        </div>
                    </div>
                    {/* Description pushed to the bottom */}
                    <p className="text-xs text-gray-500 pt-2 text-center sm:text-left">
                        Frequency of sensitive or non-compliant language
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Compliance