import { useAppSelector } from '@/store/hooks';
import { MapPin, Phone, Mail, Tag, User } from 'lucide-react';

const ContactSummary = () => {
    const { currentContact } = useAppSelector((state) => state.contacts);

    if (!currentContact) return null;

    const primaryPhone = currentContact.phones?.find((p: any) => p.isPrimary)?.number || currentContact.phones?.[0]?.number || 'N/A';
    const primaryEmail = currentContact.emails?.find((e: any) => e.isPrimary)?.email || currentContact.emails?.[0]?.email || 'N/A';

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl px-6 py-3 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between gap-6 overflow-hidden">
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                    <User className="text-yellow-600 dark:text-yellow-500" size={20} />
                </div>
                <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {currentContact.fullName || "Unnamed Contact"}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            <span className="truncate">{currentContact.city || 'N/A'}, {currentContact.state || 'N/A'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Phone size={12} className="text-blue-500" />
                            <span className="font-medium text-blue-600 dark:text-blue-400">{primaryPhone}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-6 shrink-0">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{primaryEmail}</span>
                </div>
                <div className="h-8 w-px bg-gray-100 dark:bg-slate-700" />
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tags</span>
                    <div className="flex gap-1 mt-0.5">
                        {currentContact.tags?.slice(0, 2).map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-[10px] font-bold rounded-md text-gray-600 dark:text-gray-300">
                                {tag}
                            </span>
                        )) || <span className="text-gray-400 italic text-[11px]">No tags</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSummary;
