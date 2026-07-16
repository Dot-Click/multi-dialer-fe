import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar as BigCalendar,
  Views,
  dayjsLocalizer,
  type View,
} from "react-big-calendar";
import withDragAndDrop, {
  type EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FiClipboard, FiCalendar, FiPhone, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import AddEventForm from "@/components/modal/addeventmodal";
import ContactDetailModal from "@/components/modal/ContactDetailModal";
import type { CalendarEvent } from "@/hooks/useCalendar";
import Loader from "@/components/common/Loader";

const localizer = dayjsLocalizer(dayjs);
const DnDCalendar = withDragAndDrop<RbcEvent>(BigCalendar as any);

const VIEW_STORAGE_KEY = "calendarView";

// Category → color mapping (Follow-up call = "callback" in this schema).
const CATEGORY_COLORS: Record<string, string> = {
  FOLLOW_UP: "#3B82F6", // blue — callbacks
  APPOINTMENT: "#10B981", // green
  TASK: "#F59E0B", // orange
};

interface RbcEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource: CalendarEvent;
}

const toRbcEvent = (evt: CalendarEvent): RbcEvent => {
  const start = new Date(evt.startDate);
  let end: Date;
  if (evt.eventType === "ALL_DAY") {
    end = dayjs(start).endOf("day").toDate();
  } else if (evt.endDate) {
    end = new Date(evt.endDate);
  } else {
    // No explicit end — give it a visible 30-minute block in week/day view.
    end = dayjs(start).add(30, "minute").toDate();
  }
  return { id: evt.id, title: evt.title, start, end, allDay: evt.eventType === "ALL_DAY", resource: evt };
};

const formatEventTime = (event: CalendarEvent) => {
  if (event.eventType === "ALL_DAY") return "All Day";
  const start = dayjs(event.startDate).format("HH:mm");
  if (event.endDate) {
    const end = dayjs(event.endDate).format("HH:mm");
    return `${start} - ${end}`;
  }
  return start;
};

export interface BigCalendarViewProps {
  events: CalendarEvent[];
  loading: boolean;
  onMarkComplete: (evt: CalendarEvent) => Promise<void>;
  onUpdateEventTime: (id: string, payload: { startDate: string; endDate: string }) => Promise<void>;
  onEventSaved: () => void;
  jumpToDate?: Date | null;
}

