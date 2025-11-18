
// // import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// // // #region Sample data
// // const data = [
// //   {
// //     name: 'Page A',
// //     uv: 4000,
// //     pv: 2400,
// //     amt: 2400,
// //   },
// //   {
// //     name: 'Page B',
// //     uv: 3000,
// //     pv: 1398,
// //     amt: 2210,
// //   },
// //   {
// //     name: 'Page C',
// //     uv: 2000,
// //     pv: 9800,
// //     amt: 2290,
// //   },
// //   {
// //     name: 'Page D',
// //     uv: 2780,
// //     pv: 3908,
// //     amt: 2000,
// //   },
// //   {
// //     name: 'Page E',
// //     uv: 1890,
// //     pv: 4800,
// //     amt: 2181,
// //   },
// //   {
// //     name: 'Page F',
// //     uv: 2390,
// //     pv: 3800,
// //     amt: 2500,
// //   },
// //   {
// //     name: 'Page G',
// //     uv: 3490,
// //     pv: 4300,
// //     amt: 2100,
// //   },
// // ];

// // // #endregion
// // const AgentDialedTalkes = () => {
// //   return (
// //     <BarChart
// //       style={{ width: '100%', maxWidth: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
// //       responsive
// //       data={data}
// //       margin={{
// //         top: 5,
// //         right: 0,
// //         left: 0,
// //         bottom: 5,
// //       }}
// //     >
// //       <CartesianGrid strokeDasharray="3 3" />
// //       <XAxis dataKey="name" />
// //       <YAxis width="auto" />
// //       <Tooltip />
// //       <Legend />
// //       <Bar dataKey="pv" fill="#3DC269" activeBar={<Rectangle fill="green" stroke="orange" />} />
// //       <Bar dataKey="uv" fill="#FF7F3A" activeBar={<Rectangle fill="orange" stroke="green" />} />
// //     </BarChart>
// //   );
// // };

// // export default AgentDialedTalkes;

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer } from 'recharts';

// // Step 1: Image ke hisab se naya data banaya gaya hai.
// // Maine image se values ka andaza lagaya hai. Aap inhe apne actual data se badal sakte hain.
// const chartData = [
//   { time: '9:00', Dialed: 280, Talked: 190 },
//   { time: '10:00', Dialed: 340, Talked: 260 },
//   { time: '11:00', Dialed: 450, Talked: 410 },
//   { time: '12:00', Dialed: 490, Talked: 400 },
//   { time: '13:00', Dialed: 500, Talked: 350 },
//   { time: '14:00', Dialed: 550, Talked: 430 },
//   { time: '15:00', Dialed: 650, Talked: 540 },
//   { time: '16:00', Dialed: 580, Talked: 390 },
//   { time: '17:00', Dialed: 680, Talked: 460 },
//   { time: '18:00', Dialed: 520, Talked: 420 },
//   { time: '19:00', Dialed: 440, Talked: 270 },
//   { time: '20:00', Dialed: 260, Talked: 180 },
//   { time: '21:00', Dialed: 190, Talked: 110 },
// ];


// const AgentDialedTalkes = () => {
//   return (
//     // Step 2: Chart ko ResponsiveContainer me wrap kiya gaya hai
//     // height={300} aap apne hisab se adjust kar sakte hain
//     <ResponsiveContainer width="100%" height={280}>
//       <BarChart
//         data={chartData}
//         margin={{
//           top: 20, // Legend ke liye thodi jagah
//           right: 20,
//           left: 0,
//           bottom: 5,
//         }}
//         barGap={6} // Bars ke beech me thoda gap
//       >
//         {/* Step 3: Grid ki sirf horizontal lines dikhane ke liye vertical={false} kiya gaya hai */}
//         <CartesianGrid strokeDasharray="3 3" vertical={false} />

//         {/* X-axis ko time ke hisab se set kiya gaya hai */}
//         <XAxis dataKey="time" />

//         {/* Y-axis (values) */}
//         <YAxis />

//         <Tooltip />
        
        
//         <Bar dataKey="Dialed" fill="#28a745" /> {/* Green color */}
//         <Bar dataKey="Talked" fill="#fd7e14" /> {/* Orange color */}
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default AgentDialedTalkes;













import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { time: "9:00",  Dialed: 280, Talked: 190 },
  { time: "10:00", Dialed: 340, Talked: 260 },
  { time: "11:00", Dialed: 450, Talked: 380 },
  { time: "12:00", Dialed: 490, Talked: 395 },
  { time: "13:00", Dialed: 490, Talked: 350 },
  { time: "14:00", Dialed: 545, Talked: 425 },
  { time: "15:00", Dialed: 650, Talked: 535 },
  { time: "16:00", Dialed: 560, Talked: 390 },
  { time: "17:00", Dialed: 670, Talked: 460 },
  { time: "18:00", Dialed: 520, Talked: 415 },
  { time: "19:00", Dialed: 435, Talked: 275 },
  { time: "20:00", Dialed: 270, Talked: 185 },
  { time: "21:00", Dialed: 190, Talked: 110 },
];

const AgentDialedTalkes = () => {
  return (
    <div style={{ padding: "10px" }}>

      <ResponsiveContainer width="100%" height={270}>
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 0,
          }}
          barCategoryGap="30%"   // ✅ GAP BETWEEN EACH GROUP (time slot)
          barGap={0}             // ✅ NO GAP between green & orange bars
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={false}
            tickLine={false}
            tickMargin={22}   // GAP between numbers and bars
          />

          <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />

          <Bar
            dataKey="Dialed"
            fill="#3DC269"
            barSize={14}
            radius={[4, 4, 0, 0]}
          />

          <Bar
            dataKey="Talked"
            fill="#FF7F3A"
            barSize={14}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgentDialedTalkes;
