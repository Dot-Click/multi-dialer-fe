import { useState, useEffect } from 'react';
import { Input, Radio, DatePicker } from 'antd';
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useCalendar, type EventType } from '@/hooks/useCalendar';
import { useUser, type User } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import Loader from '@/components/common/Loader';

const { TextArea } = Input;

const eventColors = ["#F59E0B", "#8B5CF6", "#3B82F6", "#FCD34D", "#10B981", "#F472B6", "#EF4444"];

interface AddEventFormProps {
  open: boolean;
  onClose: (success?: boolean) => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ open, onClose }) => {
  const { createEvent, loading: calendarLoading } = useCalendar();
  const { getUsers, loading: usersLoading } = useUser();

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'START_ONLY' as EventType,
    startDate: null as dayjs.Dayjs | null,
    endDate: null as dayjs.Dayjs | null,
    assignToId: 'None',
    color: eventColors[0]
  });

  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
      };
      fetchUsers();
    }
  }, [open]);

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
      await createEvent({
        title: formData.title,
        description: formData.description,
        color: formData.color,
        eventType: formData.eventType,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate?.toISOString(),
        assignToId: formData.assignToId === 'None' ? undefined : formData.assignToId
      });
      toast.success('Event created successfully');
      onClose(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        eventType: 'START_ONLY',
        startDate: null,
        endDate: null,
        assignToId: 'None',
        color: eventColors[0]
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create event');
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
      <div className="w-[400px] bg-white rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease] flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Add New Event</h2>
          <button onClick={() => onClose()}>
            <IoClose className="text-gray-500 hover:text-gray-700 text-xl" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh] relative">
          {calendarLoading && <Loader />}

          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
            <Input
              placeholder="Enter event's title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <TextArea
              rows={4}
              placeholder="Enter event's description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Type of Event */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Type of event</label>
            <Radio.Group
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              value={formData.eventType}
              className="w-full"
            >
              <div className="space-y-4">
                <div>
                  <Radio value="START_ONLY">Start Only</Radio>
                  {formData.eventType === 'START_ONLY' && (
                    <DatePicker
                      showTime
                      placeholder="DD/MM/YYYY 00:00"
                      className="w-full mt-2"
                      value={formData.startDate}
                      onChange={(date) => setFormData({ ...formData, startDate: date })}
                    />
                  )}
                </div>

                <div>
                  <Radio value="FROM_TO">From - To</Radio>
                  {formData.eventType === 'FROM_TO' && (
                    <div className="mt-2 space-y-2">
                      <DatePicker
                        showTime
                        placeholder="Start Date"
                        className="w-full"
                        value={formData.startDate}
                        onChange={(date) => setFormData({ ...formData, startDate: date })}
                      />
                      <DatePicker
                        showTime
                        placeholder="End Date"
                        className="w-full"
                        value={formData.endDate}
                        onChange={(date) => setFormData({ ...formData, endDate: date })}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Radio value="ALL_DAY">All Day</Radio>
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
            <label className="block text-sm font-medium text-gray-600 mb-2">Assign to</label>
            <Input
              placeholder="Search"
              prefix={<FiSearch className="text-gray-400" />}
              className="mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="border rounded-md max-h-36 overflow-y-auto">
              {usersLoading ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading users...</div>
              ) : (
                <Radio.Group
                  onChange={(e) => setFormData({ ...formData, assignToId: e.target.value })}
                  value={formData.assignToId}
                  className="w-full"
                >
                  <div key="none" className={`p-2 border-b last:border-b-0 ${formData.assignToId === 'None' ? 'bg-gray-100' : ''}`}>
                    <Radio value="None" className="w-full">None</Radio>
                  </div>
                  {filteredUsers.map(user => (
                    <div key={user.id} className={`p-2 border-b last:border-b-0 ${formData.assignToId === user.id ? 'bg-gray-100' : ''}`}>
                      <Radio value={user.id} className="w-full">{user.fullName}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              )}
            </div>
          </div>

          {/* Event Color */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Event Color</label>
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
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-center gap-3">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-6 py-2 w-full bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
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
    </div>
  );
};

export default AddEventForm;
