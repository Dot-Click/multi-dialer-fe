import { useState } from 'react';
import { Input, Radio, DatePicker } from 'antd';
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";

const { TextArea } = Input;

const assignToList = ["None", "John Lee", "Cody Fisher", "Marvin McKinney", "Leslie Alexander", "Brooklyn Simmons"];
const eventColors = ["#F59E0B", "#8B5CF6", "#3B82F6", "#FCD34D", "#10B981", "#F472B6", "#EF4444"];

// Define props type
interface AddEventFormProps {
  open: boolean;
  onClose: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ open, onClose }) => {
  const [eventType, setEventType] = useState('startOnly');
  const [assignTo, setAssignTo] = useState('None');
  const [selectedColor, setSelectedColor] = useState(eventColors[0]);

  if (!open) return null; // hide modal if closed

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 ">
      
      {/* Modal Box */}
      <div className="w-[400px] bg-white rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease] flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Add New Event</h2>
          <button onClick={onClose}>
            <IoClose className="text-gray-500 hover:text-gray-700 text-xl" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">

          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
            <Input placeholder="Enter event's title" />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <TextArea rows={4} placeholder="Enter event's description" />
          </div>

          {/* Type of Event */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Type of event</label>
            <Radio.Group onChange={(e) => setEventType(e.target.value)} value={eventType} className="w-full">
              <div className="space-y-4">
                <div>
                  <Radio value="startOnly">Start Only</Radio>
                  {eventType === 'startOnly' && (
                    <DatePicker showTime placeholder="DD/MM/YYYY 00:00" className="w-full mt-2" />
                  )}
                </div>

                <div>
                  <Radio value="fromTo">From - To</Radio>
                  {eventType === 'fromTo' && (
                    <div className="mt-2 space-y-2">
                      <DatePicker showTime placeholder="Start Date" className="w-full" />
                      <DatePicker showTime placeholder="End Date" className="w-full" />
                    </div>
                  )}
                </div>

                <div>
                  <Radio value="allDay">All Day</Radio>
                </div>
              </div>
            </Radio.Group>
          </div>

          {/* Assign To */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">Assign to</label>
            <Input placeholder="Search" prefix={<FiSearch className="text-gray-400" />} className="mb-2"/>
            <div className="border rounded-md max-h-36 overflow-y-auto">
              <Radio.Group onChange={(e) => setAssignTo(e.target.value)} value={assignTo} className="w-full">
                {assignToList.map(name => (
                  <div key={name} className={`p-2 border-b last:border-b-0 ${assignTo === name ? 'bg-gray-100' : ''}`}>
                    <Radio value={name} className="w-full">{name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
          </div>

          {/* Event Color */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Event Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {eventColors.map(color => (
                <button 
                  key={color} 
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-center gap-3">
          <button onClick={onClose} className="px-6 py-2 w-full bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
            Cancel
          </button>
          <button className="px-6 py-2 w-full bg-yellow-400 text-gray-800 rounded-lg font-semibold hover:bg-yellow-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventForm;
