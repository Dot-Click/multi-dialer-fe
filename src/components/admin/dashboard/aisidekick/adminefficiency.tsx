//   import { useState, useEffect } from "react";
// import axios from "@/lib/axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { useEfficiency } from "@/hooks/useAiSidekick";

const COLORS = ["#22C55E", "#E5E7EB"];

const AdminEfficiency = () => {
  const { data, isLoading } = useEfficiency();


  const timeSaved = data?.timeSaved || 0;
  const tasksAutomated = data?.tasksAutomated || 0;
  const tasksAutomatedPercentage = data?.tasksAutomatedPercentage || 0;
  const aiHandledPercentage = data?.aiHandled?.percentage || 0;
  const aiHandledData = data?.aiHandled?.data || [
    { name: "Handled", value: 0 },
    { name: "Not Handled", value: 100 },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full shadow-sm p-6 flex flex-col h-full min-h-[300px]">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-8">
        Efficiency & Automation
      </h1>

      {isLoading ? (
        <div className="grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <>
          {/* Time Saved */}
          <div className="flex justify-between items-center border-b dark:border-slate-700 pb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Time Saved via AI
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minutes saved from auto-logging, voicemail drops, etc.
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
              {timeSaved}<span className="text-2xl font-semibold"> min</span>
            </p>
          </div>

          {/* Automation Stats */}
          <div className="grow flex flex-col sm:flex-row gap-5 mt-4">

            {/* Tasks Automated */}
            <div className="w-full sm:w-1/2 flex flex-col">
              <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                Tasks Automated by AI
              </h2>
              <div className="mt-10">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tasksAutomated} tasks
                </p>
                <p className="text-2xl text-gray-800 dark:text-gray-200 font-medium -mt-1">
                  automated
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mt-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${tasksAutomatedPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3">
                Number of CRM updates, follow-ups, summaries handled by AI
              </p>
            </div>

            {/* AI-Handled Conversations */}
            <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start">
              <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                AI-Handled Conversations
              </h2>
              <div className="w-40 h-40 relative my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiHandledData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={65}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {aiHandledData.map((_: any, index: number) => (
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
                    {aiHandledPercentage}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto text-center sm:text-left">
                % of calls where AI managed parts of the interaction
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEfficiency;