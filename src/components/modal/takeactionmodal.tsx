import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';

interface TakeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TakeActionModal: React.FC<TakeActionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3 py-2"
      onClick={onClose} // Backdrop click closes modal
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl  text-gray-800">Take Action</h2>
          <button
            onClick={onClose}
            className="text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5 transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 flex flex-col items-center justify-center">
          <p className="text-gray-600 text-xs text-center">
            Action Plans can be created by navigating to settings. You can also
            create Email and Letter Templates in settings that can be used in
            your Action Plans. Click <Link to="/admin/system-settings" className="text-blue-500 hover:underline">here</Link> to create an Action Plan.
          </p>

          <div className="space-y-3 w-full">
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <label htmlFor="actionPlan" className="text-sm font-medium text-gray-900">Action Plan</label>
              <select
                id="actionPlan"
                className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1.5 bg-transparent cursor-pointer"
              >
                <option>None</option>
                <option>Plan A</option>
                <option>Plan B</option>
              </select>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <label htmlFor="assignTo" className="text-sm font-medium text-gray-900">Assign To</label>
              <input
                type="text"
                id="assignTo"
                defaultValue="John Lee"
                readOnly
                className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1.5 bg-transparent"
              />
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <label htmlFor="startDate" className="text-sm font-medium text-gray-900">Start Date</label>
              <input
                type="text"
                id="startDate"
                placeholder="DD/MM/YYYY 00:00"
                className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1.5"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-end gap-3 pt-2 mt-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button className="bg-yellow-400 w-full hover:bg-yellow-500 text-black font-semibold py-2.5 px-6 rounded-lg transition-colors">
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeActionModal;
