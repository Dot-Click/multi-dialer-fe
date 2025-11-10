
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
import { HiDownload } from "react-icons/hi";

const AnalyticsDashboard = () => {
    const stats = [
        { icon: dialingicon, label: "Dialing Time", value: "6h 35m" },
        { icon: callsicon, label: "Calls Made", value: "372" },
        { icon: contacticon, label: "Contacts Made", value: "116" },
        { icon: leadsicon, label: "Leads", value: "20" },
        { icon: appointmenticon, label: "Appointments Set", value: "11" },
        { icon: appointmentsecondicon, label: "Appointments Met", value: "6" },
        { icon: callhricon, label: "Calls/Hr", value: "42.38" },
        { icon: contacthricon, label: "Contacts/Hr", value: "11.84" },
        { icon: callleadicon, label: "Calls/Lead", value: "13.60" },
        { icon: contactleadicon, label: "Contacts/Lead", value: "3.80" },
        { icon: timeicon, label: "Time/Appointment", value: "36m" },
        { icon: callappointmenticon, label: "Calls/Appointment", value: "24.73" },
        { icon: contactappointment, label: "Contacts/Appointment", value: "6.91" },
    ];

    return (
        <div className="bg-white rounded-2xl px-5 py-4 shadow-md w-full">
            
            {/* Header & Filters Responsive */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Analytics
                    </h2>

                    <div className="flex items-center gap-3 text-sm text-gray-600 border rounded-md px-3 py-1 cursor-pointer">
                        <IoIosArrowBack className="text-[18px]" />
                        <span className="font-medium">All Dates</span>
                        <IoIosArrowForward className="text-[18px]" />
                    </div>
                </div>

                <button className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-gray-950 transition">
                    <HiDownload className="text-xl" />
                    Export
                </button>
            </div>

            {/* Stats Cards Grid (Fully Responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
                {stats.map((stat, index) => (
                    <AnalyticCard key={index} icon={stat.icon} label={stat.label} value={stat.value} />
                ))}
            </div>

        </div>
    );
};

export default AnalyticsDashboard;
