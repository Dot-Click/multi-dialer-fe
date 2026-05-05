import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    fetchContactFolders,
    fetchContactLists,
    updateContact,
    assignContactToList,
    setCurrentContactFields,
    removeFromQueue,
} from '@/store/slices/contactSlice';
import { fetchDispositions } from '@/store/slices/dispositionSlice';
// import { CiMail } from "react-icons/ci";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { IoAddOutline } from "react-icons/io5";
import { MapPin, Mail, Phone, Plus, MoreVertical, Loader2, User, Check, Flame, Thermometer, Snowflake, Clock, Ban, ThumbsDown, Tag, CheckCircle2, XCircle, PhoneOff, PhoneMissed, PhoneIncoming, Folder, ExternalLink } from "lucide-react";
import EditModal from '@/components/modal/editmodal';
import PhoneModal from '@/components/modal/phonemodal';
import EmailModal from '@/components/modal/emailmodal';
// import propertyicon from "../../../assets/propertyicon.png"
// import kiticon from "../../../assets/kiticon.png"
// import callsicon from "../../../assets/callsicon.png"
// import mobileicon from "../../../assets/mobileicon.png"
// import doticon from "../../../assets/doticon.png"
import toast from 'react-hot-toast'
import { TbEdit } from "react-icons/tb";
import { useTwilio } from "@/providers/twilio.provider";
import api from "@/lib/axios";


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
    rose: "border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950",
    pink: "border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-900 dark:text-pink-400 dark:hover:bg-pink-950",
};

const COLOR_ACTIVE: Record<string, string> = {
    green: "bg-emerald-500 border-emerald-500 text-white",
    red: "bg-red-500 border-red-500 text-white",
    orange: "bg-orange-500 border-orange-500 text-white",
    yellow: "bg-yellow-400 border-yellow-400 text-gray-900",
    blue: "bg-blue-500 border-blue-500 text-white",
    purple: "bg-violet-500 border-violet-500 text-white",
    gray: "bg-gray-600 border-gray-600 text-white dark:bg-slate-500 dark:border-slate-500",
    rose: "bg-rose-500 border-rose-500 text-white",
    pink: "bg-pink-500 border-pink-500 text-white",
};

const US_STATE_ABBREVIATIONS: Record<string, string> = {
    alabama: "AL",
    alaska: "AK",
    arizona: "AZ",
    arkansas: "AR",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    "district of columbia": "DC",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA",
    michigan: "MI",
    minnesota: "MN",
    mississippi: "MS",
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    washington: "WA",
    "west virginia": "WV",
    wisconsin: "WI",
    wyoming: "WY",
};

interface DetailProps {
    onNext?: () => void;
}

