// // // import React from 'react';
// // // import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// // // // Data for Objection Detection Rate Chart
// // // const objectionPieData = [
// // //     { name: 'Handled successfully', value: 74 },
// // //     { name: 'Missed / unhandled', value: 36 }
// // // ];
// // // const OBJECTION_COLORS = ['#8A2BE2', '#F82A6E'];

// // // // Data for Call Confidence Index Chart
// // // const confidencePieData = [
// // //     { name: 'Excellent', value: 65 }, // Visual estimation for the chart
// // //     { name: 'Average', value: 20 },
// // //     { name: 'Poor', value: 15 }
// // // ];
// // // const CONFIDENCE_COLORS = ['#22C55E', '#FBBF24', '#EF4444'];


// // // const AiCoaching = () => {
// // //     return (
// // //         <section className='bg-white rounded-2xl w-[55%] shadow-sm p-6'>
// // //             {/* Main Header */}
// // //             <h1 className="text-xl font-medium">AI Coaching & Call Analysis</h1>

// // //             {/* Real-Time Coaching Events */}
// // //             <div className='space-y-4'>
// // //                 <h2 className='text-lg font-medium text-gray-800'>Real-Time Coaching Events</h2>
// // //                 <div>
// // //                     <p className='text-sm text-gray-500'>AI provided live suggestions for:</p>
// // //                     <p className='text-lg font-semibold text-gray-900'>12 calls today</p>
// // //                 </div>
// // //                 {/* Stacked Progress Bar */}
// // //                 <div className='flex items-center gap-4'>
// // //                     <div className='w-full bg-red-500 rounded-full h-4 flex'>
// // //                         <div className='bg-green-500 h-4 rounded-l-full' style={{ width: '60%' }}></div> {/* 12 is 60% of 20 */}
// // //                     </div>
// // //                     <span className='font-semibold text-gray-800 whitespace-nowrap'>12/20</span>
// // //                 </div>
// // //                 {/* Legend */}
// // //                 <div className='flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm text-gray-600'>
// // //                     <div className="flex items-center gap-2">
// // //                         <span className="w-3 h-3 rounded-full bg-green-500"></span>
// // //                         <span>Successfully used recommendations</span>
// // //                     </div>
// // //                     <div className="flex items-center gap-2">
// // //                         <span className="w-3 h-3 rounded-full bg-red-500"></span>
// // //                         <span>Missed / not applied</span>
// // //                     </div>
// // //                 </div>
// // //             </div>

// // //             {/* Donut Charts Section */}
// // //             <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
// // //                 {/* Objection Detection Rate */}
// // //                 <div className='w-full'>
// // //                     <h2 className='text-lg font-medium text-gray-800 mb-4 text-center md:text-left'>Objection Detection Rate</h2>
// // //                     <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 w-full">
// // //                         {/* Donut Chart */}
// // //                         <div className="w-40 h-40 relative">
// // //                             <ResponsiveContainer width="100%" height="100%">
// // //                                 <PieChart>
// // //                                     <Pie data={objectionPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value">
// // //                                         {objectionPieData.map((entry, index) => (
// // //                                             <Cell key={`cell-${index}`} fill={OBJECTION_COLORS[index % OBJECTION_COLORS.length]} />
// // //                                         ))}
// // //                                     </Pie>
// // //                                 </PieChart>
// // //                             </ResponsiveContainer>
// // //                             <div className="absolute inset-0 flex items-center justify-center">
// // //                                 <span className="text-3xl font-bold text-gray-800">64%</span>
// // //                             </div>
// // //                         </div>
// // //                         {/* Custom Legend */}
// // //                         <div className="flex flex-col gap-3">
// // //                             {objectionPieData.map((entry, index) => (
// // //                                 <div key={`legend-${index}`} className="flex items-center gap-2">
// // //                                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: OBJECTION_COLORS[index] }}></span>
// // //                                     <span className="text-sm text-gray-600">{entry.name}</span>
// // //                                 </div>
// // //                             ))}
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //                 {/* Call Confidence Index */}
// // //                 <div className='w-full'>
// // //                     <h2 className='text-lg font-medium text-gray-800 mb-4 text-center md:text-left'>Call Confidence Index</h2>
// // //                     <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 w-full">
// // //                         {/* Donut Chart */}
// // //                         <div className="w-40 h-40 relative">
// // //                             <ResponsiveContainer width="100%" height="100%">
// // //                                 <PieChart>
// // //                                     <Pie data={confidencePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value" startAngle={90} endAngle={450}>
// // //                                         {confidencePieData.map((entry, index) => (
// // //                                             <Cell key={`cell-${index}`} fill={CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length]} />
// // //                                         ))}
// // //                                     </Pie>
// // //                                 </PieChart>
// // //                             </ResponsiveContainer>
// // //                             <div className="absolute inset-0 flex items-center justify-center">
// // //                                 <span className="text-3xl font-bold text-gray-800">85<span className='text-xl'>/100</span></span>
// // //                             </div>
// // //                         </div>
// // //                         {/* Custom Legend */}
// // //                         <div className="flex flex-col gap-3">
// // //                             {confidencePieData.map((entry, index) => (
// // //                                 <div key={`legend-${index}`} className="flex items-center gap-2">
// // //                                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CONFIDENCE_COLORS[index] }}></span>
// // //                                     <span className="text-sm text-gray-600">{entry.name}</span>
// // //                                 </div>
// // //                             ))}
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             </div>

