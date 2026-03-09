import SuperAdminReportsOfUserHeader from "@/components/super-admin/reports-of-user/superAdminReportsOfUserHeader"
import SuperAdminReportsData from "@/components/super-admin/reports-of-user/superAdminReportsData"
import SuperAdminRevenueGrow from "@/components/super-admin/reports-of-user/superAdminRevenueGrow"
import SuperAdminDetailedBilling from "@/components/super-admin/reports-of-user/superAdminDetailedBilling"



const SuperAdminReportsOfUser = () => {
  return (
    <section className="w-full min-h-screen flex flex-col gap-3.5 pr-4 items-start py-2 outfit dark:bg-slate-900 bg-[#F5F6FA]">

      <SuperAdminReportsOfUserHeader />
      <SuperAdminReportsData />
      <SuperAdminRevenueGrow />
      <SuperAdminDetailedBilling />

    </section>
  )
}

export default SuperAdminReportsOfUser