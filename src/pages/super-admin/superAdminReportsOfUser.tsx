import { useState } from "react";
import SuperAdminReportsOfUserHeader from "@/components/super-admin/reports-of-user/superAdminReportsOfUserHeader"
import SuperAdminReportsData from "@/components/super-admin/reports-of-user/superAdminReportsData"
import SuperAdminRevenueGrow from "@/components/super-admin/reports-of-user/superAdminRevenueGrow"
import SuperAdminDetailedBilling from "@/components/super-admin/reports-of-user/superAdminDetailedBilling"



const SuperAdminReportsOfUser = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedPlan: "All Plans",
    selectedStatus: "All Status",
  });

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  };

  const handlePlanChange = (value: string) => {
    setFilters((prev) => ({ ...prev, selectedPlan: value }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, selectedStatus: value }));
  };

  return (
    <section className="w-full min-h-screen flex flex-col gap-3.5 pr-4 items-start py-2 outfit dark:bg-slate-900 bg-[#F5F6FA]">
      <SuperAdminReportsOfUserHeader 
         onSearchChange={handleSearchChange}
         onPlanChange={handlePlanChange}
         onStatusChange={handleStatusChange}
      />
      <SuperAdminReportsData />
      <SuperAdminRevenueGrow />
      <SuperAdminDetailedBilling filters={filters} />
    </section>
  )
}

export default SuperAdminReportsOfUser