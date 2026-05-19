import { useState } from 'react';

const GeneralSetting = () => {
  const [companyName, setCompanyName] = useState('Multi Dialer Pro');
  const [timezone, setTimezone] = useState('UTC (GMT+0:00)');
  const [currency, setCurrency] = useState('USD - United States Dollar');
  const [dateTimeFormat, setDateTimeFormat] = useState('MM/DD/YYYY - 12:00 AM');

  return (
    <section className="bg-white dark:bg-slate-800 p-4 work-sans md:p-8 rounded-[22px] shadow-sm w-full max-w-full mx-auto font-sans">
      {/* Top 4 Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
        <div className="bg-[#F3F4F7] dark:bg-slate-700 py-[8px] px-[12px] rounded-[12px]">
          <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">
            Platform / Company Name
          </label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="text-[#848C94] bg-transparent dark:text-white text-[16px] font-[400] outline-none w-full"
          />
        </div>

        <div className="bg-[#F3F4F7] dark:bg-slate-700 py-[8px] px-[12px] rounded-[12px]">
          <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">
            Default Time zone
          </label>
          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="text-[#848C94] bg-transparent dark:text-white text-[16px] font-[400] outline-none w-full"
          />
        </div>

        <div className="bg-[#F3F4F7] dark:bg-slate-700 py-[8px] px-[12px] rounded-[12px]">
          <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">
            Default Currency
          </label>
          <input
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="text-[#848C94] bg-transparent dark:text-white text-[16px] font-[400] outline-none w-full"
          />
        </div>

        <div className="bg-[#F3F4F7] dark:bg-slate-700 py-[8px] px-[12px] rounded-[12px]">
          <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">
            Date & Time Format
          </label>
          <input
            value={dateTimeFormat}
            onChange={(e) => setDateTimeFormat(e.target.value)}
            className="text-[#848C94] bg-transparent dark:text-white text-[16px] font-[400] outline-none w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default GeneralSetting;