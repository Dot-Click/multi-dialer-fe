import { useState } from "react";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";

const SMSTemplate = () => {
  const [SMS, setSMS] = useState([
    { id: 1, name: "SMS Template #1", createdBy: "John Lee", createdOn: "09/09/2025", modifiedOn: "09/09/2025", status: true },
    { id: 2, name: "SMS Template #2", createdBy: "Brooklyn Simmons", createdOn: "08/09/2025", modifiedOn: "08/09/2025", status: true },
    { id: 3, name: "SMS Template #3", createdBy: "Devon Lane", createdOn: "07/09/2025", modifiedOn: "07/09/2025", status: false },
  ]);

  // Toggle status function
  const handleToggleStatus = (id: number) => {
    setSMS((prev) =>
      prev.map((SMS) =>
        SMS.id === id ? { ...SMS, status: !SMS.status } : SMS
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search + Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="relative  w-full sm:w-auto mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search by template name"
            className="w-full sm:w-96 pl-4 bg-white pr-10 py-2 border border-gray-300 rounded-4xl placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <HiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button className="bg-yellow-400 text-sm hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center">
          <HiPlus className="h-5 w-5 mr-2" />
          Add Template
        </button>
      </div>

      {/* Script cards */}
      <div className="space-y-4">
        {SMS.map((sms) => (
          <div
            key={sms.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between"
          >
            {/* sms Name */}
            <div className="font-medium text-base mb-4 lg:mb-0 w-full lg:w-1/4">
              {sms.name}
            </div>

            {/* Info section (aligned grid) */}
            <div className="w-full lg:w-3/4 grid grid-cols-4 gap-6 text-sm text-gray-600 items-center">
              <div className="flex flex-col">
                <div className="text-gray-500 text-xs">Created by</div>
                <div className="font-medium text-black">{sms.createdBy}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-gray-500 text-xs">Created on</div>
                <div className="font-medium text-black">{sms.createdOn}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-gray-500 text-xs">Modified on</div>
                <div className="font-medium text-black">{sms.modifiedOn}</div>
              </div>

              {/* Status + Dot + Menu */}
              <div className="flex items-center justify-between lg:justify-end gap-4">
                

                <label
                  htmlFor={`toggle-${sms.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`toggle-${sms.id}`}
                      className="sr-only"
                      checked={sms.status}
                      onChange={() => handleToggleStatus(sms.id)}
                    />
                    <div
                      className={`block ${
                        sms.status ? "bg-black" : "bg-gray-300"
                      } w-12 h-6 rounded-full transition-colors duration-300`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                        sms.status ? "translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                </label>

                <button className="text-gray-500 hover:text-gray-700">
                  <BsThreeDots className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SMSTemplate;
