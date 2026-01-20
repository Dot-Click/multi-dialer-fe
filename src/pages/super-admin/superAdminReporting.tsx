import { IoFilterOutline } from 'react-icons/io5'
import downarrow from "@/assets/downarrow.png"
import { PiDownloadSimpleBold } from 'react-icons/pi'
import BussinessOverviews from '@/components/super-admin/reporting/bussinessOverviews'
import RevenueByPlan from '@/components/super-admin/reporting/revenueByPlan'
import SubscriptionDistribution from '@/components/super-admin/reporting/subscrptionDistribution'
import MonthlyRecurring from '@/components/super-admin/reporting/monthlyRecurring'
import SubscriptionGrowth from '@/components/super-admin/reporting/subscriptionGrowth'
import Data from '@/components/super-admin/reporting/data'
import SubscritpionSecond from '@/components/super-admin/reporting/subscritpionSecond'
import UserUsageOverview from '@/components/super-admin/reporting/userUsageOverview'
import GeneratingReports from '@/components/super-admin/reporting/generatingReports'

const SuperAdminReporting = () => {
    return (
        <section className="w-full min-h-screen flex flex-col gap-2 px-6 py-6 outfit bg-[#F5F6FA]">
            <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col gap-4">
                    <h1 className="text-[#2C2C2C] text-[20px] md:text-[26px]  lg:text-[32px] font-[500]">Reporting</h1>
                    <button className='bg-[#FFFFFF] w-fit text-[#27272A] flex items-center justify-center gap-2 border text-[16px] font-[500] work-sans border-[#D8DCE1] rounded-[12px] py-[10px]
                    px-[14px]'>
                        <span><IoFilterOutline /></span>
                        <span>Filter</span>
                    </button>


                    <div className='flex md:items-center md:flex-row flex-col md:justify-between gap-3'>

                        <div className='flex flex-col md:flex-row md:items-center gap-3'>

                            <div className='flex items-center gap-2'>
                                <h1 className='text-[#000000] text-[18px] font-[500]'>From:</h1>
                                <button className='bg-[#FFFFFF] text-[#0E1011] work-sans font-[500] 
                            text-[16px] py-[6px] px-[20px] rounded-[12px] border border-[#EBEDF0] text-center'>
                                    01/01/2025
                                </button>
                            </div>

                            <div className='flex items-center gap-2'>
                                <h1 className='text-[#000000] text-[18px] font-[500]'>To:</h1>
                                <button className='bg-[#FFFFFF] text-[#0E1011] work-sans font-[500] 
                            text-[16px] py-[6px] px-[20px] rounded-[12px] border border-[#EBEDF0] text-center'>
                                    12/31/2025
                                </button>
                            </div>

                            <button className='bg-[#F2F2F2] px-3 py-2 h-[40px]  flex rounded-[11.56px] w-[150px] justify-between items-center gap-2'>
                                <span className='text-[#030213] text-[15.41px]  font-[400]'>All Plans</span>
                                <img src={downarrow} alt="searchIcon" className='h-1.5 object-contain' />

                            </button>


                            <button className='bg-[#F2F2F2] px-3 py-2  h-[40px]  flex rounded-[11.56px] w-[150px] justify-between items-center gap-2'>
                                <span className=' text-[15.41px] text-[#030213] font-[400]'>All Status</span>
                                <img src={downarrow} alt="searchIcon" className='h-1.5 object-contain' />

                            </button>






                        </div>


                        <div className="flex items-center gap-3 lg:ml-7 work-sans">
                            <button className="bg-[#EBEDF0] text-[#0E1011] px-[24px] py-2 rounded-[12px] flex gap-2 items-center justify-center">
                                <span className="text-[13px] md:text-[16px] font-[500]">Export CSV</span>
                            </button>
                            <button className="bg-[#FFCA06] text-[#000000] px-[24px] py-2 rounded-[12px] flex gap-2 items-center justify-center">
                                <span className="text-[13px] md:text-[16px] font-[500]">
                                    <PiDownloadSimpleBold />

                                </span>
                                <span className="text-[13px] md:text-[16px] font-[500]">Export PDF</span>
                            </button>

                        </div>

                    </div>



                </div>
            </div>

            <BussinessOverviews />

            <div className='flex gap-3 flex-col md:flex-row justify-start items-center'>
                <RevenueByPlan />
                <SubscriptionDistribution />

            </div>

            <div className='flex gap-3 flex-col md:flex-row justify-start items-center'>
                <MonthlyRecurring />
                <SubscriptionGrowth />

            </div>

            <div className='flex gap-3 flex-col md:flex-row justify-start items-center'>
                <Data />
                <SubscritpionSecond />

            </div>

            <UserUsageOverview />
            <GeneratingReports/>



        </section >
    )
}

export default SuperAdminReporting