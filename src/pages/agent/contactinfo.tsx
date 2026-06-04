import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContactById, setCurrentContact, setQueue, updateContact } from '@/store/slices/contactSlice';
import CallSection from '@/components/agent/contactinfo/callsection';
import ContactInfoCallSentiment from '@/components/agent/contactinfo/contactinfocallsentiment';
import ScriptTabs from '@/components/agent/contactinfo/scripttabs';
import ContactInfoHeader from '@/components/agent/contactinfo/contactinfoheader';
import SessionSummaryModal, { type SessionSummaryStats } from '@/components/agent/SessionSummaryModal';
import BottomContactDetail from '@/components/agent/contactdetail/bottomcontactdetail';
import Detail from '@/components/agent/contactdetail/detail';
import CallOutcomes from '@/components/agent/contactinfo/calloutcomes';
import { useTwilio } from '@/providers/twilio.provider';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { VscCallOutgoing } from 'react-icons/vsc';
import { FreezeCountdown, isCurrentlyFrozen } from '@/components/agent/common/FreezeCountdown';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CallerIdStatus {
    callCount: number;
    isFrozen: boolean;
    unfreezeAt: number | null;
    secondsRemaining: number;
}

interface DialTarget {
    contactIndex: number;
    phoneIndex: number;
}

interface ContactPhone {
    id?: string;
    number: string;
    type?: string;
    isPrimary?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_DAILY_LIMIT = 1000;
const POLL_INTERVAL_MS = 30_000;
const FREEZE_DURATION_MS = 20 * 60 * 1000; // 20 minutes, must match backend COOLDOWN_MS
const EMPTY_SESSION_STATS: SessionSummaryStats = {
    totalDialed: 0,
    connected: 0,
    noAnswer: 0,
    voicemail: 0,
    badNumber: 0,
    dnc: 0,
};

const getContactPhones = (contact: any): ContactPhone[] => {
    if (Array.isArray(contact?.phones) && contact.phones.length > 0) {
        return contact.phones.filter((phone: any) => Boolean(phone?.number));
    }

    if (contact?.phone) {
        return [{ number: contact.phone, type: "MOBILE", isPrimary: true }];
    }

    return [];
};

const getInitialPhoneIndex = (contact: any) => {
    const phones = getContactPhones(contact);
    // Prefer best number, fall back to primary, then first
    const bestIndex = phones.findIndex((phone: any) => phone.isBestNumber);
    if (bestIndex >= 0) return bestIndex;
    const primaryIndex = phones.findIndex((phone) => phone.isPrimary);
    return primaryIndex >= 0 ? primaryIndex : 0;
};

const getQueueContactId = (entry: any) => entry?.contactId || entry?.id;

const expandContactsIntoPhoneCards = (contacts: any[]) =>
    contacts.flatMap((contact) => {
        const phones = getContactPhones(contact);

        if (phones.length === 0) {
            return [{
                ...contact,
                contactId: contact.id,
                phone: contact.phone,
                phoneLabel: "Phone 1",
                phoneIndex: 0,
                totalPhones: 1,
            }];
        }

        return phones.map((phone, index) => ({
            ...contact,
            id: `${contact.id}_phone_${index}`,
            contactId: contact.id,
            phone: phone.number,
            phoneLabel: `Phone ${index + 1}`,
            phoneIndex: index,
            totalPhones: phones.length,
            isBestNumber: !!(phone as any).isBestNumber,
        }));
    });

const hydrateContactsWithPhones = async (contacts: any[]) => {
    return Promise.all(contacts.map(async (contact) => {
        if (Array.isArray(contact?.phones) && contact.phones.length > 0) {
            return contact;
        }

        try {
            const { data } = await api.get(`/contact/${contact.id}`);
            if (data.success) {
                return {
                    ...contact,
                    ...data.data,
                    name: contact.name || data.data.fullName,
                    phone: data.data.phones?.[0]?.number || contact.phone,
                    phones: data.data.phones || [],
                };
            }
        } catch (err) {
            console.warn(`[ContactInfo] Failed to hydrate phones for contact ${contact.id}`, err);
        }

        return contact;
    }));
};

// ─── Component ────────────────────────────────────────────────────────────────

const ContactInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { queue, currentContact } = useAppSelector((state) => state.contacts);
    const { role } = useAppSelector((state) => state.auth);
    const settingsInfo = location.state?.settingsInfo;

