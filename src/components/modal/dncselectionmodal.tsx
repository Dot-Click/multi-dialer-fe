import React, { useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";

interface DncSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (phoneIds: string[]) => void;
    phones: Array<{ id: string; number: string; type: string }>;
    contactName: string;
}

const DncSelectionModal: React.FC<DncSelectionModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    phones,
    contactName,
}) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        if (selectedIds.length === 0) return;
        onConfirm(selectedIds);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Move to DNC</h2>
                        <p className="text-sm text-gray-500 mt-1">Select numbers for {contactName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoCloseOutline className="text-2xl text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {phones.map((phone) => (
                            <label
                                key={phone.id}
                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${selectedIds.includes(phone.id)
                                        ? 'border-yellow-400 bg-yellow-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.includes(phone.id)
                                            ? 'bg-yellow-400 border-yellow-400'
                                            : 'border-gray-300'
                                        }`}>
                                        {selectedIds.includes(phone.id) && (
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <span className="block font-medium text-gray-900">{phone.number}</span>
                                        <span className="text-xs text-gray-500 capitalize">{phone.type.toLowerCase()}</span>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedIds.includes(phone.id)}
                                    onChange={() => toggleSelection(phone.id)}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={selectedIds.length === 0}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${selectedIds.length > 0
                                ? 'text-black bg-yellow-400 hover:bg-yellow-500'
                                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            }`}
                    >
                        Move to DNC
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DncSelectionModal;
