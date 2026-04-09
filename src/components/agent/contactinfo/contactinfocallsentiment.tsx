import { Bot, Sparkles, Circle, Loader2 } from 'lucide-react';
import { useTwilio } from '../../../providers/twilio.provider';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useEffect, useState } from 'react';
import { fetchCallSentiment, resetSentiment, setPollingStatus } from '../../../store/slices/sentimentSlice';
import api from '../../../lib/axios';

const CallSentiment = () => {
  const { callStatus, activeCallSid } = useTwilio();
  const dispatch = useAppDispatch();
  const { data: sentimentData, status: sentimentStatus, error: sentimentError } = useAppSelector((state) => state.sentiment);
  const [storedSid, setStoredSid] = useState<string | null>(null);

  // Capture the SID while the call is active
  useEffect(() => {
    if (activeCallSid) {
      setStoredSid(activeCallSid);
    }
  }, [activeCallSid]);

  // Trigger Polling in Redux
  useEffect(() => {
    if (callStatus === 'disconnected' && storedSid && sentimentStatus === 'idle') {
      console.log('Call disconnected, starting polling in Redux for SID:', storedSid);
      dispatch(setPollingStatus());
    }
  }, [callStatus, storedSid, sentimentStatus, dispatch]);

  // Handle Polling Interval
  useEffect(() => {
    let pollInterval: any;

    if (sentimentStatus === 'polling_status' && storedSid) {
      console.log('Polling status active in Redux, starting interval for SID:', storedSid);
      pollInterval = setInterval(async () => {
        try {
          // Poll for completed status using the stored SID
          const { data } = await api.get(`/calling/status/${storedSid}`);
          if (data.success && data.data.status === 'completed') {
            console.log('Call completed detected! Fetching analysis...');
            clearInterval(pollInterval);
            dispatch(fetchCallSentiment(storedSid));
          }
        } catch (err) {
          console.error('Error polling for completed status:', err);
        }
      }, 3000);
    }

    return () => {
      if (pollInterval) {
        console.log('Cleaning up poll interval');
        clearInterval(pollInterval);
      }
    };
  }, [sentimentStatus, storedSid, dispatch]);

  // Reset sentiment when a new call starts
  useEffect(() => {
    if (callStatus === 'ringing' || callStatus === 'connected') {
      dispatch(resetSentiment());
    }
  }, [callStatus, dispatch]);

  // Handle re-fetching if sentiment is still processing
  useEffect(() => {
    let timeout: any;
    if (sentimentStatus === 'processing_sentiment' && storedSid) {
      console.log('Sentiment still processing, will re-fetch in 4 seconds...');
      timeout = setTimeout(() => {
        dispatch(fetchCallSentiment(storedSid));
      }, 4000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [sentimentStatus, storedSid, dispatch]);

  // const suggestions = [
  //   {
  //     id: "1.",
  //     text: "Ask about their current pain points with customer engagement."
  //   },
  //   {
  //     id: "2.",
  //     text: "Mention our 30-day free trial offer"
  //   },
  //   {
  //     id: "3.",
  //     text: "Reference case study: similar company saw 45% improvements"
  //   }
  // ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      case 'neutral': return '#6B7280';
      default: return '#10B981';
    }
  };

  const isProcessing = ['polling_status', 'fetching_sentiment', 'processing_sentiment'].includes(sentimentStatus);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 w-full font-inter flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div className="flex items-center gap-2 text-[#4b5563] dark:text-gray-400">
          <div className="relative">
             <Bot size={20} strokeWidth={1.5} />
             <Sparkles size={8} className="absolute -top-1 -right-1 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-[15px] font-medium text-gray-600 dark:text-white">Call Sentiment</h3>
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-1.5">
          {isProcessing ? (
            <Loader2 size={14} className="animate-spin text-blue-500" />
          ) : (
            <>
              <Circle size={8} fill={getSentimentColor(sentimentData?.sentiment || 'positive')} className={`text-[${getSentimentColor(sentimentData?.sentiment || 'positive')}]`} />
              <span className="text-[14px] font-semibold" style={{ color: getSentimentColor(sentimentData?.sentiment || 'positive') }}>
                {sentimentData?.sentiment || 'Positive'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content Area - Scrollable for small screens */}
      <div className="space-y-3 overflow-y-auto pr-1">
        
        {/* AI Sidekick Box */}
        <div className="bg-[#f4f6fa] dark:bg-slate-700/50 rounded-xl p-4">
          <p className="text-[13px] font-bold text-[#1a1a1a] dark:text-white mb-1">AI Sidekick:</p>
          <p className="text-[14px] text-[#374151] dark:text-gray-300 leading-relaxed">
            {sentimentStatus === 'polling_status' ? 'Waiting for call analysis...' : 
             (sentimentStatus === 'fetching_sentiment' || sentimentStatus === 'processing_sentiment') ? 'Analyzing call...' :
             sentimentData?.aiSummary || 'Analysis will appear here after the call.'}
          </p>
        </div>

        {/* Suggestion Boxes
        {suggestions.map((item) => (
          <div 
            key={item.id} 
            className="bg-[#f4f6fa] rounded-xl p-4 flex gap-3 items-start transition-colors hover:bg-[#ebedf3]"
          >
            <span className="text-[13px] font-bold text-[#1a1a1a] shrink-0 mt-0.5">
              {item.id}
            </span>
            <p className="text-[14px] text-[#374151] leading-relaxed">
              {item.text}
            </p>
          </div>
        ))} */}

        {sentimentError && (
          <p className="text-xs text-red-500 mt-2">{sentimentError}</p>
        )}

      </div>
    </div>
  );
};

export default CallSentiment;