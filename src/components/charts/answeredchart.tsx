// import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

// // #region Sample data
// const data = [
//     {
//         name: 'Page A',
//         uv: 4000,
//         pv: 2400,
//         amt: 2400,
//     },
//     {
//         name: 'Page B',
//         uv: 3000,
//         pv: 1398,
//         amt: 2210,
//     },
//     {
//         name: 'Page C',
//         uv: 2000,
//         pv: 9800,
//         amt: 2290,
//     },
//     {
//         name: 'Page D',
//         uv: 2780,
//         pv: 3908,
//         amt: 2000,
//     },
//     {
//         name: 'Page E',
//         uv: 1890,
//         pv: 4800,
//         amt: 2181,
//     },
//     {
//         name: 'Page F',
//         uv: 2390,
//         pv: 3800,
//         amt: 2500,
//     },
//     {
//         name: 'Page G',
//         uv: 3490,
//         pv: 4300,
//         amt: 2100,
//     },
// ];

// // #endregion
// const AnsweredChart = () => {
//     return (
//         <LineChart
//             style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
//             responsive
//             data={data}
//         >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
//             <YAxis width="auto" />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
//             <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
//         </LineChart>
//     );
// }

// export default AnsweredChart

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Data (aapke original image ke hisab se)
const chartData = [
  { time: '9:00', series1: 3, series2: 2 },
  { time: '10:00', series1: 38, series2: 15 },
  { time: '11:00', series1: 53, series2: 20 },
  { time: '12:00', series1: 63, series2: 24 },
  { time: '13:00', series1: 56, series2: 21 },
  { time: '14:00', series1: 62, series2: 23 },
  { time: '15:00', series1: 72, series2: 26 },
  { time: '16:00', series1: 78, series2: 29 },
  { time: '17:00', series1: 79, series2: 29 },
  { time: '18:00', series1: 74, series2: 27 },
  { time: '19:00', series1: 66, series2: 25 },
  { time: '20:00', series1: 62, series2: 23 },
  { time: '21:00', series1: 36, series2: 14 },
  { time: '22:00', series1: 41, series2: 16 },
];


const AnsweredChart = () => {
    return (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            {/* Chart ke background me grid lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            
            {/* X-axis (Time) */}
            <XAxis dataKey="time" />
            
            {/* Y-axis (Percentage) */}
            <YAxis />
            
            {/* Hover karne par data dikhane ke liye Tooltip */}
            <Tooltip />
            
            {/* Pehli line (Upar wali) */}
            <Line 
                type="monotone" 
                dataKey="series1" 
                stroke="#828282" // Line ka color
                strokeWidth={2} // Line ki motai
                // BADLAAV YAHAN KIYA GAYA HAI: 'fill' property add ki gayi hai
                dot={{ r: 6, fill: '#828282' }} // Points ka size aur color
                activeDot={{ r: 8 }} // Active point ka size
            />

            {/* Dusri line (Neeche wali) */}
            <Line 
                type="monotone" 
                dataKey="series2" 
                stroke="#828282" 
                strokeWidth={2}
                // BADLAAV YAHAN BHI KIYA GAYA HAI
                dot={{ r: 6, fill: '#828282' }}
                activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
    );
};

export default AnsweredChart;