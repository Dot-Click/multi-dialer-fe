import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { 
    fetchContactFolders, 
    fetchContactLists, 
    assignContactToList 
} from '@/store/slices/contactSlice';
import { Folder } from "lucide-react";
import toast from 'react-hot-toast';

const ActionPanel = () => {
    const dispatch = useAppDispatch();
    const { currentContact, folders, lists } = useAppSelector((state) => state.contacts);
    const [selectedFolderId, setSelectedFolderId] = useState<string>('');

    useEffect(() => {
        dispatch(fetchContactFolders());
        dispatch(fetchContactLists());
    }, [dispatch]);

    useEffect(() => {
        if (currentContact) {
            if (lists.length > 0) {
                const currentList = lists.find(l => l.contactIds.includes(currentContact.id));
                if (currentList) {
                    const currentFolder = folders.find(f => f.listIds.includes(currentList.id));
                    if (currentFolder) setSelectedFolderId(currentFolder.id);
                }
            }
        }
    }, [currentContact, lists, folders]);

    const handleFolderChange = async (folderId: string) => {
        if (!currentContact) return;
        setSelectedFolderId(folderId);
        const folder = folders.find(f => f.id === folderId);
        if (folder && folder.listIds.length > 0) {
            const listId = folder.listIds[0];
            try {
                await dispatch(assignContactToList({ contactId: currentContact.id, listId })).unwrap();
                toast.success(`Moved to ${folder.name}`);
            } catch (err) {
                toast.error("Failed to move folder");
            }
        }
    };

    if (!currentContact) return null;

    return (
        <div className="flex flex-col gap-4">
            {/* Folders Card - Compacted */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                    <Folder size={14} className="text-gray-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Folders</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {folders.map(folder => (
                        <button
                            key={folder.id}
                            onClick={() => handleFolderChange(folder.id)}
                            className={`px-2.5 py-1.5 text-[10px] rounded-lg border font-black transition-all ${
                                selectedFolderId === folder.id
                                    ? "bg-[#0E1011] dark:bg-[#FFCA06] text-white dark:text-gray-900 border-transparent shadow-md"
                                    : "bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-slate-600 hover:border-gray-300"
                            }`}
                        >
                            {folder.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActionPanel;
