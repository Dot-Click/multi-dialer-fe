



const History = () => {


    const historyViews = [
        { id: 1, history: "Created custom field Co-Owner Birthday to 09/24/2025", date: "9/16/2025", time: "10:35:45 PM" },
        { id: 2, history: "Created custom field Co-Owner Birthday to 09/24/2025", date: "9/16/2025", time: "10:35:45 PM" },
        { id: 3, history: "Created custom field Co-Owner Birthday to 09/24/2025", date: "9/16/2025", time: "10:35:45 PM" },
        { id: 4, history: "Created custom field Co-Owner Birthday to 09/24/2025", date: "9/16/2025", time: "10:35:45 PM" },
        { id: 5, history: "Created custom field Co-Owner Birthday to 09/24/2025", date: "9/16/2025", time: "10:35:45 PM" },
        { id: 6, history: "Created custom field Co-Owner Birthday to 09/24/2025", date: "9/16/2025", time: "10:35:45 PM" },
        { id: 7, history: "Created custom field Co-Owner Birthday to 09/24/2025", date: "9/16/2025", time: "10:35:45 PM" },
       
    ]


    return (
        <div className='flex gap-6 w-full flex-col md:flex-row  min-h-40'>

            <div className="flex w-full md:w-[50%] flex-col gap-6">
                <h1 className="text-[#0E1011] text-[18px] font-[600]">History View:</h1>


                {/*  h-72 overflow-y-auto  custom-scrollbar*/}
                <div className="flex  flex-col gap-4">

                    {historyViews.map((history) => (
                        <div key={history.id} className='flex items-start gap-2 justify-between border-b border-gray-200'>
                            <div className='flex flex-col gap-1 md:gap-2'>
                                <h1 className='text-[#2B3034] text-[10px] md:text-[12px] font-[500]'>Agent Name</h1>
                                <p className='text-[#0E1011] pb-1 font-[500] text-[10px] md:text-[15px]'>{history.history}</p>
                            </div>
                            <div className='flex items-center flex-col md:flex-row  text-center md:gap-2'>
                                <p className='text-[#495057] text-[9px] md:text-[12px] font-[400]'>{history.date}</p>
                                <p className='text-[#495057] text-[9px] md:text-[12px] font-[400]'>{history.time}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>



            <div className='flex w-full md:w-[50%] gap-6 flex-col'>
                <h1 className='test-[#0E1011] text-[18px] font-[500]'>Call Recordings:</h1>

                <div className='flex justify-center items-center w-full  flex-col'>
                    <h1 className='text-[#000000] text-[14px] font-[500]'>No Data Available</h1>
                    <p className='text-[#848C94] text-[14px] font-[400]'>There are no call recordings</p>
                </div>
            </div>






        </div>
    )
}

export default History