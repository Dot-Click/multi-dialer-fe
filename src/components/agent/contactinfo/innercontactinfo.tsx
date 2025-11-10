interface FieldProps {
  label: string;
  value?: string;
}

const InnerContactInfo: React.FC = () => {
  return (
    <div className="w-full">

      {/* Top Status Row */}
      <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
        <p>Calls: <span className="font-semibold">2</span></p>
        <p>Emails: <span className="font-semibold">3</span></p>
        <p>SMS: <span className="font-semibold">0</span></p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">

        {/* Left Section */}
        <div className="space-y-4">
          <Field label="Salutation" />
          <Field label="First Name" value="John" />
          <Field label="Last Name" value="Doe" />
          <Field label="Company" value="Acme" />
          <Field label="Email" value="johndoe@example.com" />
          <Field label="Address Line 1" value="2464 Royal Ln. Mesa, NJ 45463" />
          <Field label="Address Line 2" />
          <Field label="City" value="Trenton" />
          <Field label="State" value="New Jersey" />
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <Field label="Postal Code" value="45463" />
          <Field label="Country" value="US" />
          <Field label="Web" />
          <Field label="Gender" />
          <Field label="Extension" />
          <Field label="Land ID" value="935647413" />
          <Field label="Customer ID" value="0" />
          <Field label="Product ID" value="0" />
        </div>

      </div>

      {/* Notes */}
      <textarea
        placeholder="Type your note here"
        className="w-full mt-6 px-3 py-2 border resize-none bg-gray-200 placeholder:text-sm text-sm rounded-lg overflow-auto custom-scrollbar h-[160px] focus:outline-none focus:ring focus:ring-gray-300"
      ></textarea>
    </div>
  );
};

// ✅ Field component with props type
const Field: React.FC<FieldProps> = ({ label, value = "" }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    <label className="text-gray-950 text-sm font-medium sm:w-32">{label}</label>
    <input
      defaultValue={value}
      className="flex-1 border-b border-gray-300 focus:outline-none py-1"
    />
  </div>
);

export default InnerContactInfo;
