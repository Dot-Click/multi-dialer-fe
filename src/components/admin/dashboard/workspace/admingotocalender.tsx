import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useCalendarEvents, useAllCalendarEvents } from "@/hooks/useWorkspace";
import { Loader2 } from "lucide-react";
import moment from "moment";
import { useAppSelector } from "@/store/hooks";

const AdminGoToCalender = () => {
  const navigate = useNavigate();
  const { data: ownEvents, isLoading: ownLoading } = useCalendarEvents();
  const { data: allEvents, isLoading: allLoading } = useAllCalendarEvents();
  const { role } = useAppSelector((state) => state.auth);

  const isLoading = ownLoading || allLoading;
  const today = moment();
  const tomorrow = moment().add(1, "day");

  // For ADMIN: merge own events + all agent events (deduplicated by id)
  const merged = (() => {
    if (role !== "ADMIN") return ownEvents || [];
    const combined = [...(allEvents || []), ...(ownEvents || [])];
    const seen = new Set<string>();
    return combined.filter((ev) => {
      if (seen.has(ev.id)) return false;
      seen.add(ev.id);
      return true;
    });
  })();

  // Widget is a quick "what's coming up" glance — only today and tomorrow,
  // split into their own columns.
  const todayEvents = merged.filter((ev) => moment(ev.startDate).isSame(today, "day"));
  const tomorrowEvents = merged.filter((ev) => moment(ev.startDate).isSame(tomorrow, "day"));

  const goToCalendar = (date?: string) =>
    navigate(role === "ADMIN" ? "/admin/calendar" : "/calendar", date ? { state: { date } } : undefined);

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-slate-800 h-fit lg:h-[50vh] flex flex-col items-center justify-center rounded-[32px] w-full lg:w-[55%] ">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </section>
    );
  }

  const renderEvent = (ev: (typeof merged)[number]) => (
    <div
      key={ev.id}
      onClick={() => goToCalendar(ev.startDate)}
      className="px-3 py-2 border-l-4 rounded bg-gray-50 dark:bg-slate-700/50 cursor-pointer"
      style={{ borderColor: ev.color || "#D43435" }}
    >
      <h1 className="text-[15px] font-medium text-[#0E1011] dark:text-white truncate">
        {ev.title}
      </h1>
      <h1 className="text-[13px] font-normal text-black">
        {moment(ev.startDate).format("HH:mm")} -{" "}
        {ev.endDate ? moment(ev.endDate).format("HH:mm") : "..."}
      </h1>
      {role === "ADMIN" && ev.assignTo?.fullName && (
        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400">
          {ev.assignTo.fullName}
        </span>
      )}
    </div>
  );

  return (
    <section className="bg-white dark:bg-slate-800 h-fit lg:h-[50vh]  flex flex-col gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px]  w-full lg:w-[55%] shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[14px] text-secondary-heading font-medium">
            {today.format("dddd")}
          </h1>
          <h1 className="text-[20px] text-heading font-medium">
            {today.format("MMMM DD")}
          </h1>
        </div>
        <div
          onClick={() => goToCalendar()}
          className="flex gap-1 cursor-pointer items-center text-secondary-heading"
        >
          <span className="text-[16px] font-medium">Go to Calendar</span>
          <span>
            <IoIosArrowForward className="text-[19px] font-normal" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2 h-full">
        <div className="flex flex-col gap-3">
          <h2 className="text-[13px] font-medium text-secondary-heading">Today</h2>
          <div className="flex flex-col gap-3">
            {todayEvents.length > 0 ? (
              todayEvents.map(renderEvent)
            ) : (
              <div className="text-[13px] text-black">No events today</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-[13px] font-medium text-secondary-heading">
            Tomorrow, {tomorrow.format("MMMM DD")}
          </h2>
          <div className="flex flex-col gap-3">
            {tomorrowEvents.length > 0 ? (
              tomorrowEvents.map(renderEvent)
            ) : (
              <div className="text-[13px] text-black">No events tomorrow</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminGoToCalender;
