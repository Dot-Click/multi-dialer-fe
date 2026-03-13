import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContactById, setQueue } from '@/store/slices/contactSlice';
import CallSection from '@/components/agent/contactinfo/callsection';
import ContactInfoBottom from '@/components/agent/contactinfo/contactinfobottom';
import ContactInfoCallSentiment from '@/components/agent/contactinfo/contactinfocallsentiment';
import ContactInfoDisposition from '@/components/agent/contactinfo/contactinfodisposition';
import ContactInfoHeader from '@/components/agent/contactinfo/contactinfoheader';
// import ContactInfoScript from '@/components/agent/contactinfo/contactinfoscript';
import toast from 'react-hot-toast';
import ContactInfoScript from '@/components/admin/contactinfo/contactinfoscript';
import LiveContactScript from '@/components/admin/contactinfo/livecallscript';
import ContactDisposition from '@/components/agent/contactinfo/contactdisposition';
import BottomContactDetail from '@/components/agent/contactdetail/bottomcontactdetail';

const ContactInfo = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { queue, currentContact } = useAppSelector((state) => state.contacts);
    const [currentIndex, setCurrentIndex] = useState(0);

    // --- Rotation & Limit State ---
    const [callerIds, setCallerIds] = useState<string[]>([]);
    const [currentCallerId, setCurrentCallerId] = useState<string | null>(null);
    const [callsMadeWithCurrent, setCallsMadeWithCurrent] = useState(0);
    const [dailyCallsCount, setDailyCallsCount] = useState(0);
    const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
    const maxCallsPerId = location.state?.numberOfLines || 5;
    const TOTAL_DAILY_LIMIT = 25;
    const COOLDOWN_MINUTES = 20;

    // const [scriptId, setScriptId] = useState<string | null>(null);

    const [scriptId, setScriptId] = useState<string | null>(
        location.state?.selectedScript || null  // ← initialize directly from state
    );

    // Initialize from location state
    useEffect(() => {
        const selectedContacts = location.state?.contacts;
        const incomingCallerIds = location.state?.callerIds;

        // ✅ script handled here alongside the other state init
        if (location.state?.selectedScript) {
            setScriptId(location.state.selectedScript);
        }

        if (selectedContacts && selectedContacts.length > 0) {
            dispatch(setQueue(selectedContacts));
            setCurrentIndex(0);
        }

        if (Array.isArray(incomingCallerIds) && incomingCallerIds.length > 0) {
            setCallerIds(incomingCallerIds);
            setCurrentCallerId(incomingCallerIds[0]);
        } else if (location.state?.callerId) {
            setCallerIds([location.state.callerId]);
            setCurrentCallerId(location.state.callerId);
        }
    }, [location.state, dispatch]);

    // Fetch contact data
    useEffect(() => {
        if (queue.length > 0 && queue[currentIndex]) {
            const contactId = queue[currentIndex].id;
            dispatch(fetchContactById(contactId));
        }
    }, [currentIndex, queue, dispatch]);

    const handleNextContact = () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePreviousContact = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    /**
     * rotation logic to pick the next valid caller ID
     */
    const rotateCallerId = useCallback((): string | null => {
        if (dailyCallsCount >= TOTAL_DAILY_LIMIT) {
            toast.error(`Daily limit of ${TOTAL_DAILY_LIMIT} calls reached!`);
            return null;
        }

        const now = Date.now();

        // 1. Check if we can still use the current ID
        if (currentCallerId && callsMadeWithCurrent < maxCallsPerId) {
            return currentCallerId;
        }

        // 2. We reached the limit for current CID or don't have one
        // Mark current as cooldown if it just reached limit
        if (currentCallerId && callsMadeWithCurrent >= maxCallsPerId) {
            const newCooldowns = { ...cooldowns, [currentCallerId]: now + COOLDOWN_MINUTES * 60 * 1000 };
            setCooldowns(newCooldowns);
            toast(`Caller ID ${currentCallerId} is on a ${COOLDOWN_MINUTES}-min cooldown.`);
        }

        // 3. Find next available from list (rotation)
        const startIdx = currentCallerId ? (callerIds.indexOf(currentCallerId) + 1) % callerIds.length : 0;

        for (let i = 0; i < callerIds.length; i++) {
            const idx = (startIdx + i) % callerIds.length;
            const cid = callerIds[idx];
            const cooldownUntil = cooldowns[cid] || 0;

            if (now >= cooldownUntil) {
                setCurrentCallerId(cid);
                setCallsMadeWithCurrent(0); // Reset count for new CID
                return cid;
            }
        }

        toast.error("All selected Caller IDs are currently on cooldown. Please wait 20 minutes.");
        return null;
    }, [callerIds, currentCallerId, callsMadeWithCurrent, dailyCallsCount, cooldowns, maxCallsPerId]);

    /**
     * Called when a call is successfully initiated
     */
    const onCallStarted = useCallback(() => {
        setCallsMadeWithCurrent(prev => prev + 1);
        setDailyCallsCount(prev => prev + 1);
    }, []);

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
            />

            <div className='w-full p-4  lg:flex lg:gap-4 space-y-4 lg:space-y-0'>
                <div className='w-full lg:w-[65%] space-y-4'>
                    <CallSection />
                    {/* <ContactInfoDisposition /> */}
                    <ContactDisposition />

                    <BottomContactDetail />
                </div>
                <div className='w-full lg:w-[35%]'>
                    <div>
                        <ContactInfoScript scriptId={scriptId} />
                    </div>
                    <div className='mt-4'>
                        <LiveContactScript contactId={currentContact?.id} scriptId={scriptId} />
                    </div>
                </div>
            </div>

            <div className='w-full p-4  lg:flex lg:gap-4 space-y-4 lg:space-y-0'>
                <div className='w-full lg:w-[65%]'>
                    {/* <ContactInfoBottom /> */}
                </div>
                <div className='w-full h-fit flex flex-col gap-2 lg:w-[35%]'>
                    <ContactInfoCallSentiment />
                </div>
            </div>

            {/* Debug/Info Overlay for User */}
            <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-50 text-[12px]">
                <p className="font-bold text-gray-700 dark:text-gray-200">Session Stats</p>
                <div className="mt-1 space-y-0.5">
                    <p className="text-gray-500">Today: <span className="text-black dark:text-white font-medium">{dailyCallsCount}/{TOTAL_DAILY_LIMIT}</span></p>
                    <p className="text-gray-500">Current ID Calls: <span className="text-black dark:text-white font-medium">{callsMadeWithCurrent}/{maxCallsPerId}</span></p>
                    <p className="text-gray-500 truncate max-w-[150px]">Current ID: <span className="text-yellow-500 font-medium">{currentCallerId || 'None'}</span></p>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;