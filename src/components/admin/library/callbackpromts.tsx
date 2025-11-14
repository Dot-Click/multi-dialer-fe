import { useState, useEffect } from "react";
import { HiOutlineSearch, HiPlus, HiX } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";

// ======================================================
// TYPES
// ======================================================
interface RecordingData {
  id: number;
  name: string;
  type: string;
  createdBy: string;
  createdOn: string;
}

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; type: string }) => void;
  recordingData: RecordingData | null;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// ======================================================
// DELETE MODAL
// ======================================================
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1200] p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-8">
        <div className="mx-auto flex items-center justify-center w-fit">
          <IoWarningOutline className="text-3xl text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-5">Delete Recording?</h3>
        <p className="text-sm text-gray-500 mt-2">
          Once deleted, this action cannot be undone. Are you sure?
        </p>
        <div className="mt-8 flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2.5 w-full bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// ADD/EDIT MODAL
// ======================================================
const RecordingModal = ({ isOpen, onClose, onSave, recordingData }: RecordingModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (recordingData && isOpen) {
      setName(recordingData.name);
      setType(recordingData.type);
    } else {
      setName("");
      setType("");
    }
  }, [recordingData, isOpen]);

  const handleSave = () => {
    if (!name.trim() || !type.trim()) {
      alert("Both fields are required.");
      return;
    }
    onSave({ name, type });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {recordingData ? "Edit Recording" : "Add Recording"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <HiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="bg-gray-100 p-3 flex flex-col gap-1 rounded-lg focus-within:ring-2 focus-within:ring-yellow-400">
            <label className="text-xs font-medium text-gray-600">Template Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Template #1"
            />
          </div>

          <div className="bg-gray-100 p-3 flex flex-col gap-1 rounded-lg focus-within:ring-2 focus-within:ring-yellow-400">
            <label className="text-xs font-medium text-gray-600">Type of Recording</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Voice Mail / On Hold / Email Video"
            />
          </div>
        </div>

        <div className="flex justify-center items-center p-5 border-t border-gray-200 space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 w-full bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================
const CallBackPromts = () => {
  const [recordings, setRecordings] = useState<RecordingData[]>([
    { id: 1, name: "Template #1", type: "Voice Mail", createdBy: "John Lee", createdOn: "09/09/2025" },
    { id: 2, name: "Template #2", type: "On Hold", createdBy: "Brooklyn Simmons", createdOn: "08/09/2025" },
    { id: 3, name: "Template #3", type: "Email Video", createdBy: "Devon Lane", createdOn: "07/09/2025" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordingToEdit, setRecordingToEdit] = useState<RecordingData | null>(null);
  const [recordingToDelete, setRecordingToDelete] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleAdd = () => {
    setRecordingToEdit(null);
    setIsModalOpen(true);
  };

  const handleSave = (data: { name: string; type: string }) => {
    if (recordingToEdit) {
      setRecordings((prev) =>
        prev.map((r) => (r.id === recordingToEdit.id ? { ...r, ...data } : r))
      );
    } else {
      const newRec: RecordingData = {
        id: Date.now(),
        ...data,
        createdBy: "Current User",
        createdOn: new Date().toLocaleDateString("en-GB"),
      };
      setRecordings((prev) => [...prev, newRec]);
    }
    setIsModalOpen(false);
  };

  const openDeleteModal = (id: number) => {
    setRecordingToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (recordingToDelete !== null) {
      setRecordings((prev) => prev.filter((r) => r.id !== recordingToDelete));
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen p-6">
      {/* Search + Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="relative w-full sm:w-[40%]">
          <input
            type="text"
            placeholder="Search by script name"
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-white placeholder:text-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <HiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleAdd}
          className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <HiPlus className="h-5 w-5 mr-2" />
          Add Recording
        </button>
      </div>

      {/* Recording List */}
      <div className="space-y-3">
        {recordings.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition"
          >
            <div className="font-medium text-gray-900 w-full sm:w-1/4">{r.name}</div>
            <div className="w-full sm:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <span className="text-gray-500 text-xs block">Type of recording</span>
                <span className="font-medium text-gray-900">{r.type}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Created by</span>
                <span className="font-medium text-gray-900">{r.createdBy}</span>
              </div>

              {/* Fixed Layout for Date + Dots */}
              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs block">Created on</span>
                  <span className="font-medium text-gray-900 whitespace-nowrap">{r.createdOn}</span>
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <BsThreeDots className="h-5 w-5" />
                  </button>
                  {openMenuId === r.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-20">
                      <button
                        onClick={() => {
                          setRecordingToEdit(r);
                          setIsModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          openDeleteModal(r.id);
                          setOpenMenuId(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <RecordingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        recordingData={recordingToEdit}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CallBackPromts;
