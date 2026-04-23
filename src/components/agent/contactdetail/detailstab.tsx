import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { MapPin, Mail, Phone, Plus, MoreVertical } from "lucide-react";
import PhoneModal from '@/components/modal/phonemodal';
import EmailModal from '@/components/modal/emailmodal';
import { TbEdit } from "react-icons/tb";
import EditModal from '@/components/modal/editmodal';

const DetailsTab = () => {
    const { currentContact } = useAppSelector((state) => state.contacts);
    const [showEditModal, setShowEditModal] = useState(false);
    const [phoneModal, setPhoneModal] = useState(false);
    const [editingPhone, setEditingPhone] = useState<any>(null);
    const [editingPhoneIndex, setEditingPhoneIndex] = useState<number | undefined>(undefined);
    const [emailModal, setEmailModal] = useState(false);
    const [editingEmail, setEditingEmail] = useState<any>(null);
    const [editingEmailIndex, setEditingEmailIndex] = useState<number | undefined>(undefined);

    if (!currentContact) return null;

    return (
        <div className="flex flex-col gap-8">
            {/* Header with Edit */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Contact Information</h3>
                    <p className="text-xs text-gray-500">Manage addresses and contact methods</p>
                </div>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <TbEdit size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Addresses */}
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl h-fit">
                            <MapPin size={18} className="text-yellow-600 dark:text-yellow-500" />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Property Address</h4>
                            <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                                <p><span className="text-gray-400 font-medium inline-block w-20">Address:</span> {currentContact.address || '-'}</p>
                                <p><span className="text-gray-400 font-medium inline-block w-20">City:</span> {currentContact.city || '-'}</p>
                                <p><span className="text-gray-400 font-medium inline-block w-20">State:</span> {currentContact.state || '-'}</p>
                                <p><span className="text-gray-400 font-medium inline-block w-20">Zip code:</span> {currentContact.zip || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl h-fit">
                            <Mail size={18} className="text-blue-600 dark:text-blue-500" />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Mailing Address</h4>
                            <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                                <p><span className="text-gray-400 font-medium inline-block w-20">Address:</span> {currentContact.mailingAddress || '-'}</p>
                                <p><span className="text-gray-400 font-medium inline-block w-20">City:</span> {currentContact.mailingCity || '-'}</p>
                                <p><span className="text-gray-400 font-medium inline-block w-20">State:</span> {currentContact.mailingState || '-'}</p>
                                <p><span className="text-gray-400 font-medium inline-block w-20">Zip code:</span> {currentContact.mailingZip || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phones & Emails */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Phone Numbers</h4>
                            <button
                                onClick={() => { setEditingPhone(null); setEditingPhoneIndex(undefined); setPhoneModal(true); }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                            >
                                <Plus size={14} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {currentContact.phones?.map((phone: any, index: number) => (
                                <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl group border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Phone size={12} className="text-blue-500" />
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{phone.number}</span>
                                    </div>
                                    <button
                                        onClick={() => { setEditingPhone(phone); setEditingPhoneIndex(index); setPhoneModal(true); }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    >
                                        <MoreVertical size={14} className="text-gray-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Email Addresses</h4>
                            <button
                                onClick={() => { setEditingEmail(null); setEditingEmailIndex(undefined); setEmailModal(true); }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                            >
                                <Plus size={14} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {currentContact.emails?.map((email: any, index: number) => (
                                <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl group border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Mail size={12} className="text-blue-500" />
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{email.email}</span>
                                    </div>
                                    <button
                                        onClick={() => { setEditingEmail(email); setEditingEmailIndex(index); setEmailModal(true); }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    >
                                        <MoreVertical size={14} className="text-gray-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && <EditModal onClose={() => setShowEditModal(false)} />}
            {phoneModal && <PhoneModal isOpen={phoneModal} onClose={() => setPhoneModal(false)} initialData={editingPhone} index={editingPhoneIndex} />}
            {emailModal && <EmailModal isOpen={emailModal} onClose={() => setEmailModal(false)} initialData={editingEmail} index={editingEmailIndex} />}
        </div>
    );
};

export default DetailsTab;
