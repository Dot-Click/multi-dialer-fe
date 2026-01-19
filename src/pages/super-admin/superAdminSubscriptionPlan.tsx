import settingicon from "@/assets/settingicon.png"
import FailedPayment from "@/components/super-admin/subscription/failedPayment"
import SubscriptionCard from "@/components/super-admin/subscription/subscriptionCard"
import SubscriptionTable from "@/components/super-admin/subscription/subscriptionTable"
import UpcomingRenewals from "@/components/super-admin/subscription/upcominRenewals"


const SuperAdminSubscriptionPlan = () => {
  return (
    <section className='w-full min-h-screen flex flex-col gap-5 px-6 py-3 outfit bg-[#F5F6FA]'>
    
          <div className="flex justify-between items-center mb-2">
            <div className="flex leading-none gap-6  items-center">
             <img src={settingicon} alt="settingicon" className="h-[23.41058349609375] object-contain" />
              <h1 className="text-[#2C2C2C] text-[20px] outfit md:text-[26px]  lg:text-[33.95px] font-[600]">Subscription Plans & Pricing</h1>    
            </div>
    

    
          </div>
    
    <SubscriptionCard/>

    <div className="flex gap-4 flex-col md:flex-row justify-between items-center">

    <FailedPayment />
    <UpcomingRenewals/>

    </div>

    <SubscriptionTable/>
    
    
        </section>
  )
}

export default SuperAdminSubscriptionPlan