import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ChevronDown } from 'lucide-react';

const sessionData = [
    {
        id: 1,
        date: '18/06/2021 09:13',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 1,
        appt: 0,
        details: {
            totalCalls: 1,
            talkTime: '00:00:00',
            dialTime: '00:02:53',
            appointments: 0,
            leads: 0,
        },
    },
    {
        id: 2,
        date: '29/10/2024 15:36',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 3,
        appt: 0,
        details: {
            totalCalls: 3,
            talkTime: '00:05:10',
            dialTime: '00:08:15',
            appointments: 0,
            leads: 0,
        },
    },
    {
        id: 3,
        date: '20/11/2013 20:01',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 0,
        appt: 0,
        details: {
            totalCalls: 0,
            talkTime: '00:00:00',
            dialTime: '00:01:30',
            appointments: 0,
            leads: 0,
        },
    },
    {
        id: 4,
        date: '10/06/2021 19:30',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 1,
        appt: 0,
        details: {
            totalCalls: 1,
            talkTime: '00:00:00',
            dialTime: '00:02:53',
            appointments: 0,
            leads: 0,
        },
    },
    {
        id: 5,
        date: '10/06/2021 19:30',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 1,
        appt: 0,
        details: {
            totalCalls: 1,
            talkTime: '00:00:00',
            dialTime: '00:02:53',
            appointments: 0,
            leads: 0,
        },
    },
    {
        id: 6,
        date: '10/06/2021 19:30',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 1,
        appt: 0,
        details: {
            totalCalls: 1,
            talkTime: '00:00:00',
            dialTime: '00:02:53',
            appointments: 0,
            leads: 0,
        },
    },
    {
        id: 7,
        date: '10/06/2021 19:30',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 1,
        appt: 0,
        details: {
            totalCalls: 1,
            talkTime: '00:00:00',
            dialTime: '00:02:53',
            appointments: 0,
            leads: 0,
        },
    },
    {
        id: 8,
        date: '10/06/2021 19:30',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 1,
        appt: 0,
        details: {
            totalCalls: 1,
            talkTime: '00:00:00',
            dialTime: '00:02:53',
            appointments: 0,
            leads: 0,
        },
    },
    {
        id: 9,
        date: '10/06/2021 19:30',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 1,
        appt: 0,
        details: {
            totalCalls: 1,
            talkTime: '00:00:00',
            dialTime: '00:02:53',
            appointments: 0,
            leads: 0,
        },
    },
    {
        id: 10,
        date: '10/06/2021 19:30',
        agent: 'Bertha Wiza',
        type: 'C2C Session',
        list: 'Mojo Training List',
        calls: 1,
        appt: 0,
        details: {
            totalCalls: 1,
            talkTime: '00:00:00',
            dialTime: '00:02:53',
            appointments: 0,
            leads: 0,
        },
    },
];