// // //             {/* Keyword Optimization Score */}
// // //             <div className='space-y-3'>
// // //                 <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
// // //                     <h2 className='text-lg font-medium text-gray-800'>Keyword Optimization Score</h2>
// // //                     <div className="flex items-center gap-4">
// // //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500"></span>High</span>
// // //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-yellow-400"></span>Medium</span>
// // //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 rounded-full bg-red-500"></span>Low</span>
// // //                     </div>
// // //                 </div>
// // //                 {/* Progress Bar */}
// // //                 <div className='flex items-center gap-4'>
// // //                     <div className='w-full bg-gray-200 rounded-full h-4'>
// // //                         <div className='bg-green-500 h-4 rounded-full' style={{ width: '72%' }}></div>
// // //                     </div>
// // //                     <span className='font-semibold text-gray-800'>72%</span>
// // //                 </div>
// // //                 <p className='text-sm text-gray-500'>AI-rated delivery quality (tone, pacing, clarity)</p>
// // //             </div>
// // //         </section>
// // //     );
// // // }

// // // export default AiCoaching;

// // import React from 'react';
// // import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// // // Data for Objection Detection Rate Chart
// // const objectionPieData = [
// //     { name: 'Handled successfully', value: 64 },
// //     { name: 'Missed / unhandled', value: 36 }
// // ];
// // const OBJECTION_COLORS = ['#9333EA', '#EF4444']; // Adjusted colors to match image

// // // Data for Call Confidence Index Chart
// // const confidencePieData = [
// //     { name: 'Excellent', value: 65 }, // Visual estimation from the chart
// //     { name: 'Average', value: 20 },
// //     { name: 'Poor', value: 15 }
// // ];
// // const CONFIDENCE_COLORS = ['#22C55E', '#FBBF24', '#DC2626']; // Adjusted colors

// // const AiCoaching = () => {
// //     return (
// //         <section className='bg-white rounded-2xl w-[555%] shadow-sm p-6 space-y-8'>
// //             {/* Main Header */}
// //             <h1 className="text-xl font-medium text-gray-800">AI Coaching & Call Analysis</h1>

