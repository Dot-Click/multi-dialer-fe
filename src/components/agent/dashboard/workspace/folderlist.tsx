import { useState } from 'react';
import {  useLists } from '@/hooks/useWorkspace';
import { Loader2 } from 'lucide-react';

const FoldersList = () => {
    const { data: lists, isLoading: listsLoading } = useLists();
    const [activeListId, setActiveListId] = useState<string>("all");

    if (listsLoading) {
        return (
            <section className='bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] items-center justify-center rounded-[32px] md:w-[50%] w-full '>
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </section>
        );
    }

    const allLists = lists || [];

    const filteredLists = activeListId === "all"
        ? allLists
        : allLists.filter(l => l.id === activeListId);

    return (
        <section className='bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px] md:w-[50%]  w-full '>
            <div className="flex flex-col justify-between gap-3">
                <h1 className="text-[20px] dark:text-white text-[#000000] font-medium">Lists</h1>
                <div className='flex gap-2 overflow-x-auto custom-scrollbar pb-1'>
                    <button
                        onClick={() => setActiveListId("all")}
                        className={
                            activeListId === "all"
                                ? "border px-2 rounded-md font-medium cursor-pointer py-1 text-[11px] whitespace-nowrap dark:bg-slate-700 bg-[#0E1011] text-white"
                                : "border px-2 rounded-md text-gray-950 dark:text-gray-400 font-medium cursor-pointer hover:bg-gray-200 py-1 text-[11px] whitespace-nowrap"
                        }
                    >
                        All Lists
                    </button>
                    {allLists.map((list) => (
                        <button
                            key={list.id}
                            onClick={() => setActiveListId(list.id)}
                            className={
                                activeListId === list.id
                                    ? "border px-2 rounded-md font-medium cursor-pointer py-1 text-[11px] whitespace-nowrap dark:bg-slate-700 bg-[#0E1011] text-white"
                                    : "border px-2 rounded-md text-gray-950 dark:text-gray-400 font-medium cursor-pointer hover:bg-gray-200 py-1 text-[11px] whitespace-nowrap"
                            }
                        >
                            {list.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex flex-col gap-5  overflow-auto custom-scrollbar pr-2'>
                {filteredLists.length > 0 ? (
                    filteredLists.map((list) => (
                        <div key={list.id} className='flex border-b gap-2 items-center border-gray-200 dark:border-slate-700 pb-2'>
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
