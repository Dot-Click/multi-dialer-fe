import { useState } from "react";
import AiIcon from "@/assets/Ai_icon.png";
import WorkspaceIcon from "@/assets/workspace_icon.png";
import AdminWorkspace from "@/pages/admin/adminworkspace";
import AdminAisidekick from "@/pages/admin/adminaisidekick";


const AdminHome = () => {
  const [active, setActive] = useState("Workspace");

  const components = [
    { id: 1, name: "Workspace", icon: WorkspaceIcon },
    { id: 2, name: "AI Sidekick", icon: AiIcon },
  ];

  return (
    <section className="w-full min-h-full ">
      {/* Header */}
      <div className="flex justify-between items-center pr-3 lg:pr-6">
        <div>
          <h1 className="text-[#0E1011] text-[20px] md:text-[26px]  lg:text-[28px] font-[500]">Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center px-1.5 py-1.5 rounded-[12px] bg-[#D8DCE1] items-center gap-2">
          {components.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setActive(comp.name)}
              className={`flex items-center gap-2 px-1.5 py-1.5 lg:px-2 lg:py-1 rounded-[8px] transition-all duration-200
                ${active === comp.name ? "bg-white shadow-sm" : "bg-transparent"}`}
            >
              <img src={comp.icon} className="h-4 w-4" alt={comp.name} />
              <span
                className={`text-[10px] cursor-pointer md:text-[13px] lg:text-[14px] font-semibold ${active === comp.name ? "text-[#0E1011]" : "text-[#495057]"
                  }`}
              >
                {comp.name}
              </span>
            </button>
          ))}
        </div>
      </div>



      <div className="mt-3   pr-6">
        {active === "Workspace" && <AdminWorkspace />}
        {active === "AI Sidekick" && <AdminAisidekick />}
      </div>
    </section>
  );
};

export default AdminHome;