// //             {/* Real-Time Coaching Events */}
// //             <div className='space-y-3'>
// //                 <h2 className='text-lg font-medium text-gray-800'>Real-Time Coaching Events</h2>
// //                 <div>
// //                     <p className='text-sm text-gray-500'>AI provided live suggestions for:</p>
// //                     <p className='text-lg font-semibold text-gray-900'>12 calls today</p>
// //                 </div>
// //                 {/* Stacked Progress Bar */}
// //                 <div className='flex items-center gap-4'>
// //                     <div className='flex-grow bg-red-600 rounded-full h-3.5 flex overflow-hidden'>
// //                         <div className='bg-green-500 h-3.5' style={{ width: '60%' }}></div> {/* 12 is 60% of 20 */}
// //                     </div>
// //                     <span className='font-semibold text-gray-700 whitespace-nowrap'>12/20</span>
// //                 </div>
// //                 {/* Legend */}
// //                 <div className='flex flex-col sm:flex-row gap-x-6 gap-y-1 text-sm text-gray-600 pt-2'>
// //                     <div className="flex items-center gap-2">
// //                         <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
// //                         <span>Successfully used recommendations</span>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                         <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
// //                         <span>Missed / not applied</span>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Donut Charts Section */}
// //             <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 pt-4'>
// //                 {/* Objection Detection Rate */}
// //                 <div className='flex flex-col'>
// //                     <h2 className='text-lg font-medium text-gray-800 mb-4 text-left'>Objection Detection Rate</h2>
// //                     <div className="flex items-center gap-6 w-full">
// //                         {/* Donut Chart */}
// //                         <div className="min-w-[10rem] min-h-[10rem] w-40 h-40 relative">
// //                             <ResponsiveContainer width="100%" height="100%">
// //                                 <PieChart>
// //                                     <Pie data={objectionPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={4} dataKey="value">
// //                                         {objectionPieData.map((entry, index) => (
// //                                             <Cell key={`cell-${index}`} fill={OBJECTION_COLORS[index % OBJECTION_COLORS.length]} />
// //                                         ))}
// //                                     </Pie>
// //                                 </PieChart>
// //                             </ResponsiveContainer>
// //                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
// //                                 <span className="text-3xl font-bold text-gray-800">64%</span>
// //                             </div>
// //                         </div>
// //                         {/* Custom Legend */}
// //                         <div className="flex flex-col gap-3">
// //                             {objectionPieData.map((entry, index) => (
// //                                 <div key={`legend-${index}`} className="flex items-center gap-2">
// //                                     <span className="w-2.5 h-2.5" style={{ backgroundColor: OBJECTION_COLORS[index] }}></span>
// //                                     <span className="text-sm text-gray-600">{entry.name}</span>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>
// //                 {/* Call Confidence Index */}
// //                 <div className='flex flex-col'>
// //                     <h2 className='text-lg font-medium text-gray-800 mb-4 text-left'>Call Confidence Index</h2>
// //                     <div className="flex items-center gap-6 w-full">
// //                         {/* Donut Chart */}
// //                         <div className="min-w-[10rem] min-h-[10rem] w-40 h-40 relative">
// //                             <ResponsiveContainer width="100%" height="100%">
// //                                 <PieChart>
// //                                     <Pie data={confidencePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" dataKey="value" startAngle={90} endAngle={-270}>
// //                                         {confidencePieData.map((entry, index) => (
// //                                             <Cell key={`cell-${index}`} fill={CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length]} stroke={CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length]} />
// //                                         ))}
// //                                     </Pie>
// //                                 </PieChart>
// //                             </ResponsiveContainer>
// //                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
// //                                 <span className="text-3xl font-bold text-gray-800">85<span className='text-xl text-gray-600'>/100</span></span>
// //                             </div>
// //                         </div>
// //                         {/* Custom Legend */}
// //                         <div className="flex flex-col gap-3">
// //                             {confidencePieData.map((entry, index) => (
// //                                 <div key={`legend-${index}`} className="flex items-center gap-2">
// //                                     <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CONFIDENCE_COLORS[index] }}></span>
// //                                     <span className="text-sm text-gray-600">{entry.name}</span>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Keyword Optimization Score */}
// //             <div className='space-y-3 pt-4'>
// //                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
// //                     <h2 className='text-lg font-medium text-gray-800'>Keyword Optimization Score</h2>
// //                     <div className="flex items-center gap-4">
// //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>High</span>
// //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>Medium</span>
// //                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>Low</span>
// //                     </div>
// //                 </div>
// //                 {/* Progress Bar */}
// //                 <div className='flex items-center gap-4'>
// //                     <div className='w-full bg-gray-200 rounded-full h-3.5'>
// //                         <div className='bg-green-500 h-3.5 rounded-full' style={{ width: '72%' }}></div>
// //                     </div>
// //                     <span className='font-semibold text-gray-700'>72%</span>
// //                 </div>
// //                 <p className='text-sm text-gray-500 pt-1'>AI-rated delivery quality (tone, pacing, clarity)</p>
// //             </div>
// //         </section>
// //     );
// // }

// // export default AiCoaching;

// // AiCoaching.js
// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// // Data for charts
// const objectionPieData = [
//     { name: 'Handled successfully', value: 64 },
//     { name: 'Missed / unhandled', value: 36 }
// ];
// const OBJECTION_COLORS = ['#9333EA', '#EF4444'];
// const confidencePieData = [
//     { name: 'Excellent', value: 65 },
//     { name: 'Average', value: 20 },
//     { name: 'Poor', value: 15 }
// ];
// const CONFIDENCE_COLORS = ['#22C55E', '#FBBF24', '#DC2626'];

// const AiCoaching = () => {
//     return (
//         <section className='bg-white rounded-2xl w-full shadow-sm p-6 flex flex-col h-full'>
//             <h1 className="text-xl font-medium text-gray-800">AI Coaching & Call Analysis</h1>
            
//             {/* Real-Time Coaching Events */}
//             <div className='space-y-3 mt-8'>
//                 <h2 className='text-lg font-medium text-gray-800'>Real-Time Coaching Events</h2>
//                 <div>
//                     <p className='text-sm text-gray-500'>AI provided live suggestions for:</p>
//                     <p className='text-lg font-semibold text-gray-900'>12 calls today</p>
//                 </div>
//                 <div className='flex items-center gap-4'>
//                     <div className='flex-grow bg-red-600 rounded-full h-3.5 flex overflow-hidden'>
//                         <div className='bg-green-500 h-3.5' style={{ width: '60%' }}></div>
//                     </div>
//                     <span className='font-semibold text-gray-700 whitespace-nowrap'>12/20</span>
//                 </div>
//                 <div className='flex flex-col sm:flex-row gap-x-6 gap-y-1 text-sm text-gray-600 pt-2'>
//                     <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>Successfully used recommendations</div>
//                     <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>Missed / not applied</div>
//                 </div>
//             </div>

//             {/* Donut Charts Section */}
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mt-10'>
//                 <div className='flex flex-col'>
//                     <h2 className='text-lg font-medium text-gray-800 mb-4 text-left'>Objection Detection Rate</h2>
//                     <div className="flex items-center gap-6 w-full">
//                         <div className="min-w-[10rem] min-h-[10rem] w-40 h-40 relative">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie data={objectionPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={4} dataKey="value">
//                                         {objectionPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={OBJECTION_COLORS[index % OBJECTION_COLORS.length]} />)}
//                                     </Pie>
//                                 </PieChart>
//                             </ResponsiveContainer>
//                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                                 <span className="text-3xl font-bold text-gray-800">64%</span>
//                             </div>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             {objectionPieData.map((entry, index) => (
//                                 <div key={`legend-${index}`} className="flex items-center gap-2">
//                                     <span className="w-2.5 h-2.5" style={{ backgroundColor: OBJECTION_COLORS[index] }}></span>
//                                     <span className="text-sm text-gray-600">{entry.name}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//                 <div className='flex flex-col'>
//                     <h2 className='text-lg font-medium text-gray-800 mb-4 text-left'>Call Confidence Index</h2>
//                     <div className="flex items-center gap-6 w-full">
//                         <div className="min-w-[10rem] min-h-[10rem] w-40 h-40 relative">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie data={confidencePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" dataKey="value" startAngle={90} endAngle={-270}>
//                                         {confidencePieData.map((entry, index) => <Cell key={`cell-${index}`} fill={CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length]} stroke={CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length]} />)}
//                                     </Pie>
//                                 </PieChart>
//                             </ResponsiveContainer>
//                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                                 <span className="text-3xl font-bold text-gray-800">85<span className='text-xl text-gray-600'>/100</span></span>
//                             </div>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             {confidencePieData.map((entry, index) => (
//                                 <div key={`legend-${index}`} className="flex items-center gap-2">
//                                     <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CONFIDENCE_COLORS[index] }}></span>
//                                     <span className="text-sm text-gray-600">{entry.name}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Keyword Optimization Score (using mt-auto to push to bottom) */}
//             <div className='space-y-3 mt-auto pt-8'>
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                     <h2 className='text-lg font-medium text-gray-800'>Keyword Optimization Score</h2>
//                     <div className="flex items-center gap-4">
//                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>High</span>
//                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>Medium</span>
//                         <span className="flex items-center gap-2 text-sm text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>Low</span>
//                     </div>
//                 </div>
//                 <div className='flex items-center gap-4'>
//                     <div className='w-full bg-gray-200 rounded-full h-3.5'>
//                         <div className='bg-green-500 h-3.5 rounded-full' style={{ width: '72%' }}></div>
//                     </div>
//                     <span className='font-semibold text-gray-700'>72%</span>
//                 </div>
//                 <p className='text-sm text-gray-500 pt-1'>AI-rated delivery quality (tone, pacing, clarity)</p>
//             </div>
//         </section>
//     );
// }

// export default AiCoaching;

