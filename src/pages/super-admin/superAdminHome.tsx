import DashboardAlert from "@/components/super-admin/home/dashboardAlert"
import NewAccountsOverTime from "@/components/super-admin/home/newAccountsOverTime"
import SubscriptionDistribution from "@/components/super-admin/home/subscriptionDistribution"
import UserOverviews from "@/components/super-admin/home/userOverviews"
import UserOverviewTable from "@/components/super-admin/home/userOverviewTable"



const SuperAdminHome = () => {

    return (
        <section className="w-full min-h-screen flex flex-col gap-2 px-6 py-6 outfit bg-[#F5F6FA]">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-[#0E1011] text-[20px] md:text-[26px]  lg:text-[28px] font-[500]">Dashboard</h1>
                </div>

            </div>

            <UserOverviews />

            <div className="flex gap-2 items-center justify-evenly">
                <NewAccountsOverTime />
                <DashboardAlert />
            </div>

            <div className="flex gap-2 items-center justify-evenly">
                <UserOverviewTable />
              <SubscriptionDistribution/>
            </div>


        </section>
    )
}

export default SuperAdminHome