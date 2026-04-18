import { useState } from 'react';
import { useLists, useFolders } from '@/hooks/useWorkspace';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminFoldersList = () => {
  const [activeTab, setActiveTab] = useState<'lists' | 'folders'>('lists');
  const { data: lists, isLoading: listsLoading } = useLists();
  const { data: folders, isLoading: foldersLoading } = useFolders();
  const navigate = useNavigate();

  const isLoading = listsLoading || foldersLoading;

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] items-center justify-center rounded-4xl md:w-[50%] w-full ">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-3 rounded-4xl px-6 py-5 md:w-[50%]  w-full ">
        <div className="flex items-center gap-6 mb-2 border-b border-gray-100 dark:border-slate-700">
                <button 
                    onClick={() => setActiveTab('lists')}
                    className={`pb-2 text-[15px] font-semibold transition-all relative ${
                        activeTab === 'lists' 
                        ? 'text-[#0E1011] dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-yellow-400' 
                        : 'text-[#9CA3AF] hover:text-[#4B5563] dark:hover:text-gray-300'
                    }`}
                >
                    LISTS
                </button>
                <button 
                    onClick={() => setActiveTab('folders')}
                    className={`pb-2 text-[15px] font-semibold transition-all relative ${
                        activeTab === 'folders' 
                        ? 'text-[#0E1011] dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-yellow-400' 
                        : 'text-[#9CA3AF] hover:text-[#4B5563] dark:hover:text-gray-300'
                    }`}
                >
                    FOLDERS
                </button>
            </div>

      <div className="flex flex-col gap-4  overflow-auto custom-scrollbar pr-2">
        {activeTab === 'lists' ? (
            (lists || []).length > 0 ? (
                (lists || []).map((list) => (
                    <div
                      key={list.id}
                      onClick={() => navigate('/admin/data-dialer', { state: { activeItem: { type: 'list', id: list.id, name: list.name } } })}
                      className="flex border-b gap-2 items-center border-gray-100 dark:border-slate-700/50 pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 p-2 rounded-md transition-colors w-full text-left"
                    >
                      <div className="flex flex-col justify-between w-full">
                        <h1 className="text-[14px] font-medium text-gray-950 dark:text-white">
                          {list.name}
                        </h1>
                        <h1 className="text-[12px] font-normal text-[#495057] dark:text-gray-400">
                          Contacts: {list.contactIds?.length || 0}
                        </h1>
                      </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500">No lists found.</div>
            )
        ) : (
            (folders || []).length > 0 ? (
                (folders || []).map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() => navigate('/admin/data-dialer', { state: { activeItem: { type: 'folder', id: folder.id, name: folder.name } } })}
                      className="flex border-b gap-2 items-center border-gray-100 dark:border-slate-700/50 pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 p-2 rounded-md transition-colors w-full text-left"
                    >
                      <div className="flex flex-col justify-between w-full">
                        <h1 className="text-[14px] font-medium text-gray-950 dark:text-white">
                          {folder.name}
                        </h1>
                        <h1 className="text-[12px] font-normal text-[#495057] dark:text-gray-400">
                          Lists: {folder.listIds?.length || 0}
                        </h1>
                      </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500">No folders found.</div>
            )
        )}
      </div>
    </section>
  );
};

export default AdminFoldersList;
