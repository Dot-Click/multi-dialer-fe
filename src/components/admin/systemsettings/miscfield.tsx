
import { useState } from "react";
import type { FC } from "react";
import { FaPlus } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import AdminMiscModal from "@/components/modal/adminmiscmodal";

// Define proper TypeScript types
interface FieldRowProps {
  label: string;
  type: "text" | "select";
  options?: string[];
}

const leftColumnFields: FieldRowProps[] = [
  { label: "Lead Source", type: "text" },
  { label: "Status", type: "select", options: ["None"] },
  { label: "Priority", type: "select", options: ["None"] },
  { label: "Lead Stage", type: "select", options: ["None"] },
  { label: "Deal Value (USD)", type: "text" },
  { label: "Probability (%)", type: "text" },
  { label: "Competitors Mentioned", type: "text" },
  { label: "Account Manager", type: "text" },
  { label: "Sales Representative", type: "text" },
  { label: "Referred By", type: "text" },
];

const rightColumnFields: FieldRowProps[] = [
  { label: "Initial Contact Date", type: "text" },
  { label: "Next Follow-Up Date", type: "text" },
  { label: "Follow-Up Method", type: "select", options: ["None"] },
  { label: "Demo Scheduled", type: "select", options: ["None"] },
  { label: "Last Activity", type: "text" },
  { label: "Expected Close Date", type: "text" },
  { label: "Preferred Contact Time", type: "text" },
  { label: "Timezone", type: "text" },
  { label: "Language Preference", type: "text" },
  { label: "Next Step", type: "text" },
];

// FieldRow Component
const FieldRow: FC<FieldRowProps> = ({ label, type, options = [] }) => {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select className="w-full bg-transparent appearance-none py-2 focus:outline-none">
            {options.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            className="w-full bg-transparent py-2 focus:outline-none"
          />
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <label className="text-base text-gray-950 font-medium mb-1 md:mb-0 md:w-2/5 md:pr-4">
        {label}
      </label>

      <div className="flex-grow relative border-b border-gray-200">
        {renderInput()}
        {type === "select" && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <IoIosArrowDown />
          </div>
        )}
      </div>

      <button className="mt-2 md:mt-0 md:ml-4 text-gray-400 hover:text-gray-700 self-start md:self-auto">
        <BsThreeDotsVertical size={20} />
      </button>
    </div>
  );
};

// Main MiscField Component
const MiscField: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white px-4 py-5 rounded-lg w-full max-w-7xl mx-auto relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Misc Fields</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 gap-y-6">
        <div className="flex flex-col gap-y-3">
          {leftColumnFields.map((field) => (
            <FieldRow key={field.label} {...field} />
          ))}
        </div>
        <div className="flex flex-col gap-y-3">
          {rightColumnFields.map((field) => (
            <FieldRow key={field.label} {...field} />
          ))}
        </div>
      </div>

      {/* Add Field Button */}
      <div className="mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-950 rounded-md hover:bg-gray-200"
        >
          <FaPlus size={14} />
          <span className="text-base font-medium">Add Field</span>
        </button>
      </div>

      {isModalOpen && <AdminMiscModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default MiscField;
