
const failedPayments = [
  {
    name: "SalesPro Agency",
    reason: "Payment failed - Credit card declined",
    amount: "$4,499",
  },
  {
    name: "LeadGen Solutions",
    reason: "Payment failed - Insufficient funds",
    amount: "$11,999",
  },
  {
    name: "GrowthX Labs",
    reason: "Payment failed - Card expired",
    amount: "$2,350",
  },
  {
    name: "MarketBoost",
    reason: "Payment failed - Bank declined transaction",
    amount: "$6,120",
  },
];

const FailedPayment = () => {
  return (
    <div className="w-full md:w-[50%] bg-white work-sans rounded-[22px] pt-5 pb-6 shadow-lg">
      
      {/* Header */}
      <div className="flex justify-between px-6  items-center mb-3">
        <h3 className="text-[22px] font-[600] text-[#2C2C2C]">
          Failed Payments
        </h3>
        <button className="text-[16px] font-[400] text-[#2463EB]">
          View All
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 max-h-[200px] px-6  overflow-auto custom-scrollbar">
        {failedPayments.map((item, index) => (
          <div
            key={index}
            className="bg-[#FEF2F2] rounded-[12px] px-4 py-3.5 flex justify-between items-center"
          >
            <div className="pr-2">
              <p className="text-[16px] font-[600] text-[#1D2C45]">
                {item.name}
              </p>
              <p className="text-[14px] font-[400] text-[#1D2C45B5]">
                {item.reason}
              </p>
            </div>

            <span className="text-[16px] font-[600] text-[#C90007] whitespace-nowrap">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FailedPayment;