const BigCalendarView = ({ events, loading, onMarkComplete, onUpdateEventTime, onEventSaved, jumpToDate }: BigCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>(() => {
    try {
      const stored = localStorage.getItem(VIEW_STORAGE_KEY);
      const validViews: string[] = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA];
      if (stored && validViews.includes(stored)) {
        return stored as View;
      }
    } catch {
      // Storage unavailable (private browsing, etc.) — fall back to Month.
    }
    return Views.MONTH;
  });

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      // Best-effort persistence only.
    }
  }, [view]);

  useEffect(() => {
    if (jumpToDate) {
      setCurrentDate(jumpToDate);
      setSelectedDate(dayjs(jumpToDate));
    }
  }, [jumpToDate]);

  /* modals */
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [showAllOpen, setShowAllOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  /* filter options */
  const [filters, setFilters] = useState({
    task: true,
    appointments: true,
    followUpCalls: true,
  });

  const visibleEvents = useMemo(() => {
    return events.filter((e) => {
      if (e.status === "MET") return false;
      const category = e.category || "TASK";
      if (category === "TASK" && !filters.task) return false;
      if (category === "APPOINTMENT" && !filters.appointments) return false;
      if (category === "FOLLOW_UP" && !filters.followUpCalls) return false;
      return true;
    });
  }, [events, filters]);

  const rbcEvents = useMemo(() => visibleEvents.map(toRbcEvent), [visibleEvents]);

  const getEventDataForDate = useCallback(
    (date: Dayjs) => visibleEvents.filter((e) => dayjs(e.startDate).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")),
    [visibleEvents],
  );

  /* handlers */
  const showAdd = () => {
    setOptionsOpen(false);
    setSelectedEvent(null);
    setAddOpen(true);
  };

  const showAll = () => {
    setOptionsOpen(false);
    setShowAllOpen(true);
  };

  const openDetail = (ev: CalendarEvent) => {
    if (ev.contactId || ev.contact?.id) {
      setSelectedEvent(ev);
      setContactModalOpen(true);
    }
  };

  const navigateBy = (direction: 1 | -1) => {
    const unit = view === Views.WEEK ? "week" : view === Views.DAY ? "day" : view === Views.AGENDA ? "day" : "month";
    const amount = view === Views.AGENDA ? 30 : 1;
    setCurrentDate((d) => dayjs(d).add(direction * amount, unit).toDate());
  };

  const headerLabel = () => {
    const d = dayjs(currentDate);
    if (view === Views.WEEK) return `${d.startOf("week").format("MMM D")} - ${d.endOf("week").format("MMM D, YYYY")}`;
    if (view === Views.DAY) return d.format("MMMM D, YYYY");
    return d.format("MMMM YYYY");
  };

  const handleSelectSlot = useCallback((slotInfo: { start: Date }) => {
    setSelectedDate(dayjs(slotInfo.start));
    setOptionsOpen(true);
  }, []);

  const handleSelectEvent = useCallback((rbcEvent: RbcEvent) => {
    openDetail(rbcEvent.resource);
  }, []);

  const eventPropGetter = useCallback((rbcEvent: RbcEvent) => {
    const category = rbcEvent.resource.category || "TASK";
    const bg = CATEGORY_COLORS[category] || CATEGORY_COLORS.TASK;
    return {
      style: {
        backgroundColor: bg,
        borderColor: bg,
      },
    };
  }, []);

  const handleEventResize = useCallback(async ({ event, start, end }: EventInteractionArgs<RbcEvent>) => {
    try {
      await onUpdateEventTime(event.id, {
        startDate: dayjs(start).toISOString(),
        endDate: dayjs(end).toISOString(),
      });
      toast.success("Event updated");
    } catch (err) {
      console.error("[BigCalendarView] Resize failed:", err);
      toast.error("Failed to resize event");
    }
  }, [onUpdateEventTime]);

  const handleEventDrop = useCallback(async ({ event, start, end }: EventInteractionArgs<RbcEvent>) => {
    try {
      await onUpdateEventTime(event.id, {
        startDate: dayjs(start).toISOString(),
        endDate: dayjs(end).toISOString(),
      });
      toast.success("Event rescheduled");
    } catch (err) {
      console.error("[BigCalendarView] Move failed:", err);
      toast.error("Failed to move event");
    }
  }, [onUpdateEventTime]);

  const VIEW_OPTIONS: { key: View; label: string }[] = [
    { key: Views.MONTH, label: "Month" },
    { key: Views.WEEK, label: "Week" },
    { key: Views.DAY, label: "Day" },
    { key: Views.AGENDA, label: "Agenda" },
  ];

  return (
    <div className="mr-0 sm:mr-10 p-4 sm:p-0 transition-colors">
      {/* ------- header ------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
          <h2 className="text-base sm:text-[28px] dark:text-white font-medium text-[#0E1011] transition-colors">
            {headerLabel()}
          </h2>
          <div className="flex gap-2">
            <button
              className="p-1 border text-[#71717A] dark:text-[#A0A0A0] border-[#D8DCE1] dark:border-[#303030] rounded-[8px] bg-[#FFFFFF] dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
              onClick={() => navigateBy(-1)}
            >
              <IoIosArrowBack />
            </button>
            <button
              className="p-1 border text-[#71717A] dark:text-[#A0A0A0] border-[#D8DCE1] dark:border-[#303030] rounded-[8px] bg-[#FFFFFF] dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
              onClick={() => navigateBy(1)}
            >
              <IoIosArrowForward />
            </button>
          </div>

          {/* View switcher — persisted to localStorage */}
          <div className="flex gap-1 bg-gray-100 dark:bg-[#1f1f1f] rounded-[10px] p-1">
            {VIEW_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setView(opt.key)}
                className={`px-3 py-1 rounded-[8px] text-xs sm:text-sm font-medium transition-colors ${
                  view === opt.key
                    ? "bg-[#FFCA06] text-[#2B3034]"
                    : "text-[#71717A] dark:text-[#A0A0A0] hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 pr-[16px] pl-[10px] py-[4px] text-sm sm:text-base font-medium text-[#FFFFFF] border border-[#D8DCE1] dark:border-[#303030] rounded-[12px] bg-[#FFFFFF] dark:bg-[#141414] w-full sm:w-auto justify-center hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
        >
          <span className="text-[#2B3034] dark:text-[#E0E0E0]">
            <FiClipboard />
          </span>
          <span className="text-[#27272A] dark:text-[#E0E0E0] font-medium text-[16px]">Filter</span>
        </button>
      </div>

      {/* ------- calendar ------- */}
      <div className="bg-white dark:bg-[#141414] rounded-xl p-2 sm:p-4 shadow-sm border border-gray-200 dark:border-[#303030] overflow-x-auto relative transition-colors">
        {loading && <Loader />}
        <DnDCalendar
          localizer={localizer}
          events={rbcEvents}
          date={currentDate}
          view={view}
          onNavigate={setCurrentDate}
          onView={(v) => setView(v)}
          toolbar={false}
          selectable
          resizable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventResize={handleEventResize}
          onEventDrop={handleEventDrop}
          eventPropGetter={eventPropGetter}
          style={{ height: 650 }}
          className="custom-big-calendar"
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
        defaultDate={selectedEvent ? undefined : selectedDate ?? undefined}
        onClose={(success) => {
          setAddOpen(false);
          setSelectedEvent(null);
          if (success) onEventSaved();
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
          <p className="text-gray-500 dark:text-gray-400 text-sm">{selectedDate?.format("dddd")}</p>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#E0E0E0] mt-0">
            {selectedDate?.format("MMMM DD")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 px-8 pb-10 pt-6">
          {getEventDataForDate(selectedDate || dayjs()).map((evt) => (
            <div key={evt.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors">
              <div
                className="w-1 rounded-full self-stretch shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[evt.category || "TASK"] }}
              />
              <div className="flex flex-col leading-tight flex-1 min-w-0">
                <p
                  className={`font-medium text-[15px] cursor-pointer truncate ${evt.status === "MET" ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-[#E0E0E0]"}`}
                  onClick={() => openDetail(evt)}
                >
                  {evt.title}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-[13px] mt-0.5">{formatEventTime(evt)}</p>
                {evt.status !== "MET" && evt.status !== "CANCELLED" && (
                  <button
                    onClick={() => onMarkComplete(evt)}
                    className="mt-1.5 flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 hover:underline w-fit"
                  >
                    <FiCheckCircle size={11} /> Mark as Complete
                  </button>
                )}
                {evt.status === "MET" && (
                  <span className="mt-1 text-[11px] text-green-500 font-medium">Completed</span>
                )}
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

      {/* ------- contact-detail modal ------- */}
      <ContactDetailModal
        isOpen={contactModalOpen}
        onClose={() => {
          setContactModalOpen(false);
          setSelectedEvent(null);
        }}
        contactId={selectedEvent?.contactId || selectedEvent?.contact?.id}
      />

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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E0E0E0]">Filter by Type</h3>
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
              onClick={() => setFilters({ task: true, appointments: true, followUpCalls: true })}
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
        .custom-big-calendar {
          background: transparent;
        }
        .custom-big-calendar .rbc-off-range-bg {
          background: #F8F9FA;
        }
        .dark .custom-big-calendar .rbc-off-range-bg {
          background: #1a1a1a;
        }
        .custom-big-calendar .rbc-today {
          background: #FFF9E6;
        }
        .dark .custom-big-calendar .rbc-today {
          background: #2a2405;
        }
        .custom-big-calendar .rbc-header,
        .custom-big-calendar .rbc-time-header-content,
        .custom-big-calendar .rbc-label {
          color: #495057;
        }
        .dark .custom-big-calendar .rbc-header,
        .dark .custom-big-calendar .rbc-time-header-content,
        .dark .custom-big-calendar .rbc-label,
        .dark .custom-big-calendar .rbc-agenda-time-cell,
        .dark .custom-big-calendar .rbc-agenda-date-cell {
          color: #E0E0E0;
        }
        .custom-big-calendar .rbc-month-view,
        .custom-big-calendar .rbc-time-view,
        .custom-big-calendar .rbc-agenda-view table,
        .custom-big-calendar .rbc-header,
        .custom-big-calendar .rbc-day-bg,
        .custom-big-calendar .rbc-month-row,
        .custom-big-calendar .rbc-time-content,
        .custom-big-calendar .rbc-time-header,
        .custom-big-calendar .rbc-timeslot-group {
          border-color: #E9ECEF;
        }
        .dark .custom-big-calendar .rbc-month-view,
        .dark .custom-big-calendar .rbc-time-view,
        .dark .custom-big-calendar .rbc-agenda-view table,
        .dark .custom-big-calendar .rbc-header,
        .dark .custom-big-calendar .rbc-day-bg,
        .dark .custom-big-calendar .rbc-month-row,
        .dark .custom-big-calendar .rbc-time-content,
        .dark .custom-big-calendar .rbc-time-header,
        .dark .custom-big-calendar .rbc-timeslot-group {
          border-color: #303030;
        }
        .dark .custom-big-calendar .rbc-off-range {
          color: #6b7280;
        }
        .dark .custom-big-calendar .rbc-date-cell {
          color: #E0E0E0;
        }
        .dark .custom-big-calendar .rbc-agenda-view table.rbc-agenda-table tbody > tr > td,
        .dark .custom-big-calendar .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
          border-color: #303030;
        }
        .custom-big-calendar .rbc-event {
          border: none;
          border-radius: 6px;
          padding: 2px 6px;
        }
        .custom-big-calendar .rbc-show-more {
          background: #F3F4F7;
          color: #495057;
          border-radius: 6px;
        }
        .dark .custom-big-calendar .rbc-show-more {
          background: #1f1f1f;
          color: #a0a0a0;
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
  );
};

export default BigCalendarView;
