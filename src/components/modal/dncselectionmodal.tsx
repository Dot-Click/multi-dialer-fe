import React from 'react';

interface DncSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    contactName: string;
}

const DncSelectionModal: React.FC<DncSelectionModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    contactName,
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-60 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Move to DNC</h2>
                    <p className="text-sm text-gray-500 mt-1">Confirm action for {contactName}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to mark <strong>{contactName}</strong> and all associated phone numbers as <strong>Do Not Call</strong>?
                    </p>
                    <p className="text-sm text-red-500 mt-4 bg-red-50 p-3 rounded-lg border border-red-100 italic">
                        This contact will be hidden from the dialer and all active calling lists.
                    </p>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-black bg-yellow-400 hover:bg-yellow-500"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DncSelectionModal;
