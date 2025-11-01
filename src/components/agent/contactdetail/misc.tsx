import React from "react";

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
      {/* Left Column */}
      <div className="flex flex-col gap-2  ">
        {leftFields.map((label) => (
          <div key={label} className="flex items-end w-full gap-3">
            <label className="text-sm font-semibold text-gray-700">
              {label}
            </label>
            <input
              type="text"
              placeholder=""
              className="border-b flex-1 border-gray-300 text-sm text-gray-900 outline-none py-1 placeholder:text-gray-400 focus:border-gray-600 transition-all"
            />
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="flex flex-col   gap-2">
        {rightFields.map((label) => (
          <div key={label} className="flex items-end w-full gap-3">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="text"
              placeholder=""
              className="border-b flex-1 border-gray-300 text-sm text-gray-900 outline-none py-1 placeholder:text-gray-400 focus:border-gray-600 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Misc;
