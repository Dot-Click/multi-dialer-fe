import { IoClose } from 'react-icons/io5';

interface TaskForContactProps {
  isOpen: boolean;
  onClose: () => void;
  contactName?: string;
}

// Sample data
const tasksData = [
  { 
    date: '09/09/2025', 
    tasks: [
      { title: 'Send Info via Email', time: '10:10 - 10:25', color: 'bg-red-500' },
      { title: 'Send Email', time: '11:00 - 11:45', color: 'bg-purple-500' }
    ]
  },
  { 
    date: '08/09/2025', 
    tasks: [
      { title: 'Call Back', time: '10:10 - 10:25', color: 'bg-green-500' }
    ]
  },
  {
    date: '07/09/2025',
    tasks: [
      { title: 'Prepare Presentation', time: '15:00 - 16:00', color: 'bg-blue-500' }
    ]
  }
];

const TaskForContact: React.FC<TaskForContactProps> = ({
  isOpen,
  onClose,
  contactName = "Contact Name"
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Backdrop click closes modal
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Tasks for {contactName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5 transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Task List */}
        <div className="flex-grow custom-scrollbar overflow-y-auto pr-3 space-y-6" style={{ height: '300px' }}>
          {tasksData.map((group, index) => (
            <div key={index}>
              <p className="text-sm font-medium text-gray-500 mb-3">{group.date}</p>
              <div className="space-y-4">
                {group.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-start gap-3">
                    <div className={`w-1 h-10 rounded-full ${task.color}`}></div>
                    <div>
                      <p className="font-semibold text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-3 pt-3 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button className="bg-yellow-400 w-full hover:bg-yellow-500 text-black font-semibold py-2.5 px-6 rounded-lg transition-colors">
            Go to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForContact;
