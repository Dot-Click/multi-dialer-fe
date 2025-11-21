import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiMail } from 'react-icons/fi';
import callsicon from "../../../assets/callsicon.png";

// --- Data for the Pie Chart (UPDATED COLORS) ---
const legendData = [
  { name: 'Positive', value: 60, color: '#3DC269' },
  { name: 'Neutral',  value: 20, color: '#F6BF26' },
  { name: 'Negative', value: 15, color: '#E53935' },
];


const chartData = [
  { name: 'Positive', value: 60, color: '#3DC269' }, // Green
  { name: 'Negative', value: 15, color: '#E53935' }, // Red
  { name: 'Neutral',  value: 20, color: '#F6BF26' }, // Yellow
];



// --- Type for Legend Props ---
interface LegendProps {
  payload: { color: string; payload: { name: string; value: number; color: string } }[];
}

// --- Custom Legend Component (same spacing as screenshot) ---
const renderLegend = (props: LegendProps) => {
  const { payload } = props;

  return (
    <ul className="flex flex-col gap-2 pl-2">
      {payload.map((entry, index) => {
        // Remove decimal if positive
        const displayValue =
          entry.payload.value > 0
            ? Math.floor(entry.payload.value) // Removes decimal
            : entry.payload.value;

        return (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></span>

            <span className="text-[14px] text-[#0E1011] font-[400]">
              {entry.payload.name}
              
            </span>
            <span className="font-[500] text-[#0E1011] text-[14px]">
            {displayValue}%
            </span>
          </li>
        );
      })}
    </ul>
  );
};


const AiCallSentiment = () => {
  return (
    <section className="">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* --- Left Column: AI Call Sentiment --- */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[18px] font-[500] text-[#0E1011]">AI Call Sentiment:</h2>

            <div className="flex flex-row items-center justify-center sm:justify-start gap-4">

              {/* === Pie Chart Container === */}
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

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-[24px] font-[600] text-[#000000]">65%</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-grow">
                {renderLegend({
                  payload: legendData.map(d => ({ color: d.color, payload: d })),
                })}
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[15px] border border-gray-200 text-center">
                <p className="text-[14px] text-[#495057] mb-1">Confidence</p>
                <p className="text-[20px] font-[500] text-[#000000]">62%</p>
              </div>

              <div className="p-4 rounded-[15px] border border-gray-200 text-center">
                <p className="text-[14px] text-[#495057] mb-1">Objections handled</p>
                <p className="text-[20px] font-[500] text-[#000000]">45%</p>
              </div>
            </div>
          </div>

          {/* --- Right Column: AI Suggested Actions --- */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[18px] font-[500] text-[#0E1011]">AI Suggested Actions</h2>

            <div className="space-y-4">

              {/* Card 1 */}
              <div className="p-3 rounded-lg border border-gray-300 ">
                <div className="flex items-start gap-4">
                  <img src={callsicon} alt="callsicon" className="mt-1" />

                  <div className="flex-1">
                    <h3 className="font-[500] text-[16px] text-[#000000]">Schedule a follow-up call</h3>
                    <p className="text-[14px] font-[400] text-[#2B3034] mt-1 mb-3">
                      Lead was positive about pricing but requested time to decide.
                    </p>
                    <button className="bg-[#EBEDF0] text-[#0E1011] text-[16px] font-[500] px-[12px] py-[8px] rounded-[8px] hover:bg-gray-200 transition-colors">
                      Follow Up
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-3 rounded-lg border border-gray-300">
                <div className="flex items-start gap-4">
                  <FiMail className="text-xl text-gray-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-[500] text-[16px] text-[#000000]">Send recap email with brochure</h3>
                    <p className="text-[14px] font-[400] text-[#2B3034] mt-1 mb-3">
                      Asked for product sheet and integration details.
                    </p>
                    <button className="bg-[#EBEDF0] text-[#0E1011] text-[16px] font-[500] px-[12px] py-[8px] rounded-[8px] hover:bg-gray-200 transition-colors">
                      Send Email
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-3 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-[#000000] mb-2">More AI ideas</h3>

                <ul className="list-disc font-[400] list-inside space-y-1 text-[14px] text-[#2B3034]">
                  <li>
                    Tag contact as <span className="font-[500] text-[#0E1011]">Interested.</span>
                  </li>
                  <li>Attach call summary to CRM record.</li>
                  <li>Share success story relevant to the industry.</li>
                </ul>

              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AiCallSentiment;
