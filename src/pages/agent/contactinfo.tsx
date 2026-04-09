import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContactById, setQueue } from '@/store/slices/contactSlice';
import CallSection from '@/components/agent/contactinfo/callsection';
import ContactInfoCallSentiment from '@/components/agent/contactinfo/contactinfocallsentiment';
import ContactInfoHeader from '@/components/agent/contactinfo/contactinfoheader';
import ContactInfoScript from '@/components/admin/contactinfo/contactinfoscript';
import LiveContactScript from '@/components/admin/contactinfo/livecallscript';
import BottomContactDetail from '@/components/agent/contactdetail/bottomcontactdetail';
import Detail from '@/components/agent/contactdetail/detail';
import { useTwilio } from '@/providers/twilio.provider';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CallerIdStatus {
    callCount: number;
    isFrozen: boolean;
    unfreezeAt: number | null;
    secondsRemaining: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_DAILY_LIMIT = 25;
const POLL_INTERVAL_MS = 30_000;

// ─── Component ────────────────────────────────────────────────────────────────

const ContactInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { queue, currentContact } = useAppSelector((state) => state.contacts);
    const { role } = useAppSelector((state) => state.auth);
    const settingsInfo = location.state?.settingsInfo;

    const { setAnsweringMachineUrl, activeBridgeContactId } = useTwilio();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [callerIds, setCallerIds] = useState<string[]>([]);
    const [currentCallerId, setCurrentCallerId] = useState<string | null>(null);
    const [dailyCallsCount, setDailyCallsCount] = useState(0);
    const [scriptId, setScriptId] = useState<string | null>(location.state?.selectedScript || null);
    const dialerMode = location.state?.dialerMode || "manual";
    const [isAutoDialing, setIsAutoDialing] = useState(false);
    const maxCallsPerId = location.state?.numberOfLines || 5;

    // Cooldown state from backend
    const [callerIdStatus, setCallerIdStatus] = useState<Record<string, CallerIdStatus>>({});
    const [contactStatuses, setContactStatuses] = useState<Record<string, string>>({});
    const [hasStarted, setHasStarted] = useState(false);
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ─── Backend sync ─────────────────────────────────────────────────────────

    const fetchCooldownStatus = useCallback(async (numbers: string[]) => {
        if (numbers.length === 0) return;
        try {
            const { data } = await api.get('/system-settings/caller-id/status', {
                params: { numbers: numbers.join(',') },
            });
            if (data.success) setCallerIdStatus(data.data);
        } catch (err) {
            console.warn('[ContactInfo] Cooldown poll failed:', err);
        }
    }, []);

    const startPolling = useCallback((numbers: string[]) => {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        pollTimerRef.current = setInterval(() => fetchCooldownStatus(numbers), POLL_INTERVAL_MS);
    }, [fetchCooldownStatus]);

    useEffect(() => {
        if (queue.length > 0) setHasStarted(true);
    }, [queue.length]);

    useEffect(() => {
        if (hasStarted && queue.length === 0) {
            toast.success("All contacts processed! Returning to dialer...", { icon: '🏁' });
            const path = role === 'ADMIN' ? '/admin/data-dialer' : '/data-dialer';
            navigate(path);
        }
    }, [hasStarted, queue.length, navigate, role]);

    useEffect(() => () => { if (pollTimerRef.current) clearInterval(pollTimerRef.current); }, []);

    // ─── Init from navigation state ───────────────────────────────────────────

    useEffect(() => {
        const selectedContacts  = location.state?.contacts;
        const incomingCallerIds = location.state?.callerIds;
        const amUrl = location.state?.answeringMachineRecordingUrl;

        if (amUrl) setAnsweringMachineUrl(amUrl);
        if (location.state?.selectedScript) setScriptId(location.state.selectedScript);
        if (selectedContacts?.length > 0) { dispatch(setQueue(selectedContacts)); setCurrentIndex(0); }

        const ids: string[] =
            Array.isArray(incomingCallerIds) && incomingCallerIds.length > 0
                ? incomingCallerIds
                : location.state?.callerId
                    ? [location.state.callerId]
                    : [];

        if (ids.length > 0) {
            setCallerIds(ids);
            fetchCooldownStatus(ids);
            startPolling(ids);
        }
    }, [location.state]);

    // Pick initial callerId once status loads
    useEffect(() => {
        if (callerIds.length === 0 || currentCallerId) return;
        const now = Date.now();
        const first = callerIds.find((cid) => {
            const s = callerIdStatus[cid];
            if (!s) return true;
            return !s.isFrozen || (s.unfreezeAt && now >= s.unfreezeAt);
        });
        if (first) setCurrentCallerId(first);
    }, [callerIds, callerIdStatus, currentCallerId]);

    // ─── Queue nav ────────────────────────────────────────────────────────────

    useEffect(() => {
        if (queue.length > 0 && queue[currentIndex]) dispatch(fetchContactById(queue[currentIndex].id));
    }, [currentIndex, queue, dispatch]);

    const handleNextContact = () => { if (currentIndex < queue.length - 1) setCurrentIndex((p) => p + 1); };
    const handlePreviousContact = () => { if (currentIndex > 0) setCurrentIndex((p) => p - 1); };

    // ─── Power Dialer Logic ───────────────────────────────────────────────────

    // Sync UI when the backend bridge answers a specific contact
    useEffect(() => {
        if (activeBridgeContactId && queue.length > 0) {
            const foundIdx = queue.findIndex(c => (c as any).id === activeBridgeContactId);
            if (foundIdx !== -1 && foundIdx !== currentIndex) {
                toast(`Connected to ${queue[foundIdx].name || queue[foundIdx].fullName || "Contact"}!`, { icon: '📞' });
                setCurrentIndex(foundIdx);
            }
        }
    }, [activeBridgeContactId, queue]);

    // REAL-TIME CALL STATUS POLLING
    useEffect(() => {
        let statusPoll: any;
        if (isAutoDialing) {
            statusPoll = setInterval(async () => {
                try {
                    const { data } = await api.get('/calling/status');
                    if (data.success && data.data.callStatuses) {
                        setContactStatuses(prev => {
                            const next = { ...prev };
                            const liveStatuses: { contactId: string; status: string }[] = data.data.callStatuses;
                            
                            // Map of IDs in current poll
                            const liveIds = new Set(liveStatuses.map(s => s.contactId));

                            // 1. Update from live server data
                            liveStatuses.forEach(s => {
                                if (s.status === 'in-progress' || s.status === 'answered') {
                                    next[s.contactId] = 'answered';
                                } else if (s.status === 'ringing' || s.status === 'initiated') {
                                    next[s.contactId] = 'ringing';
                                }
                            });

                            // 2. Detect completions/failures for contacts that left the server list
                            Object.keys(prev).forEach(id => {
                                if (!liveIds.has(id)) {
                                    // If it was already answered, keep it answered (Green)
                                    // If it was ringing and now it's gone without being answered, it's failed (Red)
                                    if (prev[id] === 'ringing') {
                                        next[id] = 'failed';
                                    }
                                }
                            });

                            return next;
                        });
                    }
                } catch (err) {
                    console.warn('[ContactInfo] Status poll failed');
                }
            }, 2000);
        } else {
            setContactStatuses({}); // Reset on stop
        }
        return () => clearInterval(statusPoll);
    }, [isAutoDialing]);

    const startSimultaneousDialing = async () => {
        if (isAutoDialingRef.current) {
            return;
        }

        if (!currentCallerId) {
            toast.error("No caller ID available for power dialer.");
            return;
        }

        isAutoDialingRef.current = true;
        toast.loading("Starting simultaneous dialer...", { id: "powerDialer" })
        try {
            const leadsPayload = queue.slice(currentIndex).map((c: any, idx: number) => ({
                fullName: c.name || c.fullName,
                phone: c.phones?.find((p: any) => p.isPrimary)?.number || c.phones?.[0]?.number || c.phone,
                email: c.emails?.[0]?.email || c.email,
                priority: queue.length - idx,
                id: c.id
            }));
            await api.post('/calling/leads', { leads: leadsPayload, callerIds });
            toast.success("Simultaneous Power Dialer Active", { id: "powerDialer" });
            setIsAutoDialing(true);
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Failed to start power dialer", { id: "powerDialer" });
            setIsAutoDialing(false);
            isAutoDialingRef.current = false;
        }
    }

    const stopSimultaneousDialing = async () => {
        try {
            await api.post('/calling/stop-dialing');
            toast.success("Power Dialer Stopped");
            setIsAutoDialing(false);
            isAutoDialingRef.current = false;
        } catch (e) {
            toast.error("Failed to stop dialer");
        }
    }

    const isAutoDialingRef = useRef(false);

    // Stop dialing if the agent navigates away from this page
    useEffect(() => {
        return () => {
            if (isAutoDialingRef.current) {
                api.post('/calling/stop-dialing').catch(() => {});
            }
        };
    }, []);

    // ─── Rotation ─────────────────────────────────────────────────────────────

    const rotateCallerId = useCallback((): string | null => {
        if (dailyCallsCount >= TOTAL_DAILY_LIMIT) {
            toast.error(`Daily limit of ${TOTAL_DAILY_LIMIT} calls reached!`);
            return null;
        }

        const now = Date.now();

        // Can we keep using the current ID?
        if (currentCallerId) {
            const s = callerIdStatus[currentCallerId];
            if (!s?.isFrozen && (s?.callCount ?? 0) < maxCallsPerId) {
                return currentCallerId;
            }
        }

        // Find next available ID
        const startIdx = currentCallerId
            ? (callerIds.indexOf(currentCallerId) + 1) % callerIds.length
            : 0;

        for (let i = 0; i < callerIds.length; i++) {
            const idx = (startIdx + i) % callerIds.length;
            const cid = callerIds[idx];
            const s = callerIdStatus[cid];
            const available = !s?.isFrozen || (s.unfreezeAt && now >= s.unfreezeAt);
            if (available) {
                setCurrentCallerId(cid);
                return cid;
            }
        }

        const minSecs = Math.min(...callerIds.map((cid) => callerIdStatus[cid]?.secondsRemaining ?? 0).filter((s) => s > 0));
        toast.error(`All Caller IDs on cooldown. Next in ~${Math.ceil(minSecs / 60)} min.`);
        return null;
    }, [callerIds, currentCallerId, callerIdStatus, dailyCallsCount, maxCallsPerId]);

    // ─── onCallStarted — receives the actual fromNumber used ─────────────────
    // FIX: fromNumber is passed in directly from handleCallToggle,
    // so we never read stale React state for currentCallerId.

    const onCallStarted = useCallback(async (fromNumber: string) => {
        setDailyCallsCount((prev) => prev + 1);

        // Optimistically update local status before BE responds
        setCallerIdStatus((prev) => {
            const current = prev[fromNumber] ?? { callCount: 0, isFrozen: false, unfreezeAt: null, secondsRemaining: 0 };
            const newCount = current.callCount + 1;
            const willFreeze = newCount >= maxCallsPerId;
            const unfreezeAt = willFreeze ? Date.now() + 20 * 60 * 1000 : current.unfreezeAt;
            return {
                ...prev,
                [fromNumber]: {
                    callCount: newCount,
                    isFrozen: willFreeze,
                    unfreezeAt: willFreeze ? unfreezeAt : null,
                    secondsRemaining: willFreeze ? 20 * 60 : 0,
                },
            };
        });

        // Persist to backend
        try {
            const { data } = await api.post('/system-settings/caller-id/use', {
                callerNumber: fromNumber,
                maxCallsPerCid: maxCallsPerId,
            });

            if (data.success) {
                const result = data.data;

                // Sync local state with authoritative BE response
                setCallerIdStatus((prev) => ({
                    ...prev,
                    [fromNumber]: {
                        callCount: result.callCount,
                        isFrozen: result.isFrozen,
                        unfreezeAt: result.unfreezeAt,
                        secondsRemaining: result.secondsRemaining,
                    },
                }));

                if (result.rotated) {
                    toast(`Caller ID ${fromNumber} is now on a 20-min cooldown.`);
                    // Advance to next available ID
                    const next = rotateCallerId();
                    if (next && next !== fromNumber) setCurrentCallerId(next);
                }
            }
        } catch (err) {
            console.error('[ContactInfo] Failed to persist callerId usage:', err);
            // Optimistic update stays in place — next poll will correct it
        }
    }, [maxCallsPerId, rotateCallerId]);

    // ─── Debug stats ──────────────────────────────────────────────────────────

    const currentStatus = currentCallerId ? (callerIdStatus[currentCallerId] ?? null) : null;
    const callsMadeCurrent = currentStatus?.callCount ?? 0;

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
            <ContactInfoHeader
                contact={currentContact}
                onNext={handleNextContact}
                onPrev={handlePreviousContact}
                currentIndex={currentIndex}
                totalContacts={queue.length}
                callerId={currentCallerId}
                onPickNextCallerId={rotateCallerId}
                onCallStarted={onCallStarted}
                dailyCount={dailyCallsCount}
                dailyLimit={TOTAL_DAILY_LIMIT}
                onholdUrl={settingsInfo?.find((s: any) => s.type === 'General Recording')?.url}
                dialerMode={dialerMode}
                autoDial={isAutoDialing}
                onStartSimultaneousDialer={startSimultaneousDialing}
                onStopSimultaneousDialer={stopSimultaneousDialing}
            />

            <div className="w-full flex flex-col lg:flex-row gap-4 p-4 lg:h-[calc(100vh-80px)] overflow-hidden">
                {/* Left Column (Main Content) - Scrollable */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-10">
                    <CallSection contactStatuses={contactStatuses} />
                    <Detail onNext={handleNextContact} />
                    <BottomContactDetail />
                </div>

                {/* Right Column (Sidebar) - Scrollable if needed */}
                <div className="w-full lg:w-[420px] flex flex-col gap-4 h-full overflow-y-auto no-scrollbar pb-10">
                    <div className="flex flex-col gap-4">
                        <ContactInfoScript scriptId={scriptId} />
                        <LiveContactScript contactId={currentContact?.id} scriptId={scriptId} />
                        <ContactInfoCallSentiment />
                    </div>
                </div>
            </div>

            {/* Session Stats Overlay */}
            <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-50 text-[12px]">
                <p className="font-bold text-gray-700 dark:text-gray-200">Session Stats</p>
                <div className="mt-1 space-y-0.5">
                    <p className="text-gray-500">Today: <span className="text-black dark:text-white font-medium">{dailyCallsCount}/{TOTAL_DAILY_LIMIT}</span></p>
                    <p className="text-gray-500">Current ID Calls: <span className="text-black dark:text-white font-medium">{callsMadeCurrent}/{maxCallsPerId}</span></p>
                    <p className="text-gray-500 truncate max-w-[150px]">Current ID: <span className="text-yellow-500 font-medium">{currentCallerId || 'None'}</span></p>
                    {currentStatus?.isFrozen && (
                        <p className="text-red-500 font-medium">Frozen: {Math.ceil((currentStatus.secondsRemaining ?? 0) / 60)}m left</p>
                    )}
                    {callerIds.length > 1 && (
                        <div className="mt-1 pt-1 border-t border-gray-100 dark:border-slate-700 space-y-0.5">
                            {callerIds.map((cid) => {
                                const s = callerIdStatus[cid];
                                return (
                                    <p key={cid} className="truncate max-w-[150px]">
                                        <span className={s?.isFrozen ? 'text-red-400' : 'text-green-400'}>●</span>{' '}
                                        <span className="text-gray-400">{cid.slice(-4)}</span>
                                        {s?.isFrozen && <span className="text-red-400"> {Math.ceil((s.secondsRemaining ?? 0) / 60)}m</span>}
                                    </p>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
