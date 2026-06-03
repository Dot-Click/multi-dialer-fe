import { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiMail, FiPhone, FiTag, FiFileText } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContactAnalysis, resetContactAnalysis } from '@/store/slices/contactAnalysisSlice';

interface LegendProps {
  payload: { color: string; payload: { name: string; value: number; color: string } }[];
}

const SENTIMENT_COLORS = {
  Positive: '#3DC269',
  Neutral: '#F6BF26',
  Negative: '#E53935',
};

const renderLegend = (props: LegendProps) => {
  const { payload } = props;
  return (
    <ul className="flex flex-col gap-2 pl-2">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-[14px] text-[#0E1011] dark:text-white font-[400]">{entry.payload.name}</span>
          <span className="font-[500] text-[#0E1011] dark:text-white text-[14px]">{entry.payload.value}%</span>
        </li>
      ))}
    </ul>
  );
};

// Generate suggested actions based on real call outcome data
function getSuggestedActions(disposition: string | null, sentiment: string | null, summary: string | null) {
  const actions: { icon: 'call' | 'email' | 'tag' | 'note'; title: string; description: string; buttonLabel: string }[] = [];

  const sent = (sentiment || '').toLowerCase();
  const disp = (disposition || '').toLowerCase();

  if (disp === 'call_back' || disp === 'callback') {
    actions.push({ icon: 'call', title: 'Schedule a follow-up call', description: 'Contact requested a callback. Mark them for follow-up.', buttonLabel: 'Follow Up' });
  } else if (disp === 'hot' || sent === 'positive') {
    actions.push({ icon: 'call', title: 'Strike while hot — call again', description: 'Contact showed strong interest. Reach out while momentum is high.', buttonLabel: 'Call Now' });
  } else if (disp === 'not_interested' || sent === 'negative') {
    actions.push({ icon: 'tag', title: 'Mark as Not Interested', description: 'Contact declined. Update their tag to avoid repeated outreach.', buttonLabel: 'Update Tag' });
  } else if (disp === 'warm' || sent === 'neutral') {
    actions.push({ icon: 'call', title: 'Schedule a follow-up call', description: 'Contact was neutral. A follow-up may convert them.', buttonLabel: 'Follow Up' });
  }

  if (disp === 'hot' || disp === 'warm') {
    actions.push({ icon: 'email', title: 'Send recap email', description: 'Follow up with a summary and any materials they requested.', buttonLabel: 'Send Email' });
  }

  if (!actions.length) {
    actions.push({ icon: 'note', title: 'Attach call summary to record', description: summary || 'Log this call outcome in the contact record for future reference.', buttonLabel: 'Log Note' });
  }

  return actions;
}

function getMoreIdeas(disposition: string | null, sentiment: string | null) {
  const ideas: string[] = [];
  const sent = (sentiment || '').toLowerCase();
  const disp = (disposition || '').toLowerCase();

  if (disp === 'hot') ideas.push('Tag contact as Hot and prioritize in next session.');
  else if (disp === 'warm') ideas.push('Tag contact as Warm for nurturing sequence.');
  else if (disp === 'not_interested') ideas.push('Move contact to a dormant list to revisit in 90 days.');

  ideas.push('Attach call summary to CRM record.');

  if (sent === 'positive') ideas.push('Share a success story relevant to their industry.');
  if (sent === 'negative') ideas.push('Review call recording to identify improvement areas.');

  return ideas;
}

const ActionIcon = ({ type }: { type: 'call' | 'email' | 'tag' | 'note' }) => {
  if (type === 'call') return <FiPhone className="text-xl text-gray-500 mt-1 flex-shrink-0" />;
  if (type === 'email') return <FiMail className="text-xl text-gray-500 mt-1 flex-shrink-0" />;
  if (type === 'tag') return <FiTag className="text-xl text-gray-500 mt-1 flex-shrink-0" />;
  return <FiFileText className="text-xl text-gray-500 mt-1 flex-shrink-0" />;
};

