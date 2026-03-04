import { IoClose } from 'react-icons/io5';
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useCalendar } from '@/hooks/useCalendar';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface CallBackModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId?: string;
  leadId?: string;
}

const CallBackModal: React.FC<CallBackModalProps> = ({ isOpen, onClose, contactId, leadId }) => {
  const { createEvent, loading: saving } = useCalendar();
  const { session } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    dateTime: '',
    notes: '',
    channel: 'phone',
  });

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    if (!formData.dateTime) {
      toast.error('Date and time are required');
      return;
    }

    try {
      await createEvent({
        title: `Call Back: ${formData.channel}`,
        description: formData.notes,
        startDate: formData.dateTime,
        eventType: 'START_ONLY',
        contactId,
        leadId,
        color: '#007bff', // blue for callbacks
        assignToId: session?.user?.id,
      });
      toast.success('Call back scheduled successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to schedule call back');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-2xl text-gray-800 font-semibold">Call Back</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form Section */}
        <div className="mt-6 space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <label htmlFor="datetime" className="text-sm font-semibold text-gray-900">
              Date & Time:
            </label>
            <input
              type="datetime-local"
              id="datetime"
              value={formData.dateTime}
              onChange={e => setFormData({ ...formData, dateTime: e.target.value })}
              className="w-full border-b-2 border-gray-200 focus:border-black focus:ring-0 outline-none py-1"
            />
          </div>

          {/* Notes */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <label htmlFor="notes" className="text-sm font-semibold text-gray-900">
              Notes:
            </label>
            <input
              type="text"
              id="notes"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border-b-2 border-gray-200 focus:border-black focus:ring-0 outline-none py-1"
            />
          </div>

          {/* Channel */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-900 mt-1">
              Channel:
            </label>
            <div className="flex flex-col flex-wrap gap-2">
              {['phone', 'sms', 'email'].map(ch => (
                <label key={ch} className="flex items-center gap-2 cursor-pointer capitalize">
                  <input
                    type="radio"
                    name="channel"
                    value={ch}
                    checked={formData.channel === ch}
                    onChange={e => setFormData({ ...formData, channel: e.target.value })}
                    className="h-5 w-5 accent-black border-gray-400 text-black focus:ring-black cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{ch}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between w-full items-center gap-3 pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={saving}
            className="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-yellow-400 w-full hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallBackModal;
