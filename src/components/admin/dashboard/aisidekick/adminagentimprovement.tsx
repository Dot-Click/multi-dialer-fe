import { Loader2 } from "lucide-react";
import { useImprovement } from "@/hooks/useAiSidekick";

const AdminAgentImprovement = () => {

  const { data, isLoading } = useImprovement();


  const current = data?.improvement?.current ?? 0;
  const target = data?.improvement?.target ?? 20;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full shadow-sm p-6 min-h-[160px]">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Agent Improvement Score
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Performance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                +{current}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Target Performance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                +{target}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-md h-10">
              <div
                className="bg-green-500 h-10 rounded-md transition-all duration-500"
                style={{ width: `${Math.min(current, 100)}%` }}
              />
            </div>
            <span className="font-semibold text-lg text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {current}%
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAgentImprovement;