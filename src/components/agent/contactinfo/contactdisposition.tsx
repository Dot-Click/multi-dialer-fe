import { useState } from "react";

const dispositions = ["Wrong Number", "Not Interested", "Answering Machine", "Got Sale", "DNC", "Call Back"];
const groups = ["Hot", "Warm", "Nurture", "Working"];
// const checkboxItems = ["Permission", "Want", "Why", "Status Quo", "Timeline", "Agent"];

const ContactDisposition = () => {
  const [activeGroup, setActiveGroup] = useState("Working");
//   const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

//   const toggleCheck = (item: string) => {
//     setCheckedItems(prev => {
//       const next = new Set(prev);
//       next.has(item) ? next.delete(item) : next.add(item);
//       return next;
//     });
//   };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 w-full">

      {/* Dispositions */}
      <div className="mb-5">
        <p className="text-md font-bold text-gray-500 dark:text-gray-400 mb-3">Dispositions:</p>
        <div className="flex flex-wrap gap-2">
          {dispositions.map((d) => (
            <button
              key={d}
              className="px-4 py-1.5 text-md rounded-full border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Group */}
      <div className="mb-6">
        <p className="text-md font-bold  dark:text-gray-400 mb-3">Group:</p>
        <div className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-4 py-1.5 text-md rounded-full border transition-colors
                ${activeGroup === g
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                  : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      {/* <div className="border-t border-gray-200 dark:border-slate-700 pt-5">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {checkboxItems.map((item) => (
            <label
              key={item}
              onClick={() => toggleCheck(item)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                ${checkedItems.has(item)
                  ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
                  : "border-gray-400 dark:border-slate-500 bg-white dark:bg-slate-800"
                }`}
              >
                {checkedItems.has(item) && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <polyline
                      points="1.5,5.5 4.5,8.5 9.5,2.5"
                      stroke={`${checkedItems.has(item) ? "white" : "transparent"}`}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="dark:stroke-gray-900"
                    />
                  </svg>
                )}
              </div>
              <span className="text-[12px] text-gray-600 dark:text-gray-400 text-center">{item}</span>
            </label>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ContactDisposition;