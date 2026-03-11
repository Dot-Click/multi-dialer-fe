import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { CalendarCheck2, ListTodo, Phone, Loader2, Clock, User } from 'lucide-react';
import api from '@/lib/axios';
import dayjs from 'dayjs';
import AddEventForm from '@/components/modal/addeventmodal';
import type { CalendarEvent as CalendarEventType } from '@/hooks/useCalendar';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  color: string;
  eventType: 'START_ONLY' | 'FROM_TO' | 'ALL_DAY';
  startDate: string;
  endDate?: string;
  contactId?: string;
  status: string;
  assignTo?: { id: string; fullName: string; email: string };
  assignBy?: { id: string; fullName: string; email: string };
  createdAt: string;
}


const getEventCategory = (event: CalendarEvent): 'appointment' | 'task' | 'callback' => {
  const title = (event.title || '').toLowerCase();
  if (title.includes('appointment')) return 'appointment';
  if (title.includes('task')) return 'task';
  if (title.includes('call back') || title.includes('callback') || event.color === '#007bff' || event.color === '#3b82f6') return 'callback';
  return 'task';
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    SET: 'bg-yellow-100 text-yellow-700',
    MET: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const EventCard = ({ event, onClick }: { event: CalendarEvent, onClick?: () => void }) => {
  const category = getEventCategory(event);

  const config = {
    appointment: { label: 'Appointment', Icon: CalendarCheck2, color: 'text-green-600', border: 'border-l-green-500', iconBg: 'bg-green-100' },
    task: { label: 'Task', Icon: ListTodo, color: 'text-purple-600', border: 'border-l-purple-500', iconBg: 'bg-purple-100' },
    callback: { label: 'Call Back', Icon: Phone, color: 'text-blue-600', border: 'border-l-blue-500', iconBg: 'bg-blue-100' },
  }[category];

  return (
    <div 
      className={`border border-gray-100 border-l-4 ${config.border} rounded-xl p-4 flex gap-3 hover:shadow-sm transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className={`shrink-0 w-9 h-9 rounded-full ${config.iconBg} flex items-center justify-center`}>
        <config.Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-semibold uppercase tracking-wide ${config.color}`}>{config.label}</span>
            <StatusBadge status={event.status} />
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5 truncate">{event.title}</h3>
        {event.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{event.description}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-2">
          <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            {dayjs(event.startDate).format('MMM D, YYYY h:mm A')}
          </span>
          {event.assignTo && (
            <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
              <User className="w-3 h-3" />
              {event.assignTo.fullName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Activities = () => {
  const { currentContact } = useAppSelector((state) => state.contacts);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'appointment' | 'task' | 'callback'>('all');

  const fetchEvents = () => {
    if (!currentContact?.id) return;
    setLoading(true);
    api.get(`/calendar/contact/${currentContact.id}`)
      .then(res => setEvents(res.data.data || []))
      .catch(err => console.error('Failed to fetch activities:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();

    const handleUpdate = () => {
      fetchEvents();
    };

    window.addEventListener('CALENDAR_UPDATED', handleUpdate);
    return () => window.removeEventListener('CALENDAR_UPDATED', handleUpdate);
  }, [currentContact?.id]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleEditClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const appointments = events.filter(e => getEventCategory(e) === 'appointment');
  const tasks = events.filter(e => getEventCategory(e) === 'task');
  const callbacks = events.filter(e => getEventCategory(e) === 'callback');

  const nextAppointment = appointments.find(e => dayjs(e.startDate).isAfter(dayjs()));

  const filtered = activeFilter === 'all' ? events
    : activeFilter === 'appointment' ? appointments
      : activeFilter === 'task' ? tasks
        : callbacks;

  const filters: { key: typeof activeFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: events.length },
    { key: 'appointment', label: 'Appointments', count: appointments.length },
    { key: 'task', label: 'Tasks', count: tasks.length },
    { key: 'callback', label: 'Call Backs', count: callbacks.length },
  ];

  return (
    <div className='flex flex-col md:flex-row gap-8 w-full min-h-40'>
      {/* LEFT — Activity Feed */}
      <div className='flex w-full md:w-[55%] flex-col gap-4'>
        <h1 className='text-[#0E1011] dark:text-white text-[18px] font-medium'>Activities</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${activeFilter === f.key
                  ? 'bg-[#FFCA06] border-[#FFCA06] text-black'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
            >
              {f.label} {f.count > 0 && <span className="ml-1 opacity-70">({f.count})</span>}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-1 text-center">
              <CalendarCheck2 className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-1" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No activities yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Use the header buttons to add an Appointment, Task, or Call Back</p>
            </div>
          ) : (
            filtered.map(event => <EventCard key={event.id} event={event} onClick={() => handleEditClick(event)} />)
          )}
        </div>

        <AddEventForm 
          open={isEditModalOpen}
          onClose={(success) => {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
            if (success) fetchEvents();
          }}
          event={selectedEvent as unknown as CalendarEventType}
          contactId={currentContact?.id}
        />
      </div>

      {/* RIGHT — Information Panel */}
      <div className="flex w-full md:w-[45%] flex-col gap-6">
        <h1 className="text-[#0E1011] dark:text-white text-[18px] font-medium">Information:</h1>

        <div className="flex flex-col gap-4">
          {/* Source */}
          <div className="w-full flex items-center">
            <label className="text-[14px] font-medium text-[#0E1011] dark:text-white w-[180px]">Source</label>
            <input  
              readOnly
              value={currentContact?.source || 'N/A'}
              className="border-b border-gray-300 dark:border-gray-700 text-[#18181B] dark:text-white font-normal text-[14px] flex-1 outline-none px-2 py-1 bg-transparent"
            />
          </div>

          {/* Last Call Result */}
          <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center">
              <label className="text-[14px] whitespace-nowrap font-medium text-[#0E1011] dark:text-white w-[180px]">Last Call Result</label>
              <input readOnly value="N/A" className="text-[14px] font-normal text-[#18181B] dark:text-white outline-none px-2 py-1 bg-transparent border-b border-gray-300 dark:border-gray-700 w-[120px]" />
            </div>
            <div className="bg-[#EBEDF0] dark:bg-gray-700 px-[12px] py-[7px] rounded-[8px]">
              <button className="text-[13px] text-[#0E1011] dark:text-white font-medium">Mark As Contact</button>
            </div>
          </div>

          {/* Last Dial Date */}
          <div className="w-full flex items-center">
            <label className="text-[14px] whitespace-nowrap font-medium text-[#0E1011] dark:text-white w-[180px]">Last Dial Date</label>
            <input readOnly value="N/A" className="border-b border-gray-300 dark:border-gray-700 text-[#18181B] dark:text-white font-normal text-[14px] flex-1 outline-none px-2 py-1 bg-transparent" />
          </div>

          {/* Attempts */}
          <div className="flex w-full items-center">
            <label className="text-[14px] font-medium text-[#0E1011] dark:text-white w-[180px]">Attempts</label>
            <div className="flex gap-4 items-center">
              <span className="rounded-[8px] text-[#495057] dark:text-white py-[6px] px-[5px] flex justify-center items-center bg-[#F7F7F7] dark:bg-gray-700">
                <RiSubtractFill className="text-[17px]" />
              </span>
              <span className="text-[#000000] dark:text-white font-medium text-[16px]">0</span>
              <span className="rounded-[8px] text-[#495057] dark:text-white py-[6px] px-[5px] flex justify-center items-center bg-[#F7F7F7] dark:bg-gray-700">
                <IoIosAdd className="text-[19px]" />
              </span>
              <span className="rounded-[8px] text-[14px] font-normal text-[#0E1011] dark:text-white py-[8px] px-[12px] flex justify-center items-center bg-[#F7F7F7] dark:bg-gray-700">Reset</span>
            </div>
          </div>

          {/* Tasks count */}
          <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center">
              <label className="text-[14px] font-medium text-[#0E1011] dark:text-white w-[180px]">Tasks</label>
              <input readOnly value={tasks.length} className="border-b border-gray-300 dark:border-gray-700 text-[#18181B] dark:text-white font-normal text-[14px] w-[80px] outline-none px-2 py-1 bg-transparent" />
            </div>
          </div>

          {/* Next Appointment */}
          <div className="w-full flex items-center">
            <label className="text-[14px] whitespace-nowrap font-medium text-[#0E1011] dark:text-white w-[180px]">Next Appointment</label>
            <input
              readOnly
              value={nextAppointment ? dayjs(nextAppointment.startDate).format('MM/DD/YYYY h:mm A') : 'None'}
              className="border-b border-gray-300 dark:border-gray-700 text-[#18181B] dark:text-white font-normal text-[14px] flex-1 outline-none px-2 py-1 bg-transparent"
            />
          </div>

          {/* Date Created */}
          <div className="w-full flex items-center">
            <label className="text-[14px] whitespace-nowrap font-medium text-[#0E1011] dark:text-white w-[180px]">Date Created</label>
            <input
              readOnly
              value={currentContact?.createdAt ? dayjs(currentContact.createdAt).format('MM/DD/YYYY') : 'N/A'}
              className="border-b border-gray-300 dark:border-gray-700 text-[#18181B] dark:text-white font-normal text-[14px] flex-1 outline-none px-2 py-1 bg-transparent"
            />
          </div>

          {/* Modified Date */}
          <div className="w-full flex items-center">
            <label className="text-[14px] whitespace-nowrap font-medium text-[#0E1011] dark:text-white w-[180px]">Modified Date</label>
            <input
              readOnly
              value={currentContact?.updatedAt ? dayjs(currentContact.updatedAt).format('MM/DD/YYYY h:mm A') : 'N/A'}
              className="border-b border-gray-300 dark:border-gray-700 text-[#18181B] dark:text-white font-normal text-[14px] flex-1 outline-none px-2 py-1 bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;