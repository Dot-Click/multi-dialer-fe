import { IoClose } from 'react-icons/io5'; // Icon ke liye: npm install react-icons
import React from 'react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-2xl text-gray-800">Appointment</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form Section */}
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <label htmlFor="title" className="text-sm font-[600] text-gray-900">Title:</label>
            <input type="text" id="title" className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1" />
          </div>

          <div className="grid grid-cols-[100px_1fr] items-start gap-4">
            <label htmlFor="description" className="text-sm font-[600] text-gray-900 mt-1">Description:</label>
            <textarea 
              id="description" 
              rows={1} 
              className="w-full resize-none border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1"
            ></textarea>
          </div>

          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <label htmlFor="starts" className="text-sm font-[600] text-gray-900">Starts:</label>
            <input type="text" id="starts" placeholder="DD/MM/YYYY 00:00" className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1" />
          </div>

          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <label htmlFor="ends" className="text-sm font-[600] text-gray-900">Ends:</label>
            <input type="text" id="ends" placeholder="DD/MM/YYYY 00:00" className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1" />
          </div>

          {/* Checkbox 1 */}
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="send-email" 
              className="h-5 w-5 rounded border-black accent-black focus:ring-0 cursor-pointer" 
            />
            <label htmlFor="send-email" className="text-sm text-gray-700">
              Send Confirmation Email
            </label>
          </div>

          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <label htmlFor="assign" className="text-sm font-[600] text-gray-900">Assign To</label>
            <select id="assign" className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1 bg-transparent">
              <option>None</option>
              <option>Agent 1</option>
              <option>Agent 2</option>
            </select>
          </div>

          {/* Checkbox 2 */}
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="assign-lead" 
              className="h-5 w-5 rounded border-black accent-black focus:ring-0 cursor-pointer" 
            />
            <label htmlFor="assign-lead" className="text-sm text-gray-700">
              To also assign the lead to this agent check this box
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between w-full items-center gap-3 pt-6 mt-6 border-t border-gray-200">
          <button 
            onClick={onClose} 
            className="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button className="bg-yellow-400 w-full hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
