import { useMyPlusLeads } from "@/hooks/useMyPlusLeads";
import { FiLoader, FiX, FiCopy, FiCheck, FiExternalLink, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-hot-toast";
import myplusLogo from "@/assets/myplus.png";
import { useEffect, useState } from "react";

const MyPlusLeadsIntegration = () => {
  const { config, isLoading, updateConfig, disconnect } = useMyPlusLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (config?.apiKey) {
      setApiKey(config.apiKey);
    }
  }, [config]);

  const handleSave = () => {
    updateConfig.mutate({ apiKey });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Webhook URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

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

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {isConnected ? "Manage MyPlusLeads" : "Connect MyPlusLeads"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">
              Enable real-time lead synchronization from your MyPlusLeads account.
            </p>

            <div className="space-y-6">
              {/* API Key Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">MyPlusLeads API Key</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API Key"
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
                  />
                  <button
                    onClick={handleSave}
                    disabled={updateConfig.isPending || !apiKey}
                    className="px-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-all text-sm disabled:opacity-50"
                  >
                    {updateConfig.isPending ? <FiLoader className="animate-spin" /> : "Save"}
                  </button>
                </div>
              </div>

              {/* Webhook Instructions */}
              {isConnected && config?.webhookUrl && (
                <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                    <FiExternalLink size={16} />
                    <h3>Setup Real-time Push</h3>
                  </div>

                  <p className="text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
                    Paste this URL into your MyPlusLeads portal under <strong>Options {">"} Preferences {">"} Data Integrations</strong>.
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 p-3 rounded-lg font-mono text-[11px] text-gray-600 dark:text-gray-400 truncate">
                      {config.webhookUrl}
                    </div>
                    <button
                      onClick={() => copyToClipboard(config.webhookUrl)}
                      className="p-3 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
                    >
                      {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Status & Disconnect */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Sync</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {config?.lastSyncAt ? new Date(config.lastSyncAt).toLocaleString() : "Never"}
                  </span>
                </div>
                {isConnected && (
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to disconnect MyPlusLeads?")) {
                        disconnect.mutate();
                        setIsModalOpen(false);
                      }
                    }}
                    className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                  >
                    <FiTrash2 size={12} /> Disconnect
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyPlusLeadsIntegration;
