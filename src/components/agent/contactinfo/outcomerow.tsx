import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { updateContact, removeFromQueue } from '@/store/slices/contactSlice';
import { fetchDispositions } from '@/store/slices/dispositionSlice';
import { 
    Phone, User, CheckCircle2, XCircle, PhoneOff, 
    PhoneMissed, PhoneIncoming, Flame, Thermometer, 
    Snowflake, Clock, Ban, ThumbsDown, Tag 
} from "lucide-react";
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useTwilio } from '@/providers/twilio.provider';

const ICON_MAP: Record<string, React.ElementType> = {
    CheckCircle2, XCircle, Phone, PhoneOff, PhoneMissed,
    PhoneIncoming, Flame, Thermometer, Snowflake, Clock,
    Ban, ThumbsDown, Tag,
};

const COLOR_IDLE: Record<string, string> = {
    green: "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950",
    red: "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950",
    orange: "border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950",
    yellow: "border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-950",
    blue: "border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950",
    purple: "border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950",
    gray: "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-400 dark:hover:bg-slate-700",
};

const COLOR_ACTIVE: Record<string, string> = {
    green: "bg-emerald-500 border-emerald-500 text-white shadow-emerald-200/50",
    red: "bg-red-500 border-red-500 text-white shadow-red-200/50",
    orange: "bg-orange-500 border-orange-500 text-white shadow-orange-200/50",
    yellow: "bg-yellow-400 border-yellow-400 text-gray-900 shadow-yellow-200/50",
    blue: "bg-blue-500 border-blue-500 text-white shadow-blue-200/50",
    purple: "bg-violet-500 border-violet-500 text-white shadow-violet-200/50",
    gray: "bg-gray-600 border-gray-600 text-white shadow-gray-200/50",
};


const OutcomeRow = ({ onNext }: { onNext?: () => void }) => {
    const dispatch = useAppDispatch();
    const { currentContact } = useAppSelector((state) => state.contacts);
    const { dispositions } = useAppSelector(s => s.dispositions);
    const { endCall, dropVoicemail, isCalling } = useTwilio();

    const [selectedDisp, setSelectedDisp] = useState<string | null>(null);
    const [savingDisp, setSavingDisp] = useState(false);

    useEffect(() => {
        dispatch(fetchDispositions());
    }, [dispatch]);

    useEffect(() => {
        if (currentContact) {
            setSelectedDisp(currentContact.disposition ?? null);
        }
    }, [currentContact]);

    const handleSmartAction = async (label: string, value: string) => {
        if (!currentContact?.id) return;
        setSelectedDisp(value);
        setSavingDisp(true);
        try {
            await dispatch(updateContact({ id: currentContact.id, payload: { disposition: value, status: value } })).unwrap();
            toast.success(`Outcome: ${label}`);
            
            const upperVal = value.toUpperCase();
            if (upperVal !== "VOICEMAIL" && onNext) {
                dispatch(removeFromQueue(currentContact.id));
            }

            if (["NO_ANSWER", "BAD_NUMBER", "DNC_CONTACT", "DNC_NUMBER", "DO_NOT_CALL"].includes(upperVal)) {
                if (isCalling) await endCall();
                if (upperVal.startsWith("DNC") || upperVal === "DO_NOT_CALL") {
                    await api.post(`/contact/${currentContact.id}/move-to-dnc`, {
                        phoneIds: (upperVal === "DNC_NUMBER") ? [currentContact.phones?.[0]?.id] : []
                    });
                }
            } else if (upperVal === "VOICEMAIL") {
                await dropVoicemail();
                if (onNext) onNext();
            } else {
                if (isCalling) await endCall();
            }
        } catch (err: any) {
            toast.error("Failed: " + err);
        } finally {
            setSavingDisp(false);
        }
    };

    if (!currentContact) return null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl px-3 py-2 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-gray-100 dark:border-slate-700">
                <CheckCircle2 size={14} className="text-gray-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Outcomes</span>
            </div>
            
            <div className="flex items-center gap-1.5 py-0.5">
                {dispositions.filter(d => d.isActive).map(d => {
                    const Icon = ICON_MAP[d.icon] ?? User;
                    const isActive = selectedDisp === d.value;
                    return (
                        <button
                            key={d.id}
                            onClick={() => handleSmartAction(d.label, d.value)}
                            disabled={savingDisp}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border font-black transition-all whitespace-nowrap shadow-sm active:scale-95 ${
                                isActive ? (COLOR_ACTIVE[d.color] || COLOR_ACTIVE.red) : (COLOR_IDLE[d.color] || COLOR_IDLE.red)
                            }`}
                        >
                            <Icon size={16} className="shrink-0" />
                            {d.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default OutcomeRow;
