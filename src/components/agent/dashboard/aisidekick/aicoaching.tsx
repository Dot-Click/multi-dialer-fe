import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Data
const objectionPieData = [
  { name: 'Handled successfully', value: 64 },
  { name: 'Missed / unhandled', value: 36 }
];
const OBJECTION_COLORS = ['#9400BD', '#F91E4A'];

const confidencePieData = [
  { name: 'Excellent', value: 65 },
  { name: 'Average', value: 20 },
  { name: 'Poor', value: 15 }
];
const CONFIDENCE_COLORS_NAMES = ['#3DC269', '#F6BF26', '#D43435'];

const CONFIDENCE_COLORS = ['#3DC269', '#D43435', '#F6BF26'];

const AiCoaching = () => {
  return (
    <section className='bg-white rounded-[32px] px-[24px] pt-[24px] pb-[32px] w-full shadow-md p-5 flex flex-col h-full'>
      <h1 className="text-[20px] font-[500] text-[#000000]">AI Coaching & Call Analysis</h1>

      {/* Real-Time Coaching Events */}
      <div className='space-y-3 mt-6'>
        <h2 className='text-[16px] font-[500] text-[#0E1011]'>Real-Time Coaching Events</h2>
        <div>
          <p className='text-[12px] font-[400] text-[#2B3034]'>AI provided live suggestions for:</p>
          <p className='text-[16px] font-[500] text-[#000000]'>12 calls today</p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex-grow bg-[#D43435] rounded-[8px] h-8 flex overflow-hidden'>
            <div className='bg-green-500 h-full' style={{ width: '30%' }}></div>
          </div>
          <span className='font-semibold text-gray-700 whitespace-nowrap'>12/20</span>
        </div>
        <div className='flex flex-col gap-x-6 gap-y-1 text-[10px] text-gray-600 pt-1'>
          <div className="flex items-center gap-2 text-[#0E1011] font-[400] text-[12px]">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Successfully used recommendations
          </div>
          <div className="flex items-center gap-2 text-[#0E1011] font-[400] text-[12px]">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Missed / not applied
          </div>
        </div>
      </div>

      {/* Donut Charts Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-12'>

        {/* Objection Detection Rate */}
        <div className='flex flex-col'>
          <h2 className='text-[16px] font-[500] text-[#0E1011] mb-4 '>Objection Detection Rate</h2>
          <div className="flex flex-row items-center justify-center gap-4 w-full">

            {/* Donut Chart */}
            <div className="min-w-[9rem] w-36 h-36 relative flex-shrink-0">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  {/* Shadow Filter */}
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
                      <feOffset dx="0" dy="4" result="offsetBlur" />
                      <feMerge>
                        <feMergeNode in="offsetBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Main Donut */}
                  <Pie
                    data={objectionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={60}
                    paddingAngle={1}
                    dataKey="value"
                    filter="url(#shadow)"   // <-- Shadow applied
                  >
                    {objectionPieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={OBJECTION_COLORS[index]}
                      />
                    ))}
                  </Pie>

                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[24px] font-[600] text-[#000000]">64%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3">
              {objectionPieData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                  <span
                    className="w-3 h-2 rounded-full"
                    style={{ backgroundColor: OBJECTION_COLORS[index] }}
                  ></span>
                  <span className="text-[12px] font-[400] text-[#0E1011]">{entry.name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>


        {/* Call Confidence Index */}
        <div className='flex flex-col'>
          <h2 className='text-[16px] font-[500] text-[#495057] mb-4 '>Call Confidence Index</h2>
          <div className="flex flex-row items-center justify-center gap-4 w-full">
            <div className="min-w-[9rem] w-36 h-36 relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={confidencePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={60}
                    paddingAngle={1}
                    dataKey="value"
                    startAngle={90}   // <--- Figma like start
                    endAngle={-270}   // <--- Complete clockwise rotation
                    filter="url(#shadow)"
                  >
                    {confidencePieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CONFIDENCE_COLORS[index % CONFIDENCE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>

              </ResponsiveContainer>

                 
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[24px] font-[500] text-[#000000]">
                  85<span className='text-[16px] text-[#848C94]'>/100</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {confidencePieData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CONFIDENCE_COLORS_NAMES[index] }}
                  ></span>
                  <span className="text-[12px] font-[400] text-[#0E1011]">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Optimization Score */}
      <div className='space-y-3 mt-auto pt-2'>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className='text-[16px] font-[500] text-[#495057]'>Keyword Optimization Score</h2>
          <div className="hidden sm:flex items-center gap-5">
            <span className="flex items-center gap-1 text-[12px] font-[400] text-[#0E1011]">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>High
            </span>
            <span className="flex text-[12px] font-[400] items-center gap-2 text-[#0E1011]">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>Medium
            </span>
            <span className="flex items-center gap-2 text-[12px] font-[400] text-[#0E1011]">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>Low
            </span>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='w-full bg-gray-200 rounded-md h-7'>
            <div className='bg-green-500 h-full rounded-md' style={{ width: '72%' }}></div>
          </div>
          <span className='font-[500] text-[18px] text-[#000000]'>72%</span>
        </div>
        <p className='text-[12px] font-[400] text-[#2B3034] pt-1'>AI-rated delivery quality (tone, pacing, clarity)</p>
      </div>
    </section>
  );
};

export default AiCoaching;