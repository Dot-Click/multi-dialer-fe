import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchActionPlans, assignActionPlan } from '@/store/slices/contactStructureSlice';
import { getAllUsers } from '@/store/slices/userSlice';
import toast from 'react-hot-toast';

interface TakeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId?: string;
}

const TakeActionModal: React.FC<TakeActionModalProps> = ({ isOpen, onClose, contactId }) => {
  const dispatch = useAppDispatch();
  const { actionPlans } = useAppSelector((state) => state.contactStructure);
  const { users } = useAppSelector((state) => state.user);
  const { session } = useAppSelector((state) => state.auth);
  const currentUser = session?.user;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    planId: '',
    assignToId: '',
    startDate: new Date().toISOString().slice(0, 16) // Default to now
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchActionPlans());
      dispatch(getAllUsers());
      // Set default assignment to current user
      if (currentUser && !formData.assignToId) {
        setFormData(prev => ({ ...prev, assignToId: currentUser.id }));
      }
    }
  }, [isOpen, dispatch, currentUser]);

  const handleAssign = async () => {
    if (!contactId || !formData.planId || !formData.assignToId) {
      toast.error("Please select a plan and an agent");
      return;
    }

    setLoading(true);
    try {
      await dispatch(assignActionPlan({
        contactId,
        planId: formData.planId,
        assignToId: formData.assignToId,
        startDate: formData.startDate
      })).unwrap();
      
      toast.success("Action Plan assigned successfully!");
      // Dispatch custom event to refresh activity feed if needed
      window.dispatchEvent(new CustomEvent('CALENDAR_UPDATED'));
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to assign plan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3 py-2"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Take Action</h2>
          <button
            onClick={onClose}
            className="text-gray-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-1.5 transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 flex flex-col items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-xs text-center px-4">
            Action Plans can be created by navigating to settings. You can also
            create Email and Letter Templates in settings that can be used in
            your Action Plans. Click <Link to="/admin/system-settings" className="text-yellow-500 hover:underline">here</Link> to manage.
          </p>

          <div className="space-y-6 w-full">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="actionPlan" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Action Plan</label>
              <select
                id="actionPlan"
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="w-full border-b-2 border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-0 outline-none py-2 bg-transparent cursor-pointer dark:text-white"
              >
                <option value="">Select a Plan</option>
                {actionPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="assignTo" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Assign To Agent</label>
              <select
                id="assignTo"
                value={formData.assignToId}
                onChange={(e) => setFormData({ ...formData, assignToId: e.target.value })}
                className="w-full border-b-2 border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-0 outline-none py-2 bg-transparent cursor-pointer dark:text-white"
              >
                <option value="">Select Agent</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.fullName || user.email}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="startDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Date & Time</label>
              <input
                type="datetime-local"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full border-b-2 border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-0 outline-none py-2 dark:text-white bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-4 pt-6 mt-8 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleAssign}
            disabled={loading}
            className={`flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Assigning...
              </>
            ) : 'Assign Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeActionModal;
