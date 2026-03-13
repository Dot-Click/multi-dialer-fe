import { useState } from "react"
import CallerId from "@/components/admin/systemsettings/callerid"
import CallSetting from "@/components/admin/systemsettings/callsetting"
import DialerSetting from "@/components/admin/systemsettings/dialersetting"
import ActionPlan from "@/components/admin/systemsettings/actionplan"
import LeadSheet from "@/components/admin/systemsettings/leadsheet"
import Appearance from "@/components/admin/systemsettings/appearance"
import Notifications from "@/components/admin/systemsettings/notifications"
import Integrations from "@/components/admin/systemsettings/integrations"
import MiscField from "@/components/admin/systemsettings/miscfield"
import DataManagement from "@/components/admin/systemsettings/datamanagement"

// Dummy components for each button

const AdminSystemSetting = () => {
    const [openDialogue, setOpenDialogue] = useState('Caller ID')

    const firstRowButtons = [
        { id: 1, name: "Caller ID", component: <CallerId /> },
        { id: 2, name: "Dialer Setting", component: <DialerSetting /> },
        { id: 3, name: "Call Settings", component: <CallSetting /> },
        { id: 4, name: "Action Plan", component: <ActionPlan /> },
        { id: 5, name: "Lead Sheet", component: <LeadSheet /> },
        { id: 6, name: "Misc Fields", component: <MiscField /> },
        { id: 7, name: "Data Management", component: <DataManagement /> },
    ]

    const secondRowButtons = [
        { id: 8, name: "Appearance", component: <Appearance /> },
        { id: 9, name: "Notifications", component: <Notifications /> },
        { id: 10, name: "Integrations", component: <Integrations /> },
    ]

    const allButtons = [...firstRowButtons, ...secondRowButtons]

    // Find the component for the selected button
    const ActiveComponent = allButtons.find(btn => btn.name === openDialogue)?.component

    return (
        <div className="min-h-screen flex flex-col gap-3 mr-10">
            <div className="flex justify-between items-center">
                <h1 className="text-[28px] dark:text-white font-medium text-[#0E1011]">
                    System Settings
                </h1>
            </div>

            <div className="flex flex-col gap-3 bg-white dark:bg-slate-800 rounded-lg px-5 py-4">
                {/* First Row */}
                <div className="flex gap-3 items-center flex-wrap">
                    {firstRowButtons.map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setOpenDialogue(btn.name)}
                            className={`px-4 py-2.5 text-[14px] text-[#495057] dark:text-gray-400 cursor-pointer font-medium rounded-md transition-colors
                            ${openDialogue === btn.name ? "bg-[#FFCA06] text-black dark:text-white" : "bg-[#F3F4F7] dark:bg-slate-700 dark:text-white text-[#495057]"}`}
                        >
                            {btn.name}
                        </button>
                    ))}
                </div>

                {/* Second Row */}
                <div className="flex gap-3 items-center flex-wrap">
                    {secondRowButtons.map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setOpenDialogue(btn.name)}
                            className={`px-4 py-2.5 text-[14px] text-[#495057] dark:text-gray-400 cursor-pointer font-medium rounded-md transition-colors
                            ${openDialogue === btn.name ? "bg-[#FFCA06] text-black dark:text-white" : "bg-[#F3F4F7] dark:bg-slate-700 dark:text-white text-[#495057]"}`}
                        >
                            {btn.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Render only the active component */}
            <div>
                {ActiveComponent}
            </div>
        </div>
    )
}

export default AdminSystemSetting
