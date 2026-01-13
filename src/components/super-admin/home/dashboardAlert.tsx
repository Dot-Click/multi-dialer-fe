import failedIcon from "@/assets/failedIcon.png"
import expiringIcon from "@/assets/expiringIcon.png"
import custIcon from "@/assets/custIcon.png"
import subscriptionIcon from "@/assets/subscriptionIcon.png"

const DashboardAlert = () => {
  return (
    
                <section className="mt-3 h-[450px] bg-[#FFFFFF] flex flex-col gap-4 work-sans px-[24px] shadow-sm pt-[18px] pb-[32px] rounded-[32px] w-[50%]">
                    <div>
                        <h1 className="text-[#000000] font-[500] text-[20px]">
                            Dashboard Alerts / Status
                        </h1>
                    </div>

                    <div className="flex flex-col gap-3">

                    <div className="flex gap-5 items-center bg-[#F8F8F8] rounded-[13px] px-4 py-4">
                        <span>
                            <img src={failedIcon} alt="failedIcon" className="h-5 object-contain" />
                        </span>
                        <div className="flex flex-col leading-none ">
                            <p className="text-[#495057] text-[16px] font-[500]">
                                Failed Payments
                            </p>
                            <p className="text-[#000000] font-[600] text-[26px]">
                                12
                            </p>
                        </div>

                    </div>

                    <div className="flex gap-5 items-center bg-[#F8F8F8] rounded-[13px] px-4 py-4">
                        <span>
                            <img src={expiringIcon} alt="failedIcon" className="h-5 object-contain" />
                        </span>
                        <div className="flex flex-col leading-none ">
                            <p className="text-[#495057] text-[16px] font-[500]">
                                Expiring Subscriptions
                            </p>
                            <p className="text-[#000000] font-[600] text-[26px]">
                                28
                            </p>
                        </div>

                    </div>


                    <div className="flex gap-5 items-center bg-[#F8F8F8] rounded-[13px] px-4 py-4">
                        <span>
                            <img src={custIcon} alt="failedIcon" className="h-5 object-contain" />
                        </span>
                        <div className="flex flex-col leading-none ">
                            <p className="text-[#495057] text-[16px] font-[500]">
                                New Customers
                            </p>
                            <p className="text-[#000000] font-[600] text-[26px]">
                                91
                            </p>
                        </div>

                    </div>

                    <div className="flex gap-5 bg-[#F8F8F8] rounded-[13px] px-4 py-4">
                        <span className="mt-1">
                            <img src={subscriptionIcon} alt="failedIcon" className="h-3 object-contain" />
                        </span>
                        <div className="flex flex-col gap-4 leading-none w-full">
                            <p className="text-[#495057] text-[16px] font-[500]">
                                Subscription Status
                            </p>
                            <div className="w-full flex flex-col gap-2 ">

                               <span className="flex justify-between items-center">
                                <h1 className="text-[#000000] text-[18px] font-[500]">Active</h1>
                                <h1 className="text-[#04A771] text-[18px] font-[500]">847</h1>
                               </span>

                               <span className="flex justify-between items-center">
                                <h1 className="text-[#000000] text-[18px] font-[500]">Inactive</h1>
                                <h1 className="text-[#E70028] text-[18px] font-[500]">153</h1>
                               </span>

                            </div>
                        </div>

                    </div>

                    </div>

                </section>
  )
}

export default DashboardAlert