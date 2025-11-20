const Misc = () => {
  // left column fields
  const leftFields = [
    "Birthday",
    "Co-owner Birthday",
    "Home Close Date",
    "Listing Status",
    "Status Change Date",
    "Tax Name",
    "List Price",
    "Days On Market",
    "List Date",
    "MLS ID",
    "Property Type",
    "Bedrooms",
    "Bathrooms",
    "Square Footage",
    "Year Built",
    "Agent Phone Number",
    "Agent Company",
    "Agent Name",
    "Agent Remarks",
  ];

  // right column fields
  const rightFields = [
    "Notes",
    "County",
    "Delinquent Amount",
    "Mortgage Holder",
    "Auction Min Bid",
    "Pre-Foreclosure Type",
    "Attorney Name",
    "Date Recorded",
    "Acres",
    "Auction Deposit",
    "Price",
    "Auction Date",
    "Auction Location",
    "Loan Amount",
    "Attorney Phone",
    "Mortgage Date",
    "Phone 3",
    "Phone 3",
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-3">
        {leftFields.map((label) => (
          <div key={label} className="flex items-center w-full gap-4">
            <label className="text-[14px] font-[500] text-[#0E1011] w-40">
              {label}
            </label>

            <div className="flex-1 border-b border-gray-300">
              <input
                type="text"
                className="w-full text-sm text-gray-900 outline-none py-1 focus:border-b focus:border-gray-600"
              />
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-3">
        {rightFields.map((label) => (
          <div key={label} className="flex items-center w-full gap-4">
            <label className="text-[14px] font-[500] text-[#0E1011] w-40">
              {label}
            </label>

            <div className="flex-1 border-b border-gray-300">
              <input
                type="text"
                className="w-full text-sm text-gray-900 outline-none py-1 focus:border-b focus:border-gray-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Misc;
