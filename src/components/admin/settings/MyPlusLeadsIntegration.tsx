import { useMyPlusLeads } from "@/hooks/useMyPlusLeads";
import { FiX, FiRefreshCw } from "react-icons/fi";
import myplusLogo from "@/assets/myplus.png";
import { useState } from "react";

const MyPlusLeadsIntegration = () => {
  const { config, isLoading, syncNow } = useMyPlusLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex justify-center">
        <FiRefreshCw className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  const isConnected = config?.status === "CONNECTED";

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center p-3 shrink-0">
            <img src={myplusLogo} alt="MyPlusLeads" className="w-full h-full object-contain" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">MyPlusLeads</h3>
              {isConnected && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Connected
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
              Connect your MyPlusLeads account to automatically sync Expired, FSBO, and FRBO leads directly into your dialer in real-time.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:min-w-[150px]">
            {isConnected ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                Manage Settings
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-yellow-400/20 text-sm"
              >
                Connect MyPlusLeads
              </button>
            )}
            {!isConnected && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Setup Required</span>}
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[1300] p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-8 relative border dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <FiX size={18} className="text-gray-600 dark:text-gray-300" />
            </button>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
              Manage MyPlusLeads
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={() => syncNow.mutate()}
                disabled={syncNow.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black transition-all hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiRefreshCw size={13} className={syncNow.isPending ? "animate-spin" : ""} />
                {syncNow.isPending ? "Syncing..." : "Sync Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyPlusLeadsIntegration;
