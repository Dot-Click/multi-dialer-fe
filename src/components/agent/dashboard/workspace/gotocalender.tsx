import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useCalendarEvents } from "@/hooks/useWorkspace";
import { Loader2 } from "lucide-react";
import moment from "moment";

const GoToCalender = () => {
    const navigate = useNavigate();
    const { data: events, isLoading } = useCalendarEvents();

    if (isLoading) {
        return (
            <section className='bg-white dark:bg-slate-800 h-fit lg:h-[50vh] flex flex-col items-center justify-center rounded-[32px] w-full lg:w-[55%] '>
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </section>
        );
    }

    return (
        <section className='bg-white dark:bg-slate-800  h-fit lg:h-[50vh]  flex flex-col gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px]  w-full lg:w-[55%] shadow-md'>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-[14px] text-black font-bold">{moment().format("dddd")}</h1>
                    <h1 className="text-[20px] text-yellow-500 font-bold">{moment().format("MMMM DD")}</h1>
                </div>
                <div onClick={() => navigate("/calendar")} className="flex gap-1  cursor-pointer text-black items-center ">
                    <span className="text-[16px] font-medium">Go To Calender</span>
                    <span ><IoIosArrowForward className="text-[19px] font-normal" /></span>
                </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 h-full">
                <h1 className="text-[14px] font-bold text-black">Latest Incomplete Events</h1>
                <div className="flex flex-col gap-3">
                    {events && events.length > 0 ? (
                        events.map((ev) => (
                            <div 
                                key={ev.id} 
                                onClick={() => navigate("/calendar", { state: { date: ev.startDate } })}
                                className="px-3 py-2 border-l-4 rounded bg-gray-50 dark:bg-slate-700/50 cursor-pointer" 
                                style={{ borderColor: ev.color || '#D43435' }}
                            >
                                <div className="flex justify-between items-start">
                                    <h1 className="text-[16px] dark:text-white font-medium text-[#0E1011]">{ev.title}</h1>
                                    <span className="text-[12px] text-black">
                                        {moment(ev.startDate).format("MMM DD")}
                                    </span>
                                </div>
                                <h1 className="text-[14px] font-normal text-black">
                                    {moment(ev.startDate).format("hh:mm A")} - {ev.endDate ? moment(ev.endDate).format("hh:mm A") : "..."}
                                </h1>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-32 text-black">
                            No incomplete events
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default GoToCalender;