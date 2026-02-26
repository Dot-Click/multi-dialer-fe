import React, { useState } from 'react';
import { FiPhone, FiX } from 'react-icons/fi';
import { useCallerIds } from '@/hooks/useSystemSettings';
import toast from 'react-hot-toast';

interface AddCallScoutNumberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const mockNumbers = [
    { id: 1, number: '+1 (555) 111-2222', location: 'New York, NY', countryCode: 'US' },
    { id: 2, number: '+1 (555) 333-4444', location: 'Los Angeles, CA', countryCode: 'US' },
    { id: 3, number: '+1 (555) 555-6666', location: 'Chicago, IL', countryCode: 'US' },
    { id: 4, number: '+1 (555) 777-8888', location: 'Houston, TX', countryCode: 'US' },
    { id: 5, number: '+1 (555) 999-0000', location: 'Miami, FL', countryCode: 'US' },
];

const AddCallScoutNumberModal: React.FC<AddCallScoutNumberModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { createCallerId } = useCallerIds();
    const [selectedId, setSelectedId] = useState<number>(4);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleAddNumber = async () => {
        const selectedNumber = mockNumbers.find(n => n.id === selectedId);
        if (!selectedNumber) return;

        setIsSubmitting(true);
        try {
            await createCallerId.mutateAsync({
                callerId: selectedNumber.number,
                label: `Number ${selectedNumber.id}`,
                countryCode: selectedNumber.countryCode,
                numberOfLines: 1,
                ringTime: 30,
                enableAutoPause: false,
                enableRecording: false,
                sendOutlookAppointment: false,
                allowDncCalls: false,
                status: 'Healthy' as any 
            });
            toast.success('Number added successfully');
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add number');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4 font-sans">
            <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header with X button */}
                <div className="px-8 pt-8 pb-2 flex justify-between items-center">
                    <h2 className="text-[20px] font-bold text-gray-900">Add CallScout Number</h2>
                    <button onClick={onClose} className="p-1.5 bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><FiX size={20} /></button>
                </div>

                <div className="p-8 pt-4 space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                        {['AREA CODE', 'CITY', 'STATE'].map((label, i) => (
                            <div key={i} className="space-y-1.5">
                                <label className="text-[10px] font-extrabold text-[#9CA3AF] tracking-wider ml-1">{label}</label>
                                <input type="text" placeholder="eg., ..." className="w-full bg-[#F3F4F8] rounded-xl py-3 px-3 text-[13px] outline-none focus:ring-1 focus:ring-yellow-400" />
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#F9FAFB] rounded-[24px] p-4">
                        <h3 className="text-[12px] font-extrabold text-gray-500 mb-3 ml-1 uppercase">Available Numbers (5)</h3>
                        <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {mockNumbers.map((item) => (
                                <div key={item.id} onClick={() => setSelectedId(item.id)} className={`flex items-center gap-4 p-4 rounded-[18px] cursor-pointer transition-all border-2 ${selectedId === item.id ? 'bg-white border-yellow-400 shadow-sm' : 'bg-white border-transparent hover:border-gray-100'}`}>
                                    <FiPhone size={18} className={selectedId === item.id ? 'text-yellow-500' : 'text-gray-400'} />
                                    <div>
                                        <p className="text-[14px] font-bold text-gray-900">{item.number}</p>
                                        <p className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-tight">{item.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 bg-[#F3F4F6] text-gray-900 text-[14px] font-extrabold py-4 rounded-[18px] hover:bg-gray-200 transition-colors">Cancel</button>
                        <button
                            onClick={handleAddNumber}
                            disabled={isSubmitting}
                            className="flex-[2] bg-[#FECD56] text-gray-900 text-[14px] font-extrabold py-4 rounded-[18px] shadow-sm hover:bg-[#F0D500] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Number to Account'}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }`}</style>
        </div>
    );
};

export default AddCallScoutNumberModal;