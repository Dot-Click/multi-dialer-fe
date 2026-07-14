import { useAppSelector } from "@/store/hooks";
import { useEffect, useState, useRef } from "react";
import { useEmailHistory, type EmailLog } from "@/hooks/useEmailHistory";
import { useEmailTemplate, type EmailTemplate } from "@/hooks/useEmailTemplate";
import api from "@/lib/axios";
import dayjs from "dayjs";
import { Mail, CheckCircle2, XCircle, Send, ChevronDown, X, Pencil, FileText } from "lucide-react";
import toast from "react-hot-toast";

type ComposeMode = "template" | "compose";

const Email = () => {
    const { currentContact } = useAppSelector((state) => state.contacts);
    const { getEmailHistoryForContact, loading } = useEmailHistory();
    const { getEmailTemplates } = useEmailTemplate();

    const [emailHistory, setEmailHistory] = useState<EmailLog[]>([]);
    const [showCompose, setShowCompose] = useState(false);
    const [composeMode, setComposeMode] = useState<ComposeMode>("compose");

    // Template mode state
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);

    // Compose mode state
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const [sending, setSending] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const refreshHistory = () => {
        if (currentContact?.id) {
            getEmailHistoryForContact(currentContact.id).then(setEmailHistory);
        }
    };

    useEffect(() => {
        refreshHistory();
    }, [currentContact?.id]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setTemplateDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openCompose = async () => {
        setShowCompose(true);
        setSelectedTemplate(null);
        setSubject("");
        setBody("");
        if (templates.length === 0) {
            setTemplatesLoading(true);
            const list = await getEmailTemplates();
            setTemplates(list);
            setTemplatesLoading(false);
        }
    };

    const closeCompose = () => {
        setShowCompose(false);
        setSelectedTemplate(null);
        setSubject("");
        setBody("");
        setTemplateDropdownOpen(false);
    };

    const handleSelectTemplate = (t: EmailTemplate) => {
        setSelectedTemplate(t);
        setTemplateDropdownOpen(false);
    };

    const handleSend = async () => {
        if (!currentContact?.id) return;
        setSending(true);
        try {
            if (composeMode === "template") {
                if (!selectedTemplate) {
                    toast.error("Please select a template.");
                    setSending(false);
                    return;
                }
                await api.post(`/contact/${currentContact.id}/send-template-email`, {
                    templateId: selectedTemplate.id,
                });
            } else {
                if (!subject.trim() || !body.trim()) {
                    toast.error("Subject and message body are required.");
                    setSending(false);
                    return;
                }
                const htmlBody = body.replace(/\n/g, "<br/>");
                await api.post(`/contact/${currentContact.id}/send-email`, {
                    subject: subject.trim(),
                    html: htmlBody,
                });
            }
            toast.success("Email sent successfully!");
            closeCompose();
            refreshHistory();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to send email.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className='flex gap-6 flex-col min-h-40'>
            <div className="flex justify-between items-center">
                <h1 className='text-[#0E1011] dark:text-white text-[18px] font-medium'>Sent Emails</h1>
                <button
                    onClick={openCompose}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FFCA06] text-black text-sm font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-sm"
                >
                    <Send size={14} />
                    Compose Email
                </button>
            </div>

            {/* Compose panel */}
            {showCompose && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-bold text-gray-800 dark:text-white">New Email</p>
                        <button onClick={closeCompose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Mode tabs */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700 px-5">
                        <button
                            onClick={() => setComposeMode("compose")}
                            className={`flex items-center gap-1.5 py-3 px-1 mr-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                                composeMode === "compose"
                                    ? "border-[#FFCA06] text-[#0E1011] dark:text-white"
                                    : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            }`}
                        >
                            <Pencil size={12} />
                            Write Email
                        </button>
                        <button
                            onClick={() => setComposeMode("template")}
                            className={`flex items-center gap-1.5 py-3 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                                composeMode === "template"
                                    ? "border-[#FFCA06] text-[#0E1011] dark:text-white"
                                    : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            }`}
                        >
                            <FileText size={12} />
                            Use Template
                        </button>
                    </div>

                    <div className="p-5 flex flex-col gap-4">
                        {composeMode === "template" ? (
                            <>
                                {/* Template selector */}
                                <div ref={dropdownRef} className="relative">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                                        Select Template
                                    </label>
                                    <button
                                        onClick={() => setTemplateDropdownOpen((v) => !v)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-left"
                                    >
                                        <span className={selectedTemplate ? "text-gray-800 dark:text-white font-medium" : "text-gray-400"}>
                                            {templatesLoading ? "Loading templates…" : selectedTemplate?.templateName || "Choose a template…"}
                                        </span>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${templateDropdownOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {templateDropdownOpen && (
                                        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                                            {templates.length === 0 ? (
                                                <p className="px-4 py-3 text-sm text-gray-400">No templates found.</p>
                                            ) : templates.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => handleSelectTemplate(t)}
                                                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 last:border-0"
                                                >
                                                    <p className="font-semibold text-gray-800 dark:text-white">{t.templateName}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{t.subject}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Template preview */}
                                {selectedTemplate && (
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Subject</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{selectedTemplate.subject}</p>
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Preview</p>
                                        <div
                                            className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Subject */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Email subject…"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] focus:border-[#FFCA06] outline-none transition-all"
                                    />
                                </div>

                                {/* Body */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Message</label>
                                    <textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        placeholder="Write your message here…"
                                        rows={6}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] focus:border-[#FFCA06] outline-none transition-all resize-y"
                                    />
                                </div>
                            </>
                        )}

                        {/* Send button */}
                        <div className="flex justify-end gap-3 pt-1">
                            <button
                                onClick={closeCompose}
                                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className="flex items-center gap-2 px-5 py-2 bg-[#FFCA06] text-black text-sm font-bold rounded-xl hover:bg-yellow-500 transition-all disabled:opacity-50"
                            >
                                {sending ? (
                                    <span className="h-4 w-4 border-2 border-black border-b-transparent rounded-full animate-spin" />
                                ) : (
                                    <Send size={14} />
                                )}
                                {sending ? "Sending…" : "Send Email"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email history */}
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
