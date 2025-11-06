import { useState } from "react";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import ScriptModal from "@/components/modal/scriptmodal";

const Script = () => {
  const [scripts, setScripts] = useState([
    { id: 1, name: "Script #1", createdBy: "John Lee", createdOn: "09/09/2025", modifiedOn: "09/09/2025", status: true },
    { id: 2, name: "Script #2", createdBy: "Brooklyn Simmons", createdOn: "08/09/2025", modifiedOn: "08/09/2025", status: true },
    { id: 3, name: "Script #3", createdBy: "Devon Lane", createdOn: "07/09/2025", modifiedOn: "07/09/2025", status: false },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Toggle status
  const handleToggleStatus = (id: number) => {
    setScripts((prev) =>
      prev.map((script) =>
        script.id === id ? { ...script, status: !script.status } : script
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* 🔍 Search + Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by script name"
            className="w-full sm:w-96 pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-white placeholder:text-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <HiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <button onClick={openModal}
          className="bg-yellow-400 text-sm hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center transition-all">
          <HiPlus className="h-5 w-5 mr-2" />
          Add Script
        </button>
      </div>

      {/* 📄 Script cards */}
      <div className="space-y-4">
        {scripts.map((script) => (
          <div
            key={script.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between transition-all"
          >
            {/* Script Name */}
            <div className="font-semibold text-base text-gray-900 w-full lg:w-1/4">
              {script.name}
            </div>

            {/* Info section */}
            <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              {/* Created By */}
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Created by</span>
                <span className="font-medium text-gray-900">{script.createdBy}</span>
              </div>

              {/* Created On */}
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Created on</span>
                <span className="font-medium text-gray-900">{script.createdOn}</span>
              </div>

              {/* Modified On */}
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Modified on</span>
                <span className="font-medium text-gray-900">{script.modifiedOn}</span>
              </div>

              {/* Status + Menu */}
              <div className="flex items-center justify-between md:justify-end gap-3">
                <label
                  htmlFor={`toggle-${script.id}`}
                  className="flex items-center cursor-pointer select-none"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`toggle-${script.id}`}
                      className="sr-only"
                      checked={script.status}
                      onChange={() => handleToggleStatus(script.id)}
                    />
                    <div
                      className={`block w-11 h-6 rounded-full transition-colors duration-300 ${script.status ? "bg-black" : "bg-gray-300"
                        }`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${script.status ? "translate-x-5" : ""
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


      <ScriptModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Script;
