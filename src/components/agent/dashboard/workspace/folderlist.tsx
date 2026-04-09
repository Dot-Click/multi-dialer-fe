import {  useLists } from '@/hooks/useWorkspace';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FoldersList = () => {
    const { data: lists, isLoading: listsLoading } = useLists();
    const navigate = useNavigate();

    if (listsLoading) {
        return (
            <section className='bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] items-center justify-center rounded-[32px] md:w-[50%] w-full '>
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </section>
        );
    }

    const allLists = lists || [];

    return (
        <section className='bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px] md:w-[50%]  w-full '>
            <div className="flex flex-col justify-between gap-3">
                <h1 className="text-[20px] dark:text-white text-[#000000] font-medium">Lists</h1>
            </div>

            <div className='flex flex-col gap-5  overflow-auto custom-scrollbar pr-2'>
                {allLists.length > 0 ? (
                    allLists.map((list) => (
                        <div 
                            key={list.id} 
                            onClick={() => navigate('/data-dialer', { state: { activeItem: { type: 'list', id: list.id, name: list.name } } })}
                            className='flex border-b gap-2 items-center border-gray-200 dark:border-slate-700 pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 p-2 rounded-md transition-colors w-full text-left'
                        >
                            <div className="flex flex-col justify-between w-full">
                                <h1 className="text-[14px] dark:text-white font-medium text-[#000000]">{list.name}</h1>
                                <h1 className="text-[14px] dark:text-gray-400 font-normal text-[#495057]">Contacts: {list.contactIds?.length || 0}</h1>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">No lists found.</div>
                )}
            </div>
        </section>
    );
};

export default FoldersList;
