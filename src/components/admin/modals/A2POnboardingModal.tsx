import React, { useState } from 'react';
// import { IoClose } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { submitA2PRegistration } from '@/store/slices/a2pSlice';

interface A2POnboardingModalProps {
    isOpen: boolean;
}

const A2POnboardingModal: React.FC<A2POnboardingModalProps> = ({ isOpen }) => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.a2p);
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
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
    });

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        await dispatch(submitA2PRegistration(formData));
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Step 1: Business Information</h3>
                        <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                            <label className="text-[#6B7280] text-[12px] font-[500]">Legal Business Name</label>
                            <input name="legalBusinessName" value={formData.legalBusinessName} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" placeholder="Exact tax name" />
                        </div>
                        <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                            <label className="text-[#6B7280] text-[12px] font-[500]">Business Type</label>
                            <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]">
                                <option value="">Select Type</option>
                                <option value="LLC">LLC</option>
                                <option value="CORPORATION">Corporation</option>
                                <option value="SOLE_PROPRIETOR">Sole Proprietor</option>
                                <option value="PARTNERSHIP">Partnership</option>
                                <option value="NON_PROFIT">Non-Profit</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                            <label className="text-[#6B7280] text-[12px] font-[500]">EIN (XX-XXXXXXX)</label>
                            <input name="ein" value={formData.ein} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" placeholder="9-digit Tax ID" />
                        </div>
                        <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                            <label className="text-[#6B7280] text-[12px] font-[500]">Business Website</label>
                            <input name="businessWebsite" value={formData.businessWebsite} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" placeholder="https://..." />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Step 2: Business Address</h3>
                        <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                            <label className="text-[#6B7280] text-[12px] font-[500]">Street Address</label>
                            <input name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                                <label className="text-[#6B7280] text-[12px] font-[500]">City</label>
                                <input name="city" value={formData.city} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" />
                            </div>
                            <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                                <label className="text-[#6B7280] text-[12px] font-[500]">State</label>
                                <input name="state" value={formData.state} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                            <label className="text-[#6B7280] text-[12px] font-[500]">Postal Code</label>
                            <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Step 3: Point of Contact</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                                <label className="text-[#6B7280] text-[12px] font-[500]">First Name</label>
                                <input name="contactFirstName" value={formData.contactFirstName} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" />
                            </div>
                            <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                                <label className="text-[#6B7280] text-[12px] font-[500]">Last Name</label>
                                <input name="contactLastName" value={formData.contactLastName} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                            <label className="text-[#6B7280] text-[12px] font-[500]">Email</label>
                            <input name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" />
                        </div>
                        <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
                            <label className="text-[#6B7280] text-[12px] font-[500]">Phone Number</label>
                            <input name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="bg-transparent outline-none text-[#111]" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-[#111] text-[22px] font-[700]">SMS Registration Required</h2>
                        <p className="text-[#6B7280] text-[14px]">Carrier compliance for US/Canada messaging</p>
                    </div>
                </div>

                <div className="p-8">
                    {error && <p className="text-red-500 mb-4 text-sm font-medium">⚠️ {error}</p>}
                    
                    {renderStep()}

                    <div className="mt-8 flex gap-3">
                        {step > 1 && (
                            <button onClick={prevStep} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-200 transition-all">
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button onClick={nextStep} className="flex-1 bg-[#FFCA06] text-black font-semibold py-3.5 rounded-xl hover:shadow-lg transition-all">
                                Next Step
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-[#FFCA06] text-black font-semibold py-3.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                                {loading ? "Submitting..." : "Submit Registration"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-[12px] text-[#6B7280]">
                        You can continue to use calling features while registration is pending.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default A2POnboardingModal;
