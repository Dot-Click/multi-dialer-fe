import { useEffect, useState } from "react";
import { Calendar, ConfigProvider, Modal, theme } from "antd"; // Added `theme`
import enGB from "antd/locale/en_GB";
import { IoFilterOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FiEdit, FiClipboard, FiCalendar, FiPhone } from "react-icons/fi";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en-gb";
import AddEventForm from "@/components/modal/addeventmodal";
import { useCalendar, type CalendarEvent } from "@/hooks/useCalendar";
import { toast } from "react-hot-toast";

//  --------------------------------------------------
const formatEventTime = (event: CalendarEvent) => {
  const start = dayjs(event.startDate);
  if (event.eventType === "ALL_DAY") return "All Day";
  if (event.eventType === "START_ONLY") return start.format("HH:mm");
  if (event.eventType === "FROM_TO" && event.endDate) {
    const end = dayjs(event.endDate);
    return `${start.format("HH:mm")} - ${end.format("HH:mm")}`;
  }
  return start.format("HH:mm");
};

/* --------------------------------------------------
 *  MAIN COMPONENT
 * -------------------------------------------------- */
export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const[selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  // Track Dark Mode to sync Ant Design with Tailwind
  const[isDarkMode, setIsDarkMode] = useState(false);

  const { getAllEvents, updateEvent } = useCalendar();

  /* modals */
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const[showAllOpen, setShowAllOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  /* filter options */
  const[filters, setFilters] = useState({
    task: true,
    appointments: true,
    followUpCalls: true,
  });

  /* selected event for detail */
  const[selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedEventDate, setSelectedEventDate] = useState<Dayjs | null>(null);

  const fetchEvents = async () => {
    const data = await getAllEvents();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();

    // Dark Mode Observer logic (Syncs Ant Design with Tailwind class)
    if (typeof document !== "undefined") {
      const checkDarkMode = () => document.documentElement.classList.contains("dark");
      setIsDarkMode(checkDarkMode());

      const observer = new MutationObserver(() => setIsDarkMode(checkDarkMode()));
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    }
  },[]);

  const getEventDataForDate = (date: Dayjs) => {
    return events.filter((event) => {
      const isSameDate =
        dayjs(event.startDate).format("YYYY-MM-DD") ===
        date.format("YYYY-MM-DD");
      if (!isSameDate) return false;

      const category = event.category || "TASK";
      if (category === "TASK" && !filters.task) return false;
      if (category === "APPOINTMENT" && !filters.appointments) return false;
      if (category === "FOLLOW_UP" && !filters.followUpCalls) return false;

      return true;
    });
  };

  /* handlers */
  const onDateClick = (d: Dayjs) => {
    setSelectedDate(d);
    setOptionsOpen(true);
  };

  const showAdd = () => {
    setOptionsOpen(false);
    setAddOpen(true);
  };

  const showAll = () => {
    setOptionsOpen(false);
    setShowAllOpen(true);
  };

  const openDetail = (ev: CalendarEvent, date: Dayjs) => {
    setSelectedEvent(ev);
    setSelectedEventDate(date);
    setDetailOpen(true);
  };

  const prev = () => setCurrentDate((d) => d.subtract(1, "month"));
  const next = () => setCurrentDate((d) => d.add(1, "month"));

  /* calendar cell render */
  const dateCellRender = (value: Dayjs) => {
    const list = getEventDataForDate(value);
    const max = 2;
    const more = list.length - max;

    return (
      <div className="flex flex-col gap-1 py-2 h-full text-left">
        {list.slice(0, max).map((it, i) => (
          <div
            key={i}
            className="flex items-start gap-1 text-[10px] sm:text-[11px] leading-tight"
          >
            <div
              className="w-1 rounded-full self-stretch shrink-0"
              style={{ backgroundColor: it.color }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-gray-700 dark:text-gray-200 truncate">{it.title}</p>
                <span className="text-[9px] px-1 bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-300 rounded border border-gray-200 dark:border-[#3a3a3a] uppercase font-bold">
                  {it.category?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 truncate">{formatEventTime(it)}</p>
            </div>
          </div>
        ))}
        {more > 0 && (
          <div
            className="mt-1 px-1 py-0.5 sm:py-1 bg-[#F3F4F7] dark:bg-[#1f1f1f] rounded-md text-[#495057] dark:text-[#a0a0a0] text-[10px] sm:text-[12px] font-normal text-center cursor-pointer hover:bg-[#E9ECEF] dark:hover:bg-[#2a2a2a] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDate(value);
              setShowAllOpen(true);
            }}
          >
            +{more}
          </div>
        )}
      </div>
    );
  };

  return (
    // Wrap EVERYTHING in ConfigProvider to guarantee child Modals receive the dark theme automatically
    <ConfigProvider
      locale={enGB}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className="mr-0 sm:mr-10 p-4 sm:p-0 transition-colors">
        {/* ------- header ------- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <h2 className="text-base sm:text-[28px] dark:text-white font-medium text-[#0E1011] transition-colors">
              {currentDate.format("MMMM YYYY")}
            </h2>
            <div className="flex gap-2">
              <button
                className="p-1 border text-[#71717A] dark:text-[#A0A0A0] border-[#D8DCE1] dark:border-[#303030] rounded-[8px] bg-[#FFFFFF] dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
                onClick={prev}
              >
                <IoIosArrowBack />
              </button>
              <button
                className="p-1 border text-[#71717A] dark:text-[#A0A0A0] border-[#D8DCE1] dark:border-[#303030] rounded-[8px] bg-[#FFFFFF] dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
                onClick={next}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 pr-[16px] pl-[10px] py-[4px] text-sm sm:text-base font-medium text-[#FFFFFF] border border-[#D8DCE1] dark:border-[#303030] rounded-[12px] bg-[#FFFFFF] dark:bg-[#141414] w-full sm:w-auto justify-center hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
          >
            <span className="text-[#2B3034] dark:text-[#E0E0E0]">
              <IoFilterOutline />
            </span>
            <span className="text-[#27272A] dark:text-[#E0E0E0] font-medium text-[16px]">Filter</span>
          </button>
        </div>

        {/* ------- calendar ------- */}
        <div className="bg-white dark:bg-[#141414] rounded-xl p-2 sm:p-4 shadow-sm border border-gray-200 dark:border-[#303030] overflow-x-auto transition-colors">
          <Calendar
            value={currentDate}
            onPanelChange={setCurrentDate}
            dateCellRender={dateCellRender}
            onSelect={onDateClick}
            headerRender={() => null}
            className="custom-calendar"
          />
        </div>

        {/* ------- options modal ------- */}
        <Modal
          open={optionsOpen}
          footer={null}
          onCancel={() => setOptionsOpen(false)}
          title={selectedDate?.format("DD MMM, YYYY")}
          className="rounded-modal"
          width="90%"
          style={{ maxWidth: 400 }}
        >
          <div className="flex flex-col gap-3">
            <button
              className="py-2 px-4 rounded-md bg-gray-100 dark:bg-[#1f1f1f] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] text-sm sm:text-base dark:text-[#E0E0E0] transition-colors"
              onClick={showAll}
            >
              Show All Events
            </button>
            <button
              className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base transition-colors"
              onClick={showAdd}
            >
              Add Event
            </button>
            <button
              className="py-2 px-4 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 text-sm sm:text-base transition-colors"
              onClick={() => setOptionsOpen(false)}
            >
              Close
            </button>
          </div>
        </Modal>

        {/* ------- add-event modal ------- */}
        <AddEventForm
          open={addOpen}
          event={selectedEvent}
          onClose={(success) => {
            setAddOpen(false);
            setSelectedEvent(null);
            if (success) fetchEvents();
          }}
        />

        {/* ------- show-all modal ------- */}
        <Modal
          open={showAllOpen}
          footer={null}
          onCancel={() => setShowAllOpen(false)}
          className="rounded-modal"
          width="90%"
          style={{ maxWidth: 900 }}
          closeIcon={<span className="text-gray-500 dark:text-gray-400 text-xl">✕</span>}
          title={null}
        >
          <div className="px-8 pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {selectedDate?.format("dddd")}
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#E0E0E0] mt-0">
              {selectedDate?.format("MMMM DD")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 px-8 pb-10 pt-6">
            {getEventDataForDate(selectedDate || dayjs()).map((evt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1f1f1f] p-2 rounded-md transition-colors"
                onClick={() => openDetail(evt, selectedDate || dayjs())}
              >
                <div
                  className="w-1 rounded-full h-full"
                  style={{ backgroundColor: evt.color }}
                />
                <div className="flex flex-col leading-tight">
                  <p className="text-gray-800 dark:text-[#E0E0E0] font-medium text-[15px]">
                    {evt.title}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-[13px] mt-0.5">
                    {formatEventTime(evt)}
                  </p>
                </div>
              </div>
            ))}
            {!getEventDataForDate(selectedDate || dayjs()).length && (
              <p className="text-gray-500 dark:text-gray-400 col-span-3 text-center py-10 text-lg">
                No events for this date
              </p>
            )}
          </div>
        </Modal>

        {/* ------- event-detail modal ------- */}
        <Modal
          open={detailOpen}
          footer={null}
          onCancel={() => setDetailOpen(false)}
          className="event-detail-modal"
          width="90%"
          style={{ maxWidth: 400 }}
          closeIcon={null}
          title={null}
          maskClosable={true}
        >
          <div className="bg-white dark:bg-[#141414] transition-colors h-full">
            {/* Header */}
            <div className="relative px-5 pt-5 pb-4">
              <div className="absolute top-5 right-5 flex items-center gap-3 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddOpen(true);
                    setDetailOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                >
                  <span className="text-lg leading-none">✕</span>
                </button>
              </div>

              {/* Title with green bar */}
              <div className="flex items-start gap-3 pr-20">
                <div
                  className="w-[2px] h-5 bg-emerald-500 shrink-0"
                  style={{ marginTop: "2px" }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0] leading-tight">
                    {selectedEvent?.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm font-normal text-gray-600 dark:text-gray-400">
                    <span>{selectedEventDate?.format("dddd, MMMM DD")}</span>
                    <span className="text-gray-400 dark:text-gray-600">|</span>
                    <span>{selectedEvent && formatEventTime(selectedEvent)}</span>
                    <span className="text-gray-400 dark:text-gray-600">|</span>
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded border border-blue-100 dark:border-blue-800 uppercase">
                      {selectedEvent?.category?.replace('_', ' ')}
                    </span>
                    {selectedEvent?.status === 'MET' && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded uppercase">
                        Completed
                      </span>
                    )}
                    {selectedEvent?.status === 'CANCELLED' && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold rounded uppercase">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content sections */}
            <div className="px-5 pb-5">
              <div className="mt-4">
                <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mb-1">Assignee</p>
                <p className="text-sm font-normal text-gray-900 dark:text-[#E0E0E0] mt-0.5">
                  {selectedEvent?.assignTo?.fullName || "Unassigned"}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mb-1">Description</p>
                <p className="text-sm font-normal text-gray-900 dark:text-[#E0E0E0] mt-0.5 leading-relaxed">
                  {selectedEvent?.description || "No description available."}
                </p>
              </div>

              {selectedEvent && selectedEvent.status !== 'MET' && (
                <div className="mt-6 pt-4 border-t dark:border-gray-800">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await updateEvent(selectedEvent.id, { status: 'MET' });
                        fetchEvents();
                        setDetailOpen(false);
                        toast.success('Event marked as completed');
                      } catch (err) {
                        toast.error('Failed to update event status');
                      }
                    }}
                    className="w-full bg-green-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal>

        {/* ------- filter modal ------- */}
        <Modal
          open={filterOpen}
          footer={null}
          onCancel={() => setFilterOpen(false)}
          className="filter-modal"
          width="90%"
          style={{ maxWidth: 500 }}
          closeIcon={null}
          title={null}
          maskClosable={true}
        >
          <div className="bg-white dark:bg-[#141414] rounded-xl transition-colors">
            {/* Header */}
            <div className="relative px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E0E0E0]">
                Filter by Type
              </h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#1f1f1f] hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
              >
                ✕
              </button>
            </div>

            {/* Filter Options */}
            <div className="px-5 py-4 flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.task}
                  onChange={(e) => setFilters({ ...filters, task: e.target.checked })}
                  className="filter-checkbox w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-gray-500 cursor-pointer"
                />
                <FiClipboard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="text-base font-medium text-gray-900 dark:text-[#E0E0E0]">Task</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.appointments}
                  onChange={(e) => setFilters({ ...filters, appointments: e.target.checked })}
                  className="filter-checkbox w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-gray-500 cursor-pointer"
                />
                <FiCalendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="text-base font-medium text-gray-900 dark:text-[#E0E0E0]">Appointments</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.followUpCalls}
                  onChange={(e) => setFilters({ ...filters, followUpCalls: e.target.checked })}
                  className="filter-checkbox w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-gray-500 cursor-pointer"
                />
                <FiPhone className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="text-base font-medium text-gray-900 dark:text-[#E0E0E0]">Follow-up Calls</span>
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => {
                  setFilters({ task: true, appointments: true, followUpCalls: true });
                }}
                className="flex-1 py-2.5 px-4 rounded-lg bg-gray-100 dark:bg-[#1f1f1f] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] text-base font-medium text-gray-900 dark:text-[#E0E0E0] transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-base font-medium text-gray-900 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </Modal>

        <style>{`
          .custom-calendar .ant-picker-cell {
            height: 150px !important;
            border: 1px solid #f3f4f6;
            overflow: hidden !important;
          }
          .dark .custom-calendar .ant-picker-cell {
            border: 1px solid #303030;
          }
          .custom-calendar .ant-picker-cell-inner {
            text-align: left !important;
            padding-left: 4px;
          }
          .rounded-modal .ant-modal-content {
            border-radius: 24px !important;
            overflow: hidden;
          }
          .rounded-modal .ant-modal-header {
            border-radius: 24px 24px 0 0 !important;
          }
          .rounded-modal .ant-modal-body {
            border-radius: 0 0 24px 24px !important;
            padding: 0 !important;
          }
          .event-detail-modal .ant-modal-content {
            border-radius: 16px !important;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            padding: 0 !important;
          }
          .event-detail-modal .ant-modal-body {
            padding: 0 !important;
            border-radius: 16px !important;
          }
          .event-detail-modal .ant-modal-close,
          .event-detail-modal .ant-modal-header {
            display: none !important;
          }
          .filter-modal .ant-modal-content {
            border-radius: 16px !important;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            padding: 0 !important;
          }
          .filter-modal .ant-modal-body {
            padding: 0 !important;
            border-radius: 16px !important;
          }
          .filter-modal .ant-modal-close,
          .filter-modal .ant-modal-header {
            display: none !important;
          }
          .filter-checkbox {
            accent-color: #000000;
            border-color: #d1d5db !important;
          }
          .filter-checkbox:checked {
            background-color: #000000 !important;
            border-color: #000000 !important;
          }
          .dark .filter-checkbox {
            accent-color: #ffffff;
            border-color: #4b5563 !important;
          }
          .dark .filter-checkbox:checked {
            background-color: #ffffff !important;
            border-color: #ffffff !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}