// AiCoaching.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Data...
const objectionPieData = [{ name: 'Handled successfully', value: 64 }, { name: 'Missed / unhandled', value: 36 }];
const OBJECTION_COLORS = ['#9333EA', '#EF4444'];
const confidencePieData = [{ name: 'Excellent', value: 65 }, { name: 'Average', value: 20 }, { name: 'Poor', value: 15 }];
const CONFIDENCE_COLORS = ['#22C55E', '#FBBF24', '#DC2626'];

const AiCoaching = () => {
    return (
        <section className='bg-white rounded-2xl w-full shadow-sm p-5 flex flex-col h-full'>
            <h1 className="text-xl font-medium text-gray-800">AI Coaching & Call Analysis</h1>

            {/* Real-Time Coaching Events */}
            <div className='space-y-3 mt-6'>
                <h2 className='text-md font-medium text-gray-800'>Real-Time Coaching Events</h2>
                <div>
                    <p className='text-sm text-gray-500'>AI provided live suggestions for:</p>
                    <p className='text-md font-semibold text-gray-900'>12 calls today</p>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='flex-grow bg-red-600 rounded-full h-3.5 flex overflow-hidden'><div className='bg-green-500 h-3.5' style={{ width: '60%' }}></div></div><span className='font-semibold text-gray-700 whitespace-nowrap'>12/20</span>
                </div>
                <div className='flex flex-col  gap-x-6 gap-y-1 text-[10px] text-gray-600 pt-1'>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>Successfully used recommendations</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>Missed / not applied</div>
                </div>
            </div>

            {/* Donut Charts Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-8'>
                {/* Objection Detection Rate */}
                <div className='flex flex-col'>
                    <h2 className='text-sm font-medium text-gray-800 mb-4'>Objection Detection Rate</h2>
                    <div className="flex flex-col xxs:flex-row items-center gap-4 w-full">
                        <div className="min-w-[9rem] w-36 h-36 relative">
                            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={objectionPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} fill="#8884d8" paddingAngle={4} dataKey="value">{objectionPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={OBJECTION_COLORS[index % OBJECTION_COLORS.length]} />)}</Pie></PieChart></ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-2xl font-bold text-gray-800">64%</span></div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {objectionPieData.map((entry, index) => (
                                <div key={`legend-${index}`} className="flex items-center gap-2"><span className="w-2.5 h-2.5" style={{ backgroundColor: OBJECTION_COLORS[index] }}></span><span className="text-sm text-gray-600">{entry.name}</span></div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Call Confidence Index */}
                <div className='flex flex-col'>
                    <h2 className='text-sm font-medium text-gray-800 mb-4'>Call Confidence Index</h2>
                    <div className="flex flex-col xxs:flex-row items-center gap-4 w-full">
                        <div className="min-w-[9rem] w-36 h-36 relative">
                            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={confidencePieData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} fill="#8884d8" dataKey="value" startAngle={90} endAngle={-270}>{confidencePieData.map((entry, index) => <Cell key={`cell-${index}`} fill={CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length]} stroke={CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length]} />)}</Pie></PieChart></ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-2xl font-bold text-gray-800">85<span className='text-lg text-gray-600'>/100</span></span></div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {confidencePieData.map((entry, index) => (
                                <div key={`legend-${index}`} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CONFIDENCE_COLORS[index] }}></span><span className="text-sm text-gray-600">{entry.name}</span></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Keyword Optimization Score */}
            <div className='space-y-3 mt-auto pt-6'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h2 className='text-md font-medium text-gray-800'>Keyword Optimization Score</h2>
                   <div className="hidden sm:flex items-center gap-1">
                        <span className="flex items-center gap-1 text-[10px] text-gray-600"><span className="w-2 h-2 rounded-full bg-green-500"></span>High</span><span className="flex text-[10px] items-center gap-2 text-gray-600"><span className="w-2 h-2 rounded-full bg-yellow-400"></span>Medium</span><span className="flex items-center gap-2 text-[10px] text-gray-600"><span className="w-2 h-2 rounded-full bg-red-500"></span>Low</span>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='w-full bg-gray-200 rounded-md h-7'><div className='bg-green-500 h-full rounded-md' style={{ width: '72%' }}></div></div><span className='font-semibold text-gray-700'>72%</span>
                </div>
                <p className='text-sm text-gray-500 pt-1'>AI-rated delivery quality (tone, pacing, clarity)</p>
            </div>
        </section>
    );
}

export default AiCoaching;