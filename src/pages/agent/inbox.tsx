import { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';
import bombLogo from "/images/bombbomb_icon.png";
import toast from 'react-hot-toast';
import { FiSend, FiSearch, FiMessageSquare, FiUser } from 'react-icons/fi';

const Inbox = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isBombBombOpen, setIsBombBombOpen] = useState(false);
  const [bombBombVideos, setBombBombVideos] = useState<any[]>([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchConversation(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchInbox = async () => {
    try {
      const res = await api.get('/calling/sms/inbox');
      if (res.data.success) {
        setConversations(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load inbox");
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (contactId: string) => {
    try {
      const res = await api.get(`/calling/sms/conversation/${contactId}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact) return;

    try {
      const res = await api.post('/calling/send-sms', {
        to: selectedContact.remoteNumber || selectedContact.phones[0]?.number || "",
        message: messageText,
        contactId: selectedContact.isUnknown ? undefined : selectedContact.id
      });

      if (res.data.success) {
        setMessageText("");
        fetchConversation(selectedContact.id);
        fetchInbox(); // Refresh last message in inbox
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

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
    setMessageText((prev) => prev ? `${prev}\n\nWatch Video: ${videoUrl}` : `Watch Video: ${videoUrl}`);
    setIsBombBombOpen(false);
    toast.success("Video added to message");
  };

  useEffect(() => {
    if (isBombBombOpen) {
      fetchVideos();
    }
  }, [isBombBombOpen]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full">
      <div className="mb-4">
        <h1 className="text-[28px] font-medium text-[#0E1011] dark:text-white">Inbox</h1>
        <p className="text-sm text-gray-500">Manage your SMS conversations and video messages.</p>
      </div>

      <div className="flex flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
        {/* Sidebar: Conversations List */}
        <div className="w-80 border-r border-gray-100 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-gray-50 dark:border-slate-800/50">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all border-b border-gray-50 dark:border-slate-800/20 ${selectedContact?.id === contact.id ? 'bg-gray-50 dark:bg-slate-800/50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shrink-0">
                      <FiUser size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {contact.fullName}
                        </h4>
                        <span className="text-[10px] text-gray-400 uppercase font-black">
                          {contact.smsLogs[0] && new Date(contact.smsLogs[0].createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium flex items-center gap-1">
                        {contact.isUnknown && <span className="px-1 bg-gray-100 dark:bg-slate-700 rounded text-[9px]">Unknown</span>}
                        {contact.smsLogs[0]?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center mt-10">
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <FiMessageSquare size={32} />
                </div>
                <p className="text-sm text-gray-500 font-medium">No conversations found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50/30 dark:bg-slate-900/10">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-black font-black">
                    {selectedContact.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedContact.fullName}
                      {selectedContact.isUnknown && <span className="ml-2 text-[10px] bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-gray-400">UNKNOWN NUMBER</span>}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{selectedContact.remoteNumber || selectedContact.phones[0]?.number}</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.status === 'SENT' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.status === 'SENT' 
                      ? 'bg-yellow-400 text-black rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-tl-none border border-gray-100 dark:border-slate-700'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <span className={`text-[9px] block mt-1 font-bold uppercase tracking-widest ${msg.status === 'SENT' ? 'text-black/50' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative group">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-yellow-500">Message</label>
                      <button 
                        onClick={() => setIsBombBombOpen(true)}
                        className="flex items-center gap-1.5 px-2 py-1 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg border border-red-100 transition-all transform active:scale-95 group/bb"
                      >
                        <img src={bombLogo} alt="BB" className="w-3 h-3 object-contain group-hover/bb:brightness-0 group-hover/bb:invert" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Add Video</span>
                      </button>
                    </div>
                    <textarea 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none min-h-[44px] max-h-32"
                    />
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="w-12 h-12 rounded-2xl bg-yellow-400 text-black flex items-center justify-center hover:bg-yellow-500 transition-all shadow-md disabled:opacity-50 active:scale-90 shrink-0 mb-[2px]"
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-gray-400">
                <FiMessageSquare size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Conversation</h3>
              <p className="text-sm text-gray-500 max-w-sm">Select a contact from the left to start messaging. Your conversation history will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* BombBomb Modal */}
      {isBombBombOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-slate-700">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center p-1.5 shadow-lg">
                    <img src={bombLogo} alt="BombBomb" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">BombBomb Library</h3>
                </div>
                <button onClick={() => setIsBombBombOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
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
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="m7 4 12 8-12 8V4z"/></svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-bold text-gray-900 dark:text-white truncate mb-1">{video.name}</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Added on {new Date(video.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-gray-300 group-hover:text-red-500 transition-colors px-2">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We couldn't find any videos in your BombBomb account.</p>
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
    </div>
  );
};

export default Inbox;
