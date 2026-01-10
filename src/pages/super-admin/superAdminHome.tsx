import NewAccountsOverTime from "@/components/super-admin/home/newAccountsOverTime"
import UserOverviews from "@/components/super-admin/home/userOverviews"
import failedIcon from "@/assets/failedIcon.png"
import expiringIcon from "@/assets/expiringIcon.png"
import custIcon from "@/assets/custIcon.png"


const SuperAdminHome = () => {



    return (
        <section className="w-full min-h-full flex flex-col gap-1  pr-3 lg:pr-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-[#0E1011] text-[20px] md:text-[26px]  lg:text-[28px] font-[500]">Dashboard</h1>
                </div>

            </div>

            <UserOverviews />

            <div className="flex gap-2 items-center justify-evenly">
                <NewAccountsOverTime />

                <section className="mt-3 bg-[#FFFFFF] work-sans px-[24px] pt-[18px] pb-[32px] rounded-[32px] w-[50%]">
                    <div>
                        <h1 className="text-[#000000] font-[500] text-[20px]">
                            Dashboard Alerts / Status
                        </h1>
                    </div>
                    <div className="flex gap-4 items-center bg-[#F8F8F8] rounded-[12px] px-2 py-1">
                        <span>
                            <img src={failedIcon} alt="failedIcon" className="h-5 object-contain" />
                        </span>
                        <div className="flex flex-col leading-none">
                            <p className="text-[#495057] text-[16px] font-[500]">
                                Failed Payments
                            </p>
                            <p className="text-[#000000] font-[600] text-[26px]">
                                12
                            </p>
                        </div>

                    </div>
                </section>

            </div>


        </section>
    )
}

export default SuperAdminHome