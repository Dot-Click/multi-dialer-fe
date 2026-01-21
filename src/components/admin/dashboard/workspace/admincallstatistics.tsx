import { useState } from 'react';
import CallStatisticChart from '@/components/charts/callstatisticschart';

const AdminCallStatistics = () => {

    const date = ["Today", "Last 7 days", "Last 30 days"];
    const [active, setActive] = useState("Today");

    return (
        <section className='bg-white flex h-fit lg:h-[75vh] flex-col gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px] w-full '>
            <div className="flex flex-col gap-3">
                <div>
                    <h1 className="text-[20px] text-[#000000] font-[500]">Call Statistics</h1>
                </div>
                <div className='flex gap-3'>
                    {date.map((dt) => (
                        <button
                            key={dt}
                            onClick={() => setActive(dt)}
                            className={
                                active === dt
                                    ? "border px-2.5 rounded-md font-[500] cursor-pointer py-1.5 text-[14px] bg-[#0E1011] text-white"
                                    : "border px-2.5 rounded-md text-gray-950 font-[500] cursor-pointer hover:bg-gray-200 py-1.5 text-[14px]"
                            }
                        >
                            {dt}
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex justify-between lg:pr-20 items-center'>
                <div>
                    <h1 className='text-[#495057] font-[500] text-[16px]'>Total Calls</h1>
                    <h4 className='text-[16px] text-[#000000] font-[500]'>123</h4>
                </div>
                <div>
                    <h1 className='text-[#495057] font-[500] text-[16px]'>Connection Rate</h1>
                    <p className='flex gap-2 items-center'>
                        <span className='text-[16px] text-[#000000] font-[500]'>78%</span>
                        <span className='bg-[#1EAC221A] text-[12px] text-[#1EAC22] px-3 rounded-[100px] '>5%</span>
                    </p>
                </div>
            </div>

            <div className='flex flex-col '>

                <h1 className='text-[16px] text-[#495057] font-[500]'>Call Outcomes</h1>

                <div className='flex flex-col lg:flex-row gap-3 items-center'>
                    <div className='h-40 flex justify-center items-center'>
                        <CallStatisticChart />
                    </div>

                    <div className='flex gap-4 items-start'>
                        <div className='flex gap-3 flex-col'>
                            <span className='flex items-center gap-2'>
                                <h1 className='h-2 w-2 rounded-full bg-red-600'></h1>
                                <h1 className='text-[14px] font-[500] text-[#2B3034]'>Interested: 2</h1>
                            </span>
                            <span className='flex items-center gap-2'>
                                <h1 className='h-2 w-2 rounded-full bg-yellow-600'></h1>
                                <h1 className='text-[14px] font-[500] text-[#2B3034]'>Follow-Up: 5</h1>
                            </span>
                            <span className='flex items-center gap-2'>
                                <h1 className='h-2 w-2 rounded-full bg-green-600'></h1>
                                <h1 className='text-[14px] font-[500] text-[#2B3034]'>No Answer: 2</h1>
                            </span>
                        </div>
                        <div className='flex gap-3 flex-col'>
                            <span className='flex items-center gap-2'>
                                <h1 className='h-2 w-2 rounded-full bg-purple-600'></h1>
                                <h1 className='text-[14px] font-[500] text-[#2B3034]'>Not Intersted: 0</h1>
                            </span>
                            <span className='flex items-center gap-2'>
                                <h1 className='h-2 w-2 rounded-full bg-green-600'></h1>
                                <h1 className='text-[14px] font-[500] text-[#2B3034]'>DNC: 1</h1>
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h1 className="text-[20px]  text-[#000000] font-[500]">Outcome Goals</h1>

                <div className='flex justify-between items-center'>

                    <div className='flex flex-col w-[45%] gap-2'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-[16px] text-[#2B3034] font-[500]'>Follow-Up</h1>
                            <h1 className='text-[14px] text-[#2B3034] font-[600]'>5/10</h1>
                        </div>
                        <div className='w-full h-1.5 bg-[#EBEDF0] rounded-md'>
                            <div className='h-full w-[50%] bg-[#1EAC22] rounded-md'></div>
                        </div>

                    </div>

                    <div className='flex flex-col  w-[45%] gap-2'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-[16px] text-[#2B3034] font-[500]'>Interested Leads</h1>
                            <h1 className='text-[14px] text-[#2B3034] font-[600]'>2/5</h1>
                        </div>
                        <div className='w-full h-1.5 bg-[#EBEDF0] rounded-md'>
                            <div className='h-full w-[50%] bg-[#1EAC22] rounded-md'></div>
                        </div>

                    </div>

                </div>
            </div>

        </section>
    )
}

export default AdminCallStatistics;
