import React, { useState, useRef, type ChangeEvent } from "react";
import { HiX, HiOutlinePlay } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useRecordings, type RecordingSlot } from "@/hooks/useRecordings";

interface AddRecordingModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const slotOptions: Array<{ id: RecordingSlot; label: string }> = [
  { id: "ON_HOLD", label: "On Hold" },
  { id: "IVR", label: "IVR" },
  { id: "ANSWERING_MACHINE", label: "Answering Machine" },
  { id: "GENERAL", label: "General" },
];

const AddRecordingModal: React.FC<AddRecordingModalProps> = ({ onClose, onSuccess }) => {
  const [selectedSlot, setSelectedSlot] = useState<RecordingSlot>("GENERAL");
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { createRecording, loading } = useRecordings();

  const handleSlotChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedSlot(event.target.value as RecordingSlot);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!selectedFile) {
      toast.error("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slot", selectedSlot);
    formData.append("file", selectedFile);

    const result = await createRecording(formData);
    if (result) {
      toast.success("Recording added successfully");
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex justify-center items-center bg-black/50 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-md sm:rounded-2xl rounded-xl shadow-2xl p-5 sm:p-6 relative animate-fadeIn">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Add Recording
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <HiX size={22} />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scroll">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Slot
            </label>
            <div className="space-y-2 pl-2">
              {slotOptions.map((opt) => (
                <div className="flex items-center" key={opt.id}>
                  <input
                    type="radio"
                    id={opt.id}
                    name="recordingSlot"
                    value={opt.id}
                    checked={selectedSlot === opt.id}
                    onChange={handleSlotChange}
                    className="w-4 h-4 accent-gray-900 text-black border-gray-300 focus:ring-black cursor-pointer"
                  />
                  <label
                    htmlFor={opt.id}
                    className="ml-3 text-xs sm:text-sm text-gray-700 cursor-pointer"
                  >
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-3">
            <label
              htmlFor="recordingName"
              className="text-[12px] font-semibold text-[#495057] block mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="recordingName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter recording name"
              className="w-full bg-transparent placeholder:text-sm text-sm dark:text-gray-700 border-none outline-none"
            />
          </div>

          <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <HiOutlinePlay size={32} className="text-gray-500 mb-4" />
            <button
              onClick={handleUploadClick}
              disabled={loading}
              className="bg-white border border-gray-300 text-sm font-medium text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-50 mb-2 transition"
            >
              {selectedFile ? selectedFile.name : "Upload Recording"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="audio/*"
            />
            <p className="text-xs text-gray-500">20 MB max</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full bg-gray-200 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-medium py-2 rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition"
          >
            {loading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecordingModal;
