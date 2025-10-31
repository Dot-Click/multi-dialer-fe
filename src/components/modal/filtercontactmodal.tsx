import React from "react";
import { IoClose } from "react-icons/io5";

const FilterModal = ({ onClose }) => {
  const dateOptions = ["Today", "Last 7 days", "This Month", "Last Month", "This Year"];
  const listOptions = ["Leads", "Prospects", "Customers", "Cold Leads"];
  const tagOptions = ["Hot Lead", "Follow Up", "Interested", "Not Interested"];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center lg:pt-20 z-50 px-3">
      {/* Modal Box */}
      <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose className="text-2xl" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-6">Filter</h2>

        {/* Body */}
        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
          {/* Date */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Date</label>
            <select className="border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400">
              <option value="">Select creation date</option>
              {dateOptions.map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          {/* List */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">List</label>
            <select className="border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400">
              <option value="">Select 1 or more list</option>
              {listOptions.map((list, index) => (
                <option key={index} value={list}>
                  {list}
                </option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Tag</label>
            <select className="border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400">
              <option value="">Select 1 or more tag</option>
              {tagOptions.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

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

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button className="bg-[#FFCA06] px-4 py-2 rounded-md text-sm font-medium text-black hover:bg-[#f5bd00]">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
