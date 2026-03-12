import { useState, useEffect } from "react";
import { HiMail, HiOutlineChatAlt2, HiPaperAirplane, HiClock } from "react-icons/hi";
import { useEmailTemplate, type EmailTemplate } from "@/hooks/useEmailTemplate";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";
import api from "@/lib/axios";

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
    // For now, let's just show a simulated schedule toast or a prompt
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
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-[18px] font-extrabold dark:text-white">SMS Messaging</h1>
        <p className="text-[#848C94] text-[13px] mt-1 font-medium">
          Manage automated Email and Direct Mail campaigns
        </p>
      </div>

      {/* Tabs / Toggle Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button 
          onClick={() => setActiveTab("email")}
          className={`flex-1 py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all ${
            activeTab === "email" ? "bg-[#111111] text-white" : "bg-white dark:bg-gray-700 border border-[#E5E7EB] dark:border-gray-600 text-[#111111] dark:text-white"
          }`}
        >
          <HiMail className="text-xl" />
          <span className="text-[15px] font-medium">Email Templates</span>
        </button>

        <button 
          onClick={() => setActiveTab("direct")}
          className={`flex-1 py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all ${
            activeTab === "direct" ? "bg-[#111111] text-white" : "bg-white dark:bg-gray-700 border border-[#E5E7EB] dark:border-gray-600 text-[#111111] dark:text-white"
          }`}
        >
          <HiOutlineChatAlt2 className="text-xl" />
          <span className="text-[15px] font-medium">Direct Mail Campaigns</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFCA06] mb-4"></div>
            <p>Fetching templates...</p>
          </div>
        ) : templates.length > 0 ? (
          templates.map((template) => (
            <div
              key={template.id}
              className="w-full bg-[#F3F4F7] dark:bg-gray-700/50 p-6 rounded-[20px] flex items-center justify-between group transition-all hover:bg-[#EBEDF0] dark:hover:bg-gray-700"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-[16px] font-bold text-[#111111] dark:text-white">
                  {template.templateName}
                </h3>
                <p className="text-[13px] text-[#848C94] font-medium truncate max-w-[200px] sm:max-w-md">
                  Subject: {template.subject}
                </p>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                 {/* Status Badge from Image */}
                 <div className={`hidden sm:block px-4 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${template.status !== false ? 'bg-[#111111] text-white' : 'bg-[#D1D5DB] text-gray-600'}`}>
                    {template.status !== false ? 'active' : 'inactive'}
                 </div>

                {/* Action Popover or Buttons */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default TouchPoints;