    const { setAnsweringMachineUrl, incomingContactId, incomingQueueCardId, startCall, endCall, isCalling, setIsPostCall, isPostCall } = useTwilio();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPhoneIndex, setCurrentPhoneIndex] = useState(0);
    const [callerIds, setCallerIds] = useState<string[]>([]);
    const [currentCallerId, setCurrentCallerId] = useState<string | null>(null);
    const [dailyCallsCount, setDailyCallsCount] = useState(0);
    const [scriptId, setScriptId] = useState<string | null>(location.state?.selectedScript || null);
    const dialerMode = location.state?.dialerMode || "manual";
    const [isAutoDialing, setIsAutoDialing] = useState(false);
    const maxCallsPerId = location.state?.numberOfLines || 5;
    const pacing: number | undefined = location.state?.pacing;
    const listId: string | undefined = location.state?.listId;

    const [callerIdStatus, setCallerIdStatus] = useState<Record<string, CallerIdStatus>>({});
    const [leadStatuses, setLeadStatuses] = useState<Record<string, string>>({});
    const [leadSids, setLeadSids] = useState<Record<string, string>>({});
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isAutoDialingRef = useRef(isAutoDialing);
    const emptyCountRef = useRef(0);
    const previousContactIdRef = useRef<string | null>(null);
    const [pendingDialTarget, setPendingDialTarget] = useState<DialTarget | null>(null);
    const [pendingContactId, setPendingContactId] = useState<string | null>(null);
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
    const [sessionStats, setSessionStats] = useState(EMPTY_SESSION_STATS);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [showSessionSummary, setShowSessionSummary] = useState(false);
    const [sessionDurationMs, setSessionDurationMs] = useState(0);
    const activeSessionIdRef = useRef<string | null>(null);
    const unresolvedDialAttemptsRef = useRef(0);
    const currentQueueEntry = queue[currentIndex];


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

    const ensureSessionStarted = useCallback(async () => {
        setSessionStartTime((current) => current || new Date());

        if (activeSessionIdRef.current) {
            return activeSessionIdRef.current;
        }

        try {
            const { data } = await api.post('/calling/session/start', {
                type: dialerMode === "power" ? "POWER" : "C2C",
            });
            const sessionId = data?.data?.id || data?.id;
            if (sessionId) {
                activeSessionIdRef.current = sessionId;
                setActiveSessionId(sessionId);
            }
            return sessionId || null;
        } catch (err) {
            console.warn('[ContactInfo] Failed to start calling session:', err);
            return null;
        }
    }, [dialerMode]);

    const incrementSessionDialed = useCallback(() => {
        unresolvedDialAttemptsRef.current += 1;
        setSessionStats((prev) => ({
            ...prev,
            totalDialed: prev.totalDialed + 1,
        }));
    }, []);

    const incrementSessionOutcome = useCallback((outcomeValue: string) => {
        const normalizedValue = outcomeValue.toUpperCase();
        const isTrackedOutcome = ["CONTACT", "NO_ANSWER", "VOICEMAIL", "BAD_NUMBER", "DNC_CONTACT", "DNC_NUMBER"].includes(normalizedValue);
        const shouldCountDialed = unresolvedDialAttemptsRef.current <= 0;

        if (!isTrackedOutcome) return;

        if (unresolvedDialAttemptsRef.current > 0) {
            unresolvedDialAttemptsRef.current -= 1;
        }

        setSessionStats((prev) => {
            const totalDialed = shouldCountDialed ? prev.totalDialed + 1 : prev.totalDialed;

            if (normalizedValue === "CONTACT") {
                return { ...prev, totalDialed, connected: prev.connected + 1 };
            }
            if (normalizedValue === "NO_ANSWER") {
                return { ...prev, totalDialed, noAnswer: prev.noAnswer + 1 };
            }
            if (normalizedValue === "VOICEMAIL") {
                return { ...prev, totalDialed, voicemail: prev.voicemail + 1 };
            }
            if (normalizedValue === "BAD_NUMBER") {
                return { ...prev, totalDialed, badNumber: prev.badNumber + 1 };
            }
            if (normalizedValue === "DNC_CONTACT" || normalizedValue === "DNC_NUMBER") {
                return { ...prev, totalDialed, dnc: prev.dnc + 1 };
            }
            return prev;
        });
    }, []);

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
        if (selectedContacts?.length > 0) {
            void (async () => {
                const contactsWithPhones = await hydrateContactsWithPhones(selectedContacts);
                dispatch(setQueue(expandContactsIntoPhoneCards(contactsWithPhones)));
                setCurrentIndex(0);
                // Save the very first contact as the resume position immediately.
                // This means even an abandoned session (no calls made, no Next clicked)
                // leaves a breadcrumb so Resume knows where to start next time.
                if (listId && selectedContacts[0]?.id) {
                    api.post('/calling/dial-session', { listId, lastContactId: selectedContacts[0].id }).catch(() => {});
                }
            })();
        }

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

    const _unusedRotateCallerId = useCallback((): string | null => {
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

    const _unusedOnCallStarted = useCallback(async (fromNumber: string) => {
        await ensureSessionStarted();
        setDailyCallsCount((prev) => prev + 1);
        incrementSessionDialed();
        setCallerIdStatus((prev) => {
            const current = prev[fromNumber] ?? { callCount: 0, isFrozen: false, unfreezeAt: null, secondsRemaining: 0 };
            const newCount = current.callCount + 1;
            const willFreeze = newCount >= maxCallsPerId;
            // Always set a fresh unfreezeAt so the widget can immediately
            // evaluate isCurrentlyFrozen correctly. Spreading ...current would
            // carry over a stale past timestamp from a previous freeze, causing
            // isCurrentlyFrozen to return false and the row to flash as unfrozen.
            return { ...prev, [fromNumber]: {
                ...current,
                callCount: newCount,
                isFrozen: willFreeze,
                unfreezeAt: willFreeze ? Date.now() + FREEZE_DURATION_MS : null,
                secondsRemaining: willFreeze ? FREEZE_DURATION_MS / 1000 : 0,
            } };
        });
        try {
            const { data } = await api.post('/system-settings/caller-id/use', { callerNumber: fromNumber, maxCallsPerCid: maxCallsPerId });
            if (data.success) {
                const res = data.data;
                setCallerIdStatus(prev => ({ ...prev, [fromNumber]: { ...prev[fromNumber], ...res } }));
                if (res.rotated) {
                    toast(`Caller ID ${fromNumber} on cooldown.`);
                    const next = _unusedRotateCallerId();
                    if (next && next !== fromNumber) setCurrentCallerId(next);
                }
            }
        } catch (err) { console.error(err); }
    }, [ensureSessionStarted, incrementSessionDialed, maxCallsPerId, _unusedRotateCallerId]);

    useEffect(() => {
        if (!currentContact?.id) {
            previousContactIdRef.current = null;
            setCurrentPhoneIndex(0);
            return;
        }

        if (typeof currentQueueEntry?.phoneIndex === "number") {
            previousContactIdRef.current = currentQueueEntry.id;
            setCurrentPhoneIndex(currentQueueEntry.phoneIndex);
            return;
        }

        if (previousContactIdRef.current !== currentContact.id) {
            previousContactIdRef.current = currentContact.id;
            setCurrentPhoneIndex(getInitialPhoneIndex(currentContact));
            return;
        }

        const phones = getContactPhones(currentContact);
        if (phones.length === 0) {
            setCurrentPhoneIndex(0);
            return;
        }

        setCurrentPhoneIndex((prev) => Math.min(prev, phones.length - 1));
    }, [currentContact?.id, currentContact?.phones?.length, currentQueueEntry?.id, currentQueueEntry?.phoneIndex, dialerMode]);

    // ─── Queue nav ────────────────────────────────────────────────────────────

    useEffect(() => {
        if (queue.length > 0 && queue[currentIndex]) {
            const activeEntry = queue[currentIndex];
            const contactId = getQueueContactId(activeEntry);
            setCurrentPhoneIndex(activeEntry.phoneIndex ?? getInitialPhoneIndex(activeEntry));
            dispatch(setCurrentContact({ ...activeEntry, id: contactId, queueCardId: activeEntry.id }));
            dispatch(fetchContactById(contactId));
        }
    }, [currentIndex, queue, dispatch]);

    // Reset isPostCall when contact index changes
    useEffect(() => {
        setIsPostCall(false);
    }, [currentIndex, setIsPostCall]);

    const handleNextContact = () => {
        setIsPostCall(false);
        // Save the NEXT contact as the resume position.
        // "Next" means: if I come back, start from this one — not the one I just finished.
        if (listId) {
            const nextEntry = queue[currentIndex + 1];
            if (nextEntry) {
                const nextContactId = (nextEntry as any).contactId || nextEntry.id;
                if (nextContactId) {
                    api.post('/calling/dial-session', { listId, lastContactId: nextContactId }).catch(() => {});
                }
            }
        }
        if (currentIndex < queue.length - 1) setCurrentIndex((p) => p + 1);
    };
    const handlePreviousContact = () => {
        setIsPostCall(false);
        if (currentIndex > 0) setCurrentIndex((p) => p - 1);
    };

    const getNextContactTarget = useCallback((fromIndex: number): DialTarget | null => {
        const nextIndex = fromIndex + 1;
        if (nextIndex >= queue.length) return null;
        return {
            contactIndex: nextIndex,
            phoneIndex: queue[nextIndex]?.phoneIndex ?? getInitialPhoneIndex(queue[nextIndex]),
        };
    }, [queue]);

    const syncQueuedContact = useCallback((updatedContact: any) => {
        dispatch(setQueue(queue.map((contact: any) => (
            getQueueContactId(contact) === updatedContact.id
                ? {
                    ...contact,
                    ...updatedContact,
                    id: contact.id,
                    contactId: getQueueContactId(contact),
                    phone: contact.phone || updatedContact.phones?.[0]?.number || updatedContact.phone || "-",
                    phoneLabel: contact.phoneLabel,
                    phoneIndex: contact.phoneIndex,
                    totalPhones: contact.totalPhones,
                }
                : contact
        ))));
    }, [dispatch, queue]);

    const continueDialer = useCallback((target: DialTarget | null) => {
        setIsPostCall(false);

        if (pendingContactId) {
            const foundIdx = queue.findIndex((c: { id?: string; contactId?: string }) => c.id === pendingContactId || c.contactId === pendingContactId);
            if (foundIdx !== -1) {
                setCurrentIndex(foundIdx);
                setCurrentPhoneIndex(queue[foundIdx].phoneIndex ?? getInitialPhoneIndex(queue[foundIdx]));
            }
            setPendingContactId(null);
            setPendingDialTarget(null);
            return;
        }

        if (!target) {
            setPendingDialTarget(null);
            toast("No more numbers to dial in this session.");
            return;
        }

        setCurrentIndex(target.contactIndex);
        setCurrentPhoneIndex(target.phoneIndex);

        if (dialerMode === "power") {
            setPendingDialTarget(null);
            return;
        }

        setPendingDialTarget(target);
    }, [dialerMode, pendingContactId, queue, setIsPostCall]);

    const moveCurrentPhoneToDnc = useCallback(async (contact: any, phoneIndex: number) => {
        const phones = getContactPhones(contact);
        const activePhone = phones[phoneIndex];
        if (!activePhone) {
            return { remainingPhones: phones };
        }

        if (activePhone.id) {
            await api.post(`/contact/${contact.id}/move-to-dnc`, { phoneIds: [activePhone.id] });
        }

        const remainingPhones = phones.filter((_, index) => index !== phoneIndex);
        const updatedContact = await dispatch(updateContact({
            id: contact.id,
            payload: { phones: remainingPhones },
        })).unwrap();

        syncQueuedContact(updatedContact);
        return { remainingPhones };
    }, [dispatch, syncQueuedContact]);

    const handleOutcomeSelected = useCallback(async (outcomeValue: string) => {
        if (!currentContact?.id) return;

        const normalizedValue = outcomeValue.toUpperCase();
        incrementSessionOutcome(normalizedValue);
        const nextContactTarget = getNextContactTarget(currentIndex);

        if (isCalling) {
            await endCall();
        }

        if (normalizedValue === "NO_ANSWER" || normalizedValue === "VOICEMAIL") {
            continueDialer(nextContactTarget);
            return;
        }

        if (normalizedValue === "BAD_NUMBER" || normalizedValue === "DNC_NUMBER") {
            await moveCurrentPhoneToDnc(currentContact, currentPhoneIndex);

            continueDialer(nextContactTarget);
            return;
        }

        if (normalizedValue === "DNC_CONTACT") {
            await api.post(`/contact/${currentContact.id}/move-to-dnc`, { phoneIds: [] });
            continueDialer(nextContactTarget);
            return;
        }

        continueDialer(nextContactTarget);
    }, [continueDialer, currentContact, currentIndex, currentPhoneIndex, dialerMode, dispatch, endCall, getNextContactTarget, incrementSessionOutcome, isCalling, moveCurrentPhoneToDnc, queue]);

    useEffect(() => {
        if (!pendingDialTarget || dialerMode === "power" || isCalling) return;

        const targetContact = queue[pendingDialTarget.contactIndex];
        if (!targetContact || currentContact?.id !== targetContact.id) return;

        const targetPhone =
            getContactPhones(currentContact)[pendingDialTarget.phoneIndex]?.number ||
            getContactPhones(targetContact)[pendingDialTarget.phoneIndex]?.number ||
            "";

        if (!targetPhone) {
            setPendingDialTarget(null);
            toast.error("No phone number available for the selected contact.");
            return;
        }

        const fromNumber = _unusedRotateCallerId();
        if (!fromNumber) {
            setPendingDialTarget(null);
            return;
        }

        setPendingDialTarget(null);

        void (async () => {
            try {
                await startCall(targetPhone, fromNumber, targetContact.id);
                await _unusedOnCallStarted(fromNumber);
            } catch {
                // startCall already reports any dial failure
            }
        })();
    }, [currentContact, dialerMode, isCalling, pendingDialTarget, queue, startCall, _unusedOnCallStarted, _unusedRotateCallerId]);

    // ─── Power Dialer Logic ───────────────────────────────────────────────────

    useEffect(() => {
        const incomingId = incomingQueueCardId || incomingContactId;
        if (incomingId && queue.length > 0) {
            if (isPostCall) {
                setPendingContactId(incomingId);
            } else {
                const foundIdx = queue.findIndex((c: { id?: string; contactId?: string }) => c.id === incomingId || c.contactId === incomingId);
                if (foundIdx !== -1 && foundIdx !== currentIndex) {
                    toast(`Connected to ${queue[foundIdx].name || queue[foundIdx].fullName || "Contact"}!`, { icon: '📞' });
                    setCurrentIndex(foundIdx);
                    setCurrentPhoneIndex(queue[foundIdx].phoneIndex ?? getInitialPhoneIndex(queue[foundIdx]));
                }
            }
        }
    }, [incomingContactId, incomingQueueCardId, queue, isPostCall, currentIndex]);

    const startSimultaneousDialing = async () => {
        if (isAutoDialingRef.current || !currentCallerId) return;
        isAutoDialingRef.current = true;
        toast.loading("Starting simultaneous dialer...", { id: "powerDialer" })
        try {
            await ensureSessionStarted();
            const leadsPayload = queue.slice(currentIndex).map((c: any, idx: number) => ({
                fullName: c.name || c.fullName,
                phone: c.phone,
                email: c.emails?.[0]?.email || c.email,
                priority: queue.length - idx,
                id: c.id,
                contactId: getQueueContactId(c),
                phoneIndex: c.phoneIndex ?? 0,
                phoneLabel: c.phoneLabel,
                totalPhones: c.totalPhones ?? 1,
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

    const stopSimultaneousDialing = useCallback(async () => {
        try {
            await api.post('/calling/stop-dialing');
            toast.success("Power Dialer Stopped");
            setIsAutoDialing(false);
            isAutoDialingRef.current = false;
        } catch {
            toast.error("Failed to stop dialer");
        }
    }, []);

    const handleHangupAndLeave = useCallback(async () => {
        const endedAt = new Date();
        const startedAt = sessionStartTime || endedAt;
        const sessionId = activeSessionIdRef.current || activeSessionId;

        if (sessionId) {
            try {
                await api.post(`/calling/session/${sessionId}/end`);
            } catch (err) {
                console.warn('[ContactInfo] Failed to end calling session:', err);
            }
        }

        setSessionDurationMs(endedAt.getTime() - startedAt.getTime());
        setShowSessionSummary(true);
    }, [activeSessionId, sessionStartTime]);

    const closeSessionAndLeave = useCallback(async () => {
        setShowSessionSummary(false);

        if (dialerMode === 'power') {
            await stopSimultaneousDialing();
        }

        if (isCalling) {
            await endCall();
        }

        const path = dialerMode === 'power'
            ? (localStorage.getItem('user_role') === 'ADMIN' ? '/admin/data-dialer' : '/data-dialer')
            : -1;

        if (path === -1) {
            navigate(-1);
        } else {
            navigate(path as string);
        }
    }, [dialerMode, endCall, isCalling, navigate, stopSimultaneousDialing]);

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
        await ensureSessionStarted();
        setDailyCallsCount((prev) => prev + 1);
        incrementSessionDialed();
        setCallerIdStatus((prev) => {
            const current = prev[fromNumber] ?? { callCount: 0, isFrozen: false, unfreezeAt: null, secondsRemaining: 0 };
            const newCount = current.callCount + 1;
            const willFreeze = newCount >= maxCallsPerId;
            // Always set a fresh unfreezeAt so the widget can immediately
            // evaluate isCurrentlyFrozen correctly. Spreading ...current would
            // carry over a stale past timestamp from a previous freeze, causing
            // isCurrentlyFrozen to return false and the row to flash as unfrozen.
            return { ...prev, [fromNumber]: {
                ...current,
                callCount: newCount,
                isFrozen: willFreeze,
                unfreezeAt: willFreeze ? Date.now() + FREEZE_DURATION_MS : null,
                secondsRemaining: willFreeze ? FREEZE_DURATION_MS / 1000 : 0,
            } };
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
    }, [ensureSessionStarted, incrementSessionDialed, maxCallsPerId, rotateCallerId]);

    // ─── Render ───────────────────────────────────────────────────────────────

    void rotateCallerId;
    void onCallStarted;

    return (
        <div className="bg-gray-100 dark:bg-slate-900 h-screen overflow-hidden flex flex-col">
            <ContactInfoHeader
                contact={currentContact}
                dialPhoneNumber={currentQueueEntry?.phone || ""}
                onNext={handleNextContact}
                onPrev={handlePreviousContact}
                currentIndex={currentIndex}
                totalContacts={queue.length}
                callerId={currentCallerId}
                onPickNextCallerId={_unusedRotateCallerId}
                onCallStarted={_unusedOnCallStarted}
                dailyCount={dailyCallsCount}
                dailyLimit={TOTAL_DAILY_LIMIT}
                onholdUrl={settingsInfo?.find((s: any) => s.type === 'General Recording')?.url}
                dialerMode={dialerMode}
                autoDial={isAutoDialing}
                onStartSimultaneousDialer={startSimultaneousDialing}
                onStopSimultaneousDialer={stopSimultaneousDialing}
                onHangupAndLeave={handleHangupAndLeave}
            />

            <main className="flex-1 overflow-hidden p-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
                    {/* Left Column (Call Tiles) - 3/12 width */}
                    <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
                        <div className="h-[calc(100vh-20rem)] min-h-[360px] flex flex-col gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-2 overflow-hidden">
                            <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-50 dark:border-slate-700/50 mb-1">
                                <VscCallOutgoing className="text-gray-400" size={14} />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Queue</h3>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <CallSection
                                    leadStatuses={leadStatuses}
                                    leadSids={leadSids}
                                    activeQueueCardId={currentQueueEntry?.id}
                                    dialerMode={dialerMode}
                                    pacing={pacing}
                                    onSelectQueueCard={(queueCardId) => {
                                        const foundIdx = queue.findIndex((entry: any) => entry.id === queueCardId);
                                        if (foundIdx >= 0) {
                                            setCurrentIndex(foundIdx);
                                            setCurrentPhoneIndex(queue[foundIdx].phoneIndex ?? getInitialPhoneIndex(queue[foundIdx]));
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="shrink-0">
                            <CallOutcomes
                                onOutcomeSelected={handleOutcomeSelected}
                                isPowerDialer={dialerMode === "power" && isAutoDialing}
                            />
                        </div>
                    </div>

                    {/* Middle Column (Contact Detail) - 7/12 width */}
                    <div className="lg:col-span-6 flex flex-col gap-4 h-full overflow-hidden">
                        <div className="shrink-0">
                            <Detail
                                onNext={handleNextContact}
                                hideOutcomes={true}
                                hideQualifications={false}
                                activePhoneIndex={currentPhoneIndex}
                            />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <BottomContactDetail />
                        </div>
                    </div>

                    {/* Right Column (Sidebar) - 3/12 width */}
                    <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto no-scrollbar pb-10">
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
                                        {callerIds.length === 0 && (
                                            <p className="text-[10px] text-gray-400 italic px-1">No caller IDs in this session.</p>
                                        )}
                                        {callerIds.map((cid) => {
                                            const status = callerIdStatus[cid];

                                            // isFrozen: backend flag is the primary truth.
                                            // isCurrentlyFrozen is only used as a client-side
                                            // "countdown has expired" signal between polls — it
                                            // NEVER overrides a false from the backend.
                                            const backendFrozen = status?.isFrozen ?? false;
                                            const clientExpired = status?.unfreezeAt
                                                ? !isCurrentlyFrozen(status.unfreezeAt)
                                                : false;
                                            const isFrozen = backendFrozen && !clientExpired;

                                            // Countdown: unfreezeAt is now always a fresh UTC epoch-ms
                                            // (set by optimistic update or poll). No stale fallback needed.
                                            const countdownTarget: number | null =
                                                isFrozen && status?.unfreezeAt
                                                    ? (status.unfreezeAt as number)
                                                    : null;

                                            return (
                                                <div
                                                    key={cid}
                                                    className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-300
                                                        ${isFrozen
                                                            ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-600/60'
                                                            : 'bg-gray-50/30 dark:bg-slate-700/20 border-transparent'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${
                                                            isFrozen
                                                                ? 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.7)]'
                                                                : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                                                        }`} />
                                                        <span className={`text-xs font-bold truncate transition-colors duration-300 ${
                                                            isFrozen
                                                                ? 'text-orange-700 dark:text-orange-300'
                                                                : 'text-gray-600 dark:text-gray-300'
                                                        }`}>
                                                            {cid}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tabular-nums">
                                                            {status?.callCount ?? 0} / {maxCallsPerId}
                                                        </span>
                                                        {isFrozen ? (
                                                            <span className="flex items-center gap-1 text-[9px] font-bold text-orange-500 uppercase">
                                                                Frozen
                                                                {countdownTarget && (
                                                                    <FreezeCountdown
                                                                        unfreezeAt={countdownTarget}
                                                                        className="font-black tabular-nums"
                                                                    />
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[9px] font-bold text-emerald-500 uppercase">Active</span>
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
            <SessionSummaryModal
                open={showSessionSummary}
                durationMs={sessionDurationMs}
                stats={sessionStats}
                onClose={closeSessionAndLeave}
            />
        </div>
    );
};

export default ContactInfo;
