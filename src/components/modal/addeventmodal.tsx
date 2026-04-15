import { useState, useEffect, useCallback } from 'react';
import { Input, Radio, DatePicker } from 'antd';
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useCalendar, type CalendarEvent, type EventType, type EventStatus, type EventCategory } from '@/hooks/useCalendar';
import { useUser, type User } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import Loader from '@/components/common/Loader';
import { authClient } from '@/lib/auth-client';

const { TextArea } = Input;

const eventColors = ["#F59E0B", "#8B5CF6", "#3B82F6", "#FCD34D", "#10B981", "#F472B6", "#EF4444"];

interface AddEventFormProps {
  open: boolean;
  onClose: (success?: boolean) => void;
  event?: CalendarEvent | null;
  contactId?: string;
  leadId?: string;
  defaultTitle?: string;
  defaultColor?: string;
  defaultCategory?: EventCategory;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ open, onClose, event, contactId, leadId, defaultTitle, defaultColor, defaultCategory }) => {
  const { createEvent, updateEvent, loading: calendarLoading } = useCalendar();
  const { getUsers, loading: usersLoading } = useUser();

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'START_ONLY' as EventType,
    category: 'TASK' as EventCategory,
    startDate: null as dayjs.Dayjs | null,
    endDate: null as dayjs.Dayjs | null,
    assignToId: 'None',
    color: eventColors[0],
    status: 'SET' as EventStatus
  });

  const { data: sessionData } = authClient.useSession();

  const fetchUsers = useCallback(async () => {
    const currentUser = sessionData?.user;
    // If Admin, only fetch users they created. Otherwise fetch all.
    const params = currentUser?.role === 'ADMIN' ? { createdBy: currentUser.id } : {};
    const data = await getUsers(params);

    // Filter out OWNERS as requested
    const filtered = data.filter(u => u.role !== 'OWNER');
    setUsers(filtered);
  }, [])

  useEffect(() => {
    if (open) {


      fetchUsers();

      if (event) {
        setFormData({
          title: event.title,
          description: event.description || '',
          eventType: event.eventType,
          category: event.category || 'TASK',
          startDate: event.startDate ? dayjs(event.startDate) : null,
          endDate: event.endDate ? dayjs(event.endDate) : null,
          assignToId: event.assignToId || 'None',
          color: event.color || eventColors[0],
          status: event.status || 'SET'
        });
      } else {
        setFormData({
          title: defaultTitle || '',
          description: '',
          eventType: 'START_ONLY',
          category: defaultCategory || 'TASK',
          startDate: null,
          endDate: null,
          assignToId: 'None',
          color: defaultColor || eventColors[0],
          status: 'SET'
        });
      }
    }
  }, [open, event, defaultTitle, defaultColor, defaultCategory, sessionData]);

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }
    if (!formData.startDate) {
      toast.error('Start date is required');
      return;
    }
    if (formData.eventType === 'FROM_TO' && !formData.endDate) {
      toast.error('End date is required for From-To events');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        color: formData.color,
        eventType: formData.eventType,
        category: formData.category,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate?.toISOString(),
        assignToId: formData.assignToId === 'None' ? undefined : formData.assignToId,
        status: formData.status,
        contactId: event?.contactId || contactId,
        leadId: event?.leadId || leadId
      };

      if (event?.id) {
        await updateEvent(event.id, payload);
        toast.success('Event updated successfully');
      } else {
        await createEvent(payload);
        toast.success('Event created successfully');
      }

      onClose(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        eventType: 'START_ONLY',
        category: 'TASK',
        startDate: null,
        endDate: null,
        assignToId: 'None',
        color: eventColors[0],
        status: 'SET'
      });
    } catch (err: any) {
      toast.error(err.message || `Failed to ${event?.id ? 'update' : 'create'} event`);
    }
  };

  if (!open) return null;

  const filteredUsers = users.filter(user =>
    user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 ">

      {/* Modal Box */}
      <div className="w-[400px] bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease] flex flex-col max-h-[90vh] transition-colors">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10 transition-colors">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Event</h2>
          <button onClick={() => onClose()}>
            <IoClose className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh] relative">
          {calendarLoading && <Loader />}

          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title</label>
            <Input
              placeholder="Enter event's title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Category</label>
            <Radio.Group
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              value={formData.category}
              className="w-full flex gap-4"
            >
              <Radio value="TASK" className="dark:text-white">Task</Radio>
              <Radio value="APPOINTMENT" className="dark:text-white">Appointment</Radio>
              <Radio value="FOLLOW_UP" className="dark:text-white">Follow-Up</Radio>
            </Radio.Group>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
            <TextArea
              rows={4}
              placeholder="Enter event's description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Type of Event */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Type of event</label>
            <Radio.Group
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              value={formData.eventType}
              className="w-full"
            >
              <div className="space-y-4">
                <div>
                  <Radio value="START_ONLY" className="dark:text-white">Start Only</Radio>
                  {formData.eventType === 'START_ONLY' && (
                    <DatePicker
                      showTime={{ use12Hours: true, format: 'h:mm A' }}
                      format="DD/MM/YYYY h:mm A"
                      placeholder="DD/MM/YYYY 00:00 AM"
                      className="w-full mt-2"
                      value={formData.startDate}
                      onChange={(date) => setFormData({ ...formData, startDate: date })}
                    />
                  )}
                </div>

                <div>
                  <Radio value="FROM_TO" className="dark:text-white">From - To</Radio>
                  {formData.eventType === 'FROM_TO' && (
                    <div className="mt-2 space-y-2">
                      <DatePicker
                        showTime={{ use12Hours: true, format: 'h:mm A' }}
                        format="DD/MM/YYYY h:mm A"
                        placeholder="Start Date"
                        className="w-full"
                        value={formData.startDate}
                        onChange={(date) => setFormData({ ...formData, startDate: date })}
                      />
                      <DatePicker
                        showTime={{ use12Hours: true, format: 'h:mm A' }}
                        format="DD/MM/YYYY h:mm A"
                        placeholder="End Date"
                        className="w-full"
                        value={formData.endDate}
                        onChange={(date) => setFormData({ ...formData, endDate: date })}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Radio value="ALL_DAY" className="dark:text-white">All Day</Radio>
                  {formData.eventType === 'ALL_DAY' && (
                    <DatePicker
                      placeholder="Select Date"
                      className="w-full mt-2"
                      value={formData.startDate}
                      onChange={(date) => setFormData({ ...formData, startDate: date })}
                    />
                  )}
                </div>
              </div>
            </Radio.Group>
          </div>

          {/* Assign To */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Assign to</label>
            <Input
              placeholder="Search"
              prefix={<FiSearch className="text-gray-400" />}
              className="mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="border dark:border-slate-700 rounded-md max-h-36 overflow-y-auto">
              {usersLoading ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading users...</div>
              ) : (
                <Radio.Group
                  onChange={(e) => setFormData({ ...formData, assignToId: e.target.value })}
                  value={formData.assignToId}
                  className="w-full"
                >
                  <div key="none" className={`p-2 border-b dark:border-slate-700 last:border-b-0 ${formData.assignToId === 'None' ? 'bg-gray-100 dark:bg-slate-700' : ''}`}>
                    <Radio value="None" className="w-full transition-colors">None</Radio>
                  </div>
                  {filteredUsers.map(user => (
                    <div key={user.id} className={`p-2 border-b dark:border-slate-700 last:border-b-0 ${formData.assignToId === user.id ? 'bg-gray-100 dark:bg-slate-700' : ''}`}>
                      <Radio value={user.id} className="w-full transition-colors">{user.fullName}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              )}
            </div>
          </div>

          {/* Event Color */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Event Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {eventColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-6 h-6 rounded-full transition-all ${formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
            <Radio.Group
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              value={formData.status}
              className="w-full flex gap-4"
            >
              <Radio value="SET">Set</Radio>
              <Radio value="MET">Completed</Radio>
              <Radio value="CANCELLED">Cancelled</Radio>
            </Radio.Group>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 px-6 py-4 border-t dark:border-slate-700 flex justify-center gap-3 transition-colors">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-6 py-2 w-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={calendarLoading}
            className="px-6 py-2 w-full bg-yellow-400 text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 disabled:opacity-50"
          >
            {calendarLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <style>{`
        /* Dark Mode Overrides for Ant Design Components in Modal */
        .dark .ant-input,
        .dark .ant-input-affix-wrapper {
          background-color: #334155 !important;
          border-color: #475569 !important;
          color: #f8fafc !important;
        }

        .dark .ant-input::placeholder {
          color: #94a3b8 !important;
        }

        .dark .ant-input-affix-wrapper .ant-input {
          background-color: transparent !important;
        }

        .dark .ant-picker {
          background-color: #334155 !important;
          border-color: #475569 !important;
        }

        .dark .ant-picker input {
          color: #f8fafc !important;
        }

        .dark .ant-picker input::placeholder {
          color: #94a3b8 !important;
        }

        .dark .ant-picker-suffix {
          color: #94a3b8 !important;
        }

        .dark .ant-radio-wrapper {
          color: #e2e8f0 !important;
        }

        .dark .ant-radio-inner {
          background-color: #1e293b !important;
          border-color: #475569 !important;
        }

        .dark .ant-radio-checked .ant-radio-inner {
          border-color: #fbbf24 !important;
          background-color: #fbbf24 !important;
        }
      `}</style>
    </div>
  );
};

export default AddEventForm;
