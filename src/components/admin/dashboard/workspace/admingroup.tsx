import { useGroups } from "@/hooks/useWorkspace";
import { Loader2 } from "lucide-react";

const AdminGroup = () => {
  const { data: groups, isLoading } = useGroups();

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[38vh] items-center justify-center rounded-[32px] w-full ">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </section>
    );
  }

  const groupList = groups || [];

  return (
    <section className="bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[38vh] gap-5  rounded-[32px] px-[24px] pt-[24px] pb-[32px]  w-full ">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] text-[#000000] dark:text-white font-medium">
          Groups
        </h1>
      </div>

      <div className="flex flex-col gap-3  overflow-auto custom-scrollbar">
        {groupList.length > 0 ? (
          groupList.map((gr) => (
            <div
              key={gr.id}
              className="flex mx-2 rounded-md border-b gap-2 items-center border-gray-200 dark:border-slate-700"
            >
              <div className="flex flex-col justify-between w-full">
                <h1 className="text-[14px] font-medium text-[#000000] dark:text-white">
                  {gr.name}
                </h1>
                <h1 className="text-[14px] font-normal text-[#495057] dark:text-gray-400">
                  Contacts: {gr.contactIds?.length || 0}
                </h1>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">No groups found.</div>
        )}
      </div>
    </section>
  );
};

export default AdminGroup;
