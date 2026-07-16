import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { FiPhoneCall, FiClock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import api from "@/lib/axios";
import type { DueCallback } from "@/hooks/useCallbackDue";

interface CallbackDueModalProps {
    dueCallbacks: DueCallback[];
    // Parent owns Twilio/dialer state, so "Call Now" is delegated up — the
    // parent decides the caller ID, purges the contact from the live queue,
    // and starts the call via useTwilio().
    onCallNow: (callback: DueCallback) => void | Promise<void>;
    // Called once an action (call now / snooze / complete) has resolved for a
    // callback, so the parent's due-callbacks list drops it immediately
    // instead of waiting for the next 30s poll.
    onResolved: (id: string) => void;
}

const getContactName = (cb: DueCallback) => cb.contact?.fullName || cb.lead?.fullName || "Unknown Contact";

const getDialablePhone = (cb: DueCallback) => {
    const phones = cb.contact?.phones || [];
    const dialable = phones.filter((p) => p.isValid !== false && !p.isDnc);
    return dialable.find((p) => p.isPrimary)?.number || dialable[0]?.number || null;
};

const getOverdueLabel = (scheduledAt: string) => {
    const diffMinutes = dayjs().diff(dayjs(scheduledAt), "minute");
    if (diffMinutes <= 0) return `Due in ${Math.abs(diffMinutes)} min`;
    if (diffMinutes < 60) return `${diffMinutes} min overdue`;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `${hours}h ${mins}m overdue`;
};

const CallbackDueModal = ({ dueCallbacks, onCallNow, onResolved }: CallbackDueModalProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [busyAction, setBusyAction] = useState<"call" | "snooze" | "complete" | null>(null);
    const wasVisibleRef = useRef(false);

    const isVisible = dueCallbacks.length > 0;
    // Clamp in case the array shrank (e.g. a callback resolved elsewhere) while
    // the agent was looking at a later card.
    const current = isVisible ? dueCallbacks[Math.min(activeIndex, dueCallbacks.length - 1)] : null;

    useEffect(() => {
        if (activeIndex >= dueCallbacks.length && dueCallbacks.length > 0) {
            setActiveIndex(dueCallbacks.length - 1);
        }
    }, [dueCallbacks.length, activeIndex]);

    // Pause the dialer the instant the interrupt appears, and let it resume
    // (agent-ready pulls the next queued lead) once every due callback has
    // been resolved. "Call Now" is the one exception — the parent is about to
    // start a manual call, so resuming the auto-queue there would race it.
    useEffect(() => {
        if (isVisible && !wasVisibleRef.current) {
            wasVisibleRef.current = true;
            api.post("/calling/stop-dialing").catch((err) => {
                console.warn("[CallbackDueModal] Failed to pause dialer:", err);
            });
        } else if (!isVisible && wasVisibleRef.current) {
            wasVisibleRef.current = false;
            api.post("/calling/agent-ready").catch((err) => {
                console.warn("[CallbackDueModal] Failed to resume dialer:", err);
            });
        }
    }, [isVisible]);

    if (!current) return null;

    const contactName = getContactName(current);
    const phone = getDialablePhone(current);

    const handleCallNow = async () => {
        setBusyAction("call");
        try {
            await onCallNow(current);
        } catch (err) {
            console.error("[CallbackDueModal] onCallNow failed:", err);
            toast.error("Failed to start the call.");
        } finally {
            setBusyAction(null);
            onResolved(current.id);
        }
    };

    const handleSnooze = async () => {
        setBusyAction("snooze");
        try {
            await api.patch(`/callbacks/${current.id}/snooze`);
            toast.success("Callback snoozed for 5 minutes");
            onResolved(current.id);
        } catch (err) {
            console.error("[CallbackDueModal] Snooze failed:", err);
            toast.error("Failed to snooze this callback.");
        } finally {
            setBusyAction(null);
        }
    };

    const handleComplete = async () => {
        setBusyAction("complete");
        try {
            await api.patch(`/callbacks/${current.id}/complete`);
            toast.success("Callback marked complete");
            onResolved(current.id);
        } catch (err) {
            console.error("[CallbackDueModal] Complete failed:", err);
            toast.error("Failed to mark this callback complete.");
        } finally {
            setBusyAction(null);
        }
    };

    const busy = busyAction !== null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-red-500 animate-in fade-in zoom-in duration-200">
                {/* Urgent header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 px-6 py-4 flex items-center gap-3">
                    <FiAlertTriangle className="text-white shrink-0 animate-pulse" size={24} />
                    <div>
                        <p className="text-white font-black uppercase tracking-widest text-xs">Callback Due</p>
                        <p className="text-white/90 text-[11px] font-medium">
                            {dueCallbacks.length > 1 ? `${activeIndex + 1} of ${dueCallbacks.length} callbacks due` : "Your dialer is paused"}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{contactName}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                            {phone || "No dialable phone number on file"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                        <FiClock className="text-red-500 shrink-0" size={16} />
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                            {getOverdueLabel(current.scheduledAt)}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                            Scheduled {dayjs(current.scheduledAt).format("MMM D, h:mm A")}
                        </span>
                    </div>

                    {current.notes && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 rounded-xl p-3 leading-relaxed">
                            {current.notes}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-2 mt-2">
                        <button
                            onClick={handleCallNow}
                            disabled={busy || !phone}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[#FFCA06] hover:bg-[#ffcf29] text-[#2B3034] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            <FiPhoneCall size={16} />
                            {busyAction === "call" ? "Starting Call…" : "Call Now"}
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSnooze}
                                disabled={busy}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <FiClock size={14} />
                                {busyAction === "snooze" ? "Snoozing…" : "Snooze 5 min"}
                            </button>
                            <button
                                onClick={handleComplete}
                                disabled={busy}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <FiCheckCircle size={14} />
                                {busyAction === "complete" ? "Saving…" : "Mark Complete"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallbackDueModal;