const Session = () => {
    const [openRow, setOpenRow] = useState<number | null>(null);

    const handleRowClick = (id: number) => {
        setOpenRow(openRow === id ? null : id);
    };

    return (
        <div className="min-h-screen py-2 flex flex-col gap-2">
            {/* Date Filter */}
            <div className="flex items-center w-fit gap-[16px] border border-[#D8DCE1] rounded-[12px] px-[16px] h-[40px] cursor-pointer">
                <IoIosArrowBack className="text-[13px] text-[#71717A]" />
                <span className="text-[16px]">All Dates</span>
                <IoIosArrowForward className="text-[13px] text-[#71717A]" />
            </div>

            {/* Table */}
            <div className="bg-white shadow-md mt-3 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#F7F7F7]">
                            <tr>
                                <th className="px-2 py-[4px] font-[500] text-[20px] text-[#0E1011]">
                                    <ChevronDown className='text-[#495057] text-[19px]' />
                                </th>
                                <th className="py-3 text-left font-[500] text-[14px] text-[#0E1011]">Date</th>
                                <th className="py-3 text-left font-[500] text-[14px] text-[#0E1011]">Agent</th>
                                <th className="py-3 text-left font-[500] text-[14px] text-[#0E1011]">Type</th>
                                <th className="py-3 text-left font-[500] text-[14px] text-[#0E1011]">Gr/List</th>
                                <th className="py-3 text-left font-[500] text-[14px] text-[#0E1011]">Calls</th>
                                <th className="py-3 text-left font-[500] text-[14px] text-[#0E1011]">Appt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessionData.map((item) => (
                                <React.Fragment key={item.id}>
                                    {/* Main Row */}
                                    <tr
                                        className={`border-b cursor-pointer transition-colors ${openRow === item.id ? 'bg-[#EBEDF0]' : ''}`}
                                        onClick={() => handleRowClick(item.id)}
                                    >
                                        <td className="py-3 px-2 w-6 text-center">
                                            <ChevronDown
                                                className={`text-[#495057] text-[19px] transition-transform duration-200 ${openRow === item.id ? 'rotate-180' : ''}`}
                                            />
                                        </td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">{item.date}</td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#0E1011]">{item.agent}</td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">{item.type}</td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">{item.list}</td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">{item.calls}</td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">{item.appt}</td>
                                    </tr>

                                    {/* Expanded Row */}
                                    {openRow === item.id && (
                                        <tr className="bg-[#F3F4F7]">
                                            <td colSpan={7} className="p-2">
                                                {/* Desktop grid remains 2-cols, Mobile stacks */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 md:px-8 py-2">
                                                    <div>
                                                        <h3 className="text-[14px] text-[#495057] flex items-center gap-1 mb-2">
                                                            <span className='font-[400]'>Group/List Dialed: </span>
                                                            <span className='font-[500]'>{item.list}</span>
                                                        </h3>
                                                        <div className="p-4">
                                                            <div className="grid grid-cols-4 border-b p-2 gap-4 items-center mb-2 font-[500] text-[14px] text-[#0E1011]">
                                                                <span>Result</span>
                                                                <span>Total Calls</span>
                                                                <span>Talk Time</span>
                                                                <span>Dial Time</span>
                                                            </div>
                                                            <div className="grid p-2 grid-cols-4 gap-4 items-center font-[400] text-[14px] text-[#495057]">
                                                                <span>Other</span>
                                                                <span>{item.details.totalCalls}</span>
                                                                <span>{item.details.talkTime}</span>
                                                                <span>{item.details.dialTime}</span>
                                                            </div>
                                                            <div className="grid bg-[#D8DCE1] border border-[#EBEDF0] p-2 grid-cols-4 gap-4 items-center font-[500] text-[14px] text-[#0E1011]">
                                                                <span>TOTAL</span>
                                                                <span>{item.details.totalCalls}</span>
                                                                <span>{item.details.talkTime}</span>
                                                                <span>{item.details.dialTime}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="p-4">
                                                            <div className="grid border-b p-2 grid-cols-2 gap-4 items-center mb-2 font-[500] text-[14px] text-[#0E1011]">
                                                                <span>Appts / Leads</span>
                                                                <span>Dial Time</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 items-start font-[400] text-[14px] text-[#495057]">
                                                                <div>
                                                                    <div className="py-1">Appointments</div>
                                                                    <div className="py-1">Leads</div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="py-1">{item.details.appointments}</div>
                                                                    <div className="py-1">{item.details.leads}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile-specific style for expanded row */}
            <style>
                {`
                @media (max-width: 768px) {
                    /* Allow horizontal scroll if table is too wide */
                    .overflow-x-auto {
                        overflow-x: auto;
                    }
                    table {
                        min-width: 700px;
                    }

                    /* Stack expanded row content */
                    table tbody tr.bg-[#F3F4F7] > td > div.grid {
                        grid-template-columns: 1fr !important;
                    }

                    table tbody tr.bg-[#F3F4F7] > td > div.grid > div {
                        width: 100%;
                    }

                    table td, table th {
                        padding: 12px 8px !important;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default Session;
