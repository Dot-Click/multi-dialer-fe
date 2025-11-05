import React, { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { HiX, HiOutlinePlay } from "react-icons/hi";

interface UploadRecordingModalProps {
    onClose: () => void;
}

type RecordingType = "voiceMail" | "onHold" | "callBack" | "emailVideo";

const UploadRecordingModal: React.FC<UploadRecordingModalProps> = ({ onClose }) => {
    // State to track selected radio type
    const [selectedType, setSelectedType] = useState<RecordingType>("onHold");

    // Ref for hidden file input
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // File size limits map
    const maxFileSizeMap: Record<RecordingType, string> = {
        voiceMail: "20 mb max",
        onHold: "750 kb max",
        callBack: "750 kb max",
        emailVideo: "20 mb max",
    };

    // Handle radio button selection
    const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedType(event.target.value as RecordingType);
    };

    // Trigger file dialog
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Handle file selection
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
            // TODO: Implement upload logic here (e.g., send to API)
        }
    };

    return (
        // Modal Backdrop
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center pt-16 items-center z-50">
            {/* Modal Container */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-medium text-gray-800">Upload Recording</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <HiX size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-3">
                    {/* Recording Type Selection */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Type</label>
                        <div className="space-y-3 pl-3">
                            {(["voiceMail", "onHold", "callBack", "emailVideo"] as RecordingType[]).map((type) => (
                                <div className="flex items-center" key={type}>
                                    <input
                                        type="radio"
                                        id={type}
                                        name="recordingType"
                                        value={type}
                                        checked={selectedType === type}
                                        onChange={handleTypeChange}
                                        className="w-4 h-4 accent-gray-950 text-black border-gray-300 focus:ring-black"
                                    />
                                    <label htmlFor={type} className="ml-3 block text-xs text-gray-700">
                                        {type === "voiceMail"
                                            ? "Voice Mail [120 seconds]"
                                            : type === "onHold"
                                                ? "On Hold [20 seconds]"
                                                : type === "callBack"
                                                    ? "CallBack Message [20 seconds]"
                                                    : "Email Video"}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Template Name Input */}
                    <div className="px-3 py-1.5 bg-gray-100 rounded-lg flex flex-col gap-1">
                        <label htmlFor="templateName" className="text-[12px] font-semibold text-gray-700 block">
                            Template Name
                        </label>
                        <input
                            type="text"
                            id="templateName"
                            placeholder="Enter template name"
                            className="w-full placeholder:text-sm text-sm outline-none  border border-transparent  "
                        />
                    </div>

                    {/* Upload Area */}
                    <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <div className="text-gray-500 mb-4">
                            <HiOutlinePlay size={32} />
                        </div>
                        <button
                            onClick={handleUploadClick}
                            className="bg-white border border-gray-300 text-sm font-medium text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-50 mb-2"
                        >
                            Upload Recording
                        </button>

                        {/* Hidden File Input */}
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

                {/* Footer */}
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 w-full bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button className="px-8 w-full py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadRecordingModal;
