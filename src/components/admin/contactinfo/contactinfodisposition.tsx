import { useState } from 'react';

// Step 1: Buttons aur Checkboxes ke liye dynamic data banayein
const dispositionOptions = [
  "Wrong Number", "Not Interested", "Answering Machine", 
  "Got Sale", "DNC", "Call Back"
];

const groupOptions = ["Hot", "Warm", "Nurture", "Working"];

const checkboxOptions = ["Permission", "Want", "Why", "Status Quo", "Timeline", "Agent"];

const ContactInfoDisposition = () => {
  // Step 2: Selected buttons ko track karne ke liye state banayein
  const [selectedDisposition, setSelectedDisposition] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("Working"); // Default selected value

  return (
    // Main Container
    <div className="bg-white rounded-2xl shadow-md px-3 py-5 w-full">
      <div className="space-y-6">
        
        {/* Dispositions Section */}
        <div className="flex flex-col gap-2 sm:gap-4">
          <h3 className="text-sm font-semibold text-gray-900 min-w-[90px]">Dispositions:</h3>
          <div className="flex flex-wrap gap-2">
            {dispositionOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedDisposition(option)}
                className={`
                  px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                  ${selectedDisposition === option 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Group Section */}
        <div className="flex flex-col gap-2 sm:gap-4">
          <h3 className="text-sm font-semibold text-gray-900 min-w-[90px]">Group:</h3>
          <div className="flex flex-wrap gap-2">
            {groupOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedGroup(option)}
                className={`
                  px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                  ${selectedGroup === option 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Divider (Optional, for better separation) */}
        <div className="border-t border-gray-100 my-2"></div>

        {/* Checkboxes Section */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-4">
          {checkboxOptions.map((option) => (
            <div key={option} className="flex flex-col items-center justify-center gap-2">
              <input
                type="checkbox"
                id={`checkbox-${option}`}
                className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
              />
              <label 
                htmlFor={`checkbox-${option}`} 
                className="text-sm text-gray-600"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoDisposition;