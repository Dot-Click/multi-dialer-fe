
// Sample data for the calling groups list
const callingGroupsData = [
    { id: 1, name: 'Summer Promo Q3', score: '24%', tag: 'Hot Lead' },
    { id: 2, name: 'Renewals Q3', score: '24%', tag: 'Follow Up' },
    { id: 3, name: 'Upsell Pilot', score: '24%', tag: 'Interested' },
    { id: 4, name: 'New Leads Q4', score: '35%', tag: 'Follow Up' },
    { id: 5, name: 'Win-back Campaign', score: '18%', tag: 'Hot Lead' },
    { id: 6, name: 'Enterprise Outreach', score: '55%', tag: 'Interested' },
    { id: 7, name: 'SMB Follow-ups', score: '29%', tag: 'Follow Up' },
];

// Helper function to get tag styles based on tag name
const getTagStyles = (tag:any) => {
    switch (tag) {
        case 'Hot Lead':
            return 'bg-[#D434351A]/90 dark:text-red-400 text-[#D43435]';
        case 'Follow Up':
            return 'bg-[#1D85F01A]/90 dark:text-blue-400 text-[#1D85F0]';
        case 'Interested':
            return 'bg-[#1D85F01A]/90 dark:text-green-400 text-[#1EAC22]';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const CallGroup = () => {
    return (
        <div className="bg-white dark:bg-slate-800 w-full  shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex flex-col h-[60vh]">
            {/* Main Title */}
            <h1 className="text-[20px] font-[500]  dark:text-white text-[#000000] mb-6 flex-shrink-0">Calling Groups</h1>

            {/* This container will manage the layout of the header and the scrollable list */}
            <div className="flex flex-col flex-1 min-h-0">
                {/* Table Header (will not scroll) */}
                <div className="grid grid-cols-3 gap-4 text-[12px] font-[500] dark:text-gray-400 text-[#848C94] pb-2 border-b flex-shrink-0">
                    <div className="col-span-1">Lead Name</div>
                    <div className="col-span-1 text-center">AI Lead Score</div>
                    <div className="col-span-1 text-right">Notes / Tags</div>
                </div>

                {/* Scrollable Table Body */}
                <div className="mt-4 flex-1  h-20 overflow-y-auto custom-scrollbar pr-2">
                    <div className="space-y-4">
                        {callingGroupsData.map((item) => (
                            <div key={item.id} className="grid grid-cols-3 text-[14px] gap-4 items-center border-b pb-4 last:border-b-0">
                                {/* Lead Name */}
                                <div className="col-span-1 font-[500] dark:text-white text-[#000000]">
                                    {item.name}
                                </div>
                                {/* AI Lead Score */}
                                <div className="col-span-1 font-[400] text-center dark:text-gray-400 text-[#2B3034]">
                                    {item.score}
                                </div>
                                {/* Notes / Tags */}
                                <div className="col-span-1 flex justify-end">
                                    <span className={`pr-[6px] pl-[8px] py-[4px] text-[12px] font-[500] rounded-[100px] max-w-[100px] min-w-[90px]  ${getTagStyles(item.tag)}`}>
                                        {item.tag}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallGroup;