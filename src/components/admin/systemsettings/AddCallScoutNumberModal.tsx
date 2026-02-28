import React, { useState } from 'react';
import { FiPhone, FiX } from 'react-icons/fi';
import { useTwilioNumbers } from '@/hooks/useSystemSettings';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface AddCallScoutNumberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (callerId: any) => void;
}
import { Country, State, City } from 'country-state-city';

const AddCallScoutNumberModal: React.FC<AddCallScoutNumberModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // const { createCallerId } = useCallerIds();
    const [filters, setFilters] = useState({
        countryCode: 'US',
        cityName: '',
        state: ''
    });

    const countries = Country.getAllCountries();
    const states = State.getStatesOfCountry(filters.countryCode);
    const cities = filters.state
        ? City.getCitiesOfState(filters.countryCode, filters.state)
        : [];
    const { availableNumbers, buyNumber } = useTwilioNumbers(filters);
    const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleAddNumber = async () => {
        if (!selectedNumber) {
            toast.error('Please select a number first');
            return;
        }

        const twilioNum = availableNumbers.data?.find(n => n.phoneNumber === selectedNumber);
        if (!twilioNum) return;

        setIsSubmitting(true);
        try {
            // 1. Buy the number from Twilio (Backend now handles saving it to DB)
            const buyResult = await buyNumber.mutateAsync({
                phoneNumber: selectedNumber,
                countryCode: twilioNum.isoCountry || 'US',
                label: `CallScout Number - ${twilioNum.locality || 'US'}`
            });

            // The backend returns { number, callerId }
            const newRecord = buyResult.data?.callerId || buyResult.callerId;

            toast.success('Number bought and added successfully');
            onSuccess(newRecord);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to process number');
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
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-[#9CA3AF] tracking-wider ml-1 uppercase">Country</label>
                            <select
                                value={filters.countryCode}
                                onChange={(e) => setFilters({ ...filters, countryCode: e.target.value, state: '', cityName: '' })}
                                className="w-full bg-[#F3F4F8] rounded-xl py-3 px-3 text-[13px] outline-none"
                            >
                                {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-[#9CA3AF] tracking-wider ml-1 uppercase">State</label>
                            <select
                                value={filters.state}
                                onChange={(e) => setFilters({ ...filters, state: e.target.value, cityName: '' })}
                                className="w-full bg-[#F3F4F8] rounded-xl py-3 px-3 text-[13px] outline-none"
                            >
                                <option value="">Select State</option>
                                {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-[#9CA3AF] tracking-wider ml-1 uppercase">City</label>
                            <select
                                value={filters.cityName}
                                // onChange={(e) => setFilters({ ...filters, cityName: e.target.value })}
                                onChange={(e) => setFilters({ ...filters, cityName: e.target.value })}
                                className="w-full bg-[#F3F4F8] rounded-xl py-3 px-3 text-[13px] outline-none"
                                disabled={!filters.state}
                            >
                                <option value="">

                                    {filters.state ? 'Select City' : 'Select State First'}
                                </option>
                                {cities.map(c => (
                                    <option
                                        key={`${filters.countryCode}-${c.stateCode}-${c.name}`}  // 👈 fully unique key
                                        value={c.name}
                                    >
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-[#F9FAFB] rounded-[24px] p-4">
                        <div className="flex justify-between items-center mb-3 ml-1">
                            <h3 className="text-[12px] font-extrabold text-gray-500 uppercase">Available Numbers ({availableNumbers.data?.length || 0})</h3>
                            {availableNumbers.isFetching && <Loader2 size={14} className="animate-spin text-yellow-500" />}
                        </div>

                        <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {!filters.countryCode || !filters.state || !filters.cityName ? (
                                <div className="text-center py-10">
                                    <p className="text-[12px] font-bold text-gray-400">
                                        Select a country, state & city to see available numbers
                                    </p>
                                </div>
                            ) : availableNumbers.isLoading || availableNumbers.isFetching ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                                    <p className="text-[12px] font-bold text-gray-400">Fetching fresh numbers...</p>
                                </div>
                            ) : availableNumbers.data?.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-[12px] font-bold text-gray-400">No numbers available for these filters.</p>
                                </div>
                            ) : (
                                availableNumbers.data?.map((item) => (
                                    <div
                                        key={item.phoneNumber}
                                        onClick={() => setSelectedNumber(item.phoneNumber)}
                                        className={`flex items-center gap-4 p-4 rounded-[18px] cursor-pointer transition-all border-2 ${selectedNumber === item.phoneNumber ? 'bg-white border-yellow-400 shadow-sm' : 'bg-white border-transparent hover:border-gray-100'}`}
                                    >
                                        <FiPhone size={18} className={selectedNumber === item.phoneNumber ? 'text-yellow-500' : 'text-gray-400'} />
                                        <div>
                                            <p className="text-[14px] font-bold text-gray-900">{item.friendlyName || item.phoneNumber}</p>
                                            <p className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-tight">
                                                {item.locality}, {item.region} ({item.isoCountry})
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 bg-[#F3F4F6] text-gray-900 text-[14px] font-extrabold py-4 rounded-[18px] hover:bg-gray-200 transition-colors">Cancel</button>
                        <button
                            onClick={handleAddNumber}
                            disabled={isSubmitting || !selectedNumber || availableNumbers.isLoading}
                            className="flex-2 bg-[#FECD56] text-gray-900 text-[14px] font-extrabold py-4 rounded-[18px] shadow-sm hover:bg-[#F0D500] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 size={18} className="animate-spin" />
                                    Processing...
                                </span>
                            ) : 'Buy & Add Number'}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }`}</style>
        </div>
    );
};

export default AddCallScoutNumberModal;
