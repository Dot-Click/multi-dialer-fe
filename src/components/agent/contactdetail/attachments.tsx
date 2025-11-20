



const Attachments = () => {
    return (
        <div className='flex gap-6 flex-col min-h-40'>
            <h1 className='test-[#0E1011] text-[18px] font-[500]'>Attachments:</h1>

            <div className='flex justify-center md:mt-12  gap-2 items-center w-full text-center md:w-[50%]  flex-col'>
                <h1 className='text-[#000000] text-[14px] font-[500]'>No Data Available</h1>
                <p className='text-[#848C94] text-[14px] font-[500]'>There have been no attachments uploaded yet</p>
                <button className='flex bg-[#EBEDF0] py-[9px] px-[24px] cursor-pointer hover:bg-gray-300 rounded-[12px] gap-1 items-center justify-center'>
                    <span className='text-[#0E1011] text-[14px] font-[500]'>Choose File</span>
                    <span className='text-[12px] font-[400] text-[#0E1011] mt-1'>(max 10 MB)</span>
                </button>

            </div>
        </div>
    )
}

export default Attachments