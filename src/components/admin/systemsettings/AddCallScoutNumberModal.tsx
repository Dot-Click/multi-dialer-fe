import React, { useState } from 'react';
import { FiPhone, FiX } from 'react-icons/fi';
import { useTwilioNumbers, type TwilioNumber } from '@/hooks/useSystemSettings';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Country, State, City } from 'country-state-city';

interface AddCallScoutNumberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (callerId: any) => void;
    // Optional: when set, an OWNER/SUPER_ADMIN buys the number on behalf of this user instead of themselves.
    userId?: string;
}

const AddCallScoutNumberModal: React.FC<AddCallScoutNumberModalProps> = ({ isOpen, onClose, onSuccess, userId }) => {
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

    const { availableNumbers, buyNumber } = useTwilioNumbers(filters, userId);
    const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Shown instead of buying directly once the plan's included count is
    // used up — mirrors the agent-seat overage flow: block the action, show
    // the exact charge, and only proceed once the user explicitly confirms.
    const [overageConfirm, setOverageConfirm] = useState<{ priceCents: number; currency: string } | null>(null);

    // Backend returns { numbers, pricing, billing } — billing.effectivePriceCents
    // is what a purchase will actually be charged right now (0 if still within
    // the plan's included free count, otherwise the super-admin-configured
    // add-on price, falling back to Twilio's live price only if unconfigured).
    const numbersList: TwilioNumber[] = availableNumbers.data?.numbers ?? [];
    const billing = availableNumbers.data?.billing;

    const pricingInfo = billing
        ? billing.isWithinIncludedCount
            ? 'Free (included in plan)'
            : `$${(billing.effectivePriceCents / 100).toFixed(2)}/mo`
        : null;

    if (!isOpen) return null;

    const runPurchase = async (confirmOverageCharge?: boolean) => {
        if (!selectedNumber) return;
        const twilioNum = numbersList.find((n: TwilioNumber) => n.phoneNumber === selectedNumber);
        if (!twilioNum) return;

        setIsSubmitting(true);
        try {
            const buyResult = await buyNumber.mutateAsync({
                phoneNumber: selectedNumber,
                countryCode: twilioNum.isoCountry || 'US',
                ...(confirmOverageCharge ? { confirmOverageCharge: true } : {}),
            });

            const newRecord = buyResult.data?.callerId || buyResult.callerId;

            toast.success(confirmOverageCharge ? 'Extra number purchased and added' : 'Number bought and added successfully');
            setOverageConfirm(null);
            onSuccess(newRecord);
        } catch (error: any) {
            // Defense in depth: even if the client's cached billing info said
            // this was still free, the server is the source of truth — if it
            // comes back requiring payment, show the same confirm dialog
            // instead of just failing.
            if (error.response?.data?.requiresPayment) {
                setOverageConfirm({
                    priceCents: error.response.data.priceCents,
                    currency: error.response.data.currency || 'usd',
                });
                return;
            }
            toast.error(error.response?.data?.message || 'Failed to process number');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddNumber = () => {
        if (!selectedNumber) {
            toast.error('Please select a number first');
            return;
        }

        // Past the included count — block the purchase and ask for
        // confirmation on the exact charge instead of buying immediately.
        if (billing && !billing.isWithinIncludedCount) {
            setOverageConfirm({ priceCents: billing.effectivePriceCents, currency: billing.effectiveCurrency });
            return;
        }

        runPurchase();
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4 font-sans">
            <div className="bg-white dark:bg-slate-800 w-full max-w-[500px] rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border dark:border-slate-700">
                {/* Header */}
                <div className="px-8 pt-8 pb-2 flex justify-between items-center">
                    <h2 className="text-[20px] font-bold text-gray-900 dark:text-white">Add Number</h2>
                    <button onClick={onClose} className="p-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <FiX size={20} />
                    </button>
                </div>

                <div className="p-8 pt-4 space-y-6">
                    {/* Filters */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-[#9CA3AF] tracking-wider ml-1 uppercase">Country</label>
                            <select
                                value={filters.countryCode}
                                onChange={(e) => setFilters({ ...filters, countryCode: e.target.value, state: '', cityName: '' })}
                                className="w-full bg-[#F3F4F8] dark:bg-slate-700 dark:text-white rounded-xl py-3 px-3 text-[13px] outline-none"
                            >
                                {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-[#9CA3AF] tracking-wider ml-1 uppercase">State</label>
                            <select
                                value={filters.state}
                                onChange={(e) => setFilters({ ...filters, state: e.target.value, cityName: '' })}
                                className="w-full bg-[#F3F4F8] dark:bg-slate-700 dark:text-white rounded-xl py-3 px-3 text-[13px] outline-none"
                            >
                                <option value="">Select State</option>
                                {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-[#9CA3AF] tracking-wider ml-1 uppercase">City</label>
                            <select
                                value={filters.cityName}
                                onChange={(e) => setFilters({ ...filters, cityName: e.target.value })}
                                className="w-full bg-[#F3F4F8] dark:bg-slate-700 dark:text-white rounded-xl py-3 px-3 text-[13px] outline-none"
                                disabled={!filters.state}
                            >
                                <option value="">
                                    {filters.state ? 'Select City' : 'Select State First'}
                                </option>
                                {cities.map(c => (
                                    <option
                                        key={`${filters.countryCode}-${c.stateCode}-${c.name}`}
                                        value={c.name}
                                    >
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Numbers List */}
                    <div className="bg-[#F9FAFB] dark:bg-slate-900/50 rounded-3xl p-4">
                        <div className="flex justify-between items-center mb-3 ml-1">
                            <h3 className="text-[12px] font-extrabold text-gray-500 dark:text-gray-400 uppercase">
                                Available Numbers ({numbersList.length})
                            </h3>
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
                            ) : numbersList.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-[12px] font-bold text-gray-400">No numbers available for these filters.</p>
                                </div>
                            ) : (
                                numbersList.map((item: TwilioNumber) => (
                                    <div
                                        key={item.phoneNumber}
                                        onClick={() => setSelectedNumber(item.phoneNumber)}
                                        className={`flex items-center gap-4 p-4 rounded-[18px] cursor-pointer transition-all border-2 ${selectedNumber === item.phoneNumber
                                                ? 'bg-white dark:bg-slate-800 border-yellow-400 shadow-sm'
                                                : 'bg-white dark:bg-slate-800 border-transparent dark:border-slate-700 hover:border-gray-100 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <FiPhone
                                            size={18}
                                            className={selectedNumber === item.phoneNumber ? 'text-yellow-500' : 'text-gray-400'}
                                        />
                                        <div className="flex-1">
                                            <p className="text-[14px] font-bold text-gray-900 dark:text-white">
                                                {item.friendlyName || item.phoneNumber}
                                            </p>
                                            <p className="text-[10px] font-extrabold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-tight">
                                                {item.locality ?? '—'}, {item.region ?? '—'} ({item.isoCountry})
                                            </p>
                                        </div>
                                        {pricingInfo && (
                                            <div className="text-right">
                                                <p className={`text-[11px] font-bold ${billing?.isWithinIncludedCount ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {pricingInfo}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[#F3F4F6] dark:bg-slate-700 text-gray-900 dark:text-white text-[14px] font-extrabold py-4 rounded-[18px] hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
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
                            ) : billing && !billing.isWithinIncludedCount ? 'Pay & Add Number' : 'Buy & Add Number'}
                        </button>
                    </div>
                </div>
            </div>

            {/* OVERAGE CONFIRMATION DIALOG */}
            {overageConfirm && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl p-6">
                        <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2">
                            Number Limit Reached
                        </h3>
                        <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-4">
                            You've used all the phone numbers included in your plan. Adding this number costs{' '}
                            <span className="font-bold text-gray-900 dark:text-white">
                                ${(overageConfirm.priceCents / 100).toFixed(2)}/mo
                            </span>
                            . Proceed with the charge?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setOverageConfirm(null)}
                                disabled={isSubmitting}
                                className="flex-1 bg-[#F3F4F6] dark:bg-slate-700 text-gray-900 dark:text-white text-[13px] font-bold py-3 rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => runPurchase(true)}
                                disabled={isSubmitting}
                                className="flex-1 bg-[#FECD56] text-gray-900 text-[13px] font-bold py-3 rounded-2xl shadow-sm hover:bg-[#F0D500] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : 'Pay & Add Number'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }`}</style>
        </div>
    );
};

export default AddCallScoutNumberModal;
