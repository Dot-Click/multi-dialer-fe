import React from "react";
import { MoveLeft, Loader2, Calendar, User, Shield, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuditLogs } from "@/hooks/useSystemSettings";
import { format } from "date-fns";

const SuperAdminAuditLogs: React.FC = () => {
    const navigate = useNavigate();
    const { data: logs, isLoading } = useAuditLogs();

    return (
        <section className="w-full min-h-screen flex flex-col gap-6 px-6 py-6 outfit bg-[#F5F6FA] dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center justify-center"
                    >
                        <MoveLeft className="w-6 h-6 text-[#343434] dark:text-white" />
                    </button>
                    <div>
                        <h1 className="text-[#2C2C2C] dark:text-white text-[24px] md:text-[32px] font-semibold inter">
                            Audit Logs
                        </h1>
                        <p className="text-[#828291] dark:text-gray-400 text-[14px] md:text-[16px]">
                            Track all administrative actions and security events
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <div className="bg-white dark:bg-slate-800 border border-[#EBEDF0] dark:border-slate-700 px-4 py-2 rounded-[12px] shadow-sm">
                        <span className="text-[14px] font-medium text-[#343434] dark:text-white">
                            Total Records: {logs?.length || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Logs Table Section */}
            <div className="bg-white dark:bg-slate-800 rounded-[22px] shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA] dark:bg-slate-700/50">
                                <th className="px-6 py-4 text-[13px] font-semibold text-[#495057] dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                                    Action
                                </th>
                                <th className="px-6 py-4 text-[13px] font-semibold text-[#495057] dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                                    Details
                                </th>
                                <th className="px-6 py-4 text-[13px] font-semibold text-[#495057] dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                                    Performed By
                                </th>
                                <th className="px-6 py-4 text-[13px] font-semibold text-[#495057] dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                                    Timestamp
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-[#030213] dark:text-white" />
                                            <span className="text-[#828291] font-medium">Loading audit logs...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : logs && logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                                                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="text-[15px] font-semibold text-[#343434] dark:text-white inter">
                                                    {log.action}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-start gap-2 max-w-md">
                                                <Info className="w-4 h-4 text-[#828291] mt-0.5 shrink-0" />
                                                <span className="text-[14px] text-[#495057] dark:text-gray-300 leading-relaxed">
                                                    {log.details || "No additional details"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-[#828291]" />
                                                    <span className="text-[14px] font-medium text-[#343434] dark:text-white">
                                                        {log.user?.fullName || "System"}
                                                    </span>
                                                </div>
                                                <span className="text-[12px] text-[#828291] dark:text-gray-400 mt-0.5 ml-5">
                                                    {log.user?.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-[#828291] dark:text-gray-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-[14px]">
                                                    {format(new Date(log.createdAt), "MMM dd, yyyy • hh:mm a")}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Info className="w-10 h-10 text-gray-300" />
                                            <span className="text-gray-500 font-medium">No audit logs found</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-2 text-center md:text-left">
                <p className="text-[14px] text-[#828291] dark:text-gray-500">
                    Audit logs are immutable records of system activity and are retained for policy compliance.
                </p>
            </div>
        </section>
    );
};

export default SuperAdminAuditLogs;
