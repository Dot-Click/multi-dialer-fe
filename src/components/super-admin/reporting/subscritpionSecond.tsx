import { PieChart, Pie, Cell } from "recharts";

const SubscriptionDistribution = () => {
  // 1. Real Data (Text display ke liye)
  const realData = [
    { name: "Successful", value: 1224, percent: "98.2%" },
    { name: "Failed", value: 23, percent: "1.8%" },
  ];

  // 2. Visual Data (Photo jaisa look dene ke liye)
  const visualData = [
    { name: "Successful", value: 82 },
    { name: "Failed", value: 18 },
  ];

  const COLORS = ["#72D394", "#FF1E4A"];

  return (
    <section className="bg-[#FFFFFF] dark:bg-slate-800 work-sans flex flex-col gap-4 shadow-sm h-[375px] p-[24px] rounded-[32px] w-[350px]">
      {/* Heading */}
      <div className="flex items-center">
        <h1 className="text-[#000000] dark:text-white font-[500] text-[20px] whitespace-nowrap">
          Subscription Distribution
        </h1>
      </div>

      {/* Pie Chart Container */}
      <div className="flex justify-center items-center py-2">
        {/* Height/Width 180 hi rakha hai */}
        <PieChart width={180} height={180}>
          <Pie
            data={visualData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            /* Radius ko 85 kar diya taake 180px mein fit aaye aur cut na ho */
            outerRadius={85}
            startAngle={0}
            endAngle={360}
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={3}
            // Isse animation smooth hogi aur edges cut nahi honge
            paddingAngle={0}
          >
            {visualData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </div>

      {/* Legend Area */}
      <div className="flex flex-col gap-4 mt-auto pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#72D394]" />
          <p className="text-[14px] font-[400] text-[#0E1011] dark:text-gray-300">
            Successful: {realData[0].value} ({realData[0].percent})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E4A]" />
          <p className="text-[14px] font-[400] text-[#0E1011] dark:text-gray-300">
            Failed: {realData[1].value} ({realData[1].percent})
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionDistribution;
