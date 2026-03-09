import { CheckCircle2, RefreshCcw } from 'lucide-react';
import zohoIcon from "@/assets/zohoIcon.png"

const GeneralSetting = () => {
  return (
    <section className="bg-white dark:bg-slate-800 p-4 work-sans md:p-8 rounded-[22px] shadow-sm w-full max-w-full mx-auto font-sans">
      
      {/* Top 4 Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 mb-6">
        <div className="bg-[#F3F4F7] dark:bg-slate-700 py-[8px] px-[12px] rounded-[12px]">
          <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">Platform / Company Name</label>
          <input placeholder='Multi Dialer Pro' className="text-[#848C94] dark:text-white text-[16px] font-[400] outline-none" />
        </div>
        
        <div className="bg-[#F3F4F7] dark:bg-slate-700 py-[8px] px-[12px] rounded-[12px]">
          <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">Default Time zone</label>
          <input placeholder='UTC (GMT+0:00)' className="text-[#848C94] dark:text-white text-[16px] font-[400] outline-none" />
        </div>

        <div className="bg-[#F3F4F7] dark:bg-slate-700 py-[8px] px-[12px] rounded-[12px]">
          <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">Default Currency</label>
          <input placeholder='USD - United Satates Dollar' className="text-[#848C94] dark:text-white text-[16px] font-[400] outline-none" />
        </div>

        <div className="bg-[#F3F4F7] dark:bg-slate-700 py-[8px] px-[12px] rounded-[12px]">
          <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">Date & Time Format</label>
          <input placeholder='MM/DD/YYYY - 12:00 AM' className="text-[#848C94] dark:text-white text-[16px] font-[400] outline-none" />
        </div>
      </div>

      {/* Billing & Integrations Section */}
      <div className=" flex flex-col gap-3">
        <h2 className="text-[18px] font-[500] inter text-[#34363B] dark:text-white">Billing & Integrations</h2>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">

          {/* Zoho Card */}
          <div className="flex items-center gap-4 bg-[#F7F7F7] dark:bg-black  border-[1.03px] dark:border-slate-600 border-[#EBEDF0] p-[12px] rounded-[8.28px] w-fit">
            <div>
                <img src={zohoIcon} alt="zohoIcon" className="h-[20px] dark:invert object-contain" />
            </div>

            <div className='flex flex-col gap-1 leading-none'>
                <h1 className='text-[16.56px] text-[#0E1011] dark:text-white font-[500] work-sans'>Zoho Subscriptions</h1>
                <h1 className="text-[#91969A] dark:text-white work-sans text-[12.42px] font-[400]">Subscription management integration</h1>
            </div>
        
          </div>

          {/* Connected Badge */}
          <div className="flex items-center  gap-1.5 bg-[#030213] text-[#F9FAFB] dark:bg-black px-[8px] py-[4px] rounded-[12px]">
            <CheckCircle2 className="w-5 h-5" />
            <h1 className="text-[15.41px] work-sans font-[400]">Connected</h1>
          </div>
        </div>

        {/* API Field */}
         <div className="bg-[#F3F4F7] dark:bg-slate-700 work-sans py-[8px] px-[12px] rounded-[12px]">
          <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">API</label>
          <input placeholder='MM/DD/YYYY - 12:00 AM' type='password' className="text-[#666060] bg-transparent dark:text-white text-[16px] font-[400] outline-none" />
        </div>

        {/* Organization ID Field */}
        <div className="bg-[#F3F4F7] dark:bg-slate-700 work-sans py-[8px] px-[12px] rounded-[12px] w-full md:w-1/2">
         <label className="text-xs md:text-[12px] font-[500] text-[#495057] dark:text-white block mb-1">Organization ID</label>
          <input placeholder='org_2nQX8kKJN8jP9' type='text' className="text-[#666060]  text-[16px] font-[400] outline-none" />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-4 work-sans flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-[#82829]  text-[12px] md:text-sm order-2 md:order-1">
          <RefreshCcw className="w-4 h-4" />
          <span className="text-[#828291] text-[12px] font-[400]">Last synced: Dec 31, 2025 at 10:45 AM</span>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto order-1 md:order-2">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-[#EBEDF0] dark:border-slate-600 px-6 py-[8px] 
          rounded-[12px] font-[500] text-[16px] text-[#0E1011] dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <RefreshCcw className="w-3 h-3" />
            Sync Now
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center bg-[#FFCA06] gap-2 border dark:border-slate-600 border-[#EBEDF0] px-6 py-[8px] 
          rounded-[12px] font-[500] text-[16px] text-[#0E1011] hover:bg-yellow-500 transition-colors">
            Disconnect
          </button>
        </div>
      </div>

    </section>
  );
};

export default GeneralSetting;