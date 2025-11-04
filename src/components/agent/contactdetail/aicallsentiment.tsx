import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { BsTelephone } from 'react-icons/bs';
import { FiMail } from 'react-icons/fi';

// --- Data for the Pie Chart ---
const data = [
  { name: 'Positive', value: 65, color: '#34D399' }, // Green
  { name: 'Neutral', value: 25, color: '#FBBF24' },  // Yellow
  { name: 'Negative', value: 10, color: '#EF4444' }, // Red
];

// --- Custom Legend Component (thoda chota text) ---
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="flex flex-col gap-1.5 pl-4"> {/* Added padding-left */}
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: entry.color }}></span>
          {/* Font size chota kar diya hai */}
          <span className="text-xs text-gray-600">{`${entry.payload.name} ${entry.payload.value}%`}</span>
        </li>
      ))}
    </ul>
  );
};

const AiCallSentiment = () => {
  return (
    <section className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid: Stacks on mobile, two columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- Left Column: AI Call Sentiment --- */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-gray-800">AI Call Sentiment:</h2>

            {/* Main Sentiment Card */}
            <div className=" flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
              
              {/* === FIX: Pie Chart Container === */}
              {/* 1. Relative positioning for the center text. */}
              {/* 2. Fixed width and height to prevent cutting off. */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%" // Center X
                      cy="50%" // Center Y
                      innerRadius={50} // Thoda chota donut
                      outerRadius={70} // Thoda chota donut
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none" // Border hata di
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* === FIX: Center Text === */}
                {/* 2. Using translate for perfect centering. */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-3xl font-bold text-gray-800">65%</span>
                </div>
              </div>

              {/* === FIX: Legend is now its own element in the flex container === */}
              <div className="flex-grow">
                 {renderLegend({ payload: data.map(d => ({ color: d.color, payload: d })) })}
              </div>
            </div>

            {/* === FIX: Stat Cards (thode chote) === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className=" p-4 rounded-lg border border-gray-200  text-center">
                <p className="text-xs text-gray-500 mb-1">Confidence</p>
                <p className="text-xl font-bold text-gray-800">62%</p>
              </div>
              <div className=" p-4 rounded-lg border border-gray-200  text-center">
                <p className="text-xs text-gray-500 mb-1">Objections handled</p>
                <p className="text-xl font-bold text-gray-800">45%</p>
              </div>
            </div>
          </div>

          {/* --- Right Column: AI Suggested Actions --- */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-gray-800">AI Suggested Actions</h2>
            
            <div className="space-y-4">
              {/* Card 1 */}
              <div className="p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <BsTelephone className="text-xl text-gray-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Schedule a follow-up call</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-3">Lead was positive about pricing but requested time to decide.</p>
                    <button className="bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-gray-200 transition-colors">
                      Follow Up
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <FiMail className="text-xl text-gray-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Send recap email with brochure</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-3">Asked for product sheet and integration details.</p>
                    <button className="bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-gray-200 transition-colors">
                      Send Email
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-3 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">More AI ideas</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Tag contact as <span className="font-semibold">Interested.</span></li>
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
}

export default AiCallSentiment;