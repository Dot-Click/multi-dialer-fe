import { useAppSelector } from "@/store/hooks";

interface FieldProps {
  label: string;
  value?: string;
}

const InnerContactInfo: React.FC = () => {
  const { currentContact } = useAppSelector((state) => state.contacts);

  if (!currentContact) {
    return <div className="p-4 text-gray-500">Loading contact info...</div>;
  }

  const primaryEmail = currentContact.emails?.find((e: any) => e.isPrimary)?.email || currentContact.emails?.[0]?.email || "";
  const address = `${currentContact.city || ""}, ${currentContact.state || ""} ${currentContact.zip || ""}`.trim();

  return (
    <div className="w-full">
      {/* Top Status Row */}
      <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
        <p>Calls: <span className="font-semibold">0</span></p>
        <p>Emails: <span className="font-semibold">{currentContact.emails?.length || 0}</span></p>
        <p>SMS: <span className="font-semibold">0</span></p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {/* Left Section */}
        <div className="space-y-4">
          <Field label="Salutation" />
          <Field label="First Name" value={currentContact.fullName?.split(' ')[0] || ""} />
          <Field label="Last Name" value={currentContact.fullName?.split(' ').slice(1).join(' ') || ""} />
          <Field label="Company" value={currentContact.source || ""} />
          <Field label="Email" value={primaryEmail} />
          <Field label="Address Line 1" value={address} />
          <Field label="Address Line 2" />
          <Field label="City" value={currentContact.city || ""} />
          <Field label="State" value={currentContact.state || ""} />
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <Field label="Postal Code" value={currentContact.zip || ""} />
          <Field label="Country" value="US" />
          <Field label="Web" />
          <Field label="Gender" />
          <Field label="Extension" />
          <Field label="Land ID" value={currentContact.dataDialerId || ""} />
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
      key={value} // Force re-render when value changes
      className="flex-1 border-b border-gray-300 focus:outline-none py-1"
    />
  </div>
);

export default InnerContactInfo;
