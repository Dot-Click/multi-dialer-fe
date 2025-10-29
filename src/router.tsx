import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/agent/dashboardlayout"
import AgentHome from "@/pages/agent/agenthome"

const Router: React.FC = () => {
  return (
    <div className="min-h-screen w-full work-sans">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<AgentHome />} /> {/* /agent */}
          
        </Route>
        

      </Routes>
    </div>
  );
};

export default Router;
