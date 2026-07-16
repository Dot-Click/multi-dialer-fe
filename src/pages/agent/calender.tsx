import { useState, useEffect, useMemo } from "react";
import { ConfigProvider, theme } from "antd";
import enGB from "antd/locale/en_GB";
import "dayjs/locale/en-gb";
import { useCalendar, type CalendarEvent } from "@/hooks/useCalendar";
import BigCalendarView from "@/components/calendar/BigCalendarView";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";

/* --------------------------------------------------
 *  MAIN COMPONENT
 * -------------------------------------------------- */
export default function CustomCalendar() {
  const { getEvents, updateEvent, loading } = useCalendar();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [jumpToDate, setJumpToDate] = useState<Date | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.date) {
      setJumpToDate(new Date(location.state.date));
      // Clear the state so it doesn't persist on page refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Track Dark Mode to sync Ant Design with Tailwind
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { session } = useAppSelector((state) => state.auth);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const markComplete = async (evt: CalendarEvent) => {
    try {
      await updateEvent(evt.id, { status: "MET" });
      setEvents((prev) => prev.filter((e) => e.id !== evt.id));
      toast.success("Event marked as completed");
    } catch {
      toast.error("Failed to update event");
    }
  };

  const updateEventTime = async (id: string, payload: { startDate: string; endDate: string }) => {
    await updateEvent(id, payload);
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...payload } : e)));
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
  }, []);

  // Agents only see events assigned to/by them, even though the backend
  // endpoint already scopes this — kept as defence-in-depth exactly as before.
  const myEvents = useMemo(() => {
    if (!session?.user?.id) return events;
    return events.filter((e) => e.assignToId === session.user.id || e.assignById === session.user.id);
  }, [events, session?.user?.id]);

  return (
    <ConfigProvider
      locale={enGB}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BigCalendarView
        events={myEvents}
        loading={loading}
        onMarkComplete={markComplete}
        onUpdateEventTime={updateEventTime}
        onEventSaved={fetchEvents}
        jumpToDate={jumpToDate}
      />
    </ConfigProvider>
  );
}
