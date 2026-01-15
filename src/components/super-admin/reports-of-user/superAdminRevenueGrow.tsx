import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Dummy Data image ke hisaab se
const barData = [
  { name: 'Jul', revenue: 80000 },
  { name: 'Aug', revenue: 60000 },
  { name: 'Sep', revenue: 55000 },
  { name: 'Oct', revenue: 50000 },
  { name: 'Now', revenue: 38000 },
  { name: 'Dec', revenue: 38000 },
];

const lineData = [
  { name: 'Jul', val: 5 },
  { name: '', val: 32 },
  { name: '', val: 43 },
  { name: 'Aug', val: 51 },
  { name: '', val: 47 },
  { name: 'Sep', val: 52 },
  { name: '', val: 58 },
  { name: 'Oct', val: 65 },
  { name: '', val: 61 },
  { name: 'Now', val: 55 },
  { name: '', val: 52 },
  { name: 'Dec', val: 32 },
  { name: '', val: 35 },
];

const SuperAdminRevenueGrow = () => {
  return (
    <div className="w-full work-sans p-4 md:p-[24.9px] bg-white rounded-[33.21px] shadow-sm ">
      <h2 className="text-[20.75px] font-[500] mb-8 text-[#000000]">Revenue Grow</h2>

      {/* Grid container: Mobile par 1 column, badi screens par 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Bar Chart */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#EBEDF0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#495057', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                domain={[0, 80000]}
                ticks={[0, 20000, 40000, 60000, 80000]}
              />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar 
                dataKey="revenue" 
                fill="#FFCC00" 
                radius={[5, 5, 0, 0]} 
                barSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Side: Line Chart */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#EBEDF0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#495057', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke="#7E84A3" 
                strokeWidth={2}
                dot={{ r: 5, fill: '#7E84A3', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminRevenueGrow;