// // // import React from 'react';
// // // import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// // // // Data for the AI Lead Score Donut Chart
// // // const pieData = [
// // //     { name: 'High', value: 72 },
// // //     { name: 'Medium', value: 18 },
// // //     { name: 'Low', value: 10 },
// // // ];

// // // const COLORS = ['#8A2BE2', '#FFA500', '#FF4136'];

// // // // Data for the Lead Sentiment Trend Line Chart
// // // const lineChartData = [
// // //     { name: 'Mon', Positive: 20, Neutral: 25, Negative: 50 },
// // //     { name: 'Tue', Positive: 48, Neutral: 30, Negative: 33 },
// // //     { name: 'Wed', Positive: 64, Neutral: 35, Negative: 25 },
// // //     { name: 'Thu', Positive: 70, Neutral: 38, Negative: 22 },
// // //     { name: 'Fri', Positive: 85, Neutral: 42, Negative: 15 },
// // //     { name: 'Sat', Positive: 74, Neutral: 38, Negative: 21 },
// // //     { name: 'Sun', Positive: 52, Neutral: 35, Negative: 32 },
// // // ];


// // // const LeadIntelligence = () => {
// // //     // Data for the top-left summary
// // //     const summaryData = [
// // //         { id: 1, name: "Avg AI Lead Score", number: "62%" },
// // //         { id: 2, name: "Engagement Prediction", number: "45%" },
// // //         { id: 3, name: "Urgent Leads", number: "7" },
// // //     ]

// // //     return (
// // //         <section className='bg-white rounded-2xl w-full shadow-sm p-6 w-full'>
// // //             <h1 className="text-xl font-medium mb-6">Lead Intelligence</h1>

// // //             {/* Top Section: Metrics and Donut Chart */}
// // //             <div className='flex flex-col md:flex-row gap-8 mb-8'>
// // //                 {/* Left Side: Metrics */}
// // //                 <div className='flex-1 flex flex-col gap-5'>
// // //                     {summaryData.map((dt) => (
// // //                         <div key={dt.id}>
// // //                             <p className='text-sm text-gray-500 font-medium'>{dt.name}</p>
// // //                             <p className='text-lg font-semibold text-gray-900'>{dt.number}</p>
// // //                         </div>
// // //                     ))}
// // //                 </div>

// // //                 {/* Right Side: AI Lead Score Donut Chart */}
// // //                 <div className='flex-1 flex flex-col items-center'>
// // //                     <h2 className='text-md font-medium text-gray-600 mb-2'>AI Lead Score</h2>
// // //                     <div className="w-48 h-48 relative">
// // //                         <ResponsiveContainer width="100%" height="100%">
// // //                             <PieChart>
// // //                                 <Pie
// // //                                     data={pieData}
// // //                                     cx="50%"
// // //                                     cy="50%"
// // //                                     innerRadius={60}
// // //                                     outerRadius={80}
// // //                                     fill="#8884d8"
// // //                                     paddingAngle={5}
// // //                                     dataKey="value"
// // //                                 >
// // //                                     {pieData.map((entry, index) => (
// // //                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //                                     ))}
// // //                                 </Pie>
// // //                             </PieChart>
// // //                         </ResponsiveContainer>
// // //                         <div className="absolute inset-0 flex items-center justify-center">
// // //                             <span className="text-3xl font-bold text-gray-800">72%</span>
// // //                         </div>
// // //                     </div>
// // //                      {/* Custom Legend */}
// // //                      <div className="flex justify-center items-center gap-4 mt-4">
// // //                         {pieData.map((entry, index) => (
// // //                              <div key={`legend-${index}`} className="flex items-center gap-2">
// // //                                 <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
// // //                                 <span className="text-sm text-gray-600">{entry.name}</span>
// // //                             </div>
// // //                         ))}
// // //                     </div>
// // //                 </div>
// // //             </div>

// // //             {/* Middle Section: Lead Sentiment Trend Line Chart */}
// // //             <div className='mb-8'>
// // //                 <h2 className='text-lg font-medium text-gray-800 mb-4'>Lead Sentiment Trend</h2>
// // //                 <div style={{ width: '100%', height: 300 }}>
// // //                      <ResponsiveContainer>
// // //                         <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
// // //                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
// // //                             <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false}/>
// // //                             <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false}/>
// // //                             <Tooltip />
// // //                             <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize: "14px", paddingTop: "20px"}}/>
// // //                             <Line type="monotone" dataKey="Positive" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
// // //                             <Line type="monotone" dataKey="Neutral" stroke="#FBBF24" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
// // //                             <Line type="monotone" dataKey="Negative" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
// // //                         </LineChart>
// // //                     </ResponsiveContainer>
// // //                 </div>
// // //             </div>

// // //             {/* Bottom Section: Progress Bar */}
// // //             <div>
// // //                  {/* The title "Lead Sentiment Trend" is repeated in the image, which might be an error. 
// // //                  I'm renaming it to be more descriptive based on the other metrics. */}
// // //                  <div className="flex items-center justify-between mb-2">
// // //                 <h2 className='text-lg font-medium text-gray-800 mb-2'>Lead Engagement</h2>
// // //                     <div className="flex items-center gap-4">
// // //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500"></span>High</span>
// // //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-yellow-400"></span>Medium</span>
// // //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-red-500"></span>Low</span>
// // //                     </div>
// // //                  </div>
// // //                 <div className='flex items-center gap-4'>
// // //                     <div className='w-full bg-gray-200 rounded-full h-4'>
// // //                         <div className='bg-green-500 h-4 rounded-full' style={{ width: '45%' }}></div>
// // //                     </div>
// // //                     <span className='font-semibold text-gray-800'>45%</span>
// // //                 </div>
// // //             </div>
// // //         </section>
// // //     );
// // // }

// // // export default LeadIntelligence;




// // import React from 'react';
// // import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// // // Data for the AI Lead Score Donut Chart
// // const pieData = [
// //     { name: 'High', value: 72 },
// //     { name: 'Medium', value: 18 },
// //     { name: 'Low', value: 10 },
// // ];

// // const COLORS = ['#8A2BE2', '#FFA500', '#FF4136'];

// // // Data for the Lead Sentiment Trend Line Chart
// // const lineChartData = [
// //     { name: 'Mon', Positive: 20, Neutral: 25, Negative: 50 },
// //     { name: 'Tue', Positive: 48, Neutral: 30, Negative: 33 },
// //     { name: 'Wed', Positive: 64, Neutral: 35, Negative: 25 },
// //     { name: 'Thu', Positive: 70, Neutral: 38, Negative: 22 },
// //     { name: 'Fri', Positive: 85, Neutral: 42, Negative: 15 },
// //     { name: 'Sat', Positive: 74, Neutral: 38, Negative: 21 },
// //     { name: 'Sun', Positive: 52, Neutral: 35, Negative: 32 },
// // ];
// // // Custom data for the legend to match the chart lines
// // const lineLegendData = [
// //     { name: 'Positive', color: '#22C55E' },
// //     { name: 'Neutral', color: '#FBBF24' },
// //     { name: 'Negative', color: '#EF4444' }
// // ];


// // const LeadIntelligence = () => {
// //     // Data for the top-left summary
// //     const summaryData = [
// //         { id: 1, name: "Avg AI Lead Score", number: "62%" },
// //         { id: 2, name: "Engagement Prediction", number: "45%" },
// //         { id: 3, name: "Urgent Leads", number: "7" },
// //     ]

// //     return (
// //         <section className='bg-white rounded-2xl w-[45%] shadow-sm p-6'>
// //             <h1 className="text-xl font-medium mb-6">Lead Intelligence</h1>

// //             {/* Top Section: Metrics and Donut Chart */}
// //             <div className='flex flex-col md:flex-row gap-8 mb-8'>
// //                 {/* Left Side: Metrics */}
// //                 <div className='flex-1 flex flex-col gap-5'>
// //                     {summaryData.map((dt) => (
// //                         <div key={dt.id}>
// //                             <p className='text-sm text-gray-500 font-medium'>{dt.name}</p>
// //                             <p className='text-lg font-semibold text-gray-900'>{dt.number}</p>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 {/* Right Side: AI Lead Score Donut Chart with Legend on the side */}
// //                 <div className='flex-1 flex flex-col items-center md:items-start'>
// //                     <h2 className='text-md font-medium text-gray-600 mb-2 self-center'>AI Lead Score</h2>
// //                     <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
// //                         {/* Donut Chart */}
// //                         <div className="w-48 h-48 relative">
// //                             <ResponsiveContainer width="100%" height="100%">
// //                                 <PieChart>
// //                                     <Pie
// //                                         data={pieData}
// //                                         cx="50%"
// //                                         cy="50%"
// //                                         innerRadius={60}
// //                                         outerRadius={80}
// //                                         fill="#8884d8"
// //                                         paddingAngle={5}
// //                                         dataKey="value"
// //                                     >
// //                                         {pieData.map((entry, index) => (
// //                                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                                         ))}
// //                                     </Pie>
// //                                 </PieChart>
// //                             </ResponsiveContainer>
// //                             <div className="absolute inset-0 flex items-center justify-center">
// //                                 <span className="text-3xl font-bold text-gray-800">72%</span>
// //                             </div>
// //                         </div>
// //                         {/* Custom Legend on the side */}
// //                         <div className="flex flex-col gap-3">
// //                             {pieData.map((entry, index) => (
// //                                 <div key={`legend-${index}`} className="flex items-center gap-2">
// //                                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
// //                                     <span className="text-sm text-gray-600">{entry.name}</span>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Middle Section: Lead Sentiment Trend Line Chart */}
// //             <div className='mb-8'>
// //                 {/* Header with Title and Custom Legend */}
// //                 <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
// //                     <h2 className='text-lg font-medium text-gray-800'>Lead Sentiment Trend</h2>
// //                     <div className="flex items-center gap-4">
// //                         {lineLegendData.map((item) => (
// //                              <div key={item.name} className="flex items-center gap-2">
// //                                 <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
// //                                 <span className="text-sm text-gray-600">{item.name}</span>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>
// //                 {/* Line Chart */}
// //                 <div style={{ width: '100%', height: 300 }}>
// //                     <ResponsiveContainer>
// //                         <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
// //                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
// //                             <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
// //                             <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
// //                             <Tooltip />
// //                             <Line type="monotone" dataKey="Positive" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
// //                             <Line type="monotone" dataKey="Neutral" stroke="#FBBF24" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
// //                             <Line type="monotone" dataKey="Negative" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
// //                         </LineChart>
// //                     </ResponsiveContainer>
// //                 </div>
// //             </div>

// //             {/* Bottom Section: Progress Bar */}
// //             <div>
// //                 <div className="flex items-center justify-between mb-2">
// //                     <h2 className='text-lg font-medium text-gray-800'>Lead Engagement</h2>
// //                     <div className="hidden sm:flex items-center gap-4">
// //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500"></span>High</span>
// //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-yellow-400"></span>Medium</span>
// //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-red-500"></span>Low</span>
// //                     </div>
// //                 </div>
// //                 <div className='flex items-center gap-4'>
// //                     <div className='w-full bg-gray-200 rounded-full h-4'>
// //                         <div className='bg-green-500 h-4 rounded-full' style={{ width: '45%' }}></div>
// //                     </div>
// //                     <span className='font-semibold text-gray-800'>45%</span>
// //                 </div>
// //             </div>
// //         </section>
// //     );
// // }

// // export default LeadIntelligence;


// // LeadIntelligence.js
// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// // Data for AI Lead Score Donut Chart
// const pieData = [
//     { name: 'High', value: 72 },
//     { name: 'Medium', value: 18 },
//     { name: 'Low', value: 10 },
// ];
// const COLORS = ['#8A2BE2', '#FFA500', '#FF4136'];

