import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/agent/dashboardlayout"
import AgentHome from "@/pages/agent/agenthome"
import AllContactSidebar from "./components/agent/common/allcontactsidebar";
import ContactLayout from "./layouts/agent/contactlayout";
import AllContact from "./pages/agent/allcontact";

const Router: React.FC = () => {
  return (
    <div className="min-h-screen w-full work-sans">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<AgentHome />} /> 
          
        </Route>
        <Route path="/contact" element={<ContactLayout />}>
          <Route index element={<AllContact/>} /> 
          
        </Route>

        <Route path="/" element={<AllContactSidebar/>} />
        

      </Routes>
    </div>
  );
};

export default Router;
