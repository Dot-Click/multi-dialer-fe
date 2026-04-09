import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { bulkAssignContactsToList, bulkAssignContactsToFolder, bulkMoveToDnc } from '@/store/slices/contactSlice';
import toast from 'react-hot-toast';
import { IoClose, IoChevronDown, IoChevronForward } from 'react-icons/io5';
import { FaFolderOpen, FaBan, FaListUl, FaFolder } from 'react-icons/fa';

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
    const { lists, folders } = useAppSelector((state) => state.contacts);
    const [selectedTarget, setSelectedTarget] = useState<{ id: string; type: 'list' | 'folder' } | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [actionType, setActionType] = useState<'move' | 'dnc'>('move');

    if (!isOpen) return null;

    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
    };

    const handleConfirm = async () => {
        if (selectedContacts.length === 0) {
            toast.error('No contacts selected');
            return;
        }

        setIsLoading(true);
        const contactIds = selectedContacts.map((c) => c.id);

        try {
            if (actionType === 'move') {
                if (!selectedTarget) {
                    toast.error('Please select a target destination');
                    setIsLoading(false);
                    return;
                }

                if (selectedTarget.type === 'list') {
                    await dispatch(bulkAssignContactsToList({ contactIds, listId: selectedTarget.id })).unwrap();
                } else {
                    await dispatch(bulkAssignContactsToFolder({ contactIds, folderId: selectedTarget.id })).unwrap();
                }
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

    const renderTreeNodes = (parentId: string | null = null, depth = 0) => {
        const currentFolders = folders.filter(f => f.parentId === parentId);
        const currentLists = lists.filter(l => l.folderId === parentId);

        return (
            <div className="flex flex-col gap-1 w-full">
                {currentFolders.map(folder => (
                    <div key={folder.id} className="flex flex-col">
                        <div 
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                                selectedTarget?.id === folder.id ? 'bg-[#FFCA06] text-black shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                            }`}
                            style={{ paddingLeft: `${depth * 16 + 8}px` }}
                            onClick={() => setSelectedTarget({ id: folder.id, type: 'folder' })}
                        >
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleFolder(folder.id); }}
                                className="p-1 hover:bg-black/10 rounded transition"
                            >
                                {expandedFolders[folder.id] ? <IoChevronDown size={14} /> : <IoChevronForward size={14} />}
                            </button>
                            <FaFolder className={selectedTarget?.id === folder.id ? 'text-black' : 'text-amber-400'} />
                            <span className="text-sm font-medium">{folder.name}</span>
                        </div>
                        {expandedFolders[folder.id] && renderTreeNodes(folder.id, depth + 1)}
                    </div>
                ))}
                {currentLists.map(list => (
                    <div 
                        key={list.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                            selectedTarget?.id === list.id ? 'bg-[#FFCA06] text-black shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                        }`}
                        style={{ paddingLeft: `${depth * 16 + 32}px` }}
                        onClick={() => setSelectedTarget({ id: list.id, type: 'list' })}
                    >
                        <FaListUl size={12} className={selectedTarget?.id === list.id ? 'text-black' : 'text-blue-400'} />
                        <span className="text-sm">{list.name}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[2000] p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Organize Contacts</h2>
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
                            <span className="text-sm font-semibold">Organize</span>
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

                    {/* Hierarchical Tree Selection */}
                    {actionType === 'move' && (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1 uppercase tracking-wide opacity-70">
                                Select Destination
                            </label>
                            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border border-gray-100 dark:border-slate-800 rounded-xl p-2 bg-gray-50/30 dark:bg-black/20">
                                {renderTreeNodes(null)}
                            </div>
                        </div>
                    )}

                    {/* DNC Warning */}
                    {actionType === 'dnc' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-4">
                            <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed italic font-medium">
                                Warning: Marking contacts as Do Not Call will remove them from all active queues and folders permanently.
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
                        className={`flex-1 px-4 py-3 text-sm font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${
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
