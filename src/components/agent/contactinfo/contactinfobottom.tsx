import { FileText, Circle } from 'lucide-react';
import { useTwilio } from '@/providers/twilio.provider';
import { useEffect, useRef } from 'react';

const ContactInfoBottom = () => {
  const { transcriptionLogs, isCalling } = useTwilio();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptionLogs]);

  return (
    <>
      <style>
        {`
          .transcript-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .transcript-scroll::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .dark .transcript-scroll::-webkit-scrollbar-track {
            background: #1e293b;
          }
          .transcript-scroll::-webkit-scrollbar-thumb {
            background: #bdc3c7;
            border-radius: 10px;
          }
          .dark .transcript-scroll::-webkit-scrollbar-thumb {
            background: #475569;
          }
          .transcript-scroll::-webkit-scrollbar-thumb:hover {
            background: #95a5a6;
          }
          .dark .transcript-scroll::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
        `}
      </style>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 font-inter w-full flex flex-col overflow-hidden h-[450px]">

        {/* Fixed Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-50 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <FileText size={18} strokeWidth={1.5} />
            <span className="text-sm font-medium">Live Call Transcript</span>
          </div>

          {isCalling && (
            <div className="flex items-center gap-2 bg-[#FEE2E2] text-[#EF4444] px-3 py-1 rounded-full border border-red-100">
              <Circle size={8} fill="currentColor" className="animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Recording</span>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div
          ref={scrollRef}
          className="transcript-scroll flex-grow overflow-y-auto p-6 pr-4 space-y-6"
        >
          {transcriptionLogs.length > 0 ? (
            transcriptionLogs.map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                {/* Timestamp */}
                <div className="text-gray-400 dark:text-gray-500 text-[12px] font-medium w-20 shrink-0 mt-1">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>

                {/* Message */}
                <div className="flex-1">
                  <p className={`${item.speaker === 'Agent' ? 'text-blue-600 dark:text-blue-400' : 'text-green-500 dark:text-green-400'} font-bold text-sm mb-1`}>
                    {item.speaker}
                  </p>
                  <p className="text-[#2D3748] dark:text-white text-[14px] leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <span className="text-sm">{isCalling ? "Waiting for conversation to start..." : "No active call transcript"}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactInfoBottom;