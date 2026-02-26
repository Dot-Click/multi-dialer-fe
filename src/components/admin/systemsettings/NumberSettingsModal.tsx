import React, { useState, useEffect } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { useCallerIds } from '@/hooks/useSystemSettings';
import { useMediaCenter, type MediaCenterItem } from '@/hooks/useMediaCenter';

interface NumberSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NumberSettingsModal: React.FC<NumberSettingsModalProps> = ({ isOpen, onClose }) => {
  const { data: callerIds } = useCallerIds();
  const { getMediaCenterItems } = useMediaCenter();

  const [recordings, setRecordings] = useState<MediaCenterItem[]>([]);
  const [dialerType, setDialerType] = useState('predictive');
  const [aiPacing, setAiPacing] = useState(true);

  // Selected values
  const [selectedCallerId, setSelectedCallerId] = useState('');
  const [selectedLines, setSelectedLines] = useState('1');
  const [selectedRecording, setSelectedRecording] = useState('');

  useEffect(() => {
    if (isOpen) {
      getMediaCenterItems().then(items => {
        const audioItems = items.filter(item => item.fileCategory === 'audio');
        setRecordings(audioItems);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (callerIds && callerIds.length > 0 && !selectedCallerId) {
      setSelectedCallerId(callerIds[0].callerId || '');
    }
  }, [callerIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4 font-sans">
      <div className="bg-white w-full max-w-[480px] max-h-[92vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-[18px] font-bold text-gray-800">Number Settings</h2>
          <button onClick={onClose} className="p-1.5 bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><FiX size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

          {/* Selectors Section */}
          <div className="space-y-3">
            {/* Caller ID Dropdown */}
            <div className="bg-[#F3F4F8] rounded-xl px-4 py-2.5 relative group">
              <label className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider block">Caller ID</label>
              <div className="relative mt-0.5">
                <select
                  value={selectedCallerId}
                  onChange={(e) => setSelectedCallerId(e.target.value)}
                  className="w-full bg-transparent appearance-none text-[13px] font-bold text-gray-700 outline-none pr-8 cursor-pointer"
                >
                  <option value="" disabled>Select a number</option>
                  {callerIds?.map(c => (
                    <option key={c.id} value={c.callerId}>{c.callerId} {c.label ? `(${c.label})` : ''}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Number of Lines Dropdown */}
            <div className="bg-[#F3F4F8] rounded-xl px-4 py-2.5 relative">
              <label className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider block">Number of Lines</label>
              <div className="relative mt-0.5">
                <select
                  value={selectedLines}
                  onChange={(e) => setSelectedLines(e.target.value)}
                  className="w-full bg-transparent appearance-none text-[13px] font-bold text-gray-700 outline-none pr-8 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* On-Hold Recording Dropdown */}
            <div className="bg-[#F3F4F8] rounded-xl px-4 py-2.5 relative">
              <label className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider block">On-Hold Recording</label>
              <div className="relative mt-0.5">
                <select
                  value={selectedRecording}
                  onChange={(e) => setSelectedRecording(e.target.value)}
                  className="w-full bg-transparent appearance-none text-[13px] font-bold text-gray-700 outline-none pr-8 cursor-pointer"
                >
                  <option value="">Select a recording</option>
                  {recordings.map(rec => (
                    <option key={rec.id} value={rec.id}>{rec.templateName}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">This on-hold recording applies to all outbound numbers.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-gray-900 border-l-4 border-yellow-400 pl-2">Dialer Settings</h3>
            {[
              { id: 'predictive', title: 'Predictive Dialing', desc: 'AI-driven call pacing\nAutomatically adjusts based on availability' },
              { id: 'power', title: 'Power Dialing', desc: 'Dials one number at a time\nAutomatically dials next contact' },
              { id: 'preview', title: 'Preview Dialing', desc: 'Agent views contact details before dialing\nAgent manually initiates each call' },
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setDialerType(option.id)}
                className={`p-4 rounded-2xl flex gap-4 cursor-pointer border-2 transition-all ${dialerType === option.id ? 'bg-[#F9FAFB] border-yellow-400' : 'bg-[#F3F4F8] border-transparent hover:border-gray-200'}`}
              >
                <div className="mt-1">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${dialerType === option.id ? 'border-yellow-500' : 'border-gray-300'}`}>
                    {dialerType === option.id && <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-gray-900">{option.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1.5 whitespace-pre-line leading-relaxed font-medium">{option.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 p-1 bg-yellow-50/50 rounded-2xl p-4 border border-yellow-100">
            <input
              type="checkbox"
              checked={aiPacing}
              onChange={() => setAiPacing(!aiPacing)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer"
            />
            <div>
              <h4 className="text-[14px] font-bold text-gray-900">Enable AI Call Pacing</h4>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed font-medium">AI adjusts outbound calling lines based on pickup rate to optimize efficiency.</p>
            </div>
          </div>

          <div className="bg-[#EEF2FF] border border-[#E0E7FF] p-4 rounded-2xl text-[11px] font-bold text-[#4F46E5] flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            Each dial will automatically send an email and text using the selected templates.
          </div>
        </div>

        <div className="p-6 border-t border-gray-50 flex gap-4">
          <button onClick={onClose} className="flex-1 bg-[#F3F4F6] hover:bg-gray-200 text-gray-900 text-[15px] font-bold py-4 rounded-2xl transition-all">Cancel</button>
          <button className="flex-[2] bg-[#FECD56] hover:bg-[#F0D500] text-gray-900 text-[15px] font-extrabold py-4 rounded-2xl shadow-md transition-all">Start Dialing</button>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }`}</style>
    </div>
  );
};

export default NumberSettingsModal;
