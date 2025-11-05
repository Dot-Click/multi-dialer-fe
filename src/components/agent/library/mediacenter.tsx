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
        { id: 4, name: "Template #3", createdBy: "Devon Lane", createdOn: "07/09/2025", recordType: "Email Video", status: false },
    ]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
                <button onClick={openModal}
                    className="bg-yellow-400 text-sm hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center">
                    <HiPlus className="h-5 w-5 mr-2" />
                    Add Template
                </button>
            </div>

            {/* Script cards */}
            <div className="space-y-4">
                {media.map((med) => (
                    <div
                        key={med.id}
                        className="bg-white p-4 rounded-lg shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between"
                    >
                        {/* sms Name */}
                        <div className="font-medium text-base mb-4 lg:mb-0 w-full lg:w-1/4">
                            {med.name}
                        </div>

                        {/* Info section (aligned grid) */}
                        <div className="w-full lg:w-3/4 grid grid-cols-4 gap-6 text-sm text-gray-600 items-center">
                            <div className="flex flex-col">
                                <div className="text-gray-500 text-xs">Type of recoridng</div>
                                <div className="font-medium text-black">{med.recordType}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-gray-500 text-xs">Created by</div>
                                <div className="font-medium text-black">{med.createdBy}</div>
                            </div>

                            <div className="flex flex-col">
                                <div className="text-gray-500 text-xs">Created on</div>
                                <div className="font-medium text-black">{med.createdOn}</div>
                            </div>



                            {/* Status + Dot + Menu */}
                            <div className="flex items-center justify-between lg:justify-end gap-4">




                                <button className="text-gray-500 hover:text-gray-700">
                                    <BsThreeDots className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <UploadRecordingModal onClose={closeModal} />}
        </div>
    );
};

export default MediaCenter;
