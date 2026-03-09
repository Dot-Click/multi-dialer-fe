import DashboardAlert from "@/components/super-admin/home/dashboardAlert"
import NewAccountsOverTime from "@/components/super-admin/home/newAccountsOverTime"
import SubscriptionDistribution from "@/components/super-admin/home/subscriptionDistribution"
import UserOverviews from "@/components/super-admin/home/userOverviews"
import UserOverviewTable from "@/components/super-admin/home/userOverviewTable"



const SuperAdminHome = () => {

    return (
        <section className="w-full min-h-screen flex flex-col gap-2 px-2 py-2 md:px-6 md:py-6 outfit bg-[#F5F6FA] dark:bg-slate-900">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-[#0E1011] dark:text-white text-[24px] md:text-[26px]  lg:text-[28px] font-[500]">Dashboard</h1>
                </div>

            </div>

            <UserOverviews />

            <div className="flex flex-col md:flex-row gap-2 items-center justify-evenly">
                <NewAccountsOverTime />
                <DashboardAlert />
            </div>

            <div className="flex flex-col md:flex-row  gap-2 items-center justify-evenly">
                <UserOverviewTable />
              <SubscriptionDistribution/>
            </div>


        </section>
    )
}

export default SuperAdminHome