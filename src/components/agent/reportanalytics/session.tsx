import React, { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useSessionReport } from '@/hooks/useSessionReport';
import dayjs from 'dayjs';

interface SessionProps {
    userId?: string;
}

const Session: React.FC<SessionProps> = ({ userId }) => {
    const [openRow, setOpenRow] = useState<string | null>(null);
    const { loading, error, data, pagination, getSessionReport } = useSessionReport();
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        getSessionReport({ userId, page, limit });
    }, [getSessionReport, userId, page, limit]);

    const handleRowClick = (id: string) => {
        setOpenRow(openRow === id ? null : id);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < Math.ceil(pagination.total / pagination.limit)) {
            setPage(page + 1);
        }
    };

    if (loading && data.length === 0) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#FFCA06]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-20 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen py-2 flex flex-col gap-2">
            {/* Date Filter & Pagination */}
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center w-fit gap-[16px] border border-[#D8DCE1] rounded-[12px] px-[16px] h-[40px] cursor-pointer">
                    <IoIosArrowBack className="text-[13px] text-[#71717A]" />
                    <span className="text-[16px]">All Dates</span>
                    <IoIosArrowForward className="text-[13px] text-[#71717A]" />
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[14px] text-[#71717A]">
                        Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination.total)} of {pagination.total}
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={handlePrevPage}
                            className="p-2 border border-[#D8DCE1] rounded-[8px] disabled:opacity-50 hover:bg-gray-50"
                        >
                            <IoIosArrowBack className="text-[13px]" />
                        </button>
                        <button
                            disabled={page >= Math.ceil(pagination.total / pagination.limit)}
                            onClick={handleNextPage}
                            className="p-2 border border-[#D8DCE1] rounded-[8px] disabled:opacity-50 hover:bg-gray-50"
                        >
                            <IoIosArrowForward className="text-[13px]" />
                        </button>
                    </div>
                </div>
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
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-[#71717A]">
                                        No session reports found
                                    </td>
                                </tr>
                            ) : data.map((item) => (
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
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">
                                            {dayjs(item.date).format('DD/MM/YYYY HH:mm')}
                                        </td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#0E1011]">{item.agent}</td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">{item.type}</td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">{item.list}</td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">{item.calls}</td>
                                        <td className="py-3 text-left text-[14px] font-[400] text-[#495057]">{item.appointments}</td>
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
                                                            {item.breakdown.results.map((result, idx) => (
                                                                <div key={idx} className="grid p-2 grid-cols-4 gap-4 items-center font-[400] text-[14px] text-[#495057]">
                                                                    <span>{result.result}</span>
                                                                    <span>{result.totalCalls}</span>
                                                                    <span>{result.talkTime}</span>
                                                                    <span>{result.dialTime}</span>
                                                                </div>
                                                            ))}
                                                            <div className="grid bg-[#D8DCE1] border border-[#EBEDF0] p-2 grid-cols-4 gap-4 items-center font-[500] text-[14px] text-[#0E1011]">
                                                                <span>TOTAL</span>
                                                                <span>{item.breakdown.total.calls}</span>
                                                                <span>{item.breakdown.total.talkTime}</span>
                                                                <span>{item.breakdown.total.dialTime}</span>
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
                                                                    <div className="py-1">{item.appointments}</div>
                                                                    <div className="py-1">{item.calls}</div> {/* Leads is not explicitly tracked in backend yet, using calls as proxy or 0 */}
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

