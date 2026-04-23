import { useState } from 'react';
import { FileText, Radio } from 'lucide-react';
import ContactInfoScript from '@/components/admin/contactinfo/contactinfoscript';
import LiveContactScript from '@/components/admin/contactinfo/livecallscript';

interface Props {
    scriptId: string | null;
    contactId?: string;
}

const ScriptTabs = ({ scriptId, contactId }: Props) => {
    const [activeTab, setActiveTab] = useState<'static' | 'live'>('static');

    if (!scriptId) return null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col h-[300px]">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-50 dark:border-slate-700 p-1">
                <button
                    onClick={() => setActiveTab('static')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
                        activeTab === 'static' 
                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                >
                    <FileText size={14} />
                    SCRIPT
                </button>
                <button
                    onClick={() => setActiveTab('live')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
                        activeTab === 'live' 
                        ? 'bg-yellow-400 text-gray-900 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                >
                    <Radio size={14} />
                    LIVE TRACKER
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden p-0">
                {activeTab === 'static' ? (
                    <div className="h-full bg-transparent p-0">
                        <ContactInfoScript scriptId={scriptId} />
                    </div>
                ) : (
                    <div className="h-full bg-transparent p-0">
                        <LiveContactScript scriptId={scriptId} contactId={contactId} />
                    </div>
                )}
            </div>

            {/* Overwrite inner component styles to fit */}
            <style dangerouslySetInnerHTML={{ __html: `
                .bg-white.rounded-2xl.p-6.shadow-sm.flex.flex-col.h-\\[200px\\] {
                    background: transparent !important;
                    box-shadow: none !important;
                    height: 100% !important;
                    padding: 1rem !important;
                }
            `}} />
        </div>
    );
};

export default ScriptTabs;
