import { useDialerHealth, useRefreshDialerHealth } from "@/hooks/useWorkspace";
import { Loader2, RefreshCw } from "lucide-react";

const DialerHealth = () => {
    const { data: dialers, isLoading } = useDialerHealth();
    const { mutate: refresh, isPending: isRefreshing } = useRefreshDialerHealth();

    console.log("dialers", dialers)

    if (isLoading) {
        return (
            <section className='bg-white dark:bg-slate-800 flex flex-col h-fit lg:h-[75vh] items-center justify-center rounded-[32px] w-full'>
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </section>
        );
    }

    return (
        <section className="bg-white dark:bg-slate-800 flex flex-col h-fit lg:h-[75vh] gap-6 rounded-[32px] px-6 py-6 w-full overflow-hidden">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-[20px] text-gray-900 dark:text-white font-bold tracking-tight">
                        Dialer Health
                    </h1>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">Caller ID Reputation</p>
                </div>
                <button
                    onClick={() => refresh()}
                    disabled={isRefreshing}
                    className="p-2.5 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all disabled:opacity-50 group"
                    title="Sync with Twilio"
                >
                    <RefreshCw className={`w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500 transition-colors ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Summary Cards */}
            {dialers && dialers.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50/50 dark:bg-green-500/5 p-3 rounded-2xl border border-green-100/50 dark:border-green-500/10">
                        <span className="text-[10px] font-black text-green-600 dark:text-green-500 uppercase tracking-widest block mb-1">Healthy</span>
                        <span className="text-[20px] font-bold text-gray-900 dark:text-white leading-none">
                            {dialers.filter(d => d.health === 'healthy').length}
                        </span>
                    </div>
                    <div className="bg-red-50/50 dark:bg-red-500/5 p-3 rounded-2xl border border-red-100/50 dark:border-red-500/10">
                        <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest block mb-1">Flagged</span>
                        <span className="text-[20px] font-bold text-gray-900 dark:text-white leading-none">
                            {dialers.filter(d => d.health === 'unhealthy').length}
                        </span>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {dialers && dialers.length > 0 ? (
                    dialers.map((dial) => {
                        const isUnhealthy = dial.health === 'unhealthy';
                        const score = dial.score || 100;

                        return (
                            <div
                                key={dial.id}
                                className="group relative bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4 transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-slate-600"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[14px] font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                                            {dial.name}
                                        </span>
                                        <span className="text-[12px] font-medium text-gray-400 font-mono">
                                            {dial.contact}
                                        </span>
                                    </div>

                                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isUnhealthy
                                            ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                            : 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                        }`}>
                                        {isUnhealthy ? 'SPAM' : 'CLEAN'}
                                    </div>
                                </div>

                                {/* Reputation Bar */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-gray-400 uppercase tracking-tighter">Reputation Score</span>
                                        <span className={isUnhealthy ? 'text-red-500' : 'text-green-500'}>{score}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${isUnhealthy ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                        <RefreshCw className="w-8 h-8 mb-2 text-gray-300" />
                        <p className="text-[13px] font-medium text-gray-400">Syncing with Twilio...</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DialerHealth;
