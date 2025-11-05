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
    <div className=" pr-10">
      <h1 className="text-3xl sm:text-4xl font-[500] text-gray-800">Library</h1>

      <div className="mt-4 rounded-md w-fit bg-gray-200">
        <nav className="flex  flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === tab
                  ? 'bg-yellow-400 text-black rounded-lg' // فعال ٹیب کا اسٹائل
                  : 'text-gray-500 hover:text-gray-800' // غیر فعال ٹیب کا اسٹائل
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="content-area mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Library;