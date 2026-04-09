import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { getRevenueGrowth } from '@/store/slices/reportsSlice';
import type { RootState, AppDispatch } from '@/store/store';
import Loader from '@/components/common/Loader';

const SuperAdminRevenueGrow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { revenueGrowth, revenueLoading } = useSelector(
    (state: RootState) => state.reports
  );

  useEffect(() => {
    dispatch(getRevenueGrowth());
  }, [dispatch]);

  // Transform data for BarChart
  const barData = revenueGrowth?.labels.map((label, index) => ({
    name: label,
    revenue: revenueGrowth.revenue[index] || 0,
  })) || [];

  // Transform data for LineChart
  const lineData = revenueGrowth?.labels.map((label, index) => ({
    name: label,
    val: revenueGrowth.growth[index] || 0,
  })) || [];

  return (
    <div className="relative w-full outfit p-4 md:p-[24.9px] bg-white dark:bg-slate-800 rounded-[33.21px] shadow-sm min-h-[350px]">
      {revenueLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-[33.21px]">
          <Loader fullPage={false} />
        </div>
      )}

      <h2 className="text-[20.75px] font-[500] mb-8 text-[#000000] dark:text-white">Revenue Grow</h2>

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
                domain={[0, 'auto']}
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
                domain={[0, 'auto']}
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
