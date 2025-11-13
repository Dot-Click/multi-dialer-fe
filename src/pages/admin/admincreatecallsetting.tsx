import { useState } from "react";
import type { FC, ReactNode } from "react";
import { IoIosArrowDown } from "react-icons/io";

// Types
interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
}

interface SelectFieldProps {
  label: string;
  children: ReactNode;
}

interface CheckboxFieldProps {
  label: string;
}

interface RadioGroupProps {
  title: string;
  name: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

// Reusable Input Field Component
const InputField: FC<InputFieldProps> = ({ label, type = "text", placeholder, value }) => (
  <div className="bg-gray-100 rounded-lg px-4 py-2">
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={value}
      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
    />
  </div>
);

// Reusable Select Field Component
const SelectField: FC<SelectFieldProps> = ({ label, children }) => (
  <div className="relative bg-gray-100 rounded-lg px-4 py-2">
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <select className="w-full bg-transparent text-sm text-gray-800 appearance-none focus:outline-none cursor-pointer">
      {children}
    </select>
    <IoIosArrowDown className="absolute right-4 top-8 text-gray-500 pointer-events-none" />
  </div>
);

// Reusable Checkbox Component
const CheckboxField: FC<CheckboxFieldProps> = ({ label }) => (
  <div className="flex items-center gap-3">
    <input type="checkbox" className="h-4 w-4 rounded accent-black border-gray-300 focus:ring-blue-400" />
    <label className="text-sm text-gray-700">{label}</label>
  </div>
);

// Reusable Radio Group Component
const RadioGroup: FC<RadioGroupProps> = ({ title, name, options, selected, onChange }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <div key={option} className="flex items-center gap-3">
          <input
            type="radio"
            id={`${name}-${option}`}
            name={name}
            value={option}
            checked={selected === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 accent-black border-gray-300 focus:ring-blue-400"
          />
          <label htmlFor={`${name}-${option}`} className="text-sm text-gray-700">
            {option}
          </label>
        </div>
      ))}
    </div>
  </div>
);

const AdminCreateCallSetting: FC = () => {
  const [dncCalls, setDncCalls] = useState("No");
  const [sendEmail, setSendEmail] = useState("No");
  const [sendText, setSendText] = useState("No");

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 rounded-2xl">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h1 className="text-2xl font-semibold text-gray-950">Create Call Settings</h1>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button className="px-5 py-2 text-sm font-semibold w-28 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button className="px-5 py-2 text-sm font-semibold w-28 text-gray-950 bg-[#FFCA06] rounded-md hover:bg-[#f1c00b] transition-colors">
              Save
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-8">
          {/* Section 1 */}
          <div className="lg:w-[50%]">
            <InputField label="Name" placeholder="Enter Name" />
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Voice recordings Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="On-hold Recording 1"><option>Select</option></SelectField>
              <SelectField label="On-hold Recording 2"><option>Select</option></SelectField>
              <SelectField label="On-hold Recording 3"><option>Select</option></SelectField>
              <SelectField label="Answering Machine Recordings"><option>Select</option></SelectField>
            </div>
          </div>

          {/* Section 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">General Communication</h2>
              <div className="space-y-4">
                <CheckboxField label="Enable Auto Pause" />
                <CheckboxField label="Enable Recording" />
                <CheckboxField label="Send scheduled appointment mail in outlook format" />
              </div>
            </div>
            <div>
              <RadioGroup
                title="Make Calls to DNC Numbers"
                name="dnc"
                options={["No", "Yes"]}
                selected={dncCalls}
                onChange={setDncCalls}
              />
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
              <div className="sm:col-span-3">
                <InputField label="Caller ID" placeholder="Enter Caller ID" value="CallScout ID" />
              </div>
              <div className="sm:col-span-2">
                <SelectField label="Country Code"><option>Select</option></SelectField>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <SelectField label="No of Lines"><option>Select</option></SelectField>
              <SelectField label="Phone Ring Time"><option>Select</option></SelectField>
              <SelectField label="Call Script"><option>Select</option></SelectField>
            </div>
          </div>

          {/* Section 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-gray-200">
            <RadioGroup
              title="Send Email"
              name="email"
              options={["No", "Yes"]}
              selected={sendEmail}
              onChange={setSendEmail}
            />
            <RadioGroup
              title="Send Text"
              name="text"
              options={["No", "Yes"]}
              selected={sendText}
              onChange={setSendText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateCallSetting;
