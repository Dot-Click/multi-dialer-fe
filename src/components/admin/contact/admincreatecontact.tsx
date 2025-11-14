// Icon imports from react-icons
import { FiPlus, FiFolder, FiMoreHorizontal } from 'react-icons/fi';
import React from 'react';

// ✅ Props interface for InputField
interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
}

// A reusable Input Field component for cleaner code
const InputField: React.FC<InputFieldProps> = ({ label, placeholder, type = 'text' }) => (
  <div className="bg-gray-100 px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 text-sm">
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full outline-none bg-gray-100"
    />
  </div>
);

// ✅ Props interface for SelectField
interface SelectFieldProps {
  label: string;
  options: string[];
}

// A reusable Select Field component for the dropdown
const SelectField: React.FC<SelectFieldProps> = ({ label, options }) => (
  <div className="bg-gray-100 px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 text-sm">
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <select className="w-full outline-none bg-gray-100">
      {options.map((option: string) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Main Component
const AdminCreateContactComponent: React.FC = () => {
  // Dummy data for lists and groups
  const folders = ['Folder', 'Folder', 'Folder'];
  const lists = [
    { name: 'List', initials: 'KM' },
    { name: 'List', initials: 'JL' },
    { name: 'List', initials: null },
    { name: 'List', initials: null },
  ];
  const groups = ['Group', 'Group', 'Group', 'Group', 'Group', 'Group', 'Group'];

  return (
    <div className="bg-white max-w-5xl mx-auto rounded-xl min-h-screen p-3 sm:p-4 md:p-6">
      <div>
        {/* Top form section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <InputField label="Full Name" placeholder="Enter lead's name" />
          <InputField label="Address" placeholder="Enter lead's address" />
          <InputField label="Email" placeholder="Enter lead's email" type="email" />
          <InputField label="City" placeholder="Enter lead's city" />
          <InputField label="Phone number" placeholder="Enter phone number" type="tel" />
          <InputField label="State" placeholder="Enter lead's state" />
          <SelectField label="Phone type" options={['Mobile', 'Work', 'Home']} />
          <InputField label="Zip" placeholder="Enter lead's Zip" />
        </div>

        {/* Bottom Lists & Groups section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* LISTS & FOLDERS Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-2 h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-900">LISTS & FOLDERS</h2>
              <button className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200">
                <FiPlus className="text-gray-600" />
              </button>
            </div>
            <div className="overflow-y-auto pr-2 flex-grow">
              {/* Folders */}
              {folders.map((folder, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                    index === 2 ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FiFolder className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">{folder}</span>
                  </div>
                  <FiMoreHorizontal className="text-gray-400" />
                </div>
              ))}
              {/* Lists */}
              {lists.map((list, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <span className="text-sm font-medium text-gray-800">{list.name}</span>
                  {list.initials && (
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold text-gray-600">
                      {list.initials}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GROUPS Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-2 h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-900">GROUPS</h2>
              <button className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200">
                <FiPlus className="text-gray-600" />
              </button>
            </div>
            <div className="overflow-y-auto pr-2 flex-grow">
              {groups.map((group, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <span className="text-sm font-medium text-gray-800">{group}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateContactComponent;
