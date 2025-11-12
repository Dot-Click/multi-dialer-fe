import { useState } from "react"
import CallerId from "@/components/admin/systemsettings/callerid"
import CallSetting from "@/components/admin/systemsettings/callsetting"
import DialerSetting from "@/components/admin/systemsettings/dialersetting"
import ActionPlan from "@/components/admin/systemsettings/actionplan"
import LeadSheet from "@/components/admin/systemsettings/leadsheet"

// Dummy components for each button
const MiscFields = () => <div className="mt-6 p-4 border rounded-md bg-gray-50">Misc Fields Component</div>
const DataManagement = () => <div className="mt-6 p-4 border rounded-md bg-gray-50">Data Management Component</div>
const Appearance = () => <div className="mt-6 p-4 border rounded-md bg-gray-50">Appearance Component</div>
const Notifications = () => <div className="mt-6 p-4 border rounded-md bg-gray-50">Notifications Component</div>
const Integrations = () => <div className="mt-6 p-4 border rounded-md bg-gray-50">Integrations Component</div>

const AdminSystemSetting = () => {
    const [openDialogue, setOpenDialogue] = useState('Caller ID')

    const buttons = [
        { id: 1, name: "Caller ID", component: <CallerId /> },
        { id: 2, name: "Dialer Setting", component: <DialerSetting /> },
        { id: 3, name: "Call Settings", component: <CallSetting /> },
        { id: 4, name: "Action Plan", component: <ActionPlan /> },
        { id: 5, name: "Lead Sheet", component: <LeadSheet /> },
        { id: 6, name: "Misc Fields", component: <MiscFields /> },
        { id: 7, name: "Data Management", component: <DataManagement /> },
        { id: 8, name: "Appearance", component: <Appearance /> },
        { id: 9, name: "Notifications", component: <Notifications /> },
        { id: 10, name: "Integrations", component: <Integrations /> },
    ]

    // Find the component for the selected button
    const ActiveComponent = buttons.find(btn => btn.name === openDialogue)?.component

    return (
        <div className="min-h-screen flex flex-col gap-3 mr-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    System Settings
                </h1>
            </div>

            <div className="flex gap-3 items-center bg-white rounded-lg px-5 py-4 flex-wrap">
                {buttons.map((btn) => (
                    <button
                        key={btn.id}
                        onClick={() => setOpenDialogue(btn.name)}
                        className={`px-4 py-2.5 text-[14px] text-[#495057F] cursor-pointer font-[500] rounded-md
                        ${openDialogue === btn.name ? "bg-[#FFCA06]" : "bg-[#F3F4F7]"}`}
                    >
                        {btn.name}
                    </button>
                ))}
            </div>

            {/* Render only the active component */}
            <div>
            {ActiveComponent}
            </div>
        </div>
    )
}

export default AdminSystemSetting
