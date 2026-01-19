// import scripticon from "../../../assets/scripticon.png"

// const scriptContent = [
//   "Hi, is this [First Name]?",
//   "Great, [First Name], this is [Your Name]. I don't want to take much of your time. The reason I'm calling is that I noticed the property on [Address] is no longer listed.",
//   "Before I let you go, may I quickly ask—are you still considering selling the home, or have your plans changed?",
//   "I completely understand. The market right now is moving in some interesting ways, and many homeowners aren't sure whether to relist or wait. If it's helpful, I'd be glad to share what similar homes nearby are currently going for, just so you have the info at hand.",
//   "Would that be something you'd like me to send over?",
// ];

// const ContactInfoScript = () => {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-3 w-full h-full flex flex-col">
//       <div className="flex items-center gap-3 mb-4 flex-shrink-0">
//         <img src={scripticon} alt="scripticon"  className="w-3 object-contain"/>
//         <h3 className="text-base font-medium text-gray-700">Script</h3>
//       </div>
//       <div className="flex-grow overflow-y-auto pr-2">
//         <div className="space-y-4">
//           {scriptContent.map((paragraph, index) => (
//             <p key={index} className="text-gray-700 leading-relaxed text-base">
//               {paragraph}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactInfoScript;
import { useState } from 'react';
import { 
  Star, 
  Play, 
  Clock, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Send} from 'lucide-react';

const ContactInfoScript = () => {
  const [activeTab, setActiveTab] = useState('Lead Sheet');
  const tabs = ['Lead Sheet', 'History', 'Touch Points'];

  // --- RENDERING FUNCTIONS FOR TABS ---

  const renderLeadSheet = () => (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <label className="text-[13px] font-bold text-[#374151] block mb-1">Company</label>
        <p className="text-[15px] text-[#6b7280]">ABC Corporation</p>
      </div>
      <div>
        <label className="text-[13px] font-bold text-[#374151] block mb-1">Industry</label>
        <p className="text-[15px] text-[#6b7280]">Technology / SaaS</p>
      </div>
      <div>
        <label className="text-[13px] font-bold text-[#374151] block mb-1">Company Size</label>
        <p className="text-[15px] text-[#6b7280]">50-200 employees</p>
      </div>
      <div className="h-[1px] bg-gray-100 w-full"></div>
      <div className="flex items-center gap-3">
        <label className="text-[15px] font-bold text-[#374151]">Lead Status</label>
        <span className="bg-[#5c6aff] text-white text-[11px] font-semibold px-3 py-0.5 rounded-full">Qualified</span>
      </div>
      <div>
        <label className="text-[15px] font-bold text-[#374151] block mb-2">Interest Level</label>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FFDE00" color="#FFDE00" />)}
        </div>
      </div>
      <div className="h-[1px] bg-gray-100 w-full"></div>
      <div className="bg-[#f8f9fa] rounded-xl p-4 min-h-[120px]">
        <p className="text-sm text-[#9ca3af]">Add Notes about this lead..</p>
      </div>
      <div className="space-y-3">
        <label className="text-[13px] font-bold text-[#6b7280] block">Tags</label>
        <div className="flex flex-wrap gap-2">
          {['Decision Maker', 'Hot Lead', 'Q1 Target'].map((tag) => (
            <span key={tag} className="px-3 py-1 border border-gray-200 rounded-full text-[12px] font-semibold text-[#4b5563]">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => {
    const historyData = [
      { name: 'Alice Cooper', phone: '+1 (555) 111-2222', duration: '5:23', date: '2026-01-12 09:15', status: 'Connected', color: 'bg-[#E8FFF3] text-[#10B981]' },
      { name: 'Bob Wilson', phone: '+1 (555) 111-2222', duration: '2:45', date: '2026-01-12 09:00', status: 'Voicemail', color: 'bg-[#FFF9E5] text-[#FBBF24]' },
      { name: 'Carol White', phone: '+1 (555) 111-2222', duration: '8:12', date: '2026-01-12 08:45', status: 'Connected', color: 'bg-[#E8FFF3] text-[#10B981]' },
    ];

    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[15px] font-bold text-[#1f2937]">Call History</h3>
          <span className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-2 py-0.5 rounded-lg">4 calls</span>
        </div>
        {historyData.map((call, idx) => (
          <div key={idx} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-[#374151]">{call.name}</h4>
                <p className="text-[12px] text-gray-400 font-medium">{call.phone}</p>
              </div>
              <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#374151] hover:text-blue-600 transition-colors">
                <Play size={14} fill="currentColor" /> Play
              </button>
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-[11px] font-medium">
              <div className="flex items-center gap-1"><Clock size={14}/> {call.duration}</div>
              <div className="flex items-center gap-1"><Calendar size={14}/> {call.date}</div>
            </div>
            <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-bold ${call.color}`}>{call.status}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderTouchPoints = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-4">
        <h3 className="text-[15px] font-bold text-[#1f2937]">Touch Point Plans</h3>
        
        {/* Email card */}
        <div className="border border-gray-100 rounded-xl p-4 flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
            <Mail size={18} className="text-gray-500" />
          </div>
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-bold text-[#374151]">Email Follow Up</h4>
              <p className="text-[12px] text-gray-400 leading-tight">Send personalized email with case studies and pricing.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500">Scheduled</span>
              <span className="px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500">+2 hours</span>
            </div>
          </div>
        </div>

        {/* SMS card */}
        <div className="border border-gray-100 rounded-xl p-4 flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
            <MessageSquare size={18} className="text-gray-500" />
          </div>
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-bold text-[#374151]">SMS Reminder</h4>
              <p className="text-[12px] text-gray-400 leading-tight">Quick text reminder about the call and next steps.</p>
            </div>
            <span className="inline-block px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500">Draft</span>
          </div>
        </div>

        {/* Mail card */}
        <div className="border border-gray-100 rounded-xl p-4 flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
            <Send size={18} className="text-gray-500 rotate-[-45deg]" />
          </div>
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-bold text-[#374151]">Direct Mail (Stannp)</h4>
              <p className="text-[12px] text-gray-400 leading-tight">Send physical brochure and product samples</p>
            </div>
            <span className="inline-block px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500">Not Scheduled</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-[15px] font-bold text-[#1f2937]">Recent Touch Points</h3>
        <div className="space-y-3 pl-1">
          {[
            { color: 'bg-[#5c6aff]', text: 'Email sent - Jan 10, 2026' },
            { color: 'bg-[#10B981]', text: 'SMS delivered - Jan 9, 2026' },
            { color: 'bg-[#5c6aff]', text: 'Email opened - Jan 8, 2026' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-[12px] font-medium text-gray-500">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full h-[600px] flex flex-col font-inter overflow-hidden">
      {/* Tabs Header */}
      <div className="p-3">
        <div className="flex bg-[#f1f3f9] rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[#FECD56] text-[#1a1a1a] shadow-sm'
                  : 'text-[#6b7280] hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto px-5 pb-5 custom-scrollbar">
        {activeTab === 'Lead Sheet' && renderLeadSheet()}
        {activeTab === 'History' && renderHistory()}
        {activeTab === 'Touch Points' && renderTouchPoints()}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
          border: 3px solid white;
        }
      `}} />
    </div>
  );
};

export default ContactInfoScript;