const Detail = ({ onNext }: DetailProps) => {
    const dispatch = useAppDispatch();
    const { endCall, dropVoicemail, isCalling } = useTwilio();
    const { currentContact, folders, lists } = useAppSelector((state) => state.contacts);
    const { dispositions } = useAppSelector(s => s.dispositions);
    const [showModal, setShowModal] = useState(false);
    const [phoneModal, setPhoneModal] = useState(false);
    const [editingPhone, setEditingPhone] = useState<any>(null);
    const [editingPhoneIndex, setEditingPhoneIndex] = useState<number | undefined>(undefined);

    const [emailModal, setEmailModal] = useState(false);
    const [editingEmail, setEditingEmail] = useState<any>(null);
    const [editingEmailIndex, setEditingEmailIndex] = useState<number | undefined>(undefined);

    const [selectedFolderId, setSelectedFolderId] = useState<string>('');
    const [selectedListId, setSelectedListId] = useState<string>('');
    const [tagsInput, setTagsInput] = useState<string>('');

    const [selectedDisp, setSelectedDisp] = useState<string | null>(null);
    const [savedDisp, setSavedDisp] = useState<string | null>(null);
    const [savingDisp, setSavingDisp] = useState(false);

    const SMART_VALUES = ["CONTACT", "NO_ANSWER", "BAD_NUMBER", "VOICEMAIL", "DNC_CONTACT", "DNC_NUMBER"];

    useEffect(() => {
        dispatch(fetchContactFolders());
        dispatch(fetchContactLists());
        dispatch(fetchDispositions());
    }, [dispatch]);

    useEffect(() => {
        if (currentContact) {
            const d = currentContact.disposition ?? null;
            setSelectedDisp(d);
            setSavedDisp(d);
            setTagsInput(currentContact.tags?.join(", ") || "");

            if (lists.length > 0) {
                const currentList = lists.find(l => l.contactIds.includes(currentContact.id));
                if (currentList) {
                    setSelectedListId(currentList.id);
                    const currentFolder = folders.find(f => f.listIds.includes(currentList.id));
                    if (currentFolder) {
                        setSelectedFolderId(currentFolder.id);
                    }
                }
            }
        }
    }, [currentContact, lists, folders]);

    if (!currentContact) return null;

    const toRealtorSlug = (value: unknown) =>
        String(value || "")
            .trim()
            .replace(/[^\w\s-]/g, " ")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

    // const realtorStreet = toRealtorSlug([currentContact.address, currentContact.address2].filter(Boolean).join(" "));
    const realtorCity = toRealtorSlug(currentContact.city);
    const normalizedState = String(currentContact.state || "")
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ");
    const realtorState = US_STATE_ABBREVIATIONS[normalizedState] || toRealtorSlug(currentContact.state).toUpperCase();
    const realtorZip = toRealtorSlug(currentContact.zip);
    const realtorLocation = realtorCity && realtorState ? `${realtorCity}_${realtorState}` : realtorZip;

    const realtorUrl = realtorLocation
        ? `https://www.realtor.com/realestateandhomes-search/${realtorLocation}?keywords=${encodeURIComponent(
            [currentContact.address, currentContact.address2].filter(Boolean).join(" ").trim()
        )}`
        : "";

    // const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedFolderId(e.target.value);
    //     setSelectedListId('');
    // };

    const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedListId(e.target.value);
    };

    const handleUpdateOrg = async () => {
        if (!currentContact) {
            toast.error("Contact not found");
            return;
        }
        try {
            // 1. Handle List Assignment
            const currentList = lists.find(l => l.contactIds.includes(currentContact.id));
            if (selectedListId && selectedListId !== currentList?.id) {
                await dispatch(assignContactToList({
                    contactId: currentContact.id,
                    listId: selectedListId,
                })).unwrap();
                dispatch(fetchContactLists());
            }

            // 2. Handle Tags
            const tagsArray = tagsInput
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== "");
            await dispatch(updateContact({
                id: currentContact.id,
                payload: { tags: tagsArray },
            })).unwrap();

            toast.success("Contact updated successfully!");
        } catch (err: any) {
            console.error("Failed to update contact:", err);
            toast.error("Failed to update: " + err);
        }
    };

    async function handleSmartAction(label: string, value: string) {
        if (!currentContact?.id) { toast.error("No contact loaded"); return; }

        setSelectedDisp(value);
        setSavingDisp(true);
        try {
            await dispatch(
                updateContact({
                    id: currentContact.id,
                    payload: { disposition: value, status: value }
                })
            ).unwrap();
            setSavedDisp(value);
            toast.success(`Outcome: ${label}`);

            const upperVal = value.toUpperCase();

            // Auto-remove from session queue for all outcomes EXCEPT Voicemail
            if (upperVal !== "VOICEMAIL" && onNext) {
                dispatch(removeFromQueue(currentContact.id));
                // When we remove from the queue, the next contact automatically 
                // becomes the 'current' one at the same index, so we don't call onNext().
            }

            switch (upperVal) {
                case "NO_ANSWER":
                case "BAD_NUMBER":
                    if (isCalling) await endCall();
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
                    // Already removed from queue above
                    break;
                default:
                    // For general 'CONTACT' or others, the removal above handles it
                    if (isCalling) await endCall();
                    break;
            }
        } catch (err: any) {
            toast.error("Failed to update disposition: " + err);
        } finally {
            setSavingDisp(false);
        }
    }

    function getDispLabel(value: string) {
        return dispositions.find(d => d.value === value)?.label ?? value;
    }

    const QUAL_FIELDS = [
        { label: "Permission", key: "permission" as const },
        { label: "Want", key: "want" as const },
        { label: "Why", key: "why" as const },
        { label: "Status Quo", key: "statusQuo" as const },
        { label: "Timeline", key: "timeline" as const },
        { label: "Agent", key: "agent" as const },
    ];

    async function handleToggleField(key: string, currentValue: boolean) {
        if (!currentContact?.id) return;

        // Optimistic Update
        dispatch(setCurrentContactFields({ [key]: !currentValue }));

        try {
            await dispatch(updateContact({
                id: currentContact.id,
                payload: { [key]: !currentValue }
            })).unwrap();
            toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} updated`);
        } catch (err: any) {
            // Rollback on failure
            dispatch(setCurrentContactFields({ [key]: currentValue }));
            toast.error("Failed to update: " + err);
        }
    }

    const activeDispositions = dispositions.filter(d => d.isActive);
    const smartItems = activeDispositions.filter(d => SMART_VALUES.includes(d.value.toUpperCase()));

    const stats = [
        { id: 1, name: "Calls", number: 0 },
        { id: 2, name: "Emails", number: currentContact.emails?.length || 0 },
        { id: 3, name: "SMS", number: 0 },
    ];

    return (
        <section className='bg-white dark:bg-[#1A1F2E] flex flex-col gap-10 px-8 py-8 w-full mx-auto rounded-[28px] shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-300'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-start'>
                <div className='flex flex-col lg:flex-row lg:gap-14 lg:items-center'>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-7'>
                            <h1 className='text-[20px] md:text-[28px] text-[#0E1011] dark:text-white font-medium'>
                                {currentContact.fullName || "Unnamed Contact"}
                            </h1>
                            <span className="bg-[#F7F7F7] dark:bg-gray-700 p-2 rounded-[12px]">
                                <TbEdit
                                    onClick={() => setShowModal(true)}
                                    className="w-[18px] object-contain cursor-pointer"
                                />
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-[14px] font-medium text-[#2B3034] dark:text-gray-300'>
                                {currentContact.fullName}
                            </span>
                            <span className='text-[14px] font-normal text-[#495057] dark:text-gray-400'>(Owner)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-8'>
                        {stats.map((dt) => (
                            <span key={dt.id} className='flex text-[14px] gap-2 items-center'>
                                <h1 className='text-[#6B7280] dark:text-gray-400 font-bold uppercase tracking-wider text-[11px]'>{dt.name}:</h1>
                                <h1 className='text-[#0E1011] dark:text-white font-bold'>{dt.number}</h1>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex lg:flex-row flex-col justify-between gap-8 items-start'>
                <div className='flex w-full lg:w-1/3 flex-col gap-8'>
                    <div className='flex gap-3 items-start'>
                        <div className="p-1.5 bg-gray-50 dark:bg-white/5 rounded-lg mt-0.5">
                            <MapPin size={16} className="text-[#FFCA06]" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <span>
                                <h1 className='text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-gray-400'>Property Address:</h1>
                            </span>
                            <div className="space-y-1.5 pl-1">
                                <h1 className='text-[#495057] dark:text-gray-300 text-[14px] font-medium flex items-center gap-2'>
                                    <span className="text-gray-400 dark:text-gray-500 w-16">Address:</span> {currentContact.address || '-'}
                                </h1>
                                <h1 className='text-[#495057] dark:text-gray-300 text-[14px] font-medium flex items-center gap-2'>
                                    <span className="text-gray-400 dark:text-gray-500 w-16">City:</span> {currentContact.city || '-'}
                                </h1>
                                <h1 className='text-[#495057] dark:text-gray-300 text-[14px] font-medium flex items-center gap-2'>
                                    <span className="text-gray-400 dark:text-gray-500 w-16">State:</span> {currentContact.state || '-'}
                                </h1>
                                <h1 className='text-[#495057] dark:text-gray-300 text-[14px] font-medium flex items-center gap-2'>
                                    <span className="text-gray-400 dark:text-gray-500 w-16">Zip code:</span> {currentContact.zip || '-'}
                                </h1>
                            </div>
                            <a
                                href={realtorUrl || undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-disabled={!realtorUrl}
                                className={`mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-[#0E1011] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-gray-900 active:scale-95 dark:bg-[#FFCA06] dark:text-gray-900 dark:hover:bg-[#ffd94d] ${realtorUrl ? "" : "pointer-events-none cursor-not-allowed opacity-50"
                                    }`}
                            >
                                <ExternalLink size={14} />
                                Realtor
                            </a>
                        </div>
                    </div>

                    <div className='flex gap-3 items-start'>
                        <div className="p-1.5 bg-gray-50 dark:bg-white/5 rounded-lg mt-0.5">
                            <Mail size={16} className="text-[#FFCA06]" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <span>
                                <h1 className='text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-gray-400'>Mailing Address:</h1>
                            </span>
                            <div className="space-y-1.5 pl-1">
                                <h1 className='text-[#495057] dark:text-gray-300 text-[14px] font-medium flex items-center gap-2'>
                                    <span className="text-gray-400 dark:text-gray-500 w-16">Address:</span> {currentContact.mailingAddress || '-'}
                                </h1>
                                <h1 className='text-[#495057] dark:text-gray-300 text-[14px] font-medium flex items-center gap-2'>
                                    <span className="text-gray-400 dark:text-gray-500 w-16">City:</span> {currentContact.mailingCity || '-'}
                                </h1>
                                <h1 className='text-[#495057] dark:text-gray-300 text-[14px] font-medium flex items-center gap-2'>
                                    <span className="text-gray-400 dark:text-gray-500 w-16">State:</span> {currentContact.mailingState || '-'}
                                </h1>
                                <h1 className='text-[#495057] dark:text-gray-300 text-[14px] font-medium flex items-center gap-2'>
                                    <span className="text-gray-400 dark:text-gray-500 w-16">Zip code:</span> {currentContact.mailingZip || '-'}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex w-full lg:w-1/3 flex-col gap-4'>
                    <div className='flex justify-between items-center mb-1'>
                        <h1 className='text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-gray-400'>Phones:</h1>
                        <span
                            onClick={() => {
                                setEditingPhone(null);
                                setEditingPhoneIndex(undefined);
                                setPhoneModal(true);
                            }}
                            className='p-1.5 rounded-[8px] bg-gray-50 dark:bg-white/5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors'
                        >
                            <Plus className='text-[#495057] dark:text-white shadow-sm' size={16} />
                        </span>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {currentContact.phones?.map((phone: any, index: number) => (
                            <div key={index} className='flex px-2 py-2 justify-between border-b border-gray-50 dark:border-white/5 items-center gap-2 group'>
                                <div className='flex gap-3 items-center'>
                                    <Phone size={14} className="text-[#1D85F0]" />
                                    <span className='text-[#1D85F0] font-bold text-[14px] tracking-tight'>{phone.number}</span>
                                </div>
                                <div>
                                    <MoreVertical
                                        onClick={() => {
                                            setEditingPhone(phone);
                                            setEditingPhoneIndex(index);
                                            setPhoneModal(true);
                                        }}
                                        className='text-gray-400 dark:text-gray-500 text-[15px] cursor-pointer hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100'
                                        size={14}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex w-full lg:w-1/3 flex-col gap-4'>
                    <div className='flex justify-between items-center mb-1'>
                        <h1 className='text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-gray-400'>E-mails:</h1>
                        <span
                            onClick={() => {
                                setEditingEmail(null);
                                setEditingEmailIndex(undefined);
                                setEmailModal(true);
                            }}
                            className='p-1.5 rounded-[8px] bg-gray-50 dark:bg-white/5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors'
                        >
                            <Plus className='text-[#495057] dark:text-white shadow-sm' size={16} />
                        </span>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {currentContact.emails?.map((email: any, index: number) => (
                            <div key={index} className='flex px-2 py-2 justify-between border-b border-gray-50 dark:border-white/5 items-center gap-2 group'>
                                <div className='flex gap-3 items-center'>
                                    <span className='text-[#1D85F0] font-bold text-[14px] tracking-tight'>{email.email}</span>
                                </div>
                                <div>
                                    <MoreVertical
                                        onClick={() => {
                                            setEditingEmail(email);
                                            setEditingEmailIndex(index);
                                            setEmailModal(true);
                                        }}
                                        className='text-gray-400 dark:text-gray-500 text-[15px] cursor-pointer hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100'
                                        size={14}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex w-full flex-col lg:flex-row lg:items-center gap-8 pt-6 border-t border-gray-100 dark:border-white/5'>
                <div className='flex w-full items-center gap-4'>
                    <label htmlFor="list" className='text-[12px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-gray-400 whitespace-nowrap'>List:</label>
                    <select
                        id="list"
                        value={selectedListId}
                        onChange={handleListChange}
                        disabled={!selectedFolderId}
                        className='border-none py-1 px-2 font-semibold text-[#0E1011] dark:text-white flex-1 text-[14px] outline-none bg-transparent disabled:opacity-50 cursor-pointer'
                    >
                        <option value="" className="dark:bg-slate-800">Select List</option>
                        {lists
                            .filter(list => {
                                const folder = folders.find(f => f.id === selectedFolderId);
                                return folder ? folder.listIds.includes(list.id) : false;
                            })
                            .map(list => (
                                <option key={list.id} value={list.id} className="dark:bg-slate-800">{list.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className='flex w-full items-center gap-4'>
                    <label htmlFor="tags" className='text-[12px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-gray-400 whitespace-nowrap'>Tags:</label>
                    <input
                        type="text"
                        id="tags"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="Tag1, Tag2..."
                        className='border-b border-gray-100 dark:border-white/10 py-1 px-2 font-semibold text-[#0E1011] dark:text-white flex-1 text-[14px] outline-none bg-transparent focus:border-[#FFCA06] transition-all'
                    />
                </div>

                <div className="flex items-center">
                    <button
                        onClick={handleUpdateOrg}
                        className="bg-[#0E1011] dark:bg-[#FFCA06] text-white dark:text-[#2B3034] px-8 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:bg-gray-900 dark:hover:bg-[#ffd94d] transition-all active:scale-95 whitespace-nowrap"
                    >
                        Update
                    </button>
                </div>
            </div>

            {/* CALL OUTCOMES */}
            <div className="flex flex-col gap-6 pt-6 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400 dark:text-gray-500" />
                        <h1 className='text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-gray-400'>Call Outcomes</h1>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    {smartItems.map(d => {
                        const Icon = ICON_MAP[d.icon] ?? User;
                        const isActive = selectedDisp === d.value;
                        return (
                            <button
                                key={d.id}
                                onClick={() => handleSmartAction(d.label, d.value)}
                                disabled={savingDisp}
                                className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm rounded-full border font-bold transition-all duration-150 active:scale-95 ${isActive
                                    ? (COLOR_ACTIVE[d.color] || COLOR_ACTIVE.red)
                                    : (COLOR_IDLE[d.color] || COLOR_IDLE.red)
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5 shrink-0 px-0" size={14} />
                                {d.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {selectedDisp !== savedDisp && selectedDisp
                            ? `Selected: ${getDispLabel(selectedDisp)}`
                            : !selectedDisp
                                ? "No disposition selected"
                                : "Up to date"}
                    </p>
                    {selectedDisp !== savedDisp && selectedDisp && !SMART_VALUES.includes(selectedDisp.toUpperCase()) && (
                        <button
                            onClick={() => handleSmartAction(getDispLabel(selectedDisp), selectedDisp)}
                            disabled={savingDisp}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-[#FFCA06] hover:bg-[#f0bc00] text-gray-900 shadow-sm transition-all"
                        >
                            {savingDisp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check size={14} /> Save Outcome</>}
                        </button>
                    )}
                </div>
            </div>

            {/* FOLDERS AS PILLS */}
            <div className="flex flex-col gap-6 pt-6 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                    <Folder size={14} className="text-gray-400 dark:text-gray-500" />
                    <h1 className='text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-gray-400'>Folders</h1>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {folders.map(folder => {
                        const isActive = selectedFolderId === folder.id;
                        return (
                            <button
                                key={folder.id}
                                onClick={() => {
                                    setSelectedFolderId(folder.id);
                                    setSelectedListId('');
                                }}
                                className={`inline-flex items-center px-5 py-2 text-sm rounded-xl border font-bold transition-all duration-150 active:scale-95 ${isActive
                                    ? "bg-[#0E1011] dark:bg-[#FFCA06] border-[#0E1011] dark:border-[#FFCA06] text-white dark:text-gray-900 shadow-md transform -translate-y-0.5"
                                    : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-700 dark:hover:text-gray-200"
                                    }`}
                            >
                                {folder.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* QUALIFICATION CHECKBOXES */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-8 border-t border-gray-100 dark:border-white/5 pb-2">
                {QUAL_FIELDS.map(f => {
                    const val = (currentContact as any)[f.key] || false;
                    return (
                        <div
                            key={f.key}
                            onClick={() => handleToggleField(f.key, val)}
                            className="flex flex-col items-center gap-3 group cursor-pointer min-w-[70px]"
                        >
                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-200 ${val
                                ? "bg-[#0E1011] dark:bg-[#FFCA06] shadow-sm transform scale-110"
                                : "border-2 border-gray-200 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30"
                                }`}>
                                {val && <Check size={14} className="text-white dark:text-gray-900 stroke-[3px]" />}
                            </div>
                            <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 ${val ? "text-[#0E1011] dark:text-[#FFCA06]" : "text-[#6B7280] dark:text-gray-400"
                                }`}>
                                {f.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {showModal && <EditModal onClose={() => setShowModal(false)} />}
            {phoneModal && (
                <PhoneModal
                    isOpen={phoneModal}
                    onClose={() => {
                        setPhoneModal(false);
                        setEditingPhone(null);
                        setEditingPhoneIndex(undefined);
                    }}
                    initialData={editingPhone}
                    index={editingPhoneIndex}
                />
            )}
            {emailModal && (
                <EmailModal
                    isOpen={emailModal}
                    onClose={() => {
                        setEmailModal(false);
                        setEditingEmail(null);
                        setEditingEmailIndex(undefined);
                    }}
                    initialData={editingEmail}
                    index={editingEmailIndex}
                />
            )}
        </section>
    );
};

export default Detail;