// // Data for Lead Sentiment Trend Line Chart
// const lineChartData = [
//     { name: 'Mon', Positive: 20, Neutral: 25, Negative: 50 },
//     { name: 'Tue', Positive: 48, Neutral: 30, Negative: 33 },
//     { name: 'Wed', Positive: 64, Neutral: 35, Negative: 25 },
//     { name: 'Thu', Positive: 70, Neutral: 38, Negative: 22 },
//     { name: 'Fri', Positive: 85, Neutral: 42, Negative: 15 },
//     { name: 'Sat', Positive: 74, Neutral: 38, Negative: 21 },
//     { name: 'Sun', Positive: 52, Neutral: 35, Negative: 32 },
// ];
// const lineLegendData = [
//     { name: 'Positive', color: '#22C55E' },
//     { name: 'Neutral', color: '#FBBF24' },
//     { name: 'Negative', color: '#EF4444' }
// ];

// const LeadIntelligence = () => {
//     const summaryData = [
//         { id: 1, name: "Avg AI Lead Score", number: "62%" },
//         { id: 2, name: "Engagement Prediction", number: "45%" },
//         { id: 3, name: "Urgent Leads", number: "7" },
//     ];

//     return (
//         <section className='bg-white rounded-2xl w-full shadow-sm p-6 flex flex-col h-full'>
//             <h1 className="text-xl font-medium mb-6">Lead Intelligence</h1>
//             {/* Top Section */}
//             <div className='flex flex-col md:flex-row gap-8 mb-8'>
//                 <div className='flex-1 flex flex-col gap-5'>
//                     {summaryData.map((dt) => (
//                         <div key={dt.id}>
//                             <p className='text-sm text-gray-500 font-medium'>{dt.name}</p>
//                             <p className='text-lg font-semibold text-gray-900'>{dt.number}</p>
//                         </div>
//                     ))}
//                 </div>
//                 <div className='flex-1 flex flex-col items-center'>
//                     <h2 className='text-md font-medium text-gray-600 mb-2'>AI Lead Score</h2>
//                     <div className="flex items-center justify-center gap-6 w-full">
//                         <div className="w-48 h-48 relative">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
//                                         {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
//                                     </Pie>
//                                 </PieChart>
//                             </ResponsiveContainer>
//                             <div className="absolute inset-0 flex items-center justify-center">
//                                 <span className="text-3xl font-bold text-gray-800">72%</span>
//                             </div>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             {pieData.map((entry, index) => (
//                                 <div key={`legend-${index}`} className="flex items-center gap-2">
//                                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
//                                     <span className="text-sm text-gray-600">{entry.name}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* Middle Section */}
//             <div className='mb-8'>
//                 <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//                     <h2 className='text-lg font-medium text-gray-800'>Lead Sentiment Trend</h2>
//                     <div className="flex items-center gap-4">
//                         {lineLegendData.map((item) => (
//                             <div key={item.name} className="flex items-center gap-2">
//                                 <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
//                                 <span className="text-sm text-gray-600">{item.name}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <div style={{ width: '100%', height: 300 }}>
//                     <ResponsiveContainer>
//                         <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                             <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
//                             <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
//                             <Tooltip />
//                             <Line type="monotone" dataKey="Positive" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
//                             <Line type="monotone" dataKey="Neutral" stroke="#FBBF24" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
//                             <Line type="monotone" dataKey="Negative" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//             {/* Bottom Section */}
//             <div className="mt-auto">
//                 <div className="flex items-center justify-between mb-2">
//                     <h2 className='text-lg font-medium text-gray-800'>Lead Sentiment Trend</h2>
//                     <div className="flex items-center gap-4">
//                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500"></span>High</span>
//                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-yellow-400"></span>Medium</span>
//                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-red-500"></span>Low</span>
//                     </div>
//                 </div>
//                 <div className='flex items-center gap-4'>
//                     <div className='w-full bg-gray-200 rounded-full h-4'>
//                         <div className='bg-green-500 h-4 rounded-full' style={{ width: '45%' }}></div>
//                     </div>
//                     <span className='font-semibold text-gray-800'>45%</span>
//                 </div>
//             </div>
//         </section>
//     );
// }

