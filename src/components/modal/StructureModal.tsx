import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';

interface StructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  title: string;
  placeholder: string;
  /** Pre-fills the input (e.g. for rename). Defaults to empty (create mode). */
  defaultValue?: string;
  /** Label for the confirm button. Defaults to "Save". */
  saveLabel?: string;
}

const StructureModal: React.FC<StructureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  placeholder,
  defaultValue = '',
  saveLabel = 'Save',
}) => {
  const [name, setName] = useState('');

  // Seed the input with defaultValue when the modal opens (rename), else clear it.
  useEffect(() => {
    if (isOpen) {
      setName(defaultValue);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[24px] shadow-2xl p-6 w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700/80 rounded-full p-2 transition-all duration-200"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-[#FFCA06] focus-within:border-transparent px-4 py-3.5 rounded-[16px] w-full transition-all duration-200">
            <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-gray-900 dark:text-white text-[15px] font-semibold outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-3 pt-5 mt-6 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold py-3.5 rounded-[16px] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 bg-[#FFCA06] text-black font-bold py-3.5 rounded-[16px] hover:bg-[#eab700] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(255,202,6,0.2)] dark:shadow-none"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StructureModal;
