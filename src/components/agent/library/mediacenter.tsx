import { useState } from "react";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import UploadRecordingModal from "@/components/modal/uploadrecordingmodal";

const MediaCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [media] = useState([
    { id: 1, name: "Template #1", createdBy: "John Lee", createdOn: "09/09/2025", recordType: "Voice Mail", status: true },
    { id: 2, name: "Template #2", createdBy: "Brooklyn Simmons", createdOn: "08/09/2025", recordType: "On Hold", status: true },
    { id: 3, name: "Template #3", createdBy: "Devon Lane", createdOn: "07/09/2025", recordType: "Callback Message", status: false },
    { id: 4, name: "Template #4", createdBy: "Devon Lane", createdOn: "07/09/2025", recordType: "Email Video", status: false },
  ]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="">
      {/* Search + Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by template name"
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <HiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <button
          onClick={openModal}
          className="bg-yellow-400 text-sm hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <HiPlus className="h-5 w-5 mr-2" />
          Add Template
        </button>
      </div>

      {/* Media Cards */}
      <div className="space-y-4">
        {media.map((med) => (
          <div
            key={med.id}
            className="bg-white p-4 rounded-lg shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition hover:shadow-md"
          >
            {/* Template Name */}
            <div className="font-medium text-base text-gray-900 w-full lg:w-1/4">
              {med.name}
            </div>

            {/* Info section */}
            <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Type of Recording</span>
                <span className="font-medium text-gray-900">{med.recordType}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Created by</span>
                <span className="font-medium text-gray-900">{med.createdBy}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Created on</span>
                <span className="font-medium text-gray-900">{med.createdOn}</span>
              </div>

              {/* Action menu */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <BsThreeDots className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && <UploadRecordingModal onClose={closeModal} />}
    </div>
  );
};

export default MediaCenter;
