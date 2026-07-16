import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/axios";

export type CallbackStatus = "PENDING" | "DUE" | "COMPLETED" | "MISSED" | "CANCELLED";

export interface DueCallbackContact {
    id: string;
    fullName: string;
    phones?: { number: string; isPrimary: boolean; isValid?: boolean; isDnc?: boolean }[];
}

export interface DueCallback {
    id: string;
    contactId: string | null;
    leadId: string | null;
    agentId: string;
    scheduledAt: string;
    notes: string | null;
    status: CallbackStatus;
    contact?: DueCallbackContact | null;
    lead?: { id: string; fullName: string } | null;
}

const POLL_INTERVAL_MS = 30_000;

/**
 * Polls GET /callbacks/due every 30s so the dialer can interrupt the agent
 * the moment a scheduled callback comes due. Only polls while `enabled` is
 * true (i.e. the agent is in an active dialing session) — no point hitting
 * this endpoint when nobody's dialing.
 */
export const useCallbackDue = (enabled: boolean) => {
    const [dueCallbacks, setDueCallbacks] = useState<DueCallback[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchDueCallbacks = useCallback(async () => {
        try {
            const { data } = await api.get("/callbacks/due");
            if (data?.success) {
                setDueCallbacks(data.data || []);
            }
        } catch (err) {
            // Non-blocking — a failed poll should never interrupt the dialer itself.
            console.warn("[useCallbackDue] Poll failed:", err);
        }
    }, []);

    // Drop a callback from local state once the agent has acted on it
    // (call now / snooze / complete) without waiting for the next poll.
    const removeDueCallback = useCallback((id: string) => {
        setDueCallbacks((prev) => prev.filter((c) => c.id !== id));
    }, []);

    useEffect(() => {
        if (!enabled) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setDueCallbacks([]);
            return;
        }

        fetchDueCallbacks();
        timerRef.current = setInterval(fetchDueCallbacks, POLL_INTERVAL_MS);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [enabled, fetchDueCallbacks]);

    return { dueCallbacks, refetchDueCallbacks: fetchDueCallbacks, removeDueCallback };
};
