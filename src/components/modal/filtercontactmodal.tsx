import React from "react";
import { IoClose } from "react-icons/io5";

interface FilterModalProps {
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose }) => {
  const dateOptions = ["Today", "Last 7 days", "This Month", "Last Month", "This Year"];
  const listOptions = ["Leads", "Prospects", "Customers", "Cold Leads"];
  const tagOptions = ["Hot Lead", "Follow Up", "Interested", "Not Interested"];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center lg:pt-20 z-50 px-3">

      <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose className="text-2xl" />
        </button>

        <h2 className="text-lg font-semibold mb-6">Filter</h2>

        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">

          {/* Reusable select wrapper */}
          {[
            { label: "Date", options: dateOptions, placeholder: "Select creation date" },
            { label: "List", options: listOptions, placeholder: "Select 1 or more list" },
            { label: "Tag", options: tagOptions, placeholder: "Select 1 or more tag" }
          ].map((item, i) => (
            <div className="flex flex-col" key={i}>
              <label className="text-sm text-black mb-1">{item.label}</label>

              {/* wrapper for arrow positioning */}
              <div className="relative">
                <select
                  className="border w-full rounded-md px-3 py-2 text-sm outline-none text-gray-600 focus:border-gray-400 appearance-none pr-8"
                >
                  <option value="">{item.placeholder}</option>
                  {item.options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {/* Custom red arrow */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="gray"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>
          ))}

          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter lead’s contact name"
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Phone number */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Phone number</label>
            <input
              type="text"
              placeholder="Enter lead’s contact phone number"
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-full bg-[#EBEDF0] px-4 py-2 rounded-md text-sm text-gray-900 font-[500] hover:bg-gray-100"
          >
            Cancel
          </button>
          <button className="bg-[#FFCA06] w-full px-4 py-2 rounded-md text-sm font-medium text-black hover:bg-[#f5bd00]">
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterModal;
