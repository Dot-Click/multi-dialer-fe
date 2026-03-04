import { IoClose } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useCalendar } from '@/hooks/useCalendar';
import { useUser, type User } from '@/hooks/useUser';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    contactId?: string;
    leadId?: string;
}

const TaskModal = ({ isOpen, onClose, contactId, leadId }: TaskModalProps) => {
    const { createEvent, loading: saving } = useCalendar();
    const { getUsers } = useUser();
    const [users, setUsers] = useState<User[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        assignToId: '',
        color: '#495057',
    });

    const { session } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isOpen) {
            getUsers({ createdBy: session?.user?.id }).then(data => setUsers(data));
        }
    }, [isOpen, session?.user?.id]);

    if (!isOpen) {
        return null;
    }

    const handleSave = async () => {
        if (!formData.title || !formData.startDate) {
            toast.error('Title and date are required');
            return;
        }

        try {
            await createEvent({
                ...formData,
                eventType: 'START_ONLY',
                contactId,
                leadId,
                assignToId: formData.assignToId || undefined,
            });
            toast.success('Task created successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create task');
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
                    <h2 className="text-2xl text-gray-800">Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Form Section */}
                <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label htmlFor="title" className="text-sm font-semibold text-gray-900">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1"
                        />
                    </div>

                    <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                        <label htmlFor="description" className="text-sm font-semibold text-gray-900 mt-1">Description:</label>
                        <textarea
                            id="description"
                            rows={1}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full resize-none border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label htmlFor="starts" className="text-sm font-semibold text-gray-900">Date:</label>
                        <input
                            type="datetime-local"
                            id="starts"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1"
                        />
                    </div>

                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label htmlFor="assign" className="text-sm font-semibold text-gray-900">Assign To</label>
                        <select
                            id="assign"
                            value={formData.assignToId}
                            onChange={e => setFormData({ ...formData, assignToId: e.target.value })}
                            className="w-full border-b-2 border-gray-200 focus:border-yellow-500 focus:ring-0 outline-none py-1 bg-transparent"
                        >
                            <option value="">None</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.fullName}</option>
                            ))}
                        </select>
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

export default TaskModal;