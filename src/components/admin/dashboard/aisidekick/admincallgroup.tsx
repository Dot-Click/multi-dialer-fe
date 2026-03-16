import { Loader2 } from "lucide-react";
import { useCallGroup } from "@/hooks/useAiSidekick";

const getTagStyles = (tag: string) => {
  switch (tag) {
    case "Hot Lead": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "Follow Up": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "Interested": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default: return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300";
  }
};

const AdminCallGroup = () => {

  const { data, isLoading } = useCallGroup();


  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full shadow-sm p-6 sm:p-8 flex flex-col h-[60vh]">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex-shrink-0">
        Calling Groups
      </h1>

      {isLoading ? (
        <div className="grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400 pb-2 border-b dark:border-slate-700 flex-shrink-0">
            <div className="col-span-1">Lead Name</div>
            <div className="col-span-1 text-center">AI Lead Score</div>
            <div className="col-span-1 text-right">Notes / Tags</div>
          </div>

          {/* Scrollable Body */}
          <div className="mt-4 flex-1 h-20 overflow-y-auto custom-scrollbar pr-2">
            {data?.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-400 dark:text-gray-500">No leads found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data!.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-3 gap-4 items-center border-b dark:border-slate-700 pb-4 last:border-b-0"
                  >
                    <div className="col-span-1 font-semibold text-gray-800 dark:text-white">
                      {item.name}
                    </div>
                    <div className="col-span-1 text-center text-gray-600 dark:text-gray-300">
                      {item.score}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <span className={`px-3 py-1 text-sm font-medium rounded-md ${getTagStyles(item.tag)}`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCallGroup;