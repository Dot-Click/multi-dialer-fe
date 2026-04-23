import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSMSTemplates, sendSMSMessage } from "@/store/slices/smsSlice";
import { useCallerIds } from "@/hooks/useSystemSettings";
import bombLogo from "/images/bombbomb_icon.png";
import toast from "react-hot-toast";
import api from "@/lib/axios";

const SMS = () => {
  const dispatch = useAppDispatch();
  const { templates, isLoading } = useAppSelector((state) => state.sms);
  const { currentContact } = useAppSelector((state) => state.contacts);
  const { data: callerIds } = useCallerIds();

  const [message, setMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedCallerId, setSelectedCallerId] = useState("");
  const [isBombBombOpen, setIsBombBombOpen] = useState(false);
  const [bombBombVideos, setBombBombVideos] = useState<any[]>([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);

  useEffect(() => {
    dispatch(fetchSMSTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (isBombBombOpen) {
      fetchVideos();
    }
  }, [isBombBombOpen]);

  const fetchVideos = async () => {
    setIsFetchingVideos(true);
    try {
      const response = await api.get("/system-settings/integration/bombbomb/videos");
      if (response.data.success) {
        setBombBombVideos(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load BombBomb library");
    } finally {
      setIsFetchingVideos(false);
    }
  };

  const handleVideoSelect = (video: any) => {
    const videoUrl = video.shortUrl;
    setMessage((prev) => prev ? `${prev}\n\nWatch Video: ${videoUrl}` : `Watch Video: ${videoUrl}`);
    setIsBombBombOpen(false);
    toast.success("Video added to message");
  };

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
      await dispatch(sendSMSMessage({ to: phoneNumber, message, from: selectedCallerId, contactId: currentContact.id })).unwrap();
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="w-full group">
            <div className="flex justify-between items-end mb-3">
              <label className="block text-gray-400 dark:text-gray-500 text-[11px] font-black uppercase tracking-widest transition-colors group-focus-within:text-yellow-500">
                Compose Message
              </label>

              {/* Prominent BombBomb Action */}
              <button
                onClick={() => setIsBombBombOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl border border-red-100 transition-all duration-300 transform active:scale-95 group/bb"
              >
                <img src={bombLogo} alt="BombBomb" className="w-4 h-4 object-contain group-hover/bb:brightness-0 group-hover/bb:invert transition-all" />
                <span className="text-[10px] font-black uppercase tracking-widest">Insert Video Message</span>
              </button>
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

        {/* BombBomb Modal (Placeholder for now) */}
        {isBombBombOpen && (
          <div className="fixed inset-0 z-1002 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-slate-700">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center p-1.5 shadow-lg">
                    <img src={bombLogo} alt="BombBomb" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">BombBomb Library</h3>
                </div>
                <button onClick={() => setIsBombBombOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto no-scrollbar">
                {isFetchingVideos ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Accessing Library...</p>
                  </div>
                ) : bombBombVideos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {bombBombVideos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleVideoSelect(video)}
                        className="group flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 transition-all cursor-pointer transform active:scale-[0.98]"
                      >
                        <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-800 shrink-0">
                          {video.thumbUrl ? (
                            <img src={video.thumbUrl} alt={video.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" /><rect width="14" height="12" x="2" y="6" rx="2" /></svg>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="m7 4 12 8-12 8V4z" /></svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-bold text-gray-900 dark:text-white truncate mb-1">{video.name}</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Added on {new Date(video.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-gray-300 group-hover:text-red-500 transition-colors px-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 p-4">
                      <img src={bombLogo} alt="BombBomb" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Library is Empty</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We couldn't find any videos in your BombBomb account. Upload a video on BombBomb.com first.</p>
                    <button
                      onClick={() => setIsBombBombOpen(false)}
                      className="w-full bg-[#0E1011] dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest py-3 rounded-xl hover:opacity-90 transition-all"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
