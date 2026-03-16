import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { useCompliance } from "@/hooks/useAiSidekick";

const COLORS = ["#22C55E", "#E5E7EB"];

const AdminCompliance = () => {

  const { data, isLoading } = useCompliance();


  const flags = data?.flags || 0;
  const flagsPercentage = data?.flagsPercentage || 0;
  const riskRate = data?.riskRate || 0;
  const riskData = data?.riskData || [
    { name: "Detected", value: 0 },
    { name: "Safe", value: 100 },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full shadow-sm p-6 sm:p-8 flex flex-col h-full min-h-[300px]">
      <h1 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Compliance & Risk Monitoring
      </h1>

      {isLoading ? (
        <div className="grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <div className="flex-grow flex flex-col sm:flex-row gap-2">

          {/* Left: Compliance Flags */}
          <div className="w-full sm:w-1/2 justify-between flex flex-col">
            <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300">
              Compliance Flags Raised
            </h2>
            <span>
              <p className="text-xl font-bold text-gray-900 dark:text-white my-4">
                {flags} flags
              </p>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${flagsPercentage}%` }}
                />
              </div>
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
              Number of calls monitored to ensure outbound numbers are not marked as spam
            </p>
          </div>

          {/* Right: Risk Phrase Detection */}
          <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start">
            <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300">
              Risk Phrase Detection Rate
            </h2>
            <div className="w-40 h-40 relative my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {riskData.map((_: any, index: number) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        stroke={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-800 dark:text-white">
                  {riskRate}%
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 text-center sm:text-left">
              Frequency of sensitive or non-compliant language
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompliance;