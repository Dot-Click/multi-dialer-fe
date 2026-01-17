import { PieChart, Pie, Cell } from "recharts";

const SubscriptionDistribution = () => {
  // Ye original data hai jo sirf neechay text mein dikhayenge
  const realData = [
    { name: "Active", value: 847 },
    { name: "Inactive", value: 153 },
  ];

  // Ye "Visual Data" hai chart ki shape ke liye. 
  // Red (Inactive) ko 300 kar diya hai taake wo 30% area cover kare (pic ki tarah)
  const visualData = [
    { name: "Active", value: 700 }, 
    { name: "Inactive", value: 300 }, 
  ];

  const COLORS = ["#9400BD", "#F91E4A"]; 
  const percentage = 72; 

  return (
    <section className="mt-3 bg-[#FFFFFF] work-sans flex flex-col gap-4 shadow-sm pt-[23px] rounded-[32px] h-[408px]  w-[35%]">
      
      {/* Heading */}
      <div className="flex items-center px-[24px]">
        <h1 className="text-[#000000] font-[500] text-[20px] whitespace-nowrap">
          Subscription Distribution
        </h1>
      </div>

      {/* Donut Chart */}
      <div className="relative flex justify-center items-center py-2">
        <PieChart width={200} height={200}>
          <Pie
            data={visualData} // Yahan visualData use kiya hai shape ke liye
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}   // Dono colors ke beech ka gap thoda aur clear kiya
            startAngle={0}     // Right side se shuru hoga taake Red bottom mein aaye
            endAngle={360}     
            dataKey="value"
            stroke="none"
          >
            {visualData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>

        {/* Center Circle with shadow effect */}
        <div 
          className="absolute rounded-full  flex items-center justify-center"
          
        >
          <span className="text-[30px] font-[600] text-black ">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Legend - Yahan realData (847, 153) hi display hoga */}
      <div className="flex flex-col gap-4 px-[24px] pb-[30px] mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#9400BD]" />
          <p className="text-[12px] font-[400] text-[#0E1011] opacity-80">
            Active Subscriptions: {realData[0].value}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F91E4A]" />
          <p className="text-[12px] font-[400] text-[#0E1011] opacity-80">
            Inactive Subscriptions: {realData[1].value}
          </p>
        </div>
      </div>

    </section>
  );
};

export default SubscriptionDistribution;