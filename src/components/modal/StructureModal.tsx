import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface StructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  title: string;
  placeholder: string;
}

const StructureModal: React.FC<StructureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  placeholder,
}) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] shadow-xl p-6 w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-[600] text-[#111]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="bg-[#F3F4F6] px-4 py-3 rounded-[12px] w-full">
            <label className="text-[12px] font-[500] text-[#6B7280] block mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-[#111] text-[15px] font-[400] outline-none placeholder:text-[#9CA3AF]"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 bg-[#F3F4F6] text-[#374151] font-[500] py-3 rounded-[12px] hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 bg-[#FFCA06] text-[#000000] font-[500] py-3 rounded-[12px] hover:bg-[#eab700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StructureModal;
