import { CheckCircle2 } from "lucide-react";

export interface SessionSummaryStats {
    totalDialed: number;
    connected: number;
    noAnswer: number;
    voicemail: number;
    badNumber: number;
    dnc: number;
}

interface SessionSummaryModalProps {
    open: boolean;
    durationMs: number;
    stats: SessionSummaryStats;
    onClose: () => void;
}

const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
};

const SessionSummaryModal = ({ open, durationMs, stats, onClose }: SessionSummaryModalProps) => {
    if (!open) return null;

    const contactRate = stats.totalDialed > 0
        ? ((stats.connected / stats.totalDialed) * 100).toFixed(1)
        : "0.0";

    const rows = [
        { label: "Session Time", value: formatDuration(durationMs), icon: "" },
        { label: "Total Dialed", value: stats.totalDialed, icon: "" },
        { label: "Connected", value: stats.connected, icon: "OK" },
        { label: "No Answer", value: stats.noAnswer, icon: "NA" },
        { label: "Voicemail", value: stats.voicemail, icon: "VM" },
        { label: "Bad Number", value: stats.badNumber, icon: "BAD" },
        { label: "DNC", value: stats.dnc, icon: "DNC" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-col items-center border-b border-gray-100 px-6 py-6 text-center dark:border-slate-700">
                    <CheckCircle2 className="mb-3 h-12 w-12 text-[#FFCA06]" />
                    <h2 className="text-xl font-black uppercase tracking-wide text-gray-900 dark:text-white">
                        Session Complete
                    </h2>
                    <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Here's how your session went
                    </p>
                </div>

                <div className="divide-y divide-gray-100 px-6 dark:divide-slate-700">
                    {rows.map((row) => (
                        <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-4 py-3">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                {row.label}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                                <span className="text-[#FFCA06]">{row.value}</span>
                                {row.icon && (
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-500 dark:bg-slate-700 dark:text-gray-300">
                                        {row.icon}
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-100 px-6 py-5 dark:border-slate-700">
                    <div className="mb-4 rounded-xl bg-yellow-50 px-4 py-3 dark:bg-yellow-900/20">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-gray-700 dark:text-gray-200">
                                Contact Rate
                            </span>
                            <span className="text-lg font-black text-[#FFCA06]">{contactRate}%</span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                            connected / totalDialed * 100
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-[#0E1011] px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-black"
                    >
                        Close Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionSummaryModal;
