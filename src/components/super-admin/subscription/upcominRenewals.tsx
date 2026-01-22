

const upcomingRenewals = [
  {
    name: "TechCorp Solutions",
    reason: "Subscription renewal in 14 days",
    amount: "$14,999",
  },
  {
    name: "StartUp Dialer",
    reason: "Subscription renewal in 12 days",
    amount: "$999",
  },
  {
    name: "CallCenter Pro",
    reason: "Subscription renewal in 7 days",
    amount: "$5,999",
  },
  {
    name: "MarketBoost",
    reason: "Payment failed - Bank declined transaction",
    amount: "$6,120",
  },
];     

const UpcomingRenewals = () => {
  return (
    <div className="w-full md:w-[50%] bg-white work-sans rounded-[22px] py-6 shadow-lg">
      
      {/* Header */}
      <div className="flex justify-between px-6  items-center mb-3">
        <h3 className="text-[22px] font-[600] text-[#2C2C2C]">
          Upcoming Renewals
        </h3>
        <button className="text-[16px] font-[400] text-[#2463EB]">
          View All
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 max-h-[200px] px-6  overflow-auto custom-scrollbar">
        {upcomingRenewals.map((item, index) => (
          <div
            key={index}
            className="bg-[#FEFCE8] rounded-[12px] px-4 py-3.5 flex justify-between items-center"
          >
            <div className="pr-2">
              <p className="text-[16px] font-[600] text-[#1D2C45]">
                {item.name}
              </p>
              <p className="text-[14px] font-[400] text-[#1D2C45B5]">
                {item.reason}
              </p>
            </div>

            <span className="text-[16px] font-[600] text-[#7D6405] whitespace-nowrap">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingRenewals;
