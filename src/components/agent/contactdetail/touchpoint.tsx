import { useState, useEffect } from "react";
import { HiMail, HiPaperAirplane, HiClock, HiOutlineMailOpen } from "react-icons/hi";
import { HiOutlineMapPin, HiOutlineUser } from "react-icons/hi2";
import { useEmailTemplate, type EmailTemplate } from "@/hooks/useEmailTemplate";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { FiLoader } from "react-icons/fi";

// ─── Direct Mail Form ─────────────────────────────────────────────────────────

interface DirectMailFormProps {
  contactId: string;
  contactName: string;
}

const DirectMailForm = ({ contactId, contactName }: DirectMailFormProps) => {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    recipientName: contactName || "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: "US",
    message: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSend = async () => {
    if (!form.address1 || !form.city || !form.postcode || !form.recipientName) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    try {
      const res = await api.post("/system-settings/integration/send-direct-mail", {
        contactId,
        ...form,
      });
      if (res.data.success) {
        toast.success("Direct mail sent via Stannp! 📬");
        setForm((prev) => ({ ...prev, address1: "", address2: "", city: "", postcode: "", message: "" }));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send direct mail.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#F3F4F7] dark:bg-gray-700/50 rounded-[20px] p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-[#111111] dark:bg-yellow-400/20 rounded-xl flex items-center justify-center">
          <HiOutlineMailOpen className="text-white dark:text-yellow-400 text-xl" />
        </div>
        <div>
          <h3 className="text-[16px] font-black text-[#111111] dark:text-white">Stannp Direct Mail</h3>
          <p className="text-[12px] text-[#848C94] font-medium">Send a physical letter or postcard to contact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recipient Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            <HiOutlineUser className="inline mr-1.5" />Recipient Name *
          </label>
          <input
            type="text"
            value={form.recipientName}
            onChange={(e) => update("recipientName", e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all"
            placeholder="Full name on envelope"
          />
        </div>

        {/* Address Line 1 */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            <HiOutlineMapPin className="inline mr-1.5" />Address Line 1 *
          </label>
          <input
            type="text"
            value={form.address1}
            onChange={(e) => update("address1", e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all"
            placeholder="123 Main Street"
          />
        </div>

        {/* Address Line 2 */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Address Line 2</label>
          <input
            type="text"
            value={form.address2}
            onChange={(e) => update("address2", e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all"
            placeholder="Apt, Suite, Floor (optional)"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">City *</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all"
            placeholder="New York"
          />
        </div>

        {/* Postcode */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">ZIP / Postcode *</label>
          <input
            type="text"
            value={form.postcode}
            onChange={(e) => update("postcode", e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all"
            placeholder="10001"
          />
        </div>

        {/* Country */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Country *</label>
          <select
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all"
          >
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="VE">Venezuela</option>
          </select>
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all resize-none"
            placeholder="Write your personal message here..."
          />
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={sending}
        className="w-full py-4 bg-[#FFCA06] text-black text-sm font-black rounded-xl hover:bg-yellow-500 hover:shadow-xl hover:shadow-yellow-400/20 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
      >
        {sending ? (
          <><FiLoader className="animate-spin" /> Sending via Stannp...</>
        ) : (
          <><HiPaperAirplane className="text-lg rotate-45" /> Send Direct Mail</>
        )}
      </button>

      <p className="text-center text-[10px] text-gray-400 font-medium">
        Powered by Stannp.com · Test mode active (no physical mail until configured for live)
      </p>
    </div>
  );
};

// ─── Main TouchPoints Component ───────────────────────────────────────────────

const TouchPoints = () => {
  const { getEmailTemplates, loading } = useEmailTemplate();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const { currentContact } = useAppSelector((state) => state.contacts);
  const [activeTab, setActiveTab] = useState<"email" | "direct">("email");

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await getEmailTemplates();
      setTemplates(data);
    };
    fetchTemplates();
  }, []);

  const handleSendEmail = async (template: EmailTemplate) => {
    if (!currentContact?.emails?.[0]?.email) {
      toast.error("Contact has no primary email address.");
      return;
    }
    try {
      const response = await api.post(`/contact/${currentContact.id}/send-template-email`, {
        templateId: template.id,
      });
      if (response.data.success) {
        toast.success(`Email "${template.templateName}" sent to ${currentContact.fullName}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send email.");
    }
  };

  const handleScheduleEmail = async (template: EmailTemplate) => {
    const date = prompt("Enter schedule date (YYYY-MM-DD HH:MM):", "");
    if (!date) return;
    if (!currentContact?.emails?.[0]?.email) {
      toast.error("Contact has no primary email address.");
      return;
    }
    try {
      const response = await api.post(`/contact/${currentContact.id}/schedule-template-email`, {
        templateId: template.id,
        scheduledAt: new Date(date).toISOString(),
      });
      if (response.data.success) {
        toast.success(`Email "${template.templateName}" scheduled for ${date}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to schedule email.");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 p-4 md:p-8 font-inter text-[#0E1011] dark:text-white transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[18px] font-extrabold dark:text-white">Touch Points</h1>
        <p className="text-[#848C94] text-[13px] mt-1 font-medium">
          Send automated Email templates or physical Direct Mail campaigns to this contact.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 p-1 bg-[#F3F4F7] dark:bg-gray-700/50 rounded-2xl">
        <button
          onClick={() => setActiveTab("email")}
          className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all font-bold text-[14px] ${
            activeTab === "email"
              ? "bg-[#111111] text-white shadow-lg"
              : "text-[#848C94] hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          <HiMail className="text-lg" />
          Email Templates
        </button>
        <button
          onClick={() => setActiveTab("direct")}
          className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all font-bold text-[14px] ${
            activeTab === "direct"
              ? "bg-[#111111] text-white shadow-lg"
              : "text-[#848C94] hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          <HiOutlineMailOpen className="text-lg" />
          Direct Mail
        </button>
      </div>

      {/* Content */}
      {activeTab === "email" ? (
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFCA06] mb-4" />
              <p className="font-medium">Fetching templates...</p>
            </div>
          ) : templates.length > 0 ? (
            templates.map((template) => (
              <div
                key={template.id}
                className="w-full bg-[#F3F4F7] dark:bg-gray-700/50 p-6 rounded-[20px] flex items-center justify-between group transition-all hover:bg-[#EBEDF0] dark:hover:bg-gray-700"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-[16px] font-bold text-[#111111] dark:text-white">{template.templateName}</h3>
                  <p className="text-[13px] text-[#848C94] font-medium truncate max-w-[200px] sm:max-w-md">
                    Subject: {template.subject}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className={`hidden sm:block px-4 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${template.status !== false ? "bg-[#111111] text-white" : "bg-[#D1D5DB] text-gray-600"}`}>
                    {template.status !== false ? "active" : "inactive"}
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => handleScheduleEmail(template)}
                      className="p-2.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                      title="Schedule communication"
                    >
                      <HiClock className="text-lg" />
                      <span className="hidden sm:inline text-xs font-bold">Schedule</span>
                    </button>
                    <button
                      onClick={() => handleSendEmail(template)}
                      className="p-2.5 sm:px-4 sm:py-2 bg-[#FFCA06] text-black rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                      title="Send now"
                    >
                      <HiPaperAirplane className="text-lg rotate-45" />
                      <span className="hidden sm:inline text-xs font-bold">Send Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#F3F4F7] dark:bg-gray-700/30 rounded-[20px] border-2 border-dashed border-gray-200 dark:border-gray-600">
              <HiMail className="text-4xl text-gray-300 mb-2" />
              <p className="text-gray-500 font-medium">No email templates found</p>
              <p className="text-gray-400 text-xs mt-1">Ask your admin to create templates in the Library.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {currentContact ? (
            <DirectMailForm
              contactId={currentContact.id}
              contactName={currentContact.fullName || ""}
            />
          ) : (
            <div className="text-center py-20 text-gray-400 font-medium">No contact selected.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TouchPoints;