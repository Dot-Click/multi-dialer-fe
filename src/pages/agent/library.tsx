import { useState } from 'react';
import EmailTemplate from '@/components/agent/library/emailtemplate';
import Script from '@/components/agent/library/script';
import SMSTemplate from '@/components/agent/library/smstemplate';
import MediaCenter from '@/components/agent/library/mediacenter';




const Library = () => {
  const [activeTab, setActiveTab] = useState('Scripts');

  const tabs = ['Scripts', 'Email Templates', 'SMS Templates', 'Media Center'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Scripts':
        return <Script />;
      case 'Email Templates':
        return <EmailTemplate />;
      case 'SMS Templates':
        return <SMSTemplate />;
      case 'Media Center':
        return <MediaCenter />;
      default:
        return <Script />;
    }
  };

  return (
  <div className=" pr-5 pt-1 pb-4">
      
      <h1 className="text-2xl sm:text-[28px] font-[500] text-[#0E1011]">Library</h1>

      <div className="mt-4 rounded-[16px] w-fit bg-[#F3F4F7]">
        <nav className="flex p-[4px]   flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-[8px] px-[16px] rounded-[12px] font-[500] text-xs sm:text-[16p] transition-colors duration-300 whitespace-nowrap ${activeTab === tab
                  ? 'bg-[#FFCA06] text-[#0E1011]  rounded-lg' 
                  : 'text-[#495057] hover:text-gray-800' 
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="content-area mt-5">
        {renderContent()}
      </div>
    </div>
    
  );
};

export default Library;