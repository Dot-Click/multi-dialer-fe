
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import AnalyticCard from "./analyticcard";
import dialingicon from "../../../assets/dialingicon.png"
import callsicon from "../../../assets/callsicon.png"
import contacticon from "../../../assets/contacticon.png"
import leadsicon from "../../../assets/leadsicon.png"
import appointmenticon from "../../../assets/appointmenticon.png"
import appointmentsecondicon from "../../../assets/appointmentsecondicon.png"
import callhricon from "../../../assets/callhricon.png"
import contacthricon from "../../../assets/contacthricon.png"
import callleadicon from "../../../assets/callleadicon.png"
import contactleadicon from "../../../assets/contactleadicon.png"
import timeicon from "../../../assets/timeicon.png"
import callappointmenticon from "../../../assets/callappointmenticon.png"
import contactappointment from "../../../assets/contactappointment.png"
import exportarrowicon from "../../../assets/exportarrowicon.png"

import type { AgentReport } from "@/hooks/useReports";

interface AnalyticsDashboardProps {
    data: AgentReport | null;
    loading: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data, loading }) => {
    const stats = [
        { icon: dialingicon, label: "Dialing Time", value: data?.dialingTime || "0s" },
        { icon: callsicon, label: "Calls Made", value: data?.callsMade.toString() || "0" },
        { icon: contacticon, label: "Contacts Made", value: data?.contacts.toString() || "0" },
        { icon: leadsicon, label: "Leads", value: data?.totalLeads.toString() || "0" },
        { icon: appointmenticon, label: "Appointments Set", value: data?.appointmentsSet?.toString() || "0" },
        { icon: appointmentsecondicon, label: "Appointments Met", value: data?.appointmentsMet?.toString() || "0" },
        { icon: callhricon, label: "Calls/Hr", value: data?.callsPerHour || "0.00" },
        { icon: contacthricon, label: "Contacts/Hr", value: data?.contactsPerHour || "0.00" },
        { icon: callleadicon, label: "Calls/Lead", value: data?.callsPerLead || "0.00" },
        { icon: contactleadicon, label: "Contacts/Lead", value: data?.contactsPerLead || "0.00" },
        { icon: timeicon, label: "Time/Appointment", value: data?.timePerAppointment || "0s" },
        { icon: callappointmenticon, label: "Calls/Appointment", value: data?.callsPerAppointment || "0.00" },
        { icon: contactappointment, label: "Contacts/Appointment", value: data?.contactsPerAppointment || "0.00" },
    ];

    return (
        <div className="bg-white rounded-[24px] p-[24px] shadow-md w-full">

            {/* Header & Filters Responsive */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-6">
                    <h2 className="text-[24px] font-medium text-[#17181B]">
                        Analytics
                    </h2>

                    <div className="flex items-center gap-[16px] text-sm  border border-[#D8DCE1] rounded-[12px] p-[4px] cursor-pointer">
                        <IoIosArrowBack className="text-[13px] text-[#71717A]" />
                        <span className="font-medium text-[16px] text-[#47474C]">All Dates</span>
                        <IoIosArrowForward className="text-[13px] text-[#71717A]" />
                    </div>
                </div>

                <button className="flex items-center gap-2 text-[16px] font-medium text-[#495057] hover:text-gray-950 transition">
                    <img src={exportarrowicon} alt="exportarrowicon" className="" />
                    <span>Export</span>
                </button>
            </div>

            {/* Stats Cards Grid (Fully Responsive) */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {stats.map((stat, index) => (
                    <AnalyticCard key={index} icon={stat.icon} label={stat.label} value={stat.value} />
                ))}
            </div>

        </div>
    );
};

export default AnalyticsDashboard;
