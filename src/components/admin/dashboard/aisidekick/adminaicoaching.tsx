import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { useAiCoaching } from "@/hooks/useAiSidekick";

const OBJECTION_COLORS = ["#9333EA", "#EF4444"];
const CONFIDENCE_COLORS = ["#22C55E", "#FBBF24", "#DC2626"];

const AdminAiCoaching = () => {
  // const [data, setData] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState(false);

  const { data, isLoading } = useAiCoaching();

  const coachingEvents = data?.coachingEvents || { count: 0, total: 0, successPercentage: 0 };
  const objectionData = data?.objectionDetection?.data || [];
  const confidenceData = data?.confidenceIndex?.data || [];
  const objectionRate = data?.objectionDetection?.rate || 0;
  const confidenceScore = data?.confidenceIndex?.score || 0;
  const keywordScore = data?.keywordScore || 0;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl w-full shadow-sm p-5 flex flex-col h-full min-h-[500px]">
      <h1 className="text-xl font-medium text-gray-800 dark:text-white">
        AI Coaching & Call Analysis
      </h1>

      {isLoading ? (
        <div className="grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <>
          {/* Real-Time Coaching Events */}
          <div className="space-y-3 mt-6">
            <h2 className="text-md font-medium text-gray-800 dark:text-gray-200">
              Real-Time Coaching Events
            </h2>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI provided live suggestions for:
              </p>
              <p className="text-md font-semibold text-gray-900 dark:text-white">
                {coachingEvents.count} calls today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-grow bg-[#D43435] rounded-lg h-7 flex overflow-hidden">
                <div
                  className="bg-green-500 h-7 transition-all duration-500"
                  style={{ width: `${coachingEvents.successPercentage}%` }}
                />
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {coachingEvents.count}/{coachingEvents.total}
              </span>
            </div>
            <div className="flex flex-col gap-x-6 gap-y-1 text-[10px] text-gray-600 dark:text-gray-400 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                Successfully used recommendations
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                Missed / not applied
              </div>
            </div>
          </div>

          {/* Donut Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-8">

            {/* Objection Detection Rate */}
            <div className="flex flex-col">
              <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-4 text-center">
                Objection Detection Rate
              </h2>
              <div className="flex flex-row items-center justify-center gap-4 w-full">
                <div className="min-w-[9rem] w-36 h-36 relative flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <filter id="shadow-admin-ac" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
                          <feOffset dx="0" dy="4" result="offsetBlur" />
                          <feMerge>
                            <feMergeNode in="offsetBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <Pie
                        data={objectionData.length ? objectionData : [{ name: "No data", value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={0}
                        dataKey="value"
                        filter="url(#shadow-admin-ac)"
                      >
                        {(objectionData.length ? objectionData : [{ name: "No data", value: 1 }]).map((_: any, index: number) => (
                          <Cell
                            key={index}
                            fill={objectionData.length ? OBJECTION_COLORS[index % OBJECTION_COLORS.length] : "#E5E7EB"}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                      {objectionRate}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {(objectionData.length ? objectionData : [{ name: "Handled successfully" }, { name: "Missed / unhandled" }]).map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: OBJECTION_COLORS[index % OBJECTION_COLORS.length] }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Call Confidence Index */}
            <div className="flex flex-col">
              <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-4 text-center">
                Call Confidence Index
              </h2>
              <div className="flex flex-row items-center justify-center gap-4 w-full">
                <div className="min-w-[9rem] w-36 h-36 relative flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confidenceData.length ? confidenceData : [{ name: "No data", value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        filter="url(#shadow-admin-ac)"
                      >
                        {(confidenceData.length ? confidenceData : [{ name: "No data", value: 1 }]).map((_: any, index: number) => (
                          <Cell
                            key={index}
                            fill={confidenceData.length ? CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length] : "#E5E7EB"}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                      {confidenceScore}
                      <span className="text-lg text-gray-600 dark:text-gray-400">/100</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {(confidenceData.length ? confidenceData : [{ name: "Excellent" }, { name: "Average" }, { name: "Poor" }]).map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length] }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Optimization Score */}
          <div className="space-y-3 mt-auto pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-md font-medium text-gray-800 dark:text-white">
                Keyword Optimization Score
              </h2>
              <div className="hidden sm:flex items-center gap-1">
                {[["bg-green-500", "High"], ["bg-yellow-400", "Medium"], ["bg-red-500", "Low"]].map(([bg, label]) => (
                  <span key={label} className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400">
                    <span className={`w-2 h-2 rounded-full ${bg}`} />{label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-md h-7">
                <div
                  className="bg-green-500 h-full rounded-md transition-all duration-500"
                  style={{ width: `${keywordScore}%` }}
                />
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {keywordScore}%
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-1">
              AI-rated delivery quality (tone, pacing, clarity)
            </p>
          </div>
        </>
      )}
    </section>
  );
};

export default AdminAiCoaching;