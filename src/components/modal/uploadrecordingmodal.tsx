import React, { useState, useRef, type ChangeEvent } from "react";
import { HiX, HiOutlinePlay } from "react-icons/hi";

interface UploadRecordingModalProps {
  onClose: () => void;
}

type RecordingType = "voiceMail" | "onHold" | "callBack" | "emailVideo";

const UploadRecordingModal: React.FC<UploadRecordingModalProps> = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState<RecordingType>("onHold");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxFileSizeMap: Record<RecordingType, string> = {
    voiceMail: "20 MB max",
    onHold: "750 KB max",
    callBack: "750 KB max",
    emailVideo: "20 MB max",
  };

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value as RecordingType);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) console.log("Selected file:", file.name);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex justify-center items-center bg-black/50 p-4 sm:p-6 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md sm:rounded-2xl rounded-xl shadow-2xl p-5 sm:p-6 relative animate-fadeIn">
        {/* Header */}
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

        {/* Scrollable content (for small screens) */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scroll">
          {/* Recording Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Type
            </label>
            <div className="space-y-2 pl-2">
              {(["voiceMail", "onHold", "callBack", "emailVideo"] as RecordingType[]).map(
                (type) => (
                  <div className="flex items-center" key={type}>
                    <input
                      type="radio"
                      id={type}
                      name="recordingType"
                      value={type}
                      checked={selectedType === type}
                      onChange={handleTypeChange}
                      className="w-4 h-4 accent-gray-900 text-black border-gray-300 focus:ring-black"
                    />
                    <label htmlFor={type} className="ml-3 text-xs sm:text-sm text-gray-700">
                      {type === "voiceMail"
                        ? "Voice Mail [120 seconds]"
                        : type === "onHold"
                        ? "On Hold [20 seconds]"
                        : type === "callBack"
                        ? "Callback Message [20 seconds]"
                        : "Email Video"}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Template Name */}
          <div className="bg-gray-100 rounded-lg p-3">
            <label
              htmlFor="templateName"
              className="text-[12px] font-semibold text-gray-700 block mb-1"
            >
              Template Name
            </label>
            <input
              type="text"
              id="templateName"
              placeholder="Enter template name"
              className="w-full bg-transparent placeholder:text-sm text-sm border-none outline-none"
            />
          </div>

          {/* Upload Area */}
          <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <HiOutlinePlay size={32} className="text-gray-500 mb-4" />
            <button
              onClick={handleUploadClick}
              className="bg-white border border-gray-300 text-sm font-medium text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-50 mb-2"
            >
              Upload Recording
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

        {/* Footer Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button className="w-full bg-yellow-400 text-black font-medium py-2 rounded-lg hover:bg-yellow-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadRecordingModal;
