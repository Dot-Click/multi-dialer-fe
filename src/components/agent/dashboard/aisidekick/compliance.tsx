import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Data for the Risk Phrase Detection Rate donut chart
const riskData = [
    { name: 'Detected', value: 25 },
    { name: 'Safe', value: 75 },
];

// Colors for the chart segments
const COLORS = ['#3DC269', '#E5E7EB']; // Green for detected, Gray for the rest

const Compliance = () => {
    // Example percentage for the compliance flags progress bar
    const flagsRaisedPercentage = 40; 

    return (
        <div className="bg-white dark:bg-slate-800 w-full  shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex flex-col h-full">
            {/* Main Title */}
            <h1 className="text-[20px] font-[500] dark:text-white text-[#000000] mb-4">Compliance & Risk Monitoring</h1>

            {/* Main content area */}
            <div className="flex-grow flex flex-col  sm:flex-row gap-2">

                {/* Left Column: Compliance Flags Raised */}
                <div className="w-full sm:w-1/2  justify-between  flex flex-col">
                    <h2 className="text-[16px] font-[500] dark:text-white text-[#0E1011]">Compliance Flags Raised</h2>
                    <span className=''>
                <p className="text-[24px] font-[600] dark:text-white text-[#000000] my-4">
                        12 flags
                    </p>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                            className="bg-[#1EAC22] h-full rounded-full"
                            style={{ width: `${flagsRaisedPercentage}%` }}
                        ></div>
                    </div>
                    </span>
                    {/* Description pushed to the bottom */}
                    <p className="text-[12px] font-[400] dark:text-gray-400 text-[#2B3034]  pt-2">
                        Number of calls monitored to ensure outbound numbers are not marked as spam
                    </p>
                </div>

                {/* Right Column: Risk Phrase Detection Rate */}
                <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start">
                    <h2 className="text-[16px] font-[500] dark:text-white text-[#0E1011]">Risk Phrase Detection Rate</h2>
                    {/* Donut Chart */}
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
                            <span className="text-[24px] font-[600] dark:text-white text-[#000000]">25%</span>
                        </div>
                    </div>
                    {/* Description pushed to the bottom */}
                    <p className="text-[12px] font-[400] dark:text-gray-400 text-[#2B3034] pt-2 text-center sm:text-left">
                        Frequency of sensitive or non-compliant language
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Compliance