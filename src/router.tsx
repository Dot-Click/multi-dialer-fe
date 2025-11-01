import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/agent/dashboardlayout"
import AgentHome from "@/pages/agent/agenthome"
import AllContactSidebar from "./components/agent/common/allcontactsidebar";
import ContactLayout from "./layouts/agent/contactlayout";
import AllContact from "./pages/agent/allcontact";
import ContactDetail from "./pages/agent/contactdetail";
import Login from "./pages/auth/login.page";
import AdminLogin from "./pages/auth/adminlogin.page";
import AdminChangePassword from "./pages/auth/adminchangepassword.page";
import RecoveryPassword from "./pages/auth/recoverypassword.page";
import ChangePassword from "./pages/auth/changepassword.page";
import Code from "./pages/auth/code.page";

const Router: React.FC = () => {
  return (
    <div className="min-h-screen w-full work-sans">
      <Routes>
        {/* agent routes */}

        <Route path="/agent/login" element={<Login/>} />
        <Route path="/agent/code" element={<Code/>} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<AgentHome />} />  
        </Route>

        <Route path="/data-dialer" element={<ContactLayout />}>
          <Route index element={<AllContact/>} /> 
        </Route>

        <Route path="/contact-detail" element={<ContactDetail/>} />
         


         {/* admin routes  */}
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/admin/change-password" element={<ChangePassword/>} />
        <Route path="/admin/password-recovery" element={<RecoveryPassword/>} />
        <Route path="/admin/create-password" element={<AdminChangePassword/>} />
         

      </Routes>
    </div>
  );
};

export default Router;