// export default LeadIntelligence;

// LeadIntelligence.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Data...
const pieData = [{ name: 'High', value: 72 }, { name: 'Medium', value: 18 }, { name: 'Low', value: 10 }];
const COLORS = ['#8A2BE2', '#FFA500', '#FF4136'];
const lineChartData = [
    { name: 'Mon', Positive: 20, Neutral: 25, Negative: 50 }, { name: 'Tue', Positive: 48, Neutral: 30, Negative: 33 },
    { name: 'Wed', Positive: 64, Neutral: 35, Negative: 25 }, { name: 'Thu', Positive: 70, Neutral: 38, Negative: 22 },
    { name: 'Fri', Positive: 85, Neutral: 42, Negative: 15 }, { name: 'Sat', Positive: 74, Neutral: 38, Negative: 21 },
    { name: 'Sun', Positive: 52, Neutral: 35, Negative: 32 },
];
const lineLegendData = [{ name: 'Positive', color: '#22C55E' }, { name: 'Neutral', color: '#FBBF24' }, { name: 'Negative', color: '#EF4444' }];

const LeadIntelligence = () => {
    const summaryData = [
        { id: 1, name: "Avg AI Lead Score", number: "62%" }, { id: 2, name: "Engagement Prediction", number: "45%" },
        { id: 3, name: "Urgent Leads", number: "7" },
    ];

    return (
        <section className='bg-white rounded-2xl w-full shadow-sm p-5 flex flex-col h-full'>
            <h1 className="text-xl font-medium mb-3">Lead Intelligence</h1>
            {/* Top Section */}
            <div className='flex flex-col md:flex-row gap-4 mb-2'>
                <div className='flex-1 flex flex-col gap-4'>
                    {summaryData.map((dt) => (
                        <div key={dt.id}>
                            <p className='text-[11px] text-gray-500 font-medium'>{dt.name}</p>
                            <p className='text-md font-semibold text-gray-900'>{dt.number}</p>
                        </div>
                    ))}
                </div>
                <div className='flex-1 flex flex-col items-center'>
                    <h2 className='text-md font-medium text-gray-600 mb-2'>AI Lead Score</h2>
                    <div className="flex items-center justify-center gap-4 w-full">
                        <div className="w-40 h-40 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value">{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-bold text-gray-800">72%</span></div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {pieData.map((entry, index) => (
                                <div key={`legend-${index}`} className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                                    <span className="text-sm text-gray-600">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Middle Section */}
            <div className='mb-2'>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-1 gap-2">
                    <h2 className='text-md font-medium text-gray-800'>Lead Sentiment Trend</h2>
                    <div className="flex items-center gap-2">
                        {lineLegendData.map((item) => (
                            <div key={item.name} className="flex text-[10px] items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span><span className=" text-gray-600">{item.name}</span></div>
                        ))}
                    </div>
                </div>
                <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer><LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip /><Line type="monotone" dataKey="Positive" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} /><Line type="monotone" dataKey="Neutral" stroke="#FBBF24" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} /><Line type="monotone" dataKey="Negative" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer>
                </div>
            </div>
            {/* Bottom Section */}
            <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                    <h2 className='text-md font-medium text-gray-800'>Lead Sentiment Trend</h2>
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-gray-600"><span className="w-2 h-2 rounded-full bg-green-500"></span>High</span><span className="flex text-[10px] items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-yellow-400"></span>Medium</span><span className="flex items-center gap-2 text-[10px] text-gray-600"><span className="w-2 h-2 rounded-full bg-red-500"></span>Low</span>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='w-full bg-gray-200 rounded-md h-7'><div className='bg-green-500 h-full rounded-md' style={{ width: '45%' }}></div></div><span className='font-semibold text-gray-800'>45%</span>
                </div>
            </div>
        </section>
    );
}

export default LeadIntelligence;