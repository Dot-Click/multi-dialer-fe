import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTwilio } from "@/providers/twilio.provider";
import { updateContact } from "@/store/slices/contactSlice";
import { fetchDispositions } from "@/store/slices/dispositionSlice";
import { Phone, User, Check, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { ICON_MAP, COLOR_ACTIVE, COLOR_IDLE } from "../contactdetail/detail";

interface CallOutcomesProps {
    onNext?: () => void;
}

const SMART_VALUES = ["CONTACT", "NO_ANSWER", "BAD_NUMBER", "VOICEMAIL", "DNC_CONTACT", "DNC_NUMBER"];

const CallOutcomes = ({ onNext }: CallOutcomesProps) => {
    const dispatch = useAppDispatch();
    const { endCall, dropVoicemail, isCalling } = useTwilio();
    const { currentContact } = useAppSelector((state) => state.contacts);
    const { dispositions } = useAppSelector(s => s.dispositions);

    const [selectedDisp, setSelectedDisp] = useState<string | null>(null);
    const [savedDisp, setSavedDisp] = useState<string | null>(null);
    const [savingDisp, setSavingDisp] = useState(false);

    useEffect(() => {
        dispatch(fetchDispositions());
    }, [dispatch]);

    useEffect(() => {
        if (currentContact) {
            const d = currentContact.disposition ?? null;
            setSelectedDisp(d);
            setSavedDisp(d);
        }
    }, [currentContact]);

    const handleSmartAction = async (label: string, value: string) => {
        if (!currentContact?.id) return;
        const upperVal = value.toUpperCase();
        setSelectedDisp(value);
        setSavingDisp(true);
        try {
            await dispatch(updateContact({
                id: currentContact.id,
                payload: { disposition: value }
            })).unwrap();
            setSavedDisp(value);
            toast.success(`Outcome set: ${label}`);

            switch (upperVal) {
                case "NO_ANSWER":
                case "BAD_NUMBER":
                    if (isCalling) await endCall();
                    if (onNext) onNext();
                    break;
                case "VOICEMAIL":
                    await dropVoicemail();
                    if (onNext) onNext();
                    break;
                case "DNC_CONTACT":
                case "DNC_NUMBER":
                    if (isCalling) await endCall();
                    await api.post(`/contact/${currentContact.id}/move-to-dnc`, {
                        phoneIds: upperVal === "DNC_NUMBER" ? [currentContact.phones?.[0]?.id] : []
                    });
                    if (onNext) onNext();
                    break;
                default:
                    if (isCalling) await endCall();
                    if (onNext) onNext();
                    break;
            }
        } catch (err: any) {
            toast.error("Failed to update disposition: " + err);
        } finally {
            setSavingDisp(false);
        }
    };

    function getDispLabel(value: string) {
        return dispositions.find(d => d.value === value)?.label ?? value;
    }

    const activeDispositions = dispositions.filter(d => d.isActive);
    const smartItems = activeDispositions.filter(d => SMART_VALUES.includes(d.value.toUpperCase()));

    if (!currentContact) return null;

    return (
        <div className="flex flex-col gap-3 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 w-full">
            <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-50 dark:border-slate-700/50 mb-1">
                <Phone size={12} className="text-gray-400 dark:text-gray-500" />
                <h1 className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Outcomes</h1>
            </div>

            <div className="grid grid-cols-2 gap-1.5 px-1">
                {smartItems.map(d => {
                    const Icon = ICON_MAP[d.icon] ?? User;
                    const isActive = selectedDisp === d.value;
                    return (
                        <button
                            key={d.id}
                            onClick={() => handleSmartAction(d.label, d.value)}
                            disabled={savingDisp}
                            className={`inline-flex items-center justify-center gap-1.5 px-2 py-2 text-[9px] rounded-xl border font-black transition-all duration-150 active:scale-95 ${isActive
                                ? (COLOR_ACTIVE[d.color] || COLOR_ACTIVE.red)
                                : (COLOR_IDLE[d.color] || COLOR_IDLE.red)
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{d.label.toUpperCase()}</span>
                        </button>
                    );
                })}
            </div>

            {selectedDisp !== savedDisp && selectedDisp && !SMART_VALUES.includes(selectedDisp.toUpperCase()) && (
                <div className="flex justify-end pt-1">
                    <button
                        onClick={() => handleSmartAction(getDispLabel(selectedDisp), selectedDisp)}
                        disabled={savingDisp}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-black bg-[#FFCA06] hover:bg-[#f0bc00] text-gray-900 shadow-sm transition-all uppercase"
                    >
                        {savingDisp ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check size={12} /> Save</>}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CallOutcomes;
