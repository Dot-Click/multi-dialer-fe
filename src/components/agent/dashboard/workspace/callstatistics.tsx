
import CallStatisticChart from '@/components/charts/callstatisticschart';


const CallStatistics = () => {

    const date = ["Today", "Last 7 days", "Last 30 days"]

    return (
        <section className='bg-white flex h-fit lg:h-[75vh] flex-col gap-5 rounded-4xl px-6 py-5 w-full '>
            <div className="flex flex-col gap-3">
                <div>
                    <h1 className="text-[20px] font-[500]">Call Statistics</h1>
                </div>
                <div className='flex gap-3'>
                    {date.map((dt) => (
                        <button className='border px-2.5 rounded-md text-gray-950 font-[500] cursor-pointer hover:bg-gray-200 py-1.5 text-[14px]'>{dt}</button>
                    ))}
                </div>
            </div>

            <div className='flex justify-between lg:pr-20 items-center'>
                <div>
                    <h1 className='text-[#495057] font-[500] text-[16px]'>Total Calls</h1>
                    <h4 className='text-[15px] font-[500]'>123</h4>
                </div>
                <div>
                    <h1 className='text-[#495057] font-[500] text-[16px]'>Connection Rate</h1>
                    <p className='flex gap-2 items-center'>
                        <span className='text-[15px] font-[500]'>78%</span>
                        <span className='bg-green-200 text-[14px] text-green-700 px-3 rounded-lg'>5%</span>
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
                                <h1 className='h-1.5 w-2 rounded-full bg-red-600'></h1>
                                <h1 className='text-[17px] font-[500] text-gray-600'>Interested: 2</h1>
                            </span>
                            <span className='flex items-center gap-2'>
                                <h1 className='h-2 w-2 rounded-full bg-yellow-600'></h1>
                                <h1 className='text-[17px] font-[500] text-gray-600'>Follow-Up: 5</h1>
                            </span>
                            <span className='flex items-center gap-2'>
                                <h1 className='h-2 w-2 rounded-full bg-green-600'></h1>
                                <h1 className='text-[17px] font-[500] text-gray-600'>No Answer: 2</h1>
                            </span>
                        </div>
                        <div className='flex gap-3 flex-col'>
                            <span className='flex items-center gap-2'>
                                <h1 className='h-2 w-2 rounded-full bg-purple-600'></h1>
                                <h1 className='text-[17px] font-[500] text-gray-600'>Not Intersted: 0</h1>
                            </span>
                            <span className='flex items-center gap-2'>
                                <h1 className='h-2 w-2 rounded-full bg-green-600'></h1>
                                <h1 className='text-[17px] font-[500] text-gray-600'>DNC: 1</h1>
                            </span>
                        </div>

                    </div>



                </div>
            </div>



            <div>
                <h1 className="text-[20px] font-[500]">Outcome Goals</h1>

                <div className='flex justify-between items-center'>

                <div className='flex flex-col w-[45%] gap-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[15px] font-[500]'>Follow-Up</h1>
                        <h1 className='text-[15px] font-[500]'>5/10</h1>
                    </div>
                    <div className='w-full h-1.5 bg-gray-300 rounded-md'>
                        <div className='h-full w-[50%] bg-green-500 rounded-md'></div>
                    </div>

                </div>


   <div className='flex flex-col  w-[45%] gap-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[15px] font-[500]'>Interested Leads</h1>
                        <h1 className='text-[15px] font-[500]'>2/5</h1>
                    </div>
                    <div className='w-full h-1.5 bg-gray-300 rounded-md'>
                        <div className='h-full w-[50%] bg-green-500 rounded-md'></div>
                    </div>

                </div>

                </div>
            </div>


        </section>
    )
}

export default CallStatistics