import { IoClose } from "react-icons/io5";
import React from "react";

interface EditModalProps {
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3  overflow-y-auto">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl sm:max-w-2xl md:max-w-3xl p-5 sm:p-6 shadow-2xl 
        relative animate-fadeIn my-auto max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit</h2>
          <button onClick={onClose}>
            <IoClose className="text-2xl text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Form Section */}
        <form className="mt-6 space-y-5">
          {/* Full Name */}
          <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-2 w-full sm:w-1/2 rounded-lg">
            <label className="text-[#495057] font-medium text-[12px]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full placeholder:text-sm text-sm outline-none bg-transparent"
            />
          </div>

          {/* Property Address */}
          <div>
            <h3 className="text-gray-800 font-medium mb-2 text-sm sm:text-base">
              Property Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Address", "City", "State", "Zip"].map((label) => (
                <div
                  key={label}
                  className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-2 rounded-lg"
                >
                  <label className="text-[#495057] font-medium text-[12px]">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter Lead's ${label}`}
                    className="w-full placeholder:text-sm text-sm outline-none bg-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mailing Address */}
          <div>
            <h3 className="text-gray-800 font-medium mb-2 text-sm sm:text-base">
              Mailing Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Address", "City", "State", "Zip"].map((label) => (
                <div
                  key={label}
                  className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-2 rounded-lg"
                >
                  <label className="text-[#495057] font-medium text-[12px]">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter Lead's ${label}`}
                    className="w-full placeholder:text-sm text-sm outline-none bg-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center border-t gap-3 mt-6 pt-4">
          <button
            onClick={onClose}
            className="bg-gray-100 w-full sm:w-1/2 hover:bg-gray-200 px-5 py-2 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button className="bg-yellow-400 w-full sm:w-1/2 hover:bg-yellow-500 px-6 py-2 rounded-lg font-medium transition">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
