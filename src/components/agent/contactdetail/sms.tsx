
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSMSTemplates, sendSMSMessage } from "@/store/slices/smsSlice";
import { useCallerIds } from "@/hooks/useSystemSettings";
import toast from "react-hot-toast";

const SMS = () => {
  const dispatch = useAppDispatch();
  const { templates, isLoading } = useAppSelector((state) => state.sms);
  const { currentContact } = useAppSelector((state) => state.contacts);
  const { data: callerIds } = useCallerIds();

  const [message, setMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedCallerId, setSelectedCallerId] = useState("");

  useEffect(() => {
    dispatch(fetchSMSTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (callerIds && callerIds.length > 0 && !selectedCallerId) {
      setSelectedCallerId(callerIds[0].twillioNumber || "");
    }
  }, [callerIds]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);

    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        setMessage(template.content);
      }
    }
    // Note: We don't clear the message if they select "Select a template" 
    // to preserve anything they might have started typing.
  };

  const handleSendSMS = async () => {
    if (!currentContact) {
      toast.error("No contact selected");
      return;
    }

    const phoneNumber = currentContact.phones?.find((p: any) => p.isPrimary)?.number || currentContact.phones?.[0]?.number;
    if (!phoneNumber) {
      toast.error("Contact has no phone number");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      await dispatch(sendSMSMessage({ to: phoneNumber, message, from: selectedCallerId })).unwrap();
      toast.success("SMS sent successfully");
      setMessage("");
      setSelectedTemplateId("");
    } catch (error: any) {
      toast.error(error || "Failed to send SMS");
    }
  };

    const phoneNumber = currentContact?.phones?.find((p: any) => p.isPrimary)?.number || currentContact?.phones?.[0]?.number;

  return (
    <div className="w-full h-full bg-white dark:bg-slate-800 p-4 font-sans transition-colors overflow-y-auto no-scrollbar">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0E1011] dark:text-white text-[18px] font-bold uppercase tracking-tight">
            SMS Messenger
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-slate-700 rounded-full border border-gray-100 dark:border-slate-600">
            <div className={`w-2 h-2 rounded-full ${phoneNumber ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              {phoneNumber || 'No Phone Number'}
            </span>
          </div>
        </div>

        {/* Input Form Section */}
        <div className="space-y-6">
          {/* Caller ID Selector */}
          <div className="w-full group">
            <label className="block text-gray-400 dark:text-gray-500 text-[11px] font-black uppercase tracking-widest mb-2 transition-colors group-focus-within:text-yellow-500">
              Sender Number (From)
            </label>
            <div className="relative">
              <select
                value={selectedCallerId}
                onChange={(e) => setSelectedCallerId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all appearance-none cursor-pointer"
              >
                {callerIds && callerIds.length > 0 ? (
                  callerIds.map((cid: any) => (
                    <option key={cid.id} value={cid.twillioNumber} className="dark:bg-slate-800">
                      {cid.label ? `${cid.label} (${cid.twillioNumber})` : cid.twillioNumber}
                    </option>
                  ))
                ) : (
                  <option value="" className="dark:bg-slate-800">Use System Default</option>
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* SMS Templates Input */}
          <div className="w-full group">
            <label className="block text-gray-400 dark:text-gray-500 text-[11px] font-black uppercase tracking-widest mb-2 transition-colors group-focus-within:text-yellow-500">
              Select Template (Optional)
            </label>
            <div className="relative">
              <select
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="dark:bg-slate-800">Choose a pre-made template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id} className="dark:bg-slate-800">
                    {template.templateName}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="w-full group">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-400 dark:text-gray-500 text-[11px] font-black uppercase tracking-widest transition-colors group-focus-within:text-yellow-500">
                Compose Message
              </label>
              <span className={`text-[10px] font-black tracking-widest ${message.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                {message.length} / 160
              </span>
            </div>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-4 text-[15px] font-medium dark:text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none min-h-[140px] shadow-inner"
                placeholder="Type your custom message here..."
              />
              {message && (
                <button 
                  onClick={() => { setMessage(""); setSelectedTemplateId(""); }}
                  className="absolute right-4 bottom-4 text-[10px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Send SMS Button */}
        <button
          onClick={handleSendSMS}
          disabled={isLoading || !message.trim()}
          className="w-full bg-[#FECD56] dark:bg-[#FFCA06] cursor-pointer hover:bg-[#f7c23d] dark:hover:bg-[#f0bc00] transition-all duration-300 rounded-2xl py-4 flex items-center justify-center gap-3 mb-6 shadow-[0_4px_20px_rgba(254,205,86,0.2)] dark:shadow-[0_4px_20px_rgba(255,202,6,0.1)] mt-8 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform duration-200 ${isLoading ? 'animate-pulse scale-95' : '-rotate-12 group-hover:translate-x-1 group-hover:-translate-y-1'}`}
          >
            <path
              d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
              stroke="#0E1011"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[#0E1011] text-[15px] font-black uppercase tracking-wider">
            {isLoading ? "Sending..." : "Send SMS"}
          </span>
        </button>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 font-medium px-6 leading-relaxed">
          Carrier rates may apply. Ensure your message complies with local regulations and TCPA guidelines.
        </p>
      </div>
    </div>

  );
};

export default SMS;
