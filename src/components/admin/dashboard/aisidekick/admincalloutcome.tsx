import { Loader2 } from "lucide-react";
import { useCallOutcome } from "@/hooks/useAiSidekick";

const AdminCallOutcome = () => {

  const { data, isLoading } = useCallOutcome();


  const predictedOutcomes = data?.predictedOutcomes || { appointmentSet: "0%", interested: "0%", notInterested: 0 };
  const qualityScore = data?.qualityScore || 0;
  const keywordData = data?.keywordData || [
    { label: "Low", percentage: 0, color: "bg-green-500" },
    { label: "Medium", percentage: 0, color: "bg-yellow-400" },
    { label: "High", percentage: 0, color: "bg-red-500" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full shadow-sm p-6 min-h-[300px]">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <div className="space-y-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Call Outcome Intelligence
          </h1>

          {/* AI-Predicted Call Outcome */}
          <div className="pb-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              AI-Predicted Call Outcome
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Appointment Set</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {predictedOutcomes.appointmentSet}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Interested</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {predictedOutcomes.interested}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">Not Interested</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {predictedOutcomes.notInterested}
                </p>
              </div>
            </div>
          </div>

          {/* Conversation Quality Score */}
          <div className="pb-4">
            <div className="flex justify-between items-center gap-4">
              <div>
                <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                  Conversation Quality Score
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  AI analysis of engagement depth and relevance
                </p>
              </div>
              <p className="text-3xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
                {qualityScore}
                <span className="text-xl text-gray-500 dark:text-gray-400">/100</span>
              </p>
            </div>
          </div>

          {/* Keyword Optimization Score */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Keyword Optimization Score
            </h2>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 flex overflow-hidden">
              {keywordData.map((item: any) => (
                <div
                  key={item.label}
                  className={`${item.color} h-4 transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
              {keywordData.map((item: any) => (
                <div key={item.label} className="flex items-center gap-2 dark:text-gray-300">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span>{item.label}: {item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCallOutcome;