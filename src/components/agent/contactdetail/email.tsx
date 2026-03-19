import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { useEmailHistory, type EmailLog } from "@/hooks/useEmailHistory";
import dayjs from "dayjs";
import { Mail, CheckCircle2, XCircle } from "lucide-react";

const Email = () => {
    const { currentContact } = useAppSelector((state) => state.contacts);
    const { getEmailHistoryForContact, loading } = useEmailHistory();
    const [emailHistory, setEmailHistory] = useState<EmailLog[]>([]);

    useEffect(() => {
        if (currentContact?.id) {
            getEmailHistoryForContact(currentContact.id).then(setEmailHistory);
        }
    }, [currentContact?.id, getEmailHistoryForContact]);

    return (
        <div className='flex gap-6 flex-col min-h-40'>
            <div className="flex justify-between items-center">
                <h1 className='text-[#0E1011] dark:text-white text-[18px] font-medium'>Sent Emails:</h1>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-2">
                        <div className="animate-spin h-8 w-8 border-2 border-[#FFCA06] border-b-transparent rounded-full" />
                        <p className="text-sm text-gray-400 font-medium">Fetching email history...</p>
                    </div>
                ) : emailHistory.length > 0 ? (
                    emailHistory.map((email) => (
                        <div key={email.id} className='bg-[#F8F9FA] dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 p-5 rounded-[20px] flex flex-col gap-3 transition-all hover:shadow-md'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className={`p-2.5 rounded-xl ${email.status === 'SENT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                                            {email.status === 'SENT' ? (
                                                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Sent Successfully</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-500"><XCircle size={12} /> Delivery Failed</span>
                                            )}
                                        </p>
                                        <p className='text-[11px] text-[#848C94] font-medium mt-0.5'>
                                            {dayjs(email.createdAt).format('MMM DD, YYYY • hh:mm A')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className='flex flex-col mt-1'>
                                <h3 className='text-[15px] font-bold text-[#111111] dark:text-white leading-tight' title={email.subject}>
                                    {email.subject}
                                </h3>
                                {email.template && (
                                    <p className='text-[12px] text-[#848C94] font-semibold mt-1'>
                                        Template: <span className="text-[#0E1011] dark:text-yellow-400">{email.template.templateName}</span>
                                    </p>
                                )}
                            </div>

                            <div className='mt-2 pt-3 border-t border-gray-100 dark:border-gray-600 flex items-center justify-between font-inter'>
                                <p className='text-[12px] text-gray-500 dark:text-gray-400'>
                                    Sent by <span className="font-bold text-[#111111] dark:text-white">{email.user?.fullName || "Agent"}</span>
                                </p>
                                {email.error && (
                                    <p className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-md truncate max-w-[120px]" title={email.error}>{email.error}</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='col-span-full flex flex-col items-center justify-center py-20 bg-[#F3F4F7] dark:bg-gray-700/30 rounded-[20px] border-2 border-dashed border-gray-200 dark:border-gray-600'>
                        <Mail className='text-gray-400 mb-2' size={40} />
                        <h1 className='text-[#000000] dark:text-white text-[16px] font-bold'>No Emails Found</h1>
                        <p className='text-[#848C94] dark:text-gray-400 text-[14px] font-medium'>There are no emails recorded for this contact yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Email;