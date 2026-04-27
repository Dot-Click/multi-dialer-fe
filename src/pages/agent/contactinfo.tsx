import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContactById, setQueue } from '@/store/slices/contactSlice';
import CallSection from '@/components/agent/contactinfo/callsection';
import ContactInfoCallSentiment from '@/components/agent/contactinfo/contactinfocallsentiment';
import ContactInfoHeader from '@/components/agent/contactinfo/contactinfoheader';
import BottomContactDetail from '@/components/agent/contactdetail/bottomcontactdetail';
import ActionPanel from '@/components/agent/contactinfo/actionpanel';
import OutcomeRow from '@/components/agent/contactinfo/outcomerow';
import ScriptTabs from '@/components/agent/contactinfo/scripttabs';
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

    const { setAnsweringMachineUrl, incomingContactId } = useTwilio();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [callerIds, setCallerIds] = useState<string[]>([]);
    const [currentCallerId, setCurrentCallerId] = useState<string | null>(null);
    const [dailyCallsCount, setDailyCallsCount] = useState(0);
    const [scriptId, setScriptId] = useState<string | null>(location.state?.selectedScript || null);
    const dialerMode = location.state?.dialerMode || "manual";
    const [isAutoDialing, setIsAutoDialing] = useState(false);
    const maxCallsPerId = location.state?.numberOfLines || 5;
    const pacing: number | undefined = location.state?.pacing;

    const [callerIdStatus, setCallerIdStatus] = useState<Record<string, CallerIdStatus>>({});
    const [leadStatuses, setLeadStatuses] = useState<Record<string, string>>({});
    const [leadSids, setLeadSids] = useState<Record<string, string>>({});
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isAutoDialingRef = useRef(isAutoDialing);
    const emptyCountRef = useRef(0);

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
        let statusPoll: any;
        if (isAutoDialing) {
            statusPoll = setInterval(async () => {
                try {
                    const { data } = await api.get('/calling/status');
                    if (data.success) {
                        if (data.data.leadStatuses) setLeadStatuses(data.data.leadStatuses);
                        if (data.data.leadSids) setLeadSids(data.data.leadSids);
                        const hasPendingCallbacks = Object.values(data.data.leadStatuses || {}).some(
                            (s: any) => s.toLowerCase() === 'callback' || s.toLowerCase() === 'call_back'
                        );
                        const isTrulyEmpty = data.data.queueSize === 0 &&
                            data.data.activeCallsCount === 0 &&
                            (data.data.pendingRedialsCount || 0) === 0 &&
                            !hasPendingCallbacks;

                        if (isTrulyEmpty) {
                            // Grace period: require 3 consecutive empty polls (6 seconds)
                            // before declaring the session finished.
                            emptyCountRef.current = (emptyCountRef.current || 0) + 1;
                            if (emptyCountRef.current >= 3) {
                                clearInterval(statusPoll);
                                toast.success("All contacts processed!", { icon: '🏁' });
                                setIsAutoDialing(false);
                                isAutoDialingRef.current = false;
                                const path = role === 'ADMIN' ? '/admin/data-dialer' : '/data-dialer';
                                navigate(path);
                            }
                        } else {
                            emptyCountRef.current = 0;
                        }
                    }
                } catch (e) {
                    console.warn('[ContactInfo] Status poll failed');
                }
            }, 2000);
        }
        return () => { if (statusPoll) clearInterval(statusPoll); };
    }, [isAutoDialing, navigate, role]);

    // ─── Init from navigation state ───────────────────────────────────────────

    useEffect(() => {
        const selectedContacts = location.state?.contacts;
        const incomingCallerIds = location.state?.callerIds;
        const amUrl = location.state?.answeringMachineRecordingUrl;

        if (amUrl) setAnsweringMachineUrl(amUrl);
        if (location.state?.selectedScript) setScriptId(location.state.selectedScript);
        if (selectedContacts?.length > 0) { dispatch(setQueue(selectedContacts)); setCurrentIndex(0); }

        const ids: string[] =
            Array.isArray(incomingCallerIds) && incomingCallerIds.length > 0
                ? incomingCallerIds
                : location.state?.callerId ? [location.state.callerId] : [];

        if (ids.length > 0) {
            setCallerIds(ids);
            fetchCooldownStatus(ids);
            startPolling(ids);
        }
    }, [location.state]);

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

    useEffect(() => {
        if (incomingContactId && queue.length > 0) {
            const foundIdx = queue.findIndex(c => (c as any).id === incomingContactId);
            if (foundIdx !== -1 && foundIdx !== currentIndex) {
                toast(`Connected to ${queue[foundIdx].name || queue[foundIdx].fullName || "Contact"}!`, { icon: '📞' });
                setCurrentIndex(foundIdx);
            }
        }
    }, [incomingContactId, queue]);

    const startSimultaneousDialing = async () => {
        if (isAutoDialingRef.current || !currentCallerId) return;
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
            await api.post('/calling/leads', { leads: leadsPayload, callerIds, pacing });
            toast.success("Simultaneous Power Dialer Active", { id: "powerDialer" });
            setIsAutoDialing(true);
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Failed", { id: "powerDialer" });
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

    useEffect(() => {
        const handleUnload = () => {
            if (isAutoDialingRef.current) {
                fetch(`${api.defaults.baseURL}/calling/stop-dialing`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': api.defaults.headers.common['Authorization'] as string },
                    keepalive: true
                }).catch(() => { });
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            if (isAutoDialingRef.current) api.post('/calling/stop-dialing').catch(() => { });
        };
    }, []);

    // ─── Rotation ─────────────────────────────────────────────────────────────

    const rotateCallerId = useCallback((): string | null => {
        if (dailyCallsCount >= TOTAL_DAILY_LIMIT) {
            toast.error(`Daily limit reached!`);
            return null;
        }
        const now = Date.now();
        if (currentCallerId) {
            const s = callerIdStatus[currentCallerId];
            if (!s?.isFrozen && (s?.callCount ?? 0) < maxCallsPerId) return currentCallerId;
        }
        const startIdx = currentCallerId ? (callerIds.indexOf(currentCallerId) + 1) % callerIds.length : 0;
        for (let i = 0; i < callerIds.length; i++) {
            const idx = (startIdx + i) % callerIds.length;
            const cid = callerIds[idx];
            const s = callerIdStatus[cid];
            if (!s?.isFrozen || (s.unfreezeAt && now >= s.unfreezeAt)) {
                setCurrentCallerId(cid);
                return cid;
            }
        }
        return null;
    }, [callerIds, currentCallerId, callerIdStatus, dailyCallsCount, maxCallsPerId]);

    const onCallStarted = useCallback(async (fromNumber: string) => {
        setDailyCallsCount((prev) => prev + 1);
        setCallerIdStatus((prev) => {
            const current = prev[fromNumber] ?? { callCount: 0, isFrozen: false, unfreezeAt: null, secondsRemaining: 0 };
            const newCount = current.callCount + 1;
            const willFreeze = newCount >= maxCallsPerId;
            return { ...prev, [fromNumber]: { ...current, callCount: newCount, isFrozen: willFreeze, secondsRemaining: willFreeze ? 1200 : 0 } };
        });
        try {
            const { data } = await api.post('/system-settings/caller-id/use', { callerNumber: fromNumber, maxCallsPerCid: maxCallsPerId });
            if (data.success) {
                const res = data.data;
                setCallerIdStatus(prev => ({ ...prev, [fromNumber]: { ...prev[fromNumber], ...res } }));
                if (res.rotated) {
                    toast(`Caller ID ${fromNumber} on cooldown.`);
                    const next = rotateCallerId();
                    if (next && next !== fromNumber) setCurrentCallerId(next);
                }
            }
        } catch (err) { console.error(err); }
    }, [maxCallsPerId, rotateCallerId]);

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="bg-gray-100 dark:bg-slate-900 h-screen overflow-hidden flex flex-col">
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

            <main className="flex-1 overflow-hidden p-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
                    {/* Left Column (Main Info) - 8/12 width */}
                    <div className="lg:col-span-8 flex flex-col gap-4 h-full overflow-hidden">
                        <div className="shrink-0">
                            <CallSection leadStatuses={leadStatuses} leadSids={leadSids} />
                        </div>
                        <div className="shrink-0">
                            <OutcomeRow onNext={handleNextContact} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <BottomContactDetail />
                        </div>
                    </div>

                    {/* Right Column (Sidebar) - 4/12 width */}
                    <div className="lg:col-span-4 flex flex-col gap-4 h-full overflow-y-auto no-scrollbar pb-10">
                        <ActionPanel />
                        <ScriptTabs scriptId={scriptId} contactId={currentContact?.id} />
                        <ContactInfoCallSentiment />

                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Session Health</h4>

                            <div className="space-y-4">
                                {/* Daily Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-500 uppercase tracking-tighter">Daily Progress</span>
                                        <span className="text-gray-900 dark:text-white">{dailyCallsCount} / {TOTAL_DAILY_LIMIT}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-yellow-400 h-full transition-all duration-500" style={{ width: `${(dailyCallsCount / TOTAL_DAILY_LIMIT) * 100}%` }} />
                                    </div>
                                </div>

                                {/* Caller IDs Status */}
                                <div className="space-y-2">
                                    <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Caller ID Rotation</h5>
                                    <div className="space-y-1.5 max-h-[150px] overflow-y-auto no-scrollbar pr-1">
                                        {callerIds.map((cid) => {
                                            const status = callerIdStatus[cid];
                                            // const _/isCurrent = currentCallerId === cid;
                                            const isFrozen = status?.isFrozen;

                                            return (
                                                <div key={cid} className="flex items-center justify-between p-2 rounded-xl border border-transparent bg-gray-50/30 dark:bg-slate-700/20 transition-all">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className={`w-2 h-2 rounded-full shrink-0 ${isFrozen ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                                            }`} />
                                                        <span className="text-xs font-bold truncate text-gray-600 dark:text-gray-400">
                                                            {cid}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col items-end shrink-0">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase">
                                                            {status?.callCount || 0} / {maxCallsPerId}
                                                        </span>
                                                        {isFrozen && (
                                                            <span className="text-[8px] font-bold text-red-500 uppercase animate-pulse">
                                                                Frozen {Math.ceil((status.secondsRemaining || 0) / 60)}m
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContactInfo;
