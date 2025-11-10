import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
];

const Session = () => {
    const [openRow, setOpenRow] = useState<number | null>(4); // type specified

    const handleRowClick = (id: number) => { // ✅ id type number
        setOpenRow(openRow === id ? null : id);
    };

    return (
        <div className="min-h-screen py-2 flex flex-col gap-2">
            <div className="border w-fit rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer">
                <FaChevronLeft className="text-[12px] text-gray-400" />
                <span className="text-xs">All Dates</span>
                <FaChevronRight className="text-[12px] text-gray-400" />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-sm text-gray-900 uppercase">
                            <tr>
                                <th scope="col" className="px-6 font-semibold py-3"></th>
                                <th scope="col" className="px-6 font-semibold py-3">Date</th>
                                <th scope="col" className="px-6 font-semibold py-3">Agent</th>
                                <th scope="col" className="px-6 font-semibold py-3">Type</th>
                                <th scope="col" className="px-6 font-semibold py-3">Gr/List</th>
                                <th scope="col" className="px-6 font-semibold py-3">Calls</th>
                                <th scope="col" className="px-6 font-semibold py-3">Appt</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sessionData.map((item) => (
                                <React.Fragment key={item.id}>
                                    {/* Main Row */}
                                    <tr
                                        className="border-b hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleRowClick(item.id)}
                                    >
                                        <td className="px-6 py-4">
                                            <svg
                                                className={`w-4 h-4 text-gray-500 transform transition-transform ${openRow === item.id ? 'rotate-90' : ''
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5l7 7-7 7"
                                                ></path>
                                            </svg>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{item.date}</td>
                                        <td className="px-6 font-semibold text-gray-900 py-4">{item.agent}</td>
                                        <td className="px-6 py-4">{item.type}</td>
                                        <td className="px-6 py-4">{item.list}</td>
                                        <td className="px-6 py-4">{item.calls}</td>
                                        <td className="px-6 py-4">{item.appt}</td>
                                    </tr>

                                    {/* Expanded Details Row */}
                                    {openRow === item.id && (
                                        <tr className="bg-gray-100">
                                            <td colSpan={7} className="p-2"> {/* ✅ colSpan number */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                                                    <div>
                                                        <h3 className="text-xs text-gray-500 mb-4">
                                                            Group/List Dialed: {item.list}
                                                        </h3>
                                                        <div className="p-4">
                                                            <div className="grid grid-cols-4 border-b p-2 gap-4 items-center mb-2">
                                                                <span className="font-semibold text-gray-700">Result</span>
                                                                <span className="font-semibold text-gray-700">Total Calls</span>
                                                                <span className="font-semibold text-gray-700">Talk Time</span>
                                                                <span className="font-semibold text-gray-700">Dial Time</span>
                                                            </div>
                                                            <div className="grid p-2 grid-cols-4 gap-4 items-center">
                                                                <span>Other</span>
                                                                <span>{item.details.totalCalls}</span>
                                                                <span>{item.details.talkTime}</span>
                                                                <span>-</span>
                                                            </div>
                                                            <div className="grid bg-gray-300 p-2 grid-cols-4 gap-4 items-center font-semibold">
                                                                <span>TOTAL</span>
                                                                <span>{item.details.totalCalls}</span>
                                                                <span>{item.details.talkTime}</span>
                                                                <span>{item.details.dialTime}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xs text-gray-500 mb-4">&nbsp;</h3>
                                                        <div className="p-4">
                                                            <div className="grid border-b p-2 grid-cols-2 gap-4 items-center mb-2">
                                                                <span className="font-bold text-gray-700">Appts / Leads</span>
                                                                <span className="font-bold text-gray-700">Dial Time</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-8 items-center">
                                                                <div>
                                                                    <div className="flex justify-between items-center py-1">
                                                                        <span>Appointments</span>
                                                                        <span>{item.details.appointments}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center py-1">
                                                                        <span>Leads</span>
                                                                        <span>{item.details.leads}</span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    {/* Placeholder */}
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

                            {/* Total Footer Row */}
                            <tr className="bg-white font-semibold">
                                <td className="px-6 py-4" colSpan={2}>TOTAL</td> {/* ✅ colSpan number */}
                                <td className="px-6 py-4">Bertha Wiza</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">5</td>
                                <td className="px-6 py-4">0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Session;
