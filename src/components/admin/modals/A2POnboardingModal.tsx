import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { submitA2PRegistration } from '@/store/slices/a2pSlice';

interface A2POnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const defaultFormData = {
    legalBusinessName: '',
    businessType: '',
    ein: '',
    businessWebsite: '',
    businessAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
};

const A2POnboardingModal: React.FC<A2POnboardingModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.a2p);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setFormData(defaultFormData);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {
        const result = await dispatch(submitA2PRegistration(formData));

        if (submitA2PRegistration.fulfilled.match(result)) {
            onClose();
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 1: Business Information</h3>
                        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                            <label className="text-[12px] font-[500] text-[#6B7280]">Legal Business Name</label>
                            <input name="legalBusinessName" value={formData.legalBusinessName} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" placeholder="Exact tax name" />
                        </div>
                        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                            <label className="text-[12px] font-[500] text-[#6B7280]">Business Type</label>
                            <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none">
                                <option value="">Select Type</option>
                                <option value="LLC">LLC</option>
                                <option value="CORPORATION">Corporation</option>
                                <option value="SOLE_PROPRIETOR">Sole Proprietor</option>
                                <option value="PARTNERSHIP">Partnership</option>
                                <option value="NON_PROFIT">Non-Profit</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                            <label className="text-[12px] font-[500] text-[#6B7280]">EIN (XX-XXXXXXX)</label>
                            <input name="ein" value={formData.ein} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" placeholder="9-digit Tax ID" />
                        </div>
                        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                            <label className="text-[12px] font-[500] text-[#6B7280]">Business Website</label>
                            <input name="businessWebsite" value={formData.businessWebsite} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" placeholder="https://..." />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 2: Business Address</h3>
                        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                            <label className="text-[12px] font-[500] text-[#6B7280]">Street Address</label>
                            <input name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                <label className="text-[12px] font-[500] text-[#6B7280]">City</label>
                                <input name="city" value={formData.city} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" />
                            </div>
                            <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                <label className="text-[12px] font-[500] text-[#6B7280]">State</label>
                                <input name="state" value={formData.state} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                            <label className="text-[12px] font-[500] text-[#6B7280]">Postal Code</label>
                            <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 3: Point of Contact</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                <label className="text-[12px] font-[500] text-[#6B7280]">First Name</label>
                                <input name="contactFirstName" value={formData.contactFirstName} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" />
                            </div>
                            <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                <label className="text-[12px] font-[500] text-[#6B7280]">Last Name</label>
                                <input name="contactLastName" value={formData.contactLastName} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                            <label className="text-[12px] font-[500] text-[#6B7280]">Email</label>
                            <input name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" />
                        </div>
                        <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                            <label className="text-[12px] font-[500] text-[#6B7280]">Phone Number</label>
                            <input name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="bg-transparent text-[#111] outline-none" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
                    <div>
                        <h2 className="text-[22px] font-[700] text-[#111]">Optional SMS Registration</h2>
                        <p className="text-[14px] text-[#6B7280]">Complete this when you are ready to enable compliant SMS messaging.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Close A2P registration modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8">
                    {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}

                    {renderStep()}

                    <div className="mt-8 flex gap-3">
                        {step > 1 && (
                            <button onClick={prevStep} className="flex-1 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-200">
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button onClick={nextStep} className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black transition-all hover:shadow-lg">
                                Next Step
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black transition-all hover:shadow-lg disabled:opacity-50">
                                {loading ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50 px-8 py-4 text-center">
                    <p className="text-[12px] text-[#6B7280]">
                        You can continue to use calling features while registration is pending.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default A2POnboardingModal;
