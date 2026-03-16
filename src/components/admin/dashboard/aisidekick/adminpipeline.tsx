import { Loader2 } from "lucide-react";
import { useImprovement } from "@/hooks/useAiSidekick";

const AdminPipeline = () => {

  const { data, isLoading } = useImprovement();



  const dealsAccelerated = data?.pipeline?.dealsAccelerated ?? 0;
  const speedIncrease = data?.pipeline?.speedIncrease ?? 0;
  const accelerationPercentage = data?.pipeline?.accelerationPercentage ?? 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full shadow-sm p-6 min-h-[160px]">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Pipeline Acceleration Index
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Deals Accelerated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                +{dealsAccelerated}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Speed Increase</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                +{speedIncrease}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-md h-10">
              <div
                className="bg-green-500 h-10 rounded-md transition-all duration-500"
                style={{ width: `${Math.min(accelerationPercentage, 100)}%` }}
              />
            </div>
            <span className="font-semibold text-lg text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {accelerationPercentage}%
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPipeline;