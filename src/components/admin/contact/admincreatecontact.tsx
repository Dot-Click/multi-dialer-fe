// Icon imports from react-icons
import { FiPlus, FiFolder, FiMoreHorizontal, FiChevronDown } from 'react-icons/fi';
import React, { useState } from 'react';
import { IoAdd } from 'react-icons/io5';

/* ================= BASIC INFORMATION INPUT ================= */

interface BasicInformationInputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
}

const BasicInformationInputField: React.FC<BasicInformationInputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
}) => (
  <div className="bg-gray-100 px-3 py-2 rounded-[12px] focus-within:ring-2 focus-within:ring-blue-500 text-sm">
    <label className="block text-[12px] font-[500] text-[#495057] mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full outline-none text-[#848C94] text-[16px] font-[400] bg-[#F3F4F7]"
    />
  </div>
);

/* ================= EMAIL INPUT ================= */

interface EmailInputFieldProps {
  placeholder: string;
}

const EmailInputField: React.FC<EmailInputFieldProps> = ({ placeholder }) => (
  <div className="bg-gray-100 px-3 py-4 rounded-[12px] focus-within:ring-2 focus-within:ring-blue-500">
    <input
      type="email"
      placeholder={placeholder}
      className="w-full outline-none text-[#848C94] text-[16px] font-[400] bg-[#F3F4F7]"
    />
  </div>
);

/* ================= PHONE INPUT ================= */

const PhoneInputField = () => {
  const [selectedType, setSelectedType] = useState('Mobile');
  const [isOpen, setIsOpen] = useState(false);
  const options = ['Mobile', 'Work', 'Home'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-3">
      <div className="bg-gray-100 px-3 py-4 rounded-[12px] focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="tel"
          placeholder="Phone number"
          className="w-full outline-none text-[#848C94] text-[16px] font-[400] bg-[#F3F4F7]"
        />
      </div>

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-100 px-3 py-4 rounded-[12px] cursor-pointer flex justify-between items-center text-[#0E1011] text-[16px] font-[400]"
        >
          <span>{selectedType}</span>
          <FiChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white shadow-lg rounded-[12px] z-[100] border border-gray-100 overflow-hidden">
            {options.map((opt) => (
              <div
                key={opt}
                className="px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-[14px] text-[#030213]"
                onClick={() => {
                  setSelectedType(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= SOURCE SELECT INPUT ================= */

const SourceSelectField = () => {
  const [selected, setSelected] = useState('Manual entry');
  const [isOpen, setIsOpen] = useState(false);
  const options = ['Manual entry'];

  return (
    <div className="relative w-full">
      <label className="block text-[#2B3034] font-[400] text-[14px] mb-2">
        How did you acquire this contact?
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 px-3 py-3 rounded-[12px] cursor-pointer flex justify-between items-center text-[#848C94] text-[16px] font-[400] focus-within:ring-2 focus-within:ring-blue-500"
      >
        <span>{selected}</span>
        <FiChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white shadow-lg rounded-[12px] z-[100] border border-gray-100 overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt}
              className="px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-[14px] text-[#030213]"
              onClick={() => {
                setSelected(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


/* ================= MAIN COMPONENT ================= */

const AdminCreateContactComponent: React.FC = () => {
  const folders = ['Folder', 'Folder', 'Folder'];
  const lists = [
    { name: 'List', initials: 'KM' },
    { name: 'List', initials: 'JL' },
    { name: 'List', initials: null },
    { name: 'List', initials: null },
  ];
  const groups = ['Group', 'Group', 'Group', 'Group', 'Group', 'Group', 'Group'];

  /* EMAIL STATE */
  const [emails, setEmails] = useState<number[]>([0, 1]);
  const handleAddEmail = () => setEmails((p) => [...p, p.length]);

  /* PHONE STATE */
  const [phones, setPhones] = useState<number[]>([0, 1]);
  const handleAddPhone = () => setPhones((p) => [...p, p.length]);

  return (
    <div className="max-w-5xl work-sans mx-auto min-h-screen">
      <div className="flex flex-col gap-5">

        {/* BASIC INFORMATION */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-3">
          <h1 className="text-[#495057] font-[500] uppercase text-[14px]">
            Basic Information
          </h1>

          <div className="grid grid-cols-1 gap-y-5">
            <BasicInformationInputField label="Full Name" placeholder="Enter lead's name" />
            <BasicInformationInputField label="Email" placeholder="Enter lead's email" type="email" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BasicInformationInputField label="City" placeholder="Enter lead's city" />
              <BasicInformationInputField label="State" placeholder="Enter lead's state" />
            </div>

            <BasicInformationInputField label="Zip" placeholder="Enter lead's Zip" />
          </div>
        </div>

        {/* EMAIL ADDRESSES */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[#495057] font-[500] uppercase text-[14px]">
              Email Addresses
            </h1>
            <button
              onClick={handleAddEmail}
              className="flex gap-1 bg-[#FFCA06] px-[15px] py-[6px] rounded-[12px] items-center text-black text-[10px] sm:text-[12px] md:text-[16px] font-[500]"
            >
              <IoAdd /> Add Email
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {emails.map((_, i) => (
              <EmailInputField
                key={i}
                placeholder={i === 0 ? 'Primary email address' : 'Additional email address'}
              />
            ))}
          </div>
        </div>

        {/* PHONE NUMBERS */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[#495057] font-[500] uppercase text-[14px]">
              Phone Numbers
            </h1>
            <button
              onClick={handleAddPhone}
              className="flex gap-1 bg-[#FFCA06] px-[15px] py-[6px] rounded-[12px] items-center text-black text-[10px] sm:text-[12px] md:text-[16px] font-[500]"
            >
              <IoAdd /> Add Phone
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {phones.map((_, i) => (
              <PhoneInputField key={i} />
            ))}
          </div>
        </div>

        {/* SOURCE */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-2">
          <h1 className="text-[#495057] font-[500] uppercase text-[14px] mb-2">Source</h1>
          <SourceSelectField />
        </div>

        {/* LISTS & GROUPS */}
        {/* LISTS & GROUPS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 bg-white p-3 sm:p-4 md:p-6 rounded-[24px]">
          {/* LISTS */}
          <div className="bg-white border border-[#E9E9EB] rounded-[16px] p-4 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4 pl-2 pr-1">
              <h2 className="text-[14px] font-[500] uppercase text-[#495057] tracking-wide">LISTS & FOLDERS</h2>
              <button className="bg-[#F3F4F7] p-1.5 rounded-[6px] hover:bg-gray-200 transition-colors">
                <FiPlus className="text-[#5F6368] text-[14px]" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 flex-grow space-y-1 custom-scrollbar">
              {folders.map((folder, index) => (
                <div
                  key={`folder-${index}`}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group ${index === 2 ? 'bg-[#F3F4F7]' : 'hover:bg-[#F9FAFB]'}`}
                >
                  <div className="flex items-center gap-3">
                    <FiFolder className={`text-[18px] ${index === 2 ? 'text-[#5F6368]' : 'text-[#9AA0A6]'}`} />
                    <span className={`text-[14px] font-[500] ${index === 2 ? 'text-[#495057]' : 'text-[#5F6368]'}`}>
                      {folder}
                    </span>
                  </div>
                  <FiMoreHorizontal className="text-[#9AA0A6] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}

              {lists.map((list, index) => (
                <div
                  key={`list-${index}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9FAFB] cursor-pointer group"
                >
                  <span className="text-[14px] font-[400] text-[#5F6368] pl-8">
                    {list.name}
                  </span>
                  {list.initials && (
                    <div className="w-[24px] h-[24px] rounded-full border border-[#E9E9EB] flex items-center justify-center text-[10px] font-[500] text-[#5F6368] bg-white">
                      {list.initials}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GROUPS */}
          <div className="bg-white border border-[#E9E9EB] rounded-[16px] p-4 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4 pl-2 pr-1">
              <h2 className="text-[14px] font-[500] uppercase text-[#495057] tracking-wide">GROUPS</h2>
              <button className="bg-[#F3F4F7] p-1.5 rounded-[6px] hover:bg-gray-200 transition-colors">
                <FiPlus className="text-[#5F6368] text-[14px]" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 flex-grow space-y-1 custom-scrollbar">
              {groups.map((group, index) => (
                <div
                  key={index}
                  className="p-2 rounded-lg hover:bg-[#F9FAFB] cursor-pointer text-[14px] font-[500] text-[#495057]"
                >
                  {group}
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
