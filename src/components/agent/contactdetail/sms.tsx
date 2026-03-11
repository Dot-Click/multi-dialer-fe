
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSMSTemplates, sendSMSMessage } from "@/store/slices/smsSlice";
import toast from "react-hot-toast";

const SMS = () => {
  const dispatch = useAppDispatch();
  const { templates, isLoading } = useAppSelector((state) => state.sms);
  const { currentContact } = useAppSelector((state) => state.contacts);

  const [message, setMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  useEffect(() => {
    dispatch(fetchSMSTemplates());
  }, [dispatch]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);

    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMessage(template.content);
    } else {
      setMessage("");
    }
  };

  const handleSendSMS = async () => {
    if (!currentContact) {
      toast.error("No contact selected");
      return;
    }

    const phoneNumber = currentContact.phones?.[0]?.number;
    if (!phoneNumber) {
      toast.error("Contact has no phone number");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      await dispatch(sendSMSMessage({ to: phoneNumber, message })).unwrap();
      toast.success("SMS sent successfully");
      setMessage("");
      setSelectedTemplateId("");
    } catch (error: any) {
      toast.error(error || "Failed to send SMS");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-800 p-4 md:p-8 font-sans transition-colors">
      <div className="w-full max-w-full">
        {/* Header */}
        <h2 className="text-[#0E1011] dark:text-white text-[18px] font-semibold mb-10">
          SMS Messaging
        </h2>

        {/* Input Form Section */}
        <div className="space-y-10 mb-6">
          {/* SMS Templates Input */}
          <div className="w-full">
            <label className="block text-[#0E1011] dark:text-white text-[14px] font-medium mb-1">
              SMS Templates
            </label>
            <div className="border-b border-[#E5E7EB] dark:border-gray-700 w-full">
              <select
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                className="w-full bg-transparent dark:text-white outline-none py-2 text-[15px] appearance-none cursor-pointer"
              >
                <option value="" className="dark:bg-slate-800">Select a template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id} className="dark:bg-slate-800">
                    {template.templateName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message Input */}
          <div className="w-full">
            <label className="block text-[#0E1011] dark:text-white text-[14px] font-medium mb-1">
              Message
            </label>
            <div className="border-b border-[#E5E7EB] dark:border-gray-700 w-full">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent dark:text-white outline-none py-2 text-[15px] resize-none min-h-[80px]"
                rows={3}
                placeholder="Type your message here..."
              />
            </div>
          </div>
        </div>

        {/* Send SMS Button */}
        <button
          onClick={handleSendSMS}
          disabled={isLoading}
          className="w-full bg-[#FECD56] cursor-pointer hover:bg-[#f7c23d] transition-all duration-200 rounded-lg py-3.5 flex items-center justify-center gap-3 mb-10 shadow-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Paper Plane Icon matches the design tilt */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform -rotate-12"
          >
            <path
              d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
              stroke="#0E1011"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[#0E1011] text-[15px] font-semibold">
            {isLoading ? "Sending..." : "Send SMS"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SMS;
