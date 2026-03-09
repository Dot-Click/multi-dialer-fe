// Data for the Keyword Optimization Score progress bar and legend
const keywordData = [
  { label: "Low", percentage: 25, color: "bg-green-500" },
  { label: "Medium", percentage: 35, color: "bg-yellow-400" },
  { label: "High", percentage: 40, color: "bg-red-500" },
];

const AdminCallOutcome = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full  shadow-sm p-6 sm:p-6">
      <div className="space-y-3">
        {/* Main Title */}
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Call Outcome Intelligence
        </h1>

        {/* Section 1: AI-Predicted Call Outcome */}
        <div className=" pb-8">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            AI-Predicted Call Outcome
          </h2>
          {/* Responsive Grid: 3 columns on large screens, 1 on small */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Appointment Set
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                62%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interested
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                45%
              </p>
            </div>
            {/* Spanning 2 cols on small screens for better centering */}
            <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Not Interested
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                7
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Conversation Quality Score */}
        <div className=" pb-4">
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
              85
              <span className="text-xl text-gray-500 dark:text-gray-400">
                /100
              </span>
            </p>
          </div>
        </div>

        {/* Section 3: Keyword Optimization Score */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Keyword Optimization Score
          </h2>
          {/* Multi-colored Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 flex overflow-hidden">
            {keywordData.map((item) => (
              <div
                key={item.label}
                className={`${item.color} h-4`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
            {keywordData.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 dark:text-gray-300"
              >
                <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                <span>
                  {item.label}: {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCallOutcome;
