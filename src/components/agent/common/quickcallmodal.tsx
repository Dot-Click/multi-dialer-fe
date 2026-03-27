import { useState, useRef, useEffect } from "react";
import { Phone, PhoneOff, X, User, Delete, Search } from "lucide-react";
import { Modal, Input, Badge, Spin, Select } from "antd";
import { useContact, type ContactBackend } from "@/hooks/useContact";
import { useCallerIds } from "@/hooks/useSystemSettings";
import { useTwilio } from "@/providers/twilio.provider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContactById } from "@/store/slices/contactSlice";
// import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import ContactDisposition from "@/components/agent/contactinfo/contactdisposition";
import Notes from "@/components/agent/contactdetail/notes";

// ─── Props ────────────────────────────────────────────────────────────────────
interface QuickCallModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// ─── Dial Pad Keys ────────────────────────────────────────────────────────────
const KEYS = [
    { label: "1", sub: "" },
    { label: "2", sub: "ABC" },
    { label: "3", sub: "DEF" },
    { label: "4", sub: "GHI" },
    { label: "5", sub: "JKL" },
    { label: "6", sub: "MNO" },
    { label: "7", sub: "PQRS" },
    { label: "8", sub: "TUV" },
    { label: "9", sub: "WXYZ" },
    { label: "*", sub: "" },
    { label: "0", sub: "+" },
    { label: "#", sub: "" },
];

