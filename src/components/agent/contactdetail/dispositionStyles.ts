import {
    CheckCircle2, XCircle, Phone, PhoneOff, PhoneMissed,
    PhoneIncoming, Flame, Thermometer, Snowflake, Clock,
    Ban, ThumbsDown, Tag,
} from "lucide-react";

// Shared between Detail (contact card) and CallOutcomes (live-call dialer) so
// disposition/call-outcome buttons look identical in both places. Lives in its
// own module — not re-exported from either component file — to avoid a
// circular import between the two.
export const ICON_MAP: Record<string, React.ElementType> = {
    CheckCircle2, XCircle, Phone, PhoneOff, PhoneMissed,
    PhoneIncoming, Flame, Thermometer, Snowflake, Clock,
    Ban, ThumbsDown, Tag,
};

export const COLOR_IDLE: Record<string, string> = {
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

export const COLOR_ACTIVE: Record<string, string> = {
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
