import React, { useState } from 'react';
import searchIcon from "@/assets/searchIcon.png";
import downarrow from "@/assets/downarrow.png";

interface HeaderProps {
    onSearchChange?: (value: string) => void;
    onPlanChange?: (value: string) => void;
    onStatusChange?: (value: string) => void;
}

const SuperAdminReportsOfUserHeader = ({ onSearchChange, onPlanChange, onStatusChange }: HeaderProps) => {
    // States for Dropdowns
    const [planOpen, setPlanOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    
    // States for Selected Values
    const [selectedPlan, setSelectedPlan] = useState("All Plans");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [searchTerm, setSearchTerm] = useState("");

    // Options
    const planOptions = ["All Plans", "Basic", "Professional", "Enterprise"];
    const statusOptions = ["All Status", "Active", "Pending", "Suspended"];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (onSearchChange) onSearchChange(val);
    };

    const selectPlan = (plan: string) => {
        setSelectedPlan(plan);
        setPlanOpen(false);
        if (onPlanChange) onPlanChange(plan);
    };

    const selectStatus = (status: string) => {
        setSelectedStatus(status);
        setStatusOpen(false);
        if (onStatusChange) onStatusChange(status);
    };

    return (
        <div className="bg-[#FFFFFF] flex flex-col md:flex-row gap-5 md:gap-2 md:justify-between md:items-center w-full rounded-[13.48px] px-5 py-4">

            {/* Search Input */}
            <div className='w-full md:w-[65%] bg-[#F2F2F2] h-[40px] flex justify-start items-center gap-3 rounded-[11.56px] px-3 py-2'>
                <span>
                    <img src={searchIcon} alt="searchIcon" className='h-[17.343202590942383] object-contain' />
                </span>
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-transparent outline-none text-[#6C6D72] text-[13.73px] font-[400]" 
                    placeholder='Search branches, rentals, services...' 
                />
            </div>

            <div className="flex justify-start items-center gap-6">
                
                {/* Plan Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => { setPlanOpen(!planOpen); setStatusOpen(false); }}
                        className='bg-[#F2F2F2] px-3 py-2 h-[40px] flex rounded-[11.56px] w-[150px] justify-between items-center gap-2'
                    >
                        <span className='text-[#030213] text-[15.41px] font-[400]'>{selectedPlan}</span>
                        <img src={downarrow} alt="arrow" className={`h-1.5 object-contain transition-transform ${planOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {planOpen && (
                        <div className="absolute top-[45px] left-0 w-full bg-white shadow-lg rounded-[11.56px] z-50 border border-gray-100 overflow-hidden">
                            {planOptions.map((opt) => (
                                <div 
                                    key={opt}
                                    className="px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-[14px] text-[#030213]"
                                    onClick={() => selectPlan(opt)}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => { setStatusOpen(!statusOpen); setPlanOpen(false); }}
                        className='bg-[#F2F2F2] px-3 py-2 h-[40px] flex rounded-[11.56px] w-[150px] justify-between items-center gap-2'
                    >
                        <span className='text-[15.41px] text-[#030213] font-[400]'>{selectedStatus}</span>
                        <img src={downarrow} alt="arrow" className={`h-1.5 object-contain transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {statusOpen && (
                        <div className="absolute top-[45px] left-0 w-full bg-white shadow-lg rounded-[11.56px] z-50 border border-gray-100 overflow-hidden">
                            {statusOptions.map((opt) => (
                                <div 
                                    key={opt}
                                    className="px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-[14px] text-[#030213]"
                                    onClick={() => selectStatus(opt)}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SuperAdminReportsOfUserHeader;