// ─── Full international country code list ─────────────────────────────────────
const COUNTRY_CODES = [
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+1", flag: "🇨🇦", name: "Canada" },
    { code: "+7", flag: "🇷🇺", name: "Russia" },
    { code: "+20", flag: "🇪🇬", name: "Egypt" },
    { code: "+27", flag: "🇿🇦", name: "South Africa" },
    { code: "+30", flag: "🇬🇷", name: "Greece" },
    { code: "+31", flag: "🇳🇱", name: "Netherlands" },
    { code: "+32", flag: "🇧🇪", name: "Belgium" },
    { code: "+33", flag: "🇫🇷", name: "France" },
    { code: "+34", flag: "🇪🇸", name: "Spain" },
    { code: "+36", flag: "🇭🇺", name: "Hungary" },
    { code: "+39", flag: "🇮🇹", name: "Italy" },
    { code: "+40", flag: "🇷🇴", name: "Romania" },
    { code: "+41", flag: "🇨🇭", name: "Switzerland" },
    { code: "+43", flag: "🇦🇹", name: "Austria" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+45", flag: "🇩🇰", name: "Denmark" },
    { code: "+46", flag: "🇸🇪", name: "Sweden" },
    { code: "+47", flag: "🇳🇴", name: "Norway" },
    { code: "+48", flag: "🇵🇱", name: "Poland" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "+51", flag: "🇵🇪", name: "Peru" },
    { code: "+52", flag: "🇲🇽", name: "Mexico" },
    { code: "+53", flag: "🇨🇺", name: "Cuba" },
    { code: "+54", flag: "🇦🇷", name: "Argentina" },
    { code: "+55", flag: "🇧🇷", name: "Brazil" },
    { code: "+56", flag: "🇨🇱", name: "Chile" },
    { code: "+57", flag: "🇨🇴", name: "Colombia" },
    { code: "+58", flag: "🇻🇪", name: "Venezuela" },
    { code: "+60", flag: "🇲🇾", name: "Malaysia" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "+62", flag: "🇮🇩", name: "Indonesia" },
    { code: "+63", flag: "🇵🇭", name: "Philippines" },
    { code: "+64", flag: "🇳🇿", name: "New Zealand" },
    { code: "+65", flag: "🇸🇬", name: "Singapore" },
    { code: "+66", flag: "🇹🇭", name: "Thailand" },
    { code: "+81", flag: "🇯🇵", name: "Japan" },
    { code: "+82", flag: "🇰🇷", name: "South Korea" },
    { code: "+84", flag: "🇻🇳", name: "Vietnam" },
    { code: "+86", flag: "🇨🇳", name: "China" },
    { code: "+90", flag: "🇹🇷", name: "Turkey" },
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+92", flag: "🇵🇰", name: "Pakistan" },
    { code: "+93", flag: "🇦🇫", name: "Afghanistan" },
    { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
    { code: "+95", flag: "🇲🇲", name: "Myanmar" },
    { code: "+98", flag: "🇮🇷", name: "Iran" },
    { code: "+212", flag: "🇲🇦", name: "Morocco" },
    { code: "+213", flag: "🇩🇿", name: "Algeria" },
    { code: "+216", flag: "🇹🇳", name: "Tunisia" },
    { code: "+218", flag: "🇱🇾", name: "Libya" },
    { code: "+220", flag: "🇬🇲", name: "Gambia" },
    { code: "+221", flag: "🇸🇳", name: "Senegal" },
    { code: "+222", flag: "🇲🇷", name: "Mauritania" },
    { code: "+223", flag: "🇲🇱", name: "Mali" },
    { code: "+224", flag: "🇬🇳", name: "Guinea" },
    { code: "+225", flag: "🇨🇮", name: "Ivory Coast" },
    { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
    { code: "+227", flag: "🇳🇪", name: "Niger" },
    { code: "+228", flag: "🇹🇬", name: "Togo" },
    { code: "+229", flag: "🇧🇯", name: "Benin" },
    { code: "+230", flag: "🇲🇺", name: "Mauritius" },
    { code: "+231", flag: "🇱🇷", name: "Liberia" },
    { code: "+232", flag: "🇸🇱", name: "Sierra Leone" },
    { code: "+233", flag: "🇬🇭", name: "Ghana" },
    { code: "+234", flag: "🇳🇬", name: "Nigeria" },
    { code: "+235", flag: "🇹🇩", name: "Chad" },
    { code: "+236", flag: "🇨🇫", name: "Central African Republic" },
    { code: "+237", flag: "🇨🇲", name: "Cameroon" },
    { code: "+238", flag: "🇨🇻", name: "Cape Verde" },
    { code: "+239", flag: "🇸🇹", name: "São Tomé and Príncipe" },
    { code: "+240", flag: "🇬🇶", name: "Equatorial Guinea" },
    { code: "+241", flag: "🇬🇦", name: "Gabon" },
    { code: "+242", flag: "🇨🇬", name: "Republic of the Congo" },
    { code: "+243", flag: "🇨🇩", name: "DR Congo" },
    { code: "+244", flag: "🇦🇴", name: "Angola" },
    { code: "+245", flag: "🇬🇼", name: "Guinea-Bissau" },
    { code: "+246", flag: "🇮🇴", name: "British Indian Ocean Territory" },
    { code: "+248", flag: "🇸🇨", name: "Seychelles" },
    { code: "+249", flag: "🇸🇩", name: "Sudan" },
    { code: "+250", flag: "🇷🇼", name: "Rwanda" },
    { code: "+251", flag: "🇪🇹", name: "Ethiopia" },
    { code: "+252", flag: "🇸🇴", name: "Somalia" },
    { code: "+253", flag: "🇩🇯", name: "Djibouti" },
    { code: "+254", flag: "🇰🇪", name: "Kenya" },
    { code: "+255", flag: "🇹🇿", name: "Tanzania" },
    { code: "+256", flag: "🇺🇬", name: "Uganda" },
    { code: "+257", flag: "🇧🇮", name: "Burundi" },
    { code: "+258", flag: "🇲🇿", name: "Mozambique" },
    { code: "+260", flag: "🇿🇲", name: "Zambia" },
    { code: "+261", flag: "🇲🇬", name: "Madagascar" },
    { code: "+262", flag: "🇷🇪", name: "Réunion" },
    { code: "+263", flag: "🇿🇼", name: "Zimbabwe" },
    { code: "+264", flag: "🇳🇦", name: "Namibia" },
    { code: "+265", flag: "🇲🇼", name: "Malawi" },
    { code: "+266", flag: "🇱🇸", name: "Lesotho" },
    { code: "+267", flag: "🇧🇼", name: "Botswana" },
    { code: "+268", flag: "🇸🇿", name: "Eswatini" },
    { code: "+269", flag: "🇰🇲", name: "Comoros" },
    { code: "+290", flag: "🇸🇭", name: "Saint Helena" },
    { code: "+291", flag: "🇪🇷", name: "Eritrea" },
    { code: "+297", flag: "🇦🇼", name: "Aruba" },
    { code: "+298", flag: "🇫🇴", name: "Faroe Islands" },
    { code: "+299", flag: "🇬🇱", name: "Greenland" },
    { code: "+350", flag: "🇬🇮", name: "Gibraltar" },
    { code: "+351", flag: "🇵🇹", name: "Portugal" },
    { code: "+352", flag: "🇱🇺", name: "Luxembourg" },
    { code: "+353", flag: "🇮🇪", name: "Ireland" },
    { code: "+354", flag: "🇮🇸", name: "Iceland" },
    { code: "+355", flag: "🇦🇱", name: "Albania" },
    { code: "+356", flag: "🇲🇹", name: "Malta" },
    { code: "+357", flag: "🇨🇾", name: "Cyprus" },
    { code: "+358", flag: "🇫🇮", name: "Finland" },
    { code: "+359", flag: "🇧🇬", name: "Bulgaria" },
    { code: "+370", flag: "🇱🇹", name: "Lithuania" },
    { code: "+371", flag: "🇱🇻", name: "Latvia" },
    { code: "+372", flag: "🇪🇪", name: "Estonia" },
    { code: "+373", flag: "🇲🇩", name: "Moldova" },
    { code: "+374", flag: "🇦🇲", name: "Armenia" },
    { code: "+375", flag: "🇧🇾", name: "Belarus" },
    { code: "+376", flag: "🇦🇩", name: "Andorra" },
    { code: "+377", flag: "🇲🇨", name: "Monaco" },
    { code: "+378", flag: "🇸🇲", name: "San Marino" },
    { code: "+380", flag: "🇺🇦", name: "Ukraine" },
    { code: "+381", flag: "🇷🇸", name: "Serbia" },
    { code: "+382", flag: "🇲🇪", name: "Montenegro" },
    { code: "+385", flag: "🇭🇷", name: "Croatia" },
    { code: "+386", flag: "🇸🇮", name: "Slovenia" },
    { code: "+387", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
    { code: "+389", flag: "🇲🇰", name: "North Macedonia" },
    { code: "+420", flag: "🇨🇿", name: "Czech Republic" },
    { code: "+421", flag: "🇸🇰", name: "Slovakia" },
    { code: "+423", flag: "🇱🇮", name: "Liechtenstein" },
    { code: "+500", flag: "🇫🇰", name: "Falkland Islands" },
    { code: "+501", flag: "🇧🇿", name: "Belize" },
    { code: "+502", flag: "🇬🇹", name: "Guatemala" },
    { code: "+503", flag: "🇸🇻", name: "El Salvador" },
    { code: "+504", flag: "🇭🇳", name: "Honduras" },
    { code: "+505", flag: "🇳🇮", name: "Nicaragua" },
    { code: "+506", flag: "🇨🇷", name: "Costa Rica" },
    { code: "+507", flag: "🇵🇦", name: "Panama" },
    { code: "+508", flag: "🇵🇲", name: "Saint Pierre and Miquelon" },
    { code: "+509", flag: "🇭🇹", name: "Haiti" },
    { code: "+590", flag: "🇬🇵", name: "Guadeloupe" },
    { code: "+591", flag: "🇧🇴", name: "Bolivia" },
    { code: "+592", flag: "🇬🇾", name: "Guyana" },
    { code: "+593", flag: "🇪🇨", name: "Ecuador" },
    { code: "+594", flag: "🇬🇫", name: "French Guiana" },
    { code: "+595", flag: "🇵🇾", name: "Paraguay" },
    { code: "+596", flag: "🇲🇶", name: "Martinique" },
    { code: "+597", flag: "🇸🇷", name: "Suriname" },
    { code: "+598", flag: "🇺🇾", name: "Uruguay" },
    { code: "+599", flag: "🇨🇼", name: "Curaçao" },
    { code: "+670", flag: "🇹🇱", name: "Timor-Leste" },
    { code: "+672", flag: "🇳🇫", name: "Norfolk Island" },
    { code: "+673", flag: "🇧🇳", name: "Brunei" },
    { code: "+674", flag: "🇳🇷", name: "Nauru" },
    { code: "+675", flag: "🇵🇬", name: "Papua New Guinea" },
    { code: "+676", flag: "🇹🇴", name: "Tonga" },
    { code: "+677", flag: "🇸🇧", name: "Solomon Islands" },
    { code: "+678", flag: "🇻🇺", name: "Vanuatu" },
    { code: "+679", flag: "🇫🇯", name: "Fiji" },
    { code: "+680", flag: "🇵🇼", name: "Palau" },
    { code: "+682", flag: "🇨🇰", name: "Cook Islands" },
    { code: "+683", flag: "🇳🇺", name: "Niue" },
    { code: "+685", flag: "🇼🇸", name: "Samoa" },
    { code: "+686", flag: "🇰🇮", name: "Kiribati" },
    { code: "+687", flag: "🇳🇨", name: "New Caledonia" },
    { code: "+688", flag: "🇹🇻", name: "Tuvalu" },
    { code: "+689", flag: "🇵🇫", name: "French Polynesia" },
    { code: "+690", flag: "🇹🇰", name: "Tokelau" },
    { code: "+691", flag: "🇫🇲", name: "Micronesia" },
    { code: "+692", flag: "🇲🇭", name: "Marshall Islands" },
    { code: "+850", flag: "🇰🇵", name: "North Korea" },
    { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
    { code: "+853", flag: "🇲🇴", name: "Macau" },
    { code: "+855", flag: "🇰🇭", name: "Cambodia" },
    { code: "+856", flag: "🇱🇦", name: "Laos" },
    { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
    { code: "+886", flag: "🇹🇼", name: "Taiwan" },
    { code: "+960", flag: "🇲🇻", name: "Maldives" },
    { code: "+961", flag: "🇱🇧", name: "Lebanon" },
    { code: "+962", flag: "🇯🇴", name: "Jordan" },
    { code: "+963", flag: "🇸🇾", name: "Syria" },
    { code: "+964", flag: "🇮🇶", name: "Iraq" },
    { code: "+965", flag: "🇰🇼", name: "Kuwait" },
    { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
    { code: "+967", flag: "🇾🇪", name: "Yemen" },
    { code: "+968", flag: "🇴🇲", name: "Oman" },
    { code: "+970", flag: "🇵🇸", name: "Palestine" },
    { code: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
    { code: "+972", flag: "🇮🇱", name: "Israel" },
    { code: "+973", flag: "🇧🇭", name: "Bahrain" },
    { code: "+974", flag: "🇶🇦", name: "Qatar" },
    { code: "+975", flag: "🇧🇹", name: "Bhutan" },
    { code: "+976", flag: "🇲🇳", name: "Mongolia" },
    { code: "+977", flag: "🇳🇵", name: "Nepal" },
    { code: "+992", flag: "🇹🇯", name: "Tajikistan" },
    { code: "+993", flag: "🇹🇲", name: "Turkmenistan" },
    { code: "+994", flag: "🇦🇿", name: "Azerbaijan" },
    { code: "+995", flag: "🇬🇪", name: "Georgia" },
    { code: "+996", flag: "🇰🇬", name: "Kyrgyzstan" },
    { code: "+998", flag: "🇺🇿", name: "Uzbekistan" },
];

const COUNTRY_CODE_OPTIONS = COUNTRY_CODES.map((c) => ({
    value: `${c.name.replace(/\s/g, "")}${c.code}`,
    dialCode: c.code,
    label: `${c.flag} ${c.code}`,
    searchLabel: `${c.name} ${c.code}`,
    name: c.name,
    flag: c.flag,
}));

const DEFAULT_COUNTRY = COUNTRY_CODE_OPTIONS.find((c) => c.name === "United States")!;

// ── Maps callStatus → human-readable label (same logic ContactInfoHeader uses) ──
const CALL_STATUS_LABEL: Record<string, string> = {
    ringing: "Ringing...",
    connected: "Active Call",
    "on-hold": "On Hold",
    disconnected: "Disconnected",
    idle: "Ready",
};

// ─── Component ────────────────────────────────────────────────────────────────
export const QuickCallModal = ({ open, onOpenChange }: QuickCallModalProps) => {
    const [tab, setTab] = useState<"dialpad" | "contacts">("dialpad");
    const [countryKey, setCountryKey] = useState<string>(DEFAULT_COUNTRY.value);
    const [number, setNumber] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCallerId, setSelectedCallerId] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    // No appStatus needed — we drive purely from callStatus like ContactInfoHeader
    const { startCall, endCall, isCalling, callStatus, duration } = useTwilio();
    const [activeContactId, setActiveContactId] = useState<string | null>(null);
    // const { data: sessionData } = authClient.useSession();
    // const isAdmin = sessionData?.user?.role === "ADMIN";
    const dispatch = useAppDispatch();
    const { currentContact } = useAppSelector((state) => state.contacts);
    const [showCallFocus, setShowCallFocus] = useState(false);

    // Fetch contact details when call is answered to support notes/disposition in modal
    useEffect(() => {
        if (callStatus === "connected" && activeContactId) {
            setShowCallFocus(true);
            dispatch(fetchContactById(activeContactId));
        }
    }, [callStatus, activeContactId, dispatch]);

    const isAnswered = showCallFocus;

    // ── Caller IDs ──
    const { data: callerIds } = useCallerIds();
    const callerIdOptions = (callerIds ?? []).map((c: any) => ({
        label: c.label ? `${c.label} — ${c.twillioNumber}` : c.twillioNumber,
        value: c.twillioNumber,
    }));

    useEffect(() => {
        if (callerIdOptions.length > 0 && !selectedCallerId) {
            setSelectedCallerId(callerIdOptions[0].value);
        }
    }, [callerIds]);

    // ── Contacts ──
    const { getContacts, loading: contactsLoading } = useContact();
    const [contacts, setContacts] = useState<ContactBackend[]>([]);

    useEffect(() => {
        if (!open) return;
        getContacts().then((data) => setContacts(data ?? []));
    }, [open]);

    useEffect(() => {
        if (open && tab === "dialpad") {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open, tab]);

    useEffect(() => {
        if (!open && !isCalling) {
            setTimeout(() => {
                setNumber("");
                setSearch("");
                setTab("dialpad");
                setActiveContactId(null);
                setShowCallFocus(false);
            }, 200);
        }
    }, [open, isCalling]);

    const formatDuration = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const selectedCountry = COUNTRY_CODE_OPTIONS.find((c) => c.value === countryKey) ?? DEFAULT_COUNTRY;
    const fullNumber = number ? `${selectedCountry.dialCode}${number.replace(/\D/g, "")}` : "";

    const handleCall = async (phone: string, contactId?: string | null) => {
        if (!phone) return;
        if (!selectedCallerId) { toast.error("Please select a caller ID first"); return; }
        if (isCalling) { toast.error("A call is already in progress"); return; }
        const cleanPhone = phone.trim().replace(/[^\d+]/g, "");
        const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`;
        try {
            // If contactId is missing (manual dial), try to find a matching contact by phone
            let finalContactId = contactId;
            if (!finalContactId) {
                const searchNum = formattedPhone.replace(/\D/g, "");
                const match = contacts.find(c =>
                    c.phones.some(p => p.number.replace(/\D/g, "").includes(searchNum) || searchNum.includes(p.number.replace(/\D/g, "")))
                );
                finalContactId = match?.id || null;
            }

            setActiveContactId(finalContactId);
            await startCall(formattedPhone, selectedCallerId, finalContactId || "");
        } catch (_) { /* TwilioProvider already toasts */ }
    };

    const handleDisconnect = async () => {
        await endCall();
        onOpenChange(false);
    };

    const handleKey = (key: string) => {
        setNumber((prev) => (prev.length < 15 ? prev + key : prev));
    };

    const handleBackspace = () => {
        setNumber((prev) => prev.slice(0, -1));
    };

    const displayContacts = contacts.filter(
        (c) =>
            c.fullName.toLowerCase().includes(search.toLowerCase()) ||
            c.phones.some((p) => p.number.includes(search))
    );

    // ── Banner colour changes based on callStatus ──
    const isConnected = callStatus === "connected";
    const isRinging = callStatus === "ringing";
    const bannerBg = isConnected
        ? "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700/40"
        : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700/30";
    const dotColor = isConnected ? "bg-green-500" : "bg-yellow-400";
    const pingColor = isConnected ? "bg-green-400" : "bg-yellow-300";
    const textColor = isConnected
        ? "text-green-700 dark:text-green-400"
        : "text-yellow-700 dark:text-yellow-400";

    // ── Shared caller ID selector ──
    const CallerIdSelector = (
        <div className="mb-4">
            <label className="text-xs font-medium mb-1.5 block text-gray-500 dark:text-gray-400">
                From
            </label>
            <Select
                value={selectedCallerId || undefined}
                onChange={setSelectedCallerId}
                options={callerIdOptions}
                placeholder="Select caller ID..."
                className="w-full"
                disabled={isCalling}
                notFoundContent={<span className="text-xs text-gray-400">No caller IDs configured</span>}
            />
        </div>
    );

    // ── Active call banner ──
    // Shows yellow + "Ringing..." until callStatus flips to "connected",
    // then green + "Active Call" + timer. Purely driven by callStatus — no appStatus.
    const ActiveCallBanner = isCalling ? (
        <div className={`mx-6 mt-4 rounded-xl px-4 py-3 flex items-center justify-between border ${bannerBg}`}>
            <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pingColor} opacity-75`} />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`} />
                </span>
                <div>
                    <p className={`text-sm font-semibold ${textColor}`}>
                        {CALL_STATUS_LABEL[callStatus] ?? "Calling..."}
                    </p>
                    {isConnected && (
                        <p className="text-xs font-mono text-green-600 dark:text-green-500">
                            {formatDuration(duration)}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-semibold transition-all"
            >
                <PhoneOff className="size-3.5" />
                {isRinging ? "Cancel" : "Disconnect"}
            </button>
        </div>
    ) : null;

    return (
        <Modal
            open={open}
            onCancel={() => !isCalling && onOpenChange(false)}
            footer={null}
            width={isAnswered ? 900 : 420}
            closable={false}
            className="quick-call-modal"
            styles={{
                container: { padding: 0, borderRadius: 16, overflow: "hidden", border: "none", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)" },
                mask: { backdropFilter: "blur(2px)" },
            }}
        >
            <div className="bg-white dark:bg-slate-800 transition-colors">

                {/* ── Header ── */}
                <div className="px-6 pt-5 pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/40">
                                <Phone className="size-3.5 text-green-600 dark:text-green-400" />
                            </div>
                            Quick Call
                        </div>

                        <button
                            onClick={() => !isCalling && onOpenChange(false)}
                            disabled={isCalling}
                            title={isCalling ? "End the call before closing" : "Close"}
                            className={`p-1.5 rounded-md transition-colors ${isCalling
                                    ? "opacity-30 cursor-not-allowed"
                                    : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>

                {/* ── Active call banner ── */}
                {ActiveCallBanner}

                {/* ── Answered Call View ── */}
                {isAnswered ? (
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left: Contact Info & Notes */}
                            <div className="flex-1 space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Member Details</p>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{currentContact?.fullName || "Loading..."}</h3>
                                    <p className="text-sm text-gray-500 font-mono">{currentContact?.phones?.[0]?.number || "No number"}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">In-Call Notes</p>
                                    <Notes />
                                </div>
                            </div>

                            {/* Right: Dispositions */}
                            <div className="w-full lg:w-[400px]">
                                <ContactDisposition />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ── Tabs ── */}
                        <div className="px-6 pt-4">
                            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
                                {(["dialpad", "contacts"] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTab(t)}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${tab === t
                                            ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                            }`}
                                    >
                                        {t === "dialpad" ? "Dial Pad" : "Contacts"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ── Dial Pad Tab (Only if not answered) ── */}
                {!isAnswered && tab === "dialpad" && (
                    <div className="px-6 pb-6 pt-4 space-y-4">
                        {CallerIdSelector}

                        <div>
                            <label className="text-xs font-medium mb-1.5 block text-gray-500 dark:text-gray-400">
                                To
                            </label>
                            <div className="flex gap-2">
                                <Select
                                    value={countryKey}
                                    onChange={setCountryKey}
                                    disabled={isCalling}
                                    showSearch
                                    className="w-[120px] shrink-0"
                                    popupMatchSelectWidth={260}
                                    filterOption={(input, option) =>
                                        (option?.searchLabel ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                    labelRender={() => (
                                        <span className="flex items-center gap-1 font-medium">
                                            <span>{selectedCountry.flag}</span>
                                            <span>{selectedCountry.dialCode}</span>
                                        </span>
                                    )}
                                    options={COUNTRY_CODE_OPTIONS.map((o) => ({
                                        value: o.value,
                                        label: o.label,
                                        searchLabel: o.searchLabel,
                                    }))}
                                    optionRender={(option) => {
                                        const entry = COUNTRY_CODE_OPTIONS.find((c) => c.value === option.value);
                                        return (
                                            <div className="flex items-center gap-2 py-0.5">
                                                <span className="text-base leading-none">{entry?.flag}</span>
                                                <span className="text-sm truncate">{entry?.name}</span>
                                                <span className="ml-auto text-xs text-gray-400 shrink-0">{entry?.dialCode}</span>
                                            </div>
                                        );
                                    }}
                                />
                                <div className="relative flex-1">
                                    <input
                                        ref={inputRef}
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                                        placeholder="Phone number"
                                        disabled={isCalling}
                                        className="w-full text-center text-xl font-mono tracking-widest bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 dark:focus:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    {number && !isCalling && (
                                        <button
                                            onClick={handleBackspace}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 transition-colors"
                                        >
                                            <Delete className="size-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {fullNumber && (
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 text-center font-mono">
                                    Will dial: {fullNumber}
                                </p>
                            )}
                        </div>

                        {/* Keypad */}
                        <div className="grid grid-cols-3 gap-2">
                            {KEYS.map(({ label, sub }) => (
                                <button
                                    key={label}
                                    onClick={() => handleKey(label)}
                                    disabled={isCalling}
                                    className="flex flex-col items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 border border-gray-100 dark:border-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed py-3"
                                >
                                    <span className="text-lg font-semibold leading-none text-gray-900 dark:text-white">
                                        {label}
                                    </span>
                                    {sub && (
                                        <span className="text-[9px] font-medium tracking-widest mt-0.5 text-gray-400 dark:text-gray-500">
                                            {sub}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Call / Disconnect */}
                        {isCalling ? (
                            <button
                                onClick={handleDisconnect}
                                className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white shadow-lg shadow-red-500/20 transition-all"
                            >
                                <PhoneOff className="size-4" />
                                {isRinging ? "Cancel" : "Disconnect"}
                            </button>
                        ) : (
                            <button
                                onClick={() => handleCall(fullNumber, null)}
                                disabled={!number || !selectedCallerId}
                                className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all ${number && selectedCallerId
                                        ? "bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white shadow-lg shadow-green-600/20"
                                        : "bg-gray-100 dark:bg-slate-900 text-gray-400 dark:text-slate-600 cursor-not-allowed"
                                    }`}
                            >
                                <Phone className="size-4" />
                                Call
                            </button>
                        )}
                    </div>
                )}

                {/* ── Contacts Tab (Only if not answered) ── */}
                {!isAnswered && tab === "contacts" && (
                    <div className="px-6 pb-6 pt-4 space-y-3">
                        {CallerIdSelector}

                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or number..."
                            prefix={<Search className="size-4 text-gray-400 dark:text-gray-500" />}
                            className="bg-gray-50 dark:bg-slate-900 rounded-xl text-gray-900 dark:text-white border-gray-200 dark:border-slate-700"
                        />

                        <div className="max-h-[280px] overflow-y-auto space-y-1 custom-scrollbar -mx-1 px-1">
                            {contactsLoading ? (
                                <div className="flex justify-center py-10"><Spin /></div>
                            ) : displayContacts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center mb-3">
                                        <User className="size-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {search ? "No contacts match your search" : "No contacts available"}
                                    </p>
                                </div>
                            ) : (
                                displayContacts.map((contact) => {
                                    const primaryPhone =
                                        contact.phones.find((p: any) => p.isPrimary)?.number ||
                                        contact.phones[0]?.number;

                                    return (
                                        <button
                                            key={contact.id}
                                            onClick={() => primaryPhone && handleCall(primaryPhone, contact.id)}
                                            disabled={!primaryPhone || isCalling}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <div className="shrink-0 w-9 h-9 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                                                {contact.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                                                    {contact.fullName}
                                                </p>
                                                <p className="text-xs truncate text-gray-400 dark:text-gray-500">
                                                    {primaryPhone ?? "No phone number"}
                                                </p>
                                            </div>
                                            {contact.phones.length > 1 && (
                                                <Badge
                                                    count={`+${contact.phones.length - 1}`}
                                                    style={{ backgroundColor: "#f3f4f6", color: "#6b7280", boxShadow: "none", fontSize: 11 }}
                                                />
                                            )}
                                            <Phone className="size-3.5 text-green-500 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default QuickCallModal;