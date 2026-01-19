import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/agent/dashboardlayout"
import AdminDashboardLayout from "@/layouts/admin/admindashboardlayout";
import SuperAdminDashboardLayout from "@/layouts/super-admin/superadmindashboardlayout";
import AgentHome from "@/pages/agent/agenthome"

import ContactLayout from "@/layouts/agent/contactlayout";
import AllContact from "@/pages/agent/allcontact";
import ContactDetail from "@/pages/agent/contactdetail";
import Login from "@/pages/auth/login.page";
import AdminLogin from "@/pages/auth/adminlogin.page";
import AdminChangePassword from "./pages/auth/adminchangepassword.page";
import RecoveryPassword from "@/pages/auth/recoverypassword.page";
import ChangePassword from "@/pages/auth/changepassword.page";
import Code from "@/pages/auth/code.page";
import Setting from "@/pages/agent/setting";
import AdminHome from "@/pages/admin/adminhome";
import Library from "@/pages/agent/library";
import ReportAnalytics from "@/pages/agent/reportanalytics";
import ContactInfo from "@/pages/agent/contactinfo";
import Calender from "@/pages/agent/calender";





import AdminContact from "@/layouts/admin/contactlayout";
import AdminAllContact from "@/pages/admin/adminallcontact";
import AdminCalender from "@/pages/admin/calender"
import AdminLibrary from "@/pages/admin/library";
import AdminReportAnalytics from "@/pages/admin/reportanalytics";
import AdminUserManagment from "@/components/admin/user-managment/useermanagement"
import Billing from "@/pages/admin/billing";
import Upgrade from "@/pages/admin/upgrade";
import LeadStore from "@/pages/admin/leadstore";
import Compliance from "@/pages/admin/compliance";
import AdminFindDuplicate from "@/pages/admin/adminfindduplicate";
import AdminCreateContact from "@/pages/admin/admincreatecontact";
import AdminSystemSetting from "@/pages/admin/adminsystemsetting";
import AddSettingPage from "@/pages/admin/addsetting";
import AddLeadSheetPage from "@/pages/admin/addleadsheet";
import NumberSetting from "@/pages/admin/numbersetting";
import AdminCreateCallSetting from "@/pages/admin/admincreatecallsetting";
import AdminActionPlan from "@/pages/admin/adminactionplan";
import AdminEditSignature from "@/pages/admin/admineditsignature";
import AdminAccountSetting from "@/pages/admin/adminaccountsetting";
import AdminRestoreData from "@/pages/admin/adminrestoredata";
import AdminPreviewData from "@/pages/admin/adminpreviewdata";
import LogincodeAgenct from "@/pages/auth/code.page.tsx"

import SuperAdminHome from "./pages/super-admin/superAdminHome";
import SuperAdminUserManagement from "./pages/super-admin/superAdminUserManagement";
import SuperAdminReportsOfUser from "./pages/super-admin/superAdminReportsOfUser";
import SuperAdminSetting from "./pages/super-admin/superAdminSetting";
import SuperAdminReporting from "./pages/super-admin/superAdminReporting";
import SuperAdminSubscriptionPlan from "./pages/super-admin/superAdminSubscriptionPlan";



const Router: React.FC = () => {
  return (
    <div className="min-h-screen w-full work-sans">
      <Routes>

        {/* ✅ Agent Routes */}
        <Route path="/agent/login" element={<Login />} />
        <Route path="/agent/code" element={<Code />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<AgentHome />} />
          <Route path="library" element={<Library />} />
          <Route path="calendar" element={<Calender />} />
          <Route path="reports-analytics" element={<ReportAnalytics />} />
          <Route path="settings" element={<Setting />} />
        </Route>

        <Route path="/data-dialer" element={<ContactLayout />}>
          <Route index element={<AllContact />} />
        </Route>

        <Route path="/contact-detail" element={<ContactDetail />} />
        <Route path="/contact-info" element={<ContactInfo />} />

        <Route path="/login-code" element={<LogincodeAgenct />} />

        {/* ✅ Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/change-password" element={<ChangePassword />} />
        <Route path="/admin/password-recovery" element={<RecoveryPassword />} />
        <Route path="/admin/create-password" element={<AdminChangePassword />} />

        {/* ✅ Admin Contact / Data Dialer Area */}
        <Route path="/admin" element={<AdminContact />}>
          <Route path="data-dialer" element={<AdminAllContact />} />
          <Route path="find-duplicate" element={<AdminFindDuplicate />} />
        </Route>

        {/* ✅ Admin Dashboard Section */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="calendar" element={<AdminCalender />} />
          <Route path="library" element={<AdminLibrary />} />
          <Route path="reports-analytics" element={<AdminReportAnalytics />} />
          <Route path="user-management" element={<AdminUserManagment />} />
          <Route path="system-settings" element={<AdminSystemSetting />} />
          <Route path="number-setting" element={<NumberSetting />} />
          <Route path="create-setting" element={<AdminCreateCallSetting />} />
          <Route path="action-plan" element={<AdminActionPlan />} />
          <Route path="billing" element={<Billing />} />
          <Route path="upgrade" element={<Upgrade />} />
          <Route path="lead-store" element={<LeadStore />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="create-contact" element={<AdminCreateContact />} />
          <Route path="add-setting" element={<AddSettingPage />} />
          <Route path="add-lead-sheet" element={<AddLeadSheetPage />} />
          <Route path="edit-signature" element={<AdminEditSignature />} />
          <Route path="account-setting" element={<AdminAccountSetting />} />
          <Route path="restore-data" element={<AdminRestoreData />} />
          <Route path="preview-data" element={<AdminPreviewData />} />

          <Route path="change-password" element={<AdminChangePassword />} />
        </Route>

        <Route path="/admin/contact-detail" element={<ContactDetail />} />
        <Route path="/admin/password-change" element={<AdminChangePassword />} />
        <Route path="/admin/contact-info" element={<ContactInfo />} />



        {/* SuperAdminDashboardLayout */}

        {/* ✅ Super Admin Dashboard Section */}
        <Route path="/super-admin" element={<SuperAdminDashboardLayout />}>
          <Route index element={<SuperAdminHome />} />
          <Route path="user-management" element={<SuperAdminUserManagement />} />
          <Route path="subscription-management" element={<SuperAdminSubscriptionPlan />} />
          <Route path="reports-of-user-billing" element={<SuperAdminReportsOfUser />} />
          <Route path="reporting" element={<SuperAdminReporting />} />
          <Route path="setting" element={<SuperAdminSetting />} />

        </Route>


      </Routes>
    </div>
  );
};

export default Router;
