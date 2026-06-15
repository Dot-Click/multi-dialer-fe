import { useAppSelector } from "@/store/hooks";
import dayjs from "dayjs";
import { FileAudio, Mail, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useEmailHistory, type EmailLog } from "@/hooks/useEmailHistory";
import api from "@/lib/axios";

interface ActivityLog {
    id: string;
    action: string;
    note?: string;
    createdAt: string;
    user: { fullName: string };
}

const History = () => {
    const { currentContact } = useAppSelector((state) => state.contacts);
    const { session, role } = useAppSelector((state) => state.auth);
    const { getEmailHistoryForContact, loading: loadingEmails } = useEmailHistory();
    const [emailHistory, setEmailHistory] = useState<EmailLog[]>([]);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const allCallRecords = currentContact?.callRecords || [];

    const filteredRecords = (role === 'ADMIN' || role === 'OWNER' || role === 'SUPER_ADMIN')
        ? allCallRecords
        : allCallRecords.filter((record: any) => record.userId === session?.user?.id);

    const fetchActivityLogs = useCallback(() => {
        if (!currentContact?.id) return;
        setLoadingLogs(true);
        api.get(`/contact/${currentContact.id}/activity-logs`)
            .then(res => setActivityLogs(res.data.data || []))
            .catch(() => {})
            .finally(() => setLoadingLogs(false));
    }, [currentContact?.id]);

    useEffect(() => {
        if (currentContact?.id) {
            getEmailHistoryForContact(currentContact.id).then(setEmailHistory);
            fetchActivityLogs();
        }
    }, [currentContact?.id, getEmailHistoryForContact, fetchActivityLogs]);

    useEffect(() => {
        window.addEventListener('CONTACT_ACTIVITY_UPDATED', fetchActivityLogs);
        return () => window.removeEventListener('CONTACT_ACTIVITY_UPDATED', fetchActivityLogs);
    }, [fetchActivityLogs]);

    return (
        <div className='flex gap-10 w-full flex-col'>
            {/* Contact Activity Section */}
            <div className='w-full'>
                <h1 className='text-[#0E1011] dark:text-white text-[18px] font-medium mb-4'>Contact Activity:</h1>
                <div className='flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2'>
                    {loadingLogs ? (
                        <div className="flex items-center gap-2 py-4 text-gray-400">
                            <div className="animate-spin h-4 w-4 border-2 border-[#FFCA06] border-b-transparent rounded-full" />
                            <span className="text-sm">Loading activity...</span>
                        </div>
                    ) : activityLogs.length > 0 ? (
                        activityLogs.map(log => (
                            <div key={log.id} className='flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-3'>
                                <div className='w-8 h-8 bg-yellow-100 dark:bg-yellow-500/10 rounded-full flex items-center justify-center shrink-0'>
                                    <UserCheck size={16} className='text-yellow-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-[13px] font-medium text-[#0E1011] dark:text-white'>{log.action}</p>
                                    {log.note && <p className='text-[12px] text-gray-500 dark:text-gray-400 truncate'>{log.note}</p>}
                                    <p className='text-[11px] text-gray-400 dark:text-gray-500'>by {log.user?.fullName || 'Unknown'}</p>
                                </div>
                                <div className='text-right shrink-0'>
                                    <p className='text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap'>
                                        {dayjs(log.createdAt).format('MMM DD, YYYY')}
                                    </p>
                                    <p className='text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap'>
                                        {dayjs(log.createdAt).format('hh:mm A')}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-700'>
                            <UserCheck size={28} className='text-gray-300 dark:text-gray-600 mb-2' />
                            <p className='text-sm text-gray-400'>No contact activity logged yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Call History & Recordings Row */}
            <div className='flex gap-6 w-full flex-col md:flex-row min-h-40'>
                <div className="flex w-full md:w-[55%] flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-[#0E1011] dark:text-white text-[18px] font-medium">Call History:</h1>
                        {role === 'AGENT' && (
                            <span className="text-[12px] text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Showing your calls only</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((record: any) => (
                                <div key={record.id} className='flex items-start gap-2 justify-between border-b border-gray-100 dark:border-gray-700 pb-3'>
                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-[#2B3034] dark:text-gray-300 text-[12px] font-medium'>
                                            {record.user?.fullName || "System"}
                                            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${record.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </h1>
                                        <p className='text-[#0E1011] dark:text-white font-normal text-[14px]'>
                                            {record.disposition || "No disposition"}
                                            {record.duration ? ` • ${Math.floor(record.duration / 60)}m ${record.duration % 60}s` : ""}
                                        </p>
                                    </div>
                                    <div className='flex flex-col text-right'>
                                        <p className='text-[#495057] dark:text-gray-400 whitespace-nowrap text-[12px] font-normal'>
                                            {dayjs(record.startTime).format('MMM DD, YYYY')}
                                        </p>
                                        <p className='text-[#495057] dark:text-gray-400 whitespace-nowrap text-[12px] font-normal'>
                                            {dayjs(record.startTime).format('hh:mm A')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                                <p className="text-sm">No call history found</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex w-full md:w-[45%] gap-6 flex-col'>
                    <h1 className='test-[#0E1011] dark:text-white text-[18px] font-medium'>Call Recordings:</h1>

                    <div className='flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2'>
                        {filteredRecords.filter((r: any) => r.recordingUrl).length > 0 ? (
                            filteredRecords.filter((r: any) => r.recordingUrl).map((record: any) => (
                                <div key={record.id} className="bg-[#F8F9FA] dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                            <FileAudio size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[#0E1011] dark:text-white">
                                                Call by {record.user?.fullName || "Agent"}
                                            </p>
                                            <p className="text-[12px] text-gray-500 dark:text-gray-400">
                                                {dayjs(record.startTime).format('MMM DD, YYYY • hh:mm A')}
                                            </p>
                                        </div>
                                    </div>
                                    <audio controls className="w-full h-8 custom-audio-player">
                                        <source src={record.recordingUrl} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            ))
                        ) : (
                            <div className='flex mt-10 gap-0.5 h-full items-center w-full flex-col'>
                                <h1 className='text-[#000000] dark:text-white text-[14px] font-medium'>No Data Available</h1>
                                <p className='text-[#848C94] dark:text-gray-400 text-[14px] font-normal'>There are no call recordings</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Email History Section */}
            <div className='w-full border-t border-gray-100 dark:border-gray-700 pt-8'>
                <h1 className='text-[#0E1011] dark:text-white text-[18px] font-medium mb-6'>Email History:</h1>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[600px]'>
                    {loadingEmails ? (
                        <div className="col-span-full py-10 flex flex-col items-center gap-2">
                            <div className="animate-spin h-6 w-6 border-2 border-[#FFCA06] border-b-transparent rounded-full" />
                            <p className="text-sm text-gray-400">Loading emails...</p>
                        </div>
                    ) : emailHistory.length > 0 ? (
                        emailHistory.map((email) => (
                            <div key={email.id} className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex flex-col gap-3 shadow-sm'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <div className={`p-2 rounded-xl ${email.status === 'SENT' ? 'bg-green-50 dark:bg-green-500/10 text-green-600' : 'bg-red-50 dark:bg-red-500/10 text-red-600'}`}>
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>
                                                {email.status === 'SENT' ? (
                                                    <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Sent</span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-red-500"><XCircle size={10} /> Failed</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <p className='text-[11px] text-gray-400 font-medium'>
                                        {dayjs(email.createdAt).format('MMM DD, hh:mm A')}
                                    </p>
                                </div>
                                
                                <div className='flex flex-col'>
                                    <h3 className='text-[14px] font-semibold text-[#0E1011] dark:text-white truncate' title={email.subject}>
                                        {email.subject}
                                    </h3>
                                    {email.template && (
                                        <p className='text-[11px] text-gray-400 font-medium'>
                                            Template: <span className="text-[#FFCA06]">{email.template.templateName}</span>
                                        </p>
                                    )}
                                </div>

                                <div className='mt-1 flex items-center justify-between'>
                                    <p className='text-[12px] text-gray-500 dark:text-gray-400'>
                                        By <span className="font-medium">{email.user?.fullName || "System"}</span>
                                    </p>
                                    {email.error && (
                                        <p className="text-[10px] text-red-400 truncate max-w-[100px]" title={email.error}>{email.error}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='col-span-full flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700'>
                            <Mail className='text-gray-300 mb-2' size={32} />
                            <p className='text-gray-400 text-sm'>No email history found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;