const AiCallSentiment = () => {
  const dispatch = useAppDispatch();
  const currentContact = useAppSelector((state) => state.contacts.currentContact);
  const { data, status } = useAppSelector((state) => state.contactAnalysis);

  useEffect(() => {
    if (currentContact?.id) {
      dispatch(fetchContactAnalysis(currentContact.id));
    }
    return () => { dispatch(resetContactAnalysis()); };
  }, [currentContact?.id, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
      </div>
    );
  }

  if (status === 'failed' || !data || !data.hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <span className="text-4xl">🤖</span>
        <h3 className="text-[16px] font-[500] text-[#0E1011] dark:text-white">No AI Analysis Yet</h3>
        <p className="text-[14px] text-[#495057] dark:text-gray-400 max-w-sm">
          AI insights will appear here after a call has been completed with this contact.
        </p>
      </div>
    );
  }

  const chartData = [
    { name: 'Positive', value: data.sentiment.positive, color: SENTIMENT_COLORS.Positive },
    { name: 'Negative', value: data.sentiment.negative, color: SENTIMENT_COLORS.Negative },
    { name: 'Neutral', value: data.sentiment.neutral, color: SENTIMENT_COLORS.Neutral },
  ].filter(d => d.value > 0);

  const legendData = [
    { name: 'Positive', value: data.sentiment.positive, color: SENTIMENT_COLORS.Positive },
    { name: 'Neutral', value: data.sentiment.neutral, color: SENTIMENT_COLORS.Neutral },
    { name: 'Negative', value: data.sentiment.negative, color: SENTIMENT_COLORS.Negative },
  ].filter(d => d.value > 0);

  const dominantSentimentPct = Math.max(data.sentiment.positive, data.sentiment.neutral, data.sentiment.negative);
  const suggestedActions = getSuggestedActions(data.latestDisposition, data.latestSentiment, data.latestSummary);
  const moreIdeas = getMoreIdeas(data.latestDisposition, data.latestSentiment);

  return (
    <section>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column: AI Call Sentiment */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[18px] font-[500] text-[#0E1011] dark:text-white">AI Call Sentiment:</h2>

            <div className="flex flex-row items-center justify-center sm:justify-start gap-4">
              <div className="relative w-40 h-40 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={1}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-[24px] font-[600] text-[#000000] dark:text-white">{dominantSentimentPct}%</span>
                </div>
              </div>

              <div className="flex-grow">
                {renderLegend({ payload: legendData.map(d => ({ color: d.color, payload: d })) })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[15px] border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-[14px] text-[#495057] dark:text-gray-400 mb-1">Confidence</p>
                <p className="text-[20px] font-[500] text-[#000000] dark:text-white">{data.confidence}%</p>
              </div>
              <div className="p-4 rounded-[15px] border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-[14px] text-[#495057] dark:text-gray-400 mb-1">Calls Analyzed</p>
                <p className="text-[20px] font-[500] text-[#000000] dark:text-white">{data.totalCalls}</p>
              </div>
            </div>

            {data.latestSummary && (
              <div className="p-4 rounded-[15px] border border-gray-200 dark:border-gray-700">
                <p className="text-[12px] text-[#495057] dark:text-gray-400 mb-1 uppercase tracking-wide">Latest Call Summary</p>
                <p className="text-[14px] text-[#2B3034] dark:text-gray-300">{data.latestSummary}</p>
              </div>
            )}
          </div>

          {/* Right Column: AI Suggested Actions */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[18px] font-[500] text-[#0E1011] dark:text-white">AI Suggested Actions</h2>

            <div className="space-y-4">
              {suggestedActions.map((action, i) => (
                <div key={i} className="p-3 rounded-lg border border-gray-300 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <ActionIcon type={action.icon} />
                    <div className="flex-1">
                      <h3 className="font-[500] text-[16px] text-[#000000] dark:text-white">{action.title}</h3>
                      <p className="text-[14px] font-[400] text-[#2B3034] dark:text-gray-300 mt-1 mb-3">{action.description}</p>
                      <button className="bg-[#EBEDF0] dark:bg-gray-700 text-[#0E1011] dark:text-white text-[16px] font-[500] px-[12px] py-[8px] rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {action.buttonLabel}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {moreIdeas.length > 0 && (
                <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-700">
                  <h3 className="font-semibold text-[#000000] dark:text-white mb-2">More AI ideas</h3>
                  <ul className="list-disc font-[400] list-inside space-y-1 text-[14px] text-[#2B3034] dark:text-gray-300">
                    {moreIdeas.map((idea, i) => (
                      <li key={i}>{idea}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AiCallSentiment;
