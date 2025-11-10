import React from "react";

interface FieldProps {
  label: string;
  value?: string;
}

const NotesContactInfo: React.FC = () => {
  return (
    <div className="w-full">
      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">

        {/* Left Section */}
        <div className="space-y-4">
          <Field label="Birthday" />
          <Field label="Co-owner Birthday" />
          <Field label="Home Close Date" />
          <Field label="Listing Status" value="Pre-Foreclosure" />
          <Field label="Status Change Date" />
          <Field label="Tax Name" />
          <Field label="Last Price" />
          <Field label="Days On Market" />
          <Field label="List Date" />
          <Field label="MLS ID" />
          <Field label="Property Type" value="H" />
          <Field label="Bedrooms" value="0" />
          <Field label="Bathrooms" value="0" />
          <Field label="Square Footage" value="1400" />
          <Field label="Year Built" value="2017" />
          <Field label="Agent Phone Number" />
          <Field label="Agent Company" />
          <Field label="Agent Name" />
          <Field label="Agent Remarks" />
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <Field label="Notes" />
          <Field label="County" />
          <Field label="Delinquent Amount" />
          <Field label="Mortgage Holder" />
          <Field label="Auction Min Bid" />
          <Field label="Pre-Foreclosure Type" />
          <Field label="Attorney Name" />
          <Field label="Date Recorded" />
          <Field label="Acres" />
          <Field label="Auction Deposit" />
          <Field label="Price" />
          <Field label="Price" />
          <Field label="Auction Date" />
          <Field label="Auction Location" />
          <Field label="Loan Amount" />
          <Field label="Attorney Phone" />
          <Field label="Mortgage Date" />
          <Field label="Phone 3" />
          <Field label="Phone 3" />
        </div>

      </div>
    </div>
  );
};

// ✅ Field Component with Props Type
const Field: React.FC<FieldProps> = ({ label, value = "" }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    <label className="text-gray-950 text-sm font-medium sm:w-32">{label}</label>
    <input
      defaultValue={value}
      className="flex-1 border-b border-gray-300 focus:outline-none py-1"
    />
  </div>
);

export default NotesContactInfo;
 