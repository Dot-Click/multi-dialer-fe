import React from 'react'

const SMS = () => {
    return (
        <div className='flex gap-6 flex-col min-h-40'>
            <h1 className='test-[#0E1011] text-[18px] font-[500]'>SMS:</h1>

            <div className='flex justify-center items-center w-full text-center md:w-[50%]  flex-col'>
                <h1 className='text-[#000000] text-[14px] font-[500]'>No Data Available</h1>
                <p className='text-[#848C94] text-[14px] font-[400]'>There have been no SMS sent to this contact</p>

            </div>
        </div>
    )
}

export default SMS