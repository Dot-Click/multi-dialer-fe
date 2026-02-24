import React, { useState, useRef, type ChangeEvent } from "react";
import { HiX, HiOutlinePlay } from "react-icons/hi";
import { useMediaCenter, type MediaType } from "@/hooks/useMediaCenter";
import { toast } from "react-hot-toast";

interface UploadRecordingModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const typeMap: Record<string, MediaType> = {
  voiceMail: "VOICE_MAIL",
  onHold: "ON_HOLD",
  callBack: "CALLBACK_MESSAGE",
  emailVideo: "EMAIL_VIDEO",
};

const UploadRecordingModal: React.FC<UploadRecordingModalProps> = ({ onClose, onSuccess }) => {
  const [selectedType, setSelectedType] = useState<string>("onHold");
  const [templateName, setTemplateName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { createMediaCenterItem, loading } = useMediaCenter();

  const maxFileSizeMap: Record<string, string> = {
    voiceMail: "20 MB max",
    onHold: "750 KB max",
    callBack: "750 KB max",
    emailVideo: "20 MB max",
  };

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error("Template Name is required");
      return;
    }
    if (!selectedFile) {
      toast.error("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("templateName", templateName);
    formData.append("mediaType", typeMap[selectedType]);
    formData.append("file", selectedFile);

    const result = await createMediaCenterItem(formData);
    if (result) {
      toast.success("Recording uploaded successfully");
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex justify-center items-center bg-black/50 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-md sm:rounded-2xl rounded-xl shadow-2xl p-5 sm:p-6 relative animate-fadeIn">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Upload Recording
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
              Type
            </label>
            <div className="space-y-2 pl-2">
              {[
                { id: "voiceMail", label: "Voice Mail [120 seconds]" },
                { id: "onHold", label: "On Hold [20 seconds]" },
                { id: "callBack", label: "Callback Message [20 seconds]" },
                { id: "emailVideo", label: "Email Video" },
              ].map((type) => (
                <div className="flex items-center" key={type.id}>
                  <input
                    type="radio"
                    id={type.id}
                    name="recordingType"
                    value={type.id}
                    checked={selectedType === type.id}
                    onChange={handleTypeChange}
                    className="w-4 h-4 accent-gray-900 text-black border-gray-300 focus:ring-black cursor-pointer"
                  />
                  <label htmlFor={type.id} className="ml-3 text-xs sm:text-sm text-gray-700 cursor-pointer">
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-3">
            <label
              htmlFor="templateName"
              className="text-[12px] font-semibold text-[#495057] block mb-1"
            >
              Template Name
            </label>
            <input
              type="text"
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="w-full bg-transparent placeholder:text-sm text-sm border-none outline-none"
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
              accept="audio/*,video/*"
            />
            <p className="text-xs text-gray-500">{maxFileSizeMap[selectedType]}</p>
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

export default UploadRecordingModal;
