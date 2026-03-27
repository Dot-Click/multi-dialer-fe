import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { bulkAssignContactsToList, bulkMoveToDnc } from '@/store/slices/contactSlice';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { FaFolderOpen, FaBan } from 'react-icons/fa';

interface MoveToModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedContacts: any[];
}

const MoveToModal: React.FC<MoveToModalProps> = ({
    isOpen,
    onClose,
    selectedContacts,
}) => {
    const dispatch = useAppDispatch();
    const { lists } = useAppSelector((state) => state.contacts);
    const [selectedListId, setSelectedListId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [actionType, setActionType] = useState<'move' | 'dnc'>('move');

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (selectedContacts.length === 0) {
            toast.error('No contacts selected');
            return;
        }

        setIsLoading(true);
        const contactIds = selectedContacts.map((c) => c.id);

        try {
            if (actionType === 'move') {
                if (!selectedListId) {
                    toast.error('Please select a target folder');
                    setIsLoading(false);
                    return;
                }
                await dispatch(bulkAssignContactsToList({ contactIds, listId: selectedListId })).unwrap();
                toast.success(`Successfully moved ${contactIds.length} contacts`);
            } else {
                await dispatch(bulkMoveToDnc(contactIds)).unwrap();
                toast.success(`Successfully marked ${contactIds.length} contacts as DNC`);
            }
            onClose();
        } catch (error: any) {
            toast.error(error || 'Failed to perform action');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-2000 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Move Contacts</h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                            {selectedContacts.length} contacts selected
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500 dark:text-slate-400"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Action Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setActionType('move')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                actionType === 'move'
                                    ? 'border-[#FFCA06] bg-yellow-50/30 dark:bg-yellow-400/5 text-[#2B3034] dark:text-[#FFCA06]'
                                    : 'border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-700'
                            }`}
                        >
                            <FaFolderOpen className="text-2xl mb-2" />
                            <span className="text-sm font-semibold">Change Folder</span>
                        </button>
                        <button
                            onClick={() => setActionType('dnc')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                actionType === 'dnc'
                                    ? 'border-red-500 bg-red-50/30 dark:bg-red-500/5 text-red-600'
                                    : 'border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-700'
                            }`}
                        >
                            <FaBan className="text-2xl mb-2" />
                            <span className="text-sm font-semibold">Mark as DNC</span>
                        </button>
                    </div>

                    {/* Folder Selection (conditionally shown) */}
                    {actionType === 'move' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">
                                Select Target Folder
                            </label>
                            <select
                                value={selectedListId}
                                onChange={(e) => setSelectedListId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Choose a folder...</option>
                                {lists.map((list) => (
                                    <option key={list.id} value={list.id}>
                                        {list.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* DNC Warning (conditionally shown) */}
                    {actionType === 'dnc' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-4">
                            <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed italic">
                                Are you sure you want to mark these contacts as Do Not Call? They will be removed from all active calling lists.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex gap-3 bg-gray-50/50 dark:bg-slate-800/50">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl shadow-lg transition-all active:scale-[0.98] ${
                            actionType === 'move'
                                ? 'bg-[#FFCA06] hover:bg-[#ffd633] text-[#2B3034]'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <span>Confirm {actionType === 'move' ? 'Move' : 'DNC'}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoveToModal;
