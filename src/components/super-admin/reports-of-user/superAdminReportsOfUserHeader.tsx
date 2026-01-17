import searchIcon from "@/assets/searchIcon.png"
import downarrow from "@/assets/downarrow.png"

const SuperAdminReportsOfUserHeader = () => {
    return (

        <div className="bg-[#FFFFFF] flex flex-col md:flex-row gap-5 md:gap-2 md:justify-between md:items-center w-full rounded-[13.48px] px-5 py-4">

            <div className='w-full md:w-[65%] bg-[#F2F2F2] h-[40px] flex justify-start items-center gap-3 rounded-[11.56px] px-3 py-2'>
                <span>
                    <img src={searchIcon} alt="searchIcon" className='h-[17.343202590942383] object-contain' />
                </span>
                <input type="text" className="w-full text-[#6C6D72] text-[13.73px] font-[400]" placeholder='Search branches, rentals, services...' />
            </div>

            <div className="flex justify-start items-center gap-6">
                <button className='bg-[#F2F2F2] px-3 py-2 h-[40px]  flex rounded-[11.56px] w-[150px] justify-between items-center gap-2'>
                    <span className='text-[#030213] text-[15.41px]  font-[400]'>All Plans</span>
                    <img src={downarrow} alt="searchIcon" className='h-1.5 object-contain' />

                </button>
                <button className='bg-[#F2F2F2] px-3 py-2  h-[40px]  flex rounded-[11.56px] w-[150px] justify-between items-center gap-2'>
                    <span className=' text-[15.41px] text-[#030213] font-[400]'>All Status</span>
                    <img src={downarrow} alt="searchIcon" className='h-1.5 object-contain' />

                </button>

            </div>


        </div>
    )
}

export default SuperAdminReportsOfUserHeader