import React from "react";
import { IoClose, IoWarningOutline } from "react-icons/io5";

interface DialRestrictionModalProps {
  onClose: () => void;
}

const DialRestrictionModal: React.FC<DialRestrictionModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999 px-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-8 relative transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <IoClose className="text-2xl" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
            <IoWarningOutline className="text-3xl text-yellow-600 dark:text-yellow-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Action Restricted
          </h2>
          
          <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
            You can only initiate calls from a selected <span className="font-semibold text-gray-900 dark:text-white">Calling List</span>. Please select a list from the sidebar to continue.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-[#FFCA06] hover:bg-[#ffcf29] text-[#2B3034] font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95 text-lg"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialRestrictionModal;
