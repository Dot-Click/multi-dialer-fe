import React from "react";

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScriptModal: React.FC<ScriptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="p-5 border w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg sm:text-xl font-medium text-gray-900">Create Call Script</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gray-100 flex flex-col gap-1 px-2 py-2 border border-gray-200 rounded-lg">
            <label
              htmlFor="script-name"
              className="block text-xs font-medium text-gray-700"
            >
              Script Name
            </label>
            <input
              type="text"
              id="script-name"
              className="text-gray-900 text-sm outline-none block w-full"
              placeholder="Enter script name"
            />
          </div>

          <div className="bg-gray-100 flex flex-col gap-1 px-2 py-2 border border-gray-200 rounded-lg">
            <label
              htmlFor="script-text"
              className="block text-xs font-medium text-gray-700"
            >
              Script Text
            </label>
            <textarea
              id="script-text"
              rows={4}
              className="text-gray-900 resize-none text-sm outline-none block w-full"
              placeholder="Enter script text"
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center pt-6 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 w-full bg-gray-200 hover:bg-gray-100 rounded-lg text-sm font-medium px-5 py-2.5"
          >
            Cancel
          </button>

          <button
            type="button"
            className="text-gray-950 w-full bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm font-medium px-5 py-2.5"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScriptModal;
