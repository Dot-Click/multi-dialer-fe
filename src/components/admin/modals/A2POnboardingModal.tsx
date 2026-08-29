import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchA2PDetails, submitA2PRegistration } from '@/store/slices/a2pSlice';
import {
    A2P_BUSINESS_TYPE_OPTIONS,
    A2P_INDUSTRY_OPTIONS,
    A2P_USE_CASE_OPTIONS,
    CAMPAIGN_STARTER_TEMPLATE,
} from './a2pConstants';

interface A2POnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Wire shape sent to POST /api/a2p/submit. Extends the historical 3-step
 * business fields with the campaign step so admins pick their own use
 * case + copy — the backend previously baked all of this in as real
 * estate defaults.
 */
interface FormData {
    legalBusinessName: string;
    businessType: string;
    ein: string;
    businessWebsite: string;
    businessAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    contactPhone: string;
    // Step 4 — campaign
    useCase: string;
    businessIndustry: string;
    messageSamples: string[];
    optInDetails: string;
    optInKeywords: string;   // comma-separated in the UI; split on submit
    optOutKeywords: string;
    helpKeywords: string;
    helpMessage: string;
}

const defaultFormData: FormData = {
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
    useCase: '',
    businessIndustry: '',
    messageSamples: CAMPAIGN_STARTER_TEMPLATE.messageSamples,
    optInDetails: CAMPAIGN_STARTER_TEMPLATE.optInDetails,
    optInKeywords: CAMPAIGN_STARTER_TEMPLATE.optInKeywords,
    optOutKeywords: CAMPAIGN_STARTER_TEMPLATE.optOutKeywords,
    helpKeywords: CAMPAIGN_STARTER_TEMPLATE.helpKeywords,
    helpMessage: CAMPAIGN_STARTER_TEMPLATE.helpMessage,
};

const TOTAL_STEPS = 4;

const A2POnboardingModal: React.FC<A2POnboardingModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { submitting, error, details } = useAppSelector((state) => state.a2p);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(defaultFormData);

    // Reset on close so a fresh open starts clean; prefill on open when
    // the admin has submitted before (rejected retry). Details are
    // fetched by the provider on login, so they're usually already in
    // the store — refetch here as a safety net in case they aren't.
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            return;
        }
        if (!details) dispatch(fetchA2PDetails());
    }, [isOpen, details, dispatch]);

    useEffect(() => {
        if (!isOpen) return;
        if (details) {
            setFormData({
                legalBusinessName: details.legalBusinessName || '',
                businessType: details.businessType || '',
                ein: details.ein || '',
                businessWebsite: details.businessWebsite || '',
                businessAddress: details.businessAddress || '',
                city: details.city || '',
                state: details.state || '',
                postalCode: details.postalCode || '',
                country: details.country || 'US',
                contactFirstName: details.contactFirstName || '',
                contactLastName: details.contactLastName || '',
                contactEmail: details.contactEmail || '',
                contactPhone: details.contactPhone || '',
                useCase: details.useCase || '',
                businessIndustry: details.businessIndustry || '',
                messageSamples: details.messageSamples?.length
                    ? details.messageSamples
                    : CAMPAIGN_STARTER_TEMPLATE.messageSamples,
                optInDetails: details.optInDetails || CAMPAIGN_STARTER_TEMPLATE.optInDetails,
                optInKeywords: (details.optInKeywords || []).join(', ') || CAMPAIGN_STARTER_TEMPLATE.optInKeywords,
                optOutKeywords: (details.optOutKeywords || []).join(', ') || CAMPAIGN_STARTER_TEMPLATE.optOutKeywords,
                helpKeywords: (details.helpKeywords || []).join(', ') || CAMPAIGN_STARTER_TEMPLATE.helpKeywords,
                helpMessage: details.helpMessage || CAMPAIGN_STARTER_TEMPLATE.helpMessage,
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [isOpen, details]);

    if (!isOpen) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const updateSample = (i: number, value: string) => {
        setFormData((prev) => {
            const next = [...prev.messageSamples];
            next[i] = value;
            return { ...prev, messageSamples: next };
        });
    };
    const addSample = () =>
        setFormData((prev) => ({ ...prev, messageSamples: [...prev.messageSamples, ''] }));
    const removeSample = (i: number) =>
        setFormData((prev) => ({
            ...prev,
            messageSamples: prev.messageSamples.filter((_, idx) => idx !== i),
        }));

    const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        // Convert the comma-separated keyword strings back into arrays.
        const payload = {
            ...formData,
            messageSamples: formData.messageSamples.map(s => s.trim()).filter(Boolean),
            optInKeywords: splitCsv(formData.optInKeywords),
            optOutKeywords: splitCsv(formData.optOutKeywords),
            helpKeywords: splitCsv(formData.helpKeywords),
        };
        const result = await dispatch(submitA2PRegistration(payload));
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
                        <Field label="Legal Business Name">
                            <input name="legalBusinessName" value={formData.legalBusinessName} onChange={handleInputChange} className={inputCls} placeholder="Exact tax name" />
                        </Field>
                        <Field label="Business Type">
                            <select name="businessType" value={formData.businessType} onChange={handleInputChange} className={inputCls}>
                                <option value="">Select Type</option>
                                {A2P_BUSINESS_TYPE_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="EIN (XX-XXXXXXX)">
                            <input name="ein" value={formData.ein} onChange={handleInputChange} className={inputCls} placeholder="9-digit Tax ID" />
                        </Field>
                        <Field label="Business Website">
                            <input name="businessWebsite" value={formData.businessWebsite} onChange={handleInputChange} className={inputCls} placeholder="https://..." />
                        </Field>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 2: Business Address</h3>
                        <Field label="Street Address">
                            <input name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} className={inputCls} />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="City">
                                <input name="city" value={formData.city} onChange={handleInputChange} className={inputCls} />
                            </Field>
                            <Field label="State">
                                <input name="state" value={formData.state} onChange={handleInputChange} className={inputCls} />
                            </Field>
                        </div>
                        <Field label="Postal Code">
                            <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={inputCls} />
                        </Field>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 3: Point of Contact</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="First Name">
                                <input name="contactFirstName" value={formData.contactFirstName} onChange={handleInputChange} className={inputCls} />
                            </Field>
                            <Field label="Last Name">
                                <input name="contactLastName" value={formData.contactLastName} onChange={handleInputChange} className={inputCls} />
                            </Field>
                        </div>
                        <Field label="Email">
                            <input name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className={inputCls} />
                        </Field>
                        <Field label="Phone Number">
                            <input name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className={inputCls} />
                        </Field>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Step 4: SMS Campaign</h3>
                        <p className="text-[13px] text-[#6B7280]">
                            TCR (The Campaign Registry) reviews this content to approve your SMS campaign. Pick the use case
                            that matches your outreach and provide two or more sample messages showing what you'll actually send.
                        </p>
                        <Field label="Industry">
                            <select name="businessIndustry" value={formData.businessIndustry} onChange={handleInputChange} className={inputCls}>
                                <option value="">Select industry</option>
                                {A2P_INDUSTRY_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Use Case">
                            <select name="useCase" value={formData.useCase} onChange={handleInputChange} className={inputCls}>
                                <option value="">Select use case</option>
                                {A2P_USE_CASE_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>

                        <div className="space-y-2">
                            <label className="text-[12px] font-[500] text-[#6B7280]">Message Samples (2+ recommended)</label>
                            {formData.messageSamples.map((sample, i) => (
                                <div key={i} className="flex gap-2">
                                    <textarea
                                        value={sample}
                                        onChange={(e) => updateSample(i, e.target.value)}
                                        placeholder="Example: Hi {name}, quick follow-up on your inquiry — reply STOP to opt out."
                                        className="min-h-[60px] flex-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2 text-[#111] outline-none"
                                    />
                                    {formData.messageSamples.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSample(i)}
                                            className="rounded-[10px] bg-red-50 px-3 text-red-600 hover:bg-red-100"
                                            aria-label={`Remove sample ${i + 1}`}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addSample}
                                className="text-[13px] font-medium text-[#0B62D6] hover:underline"
                            >
                                + Add another sample
                            </button>
                        </div>

                        <Field label="How do contacts opt in?">
                            <textarea
                                name="optInDetails"
                                value={formData.optInDetails}
                                onChange={handleInputChange}
                                className="min-h-[60px] w-full bg-transparent text-[#111] outline-none"
                                placeholder="E.g., verbal consent during a call, lead form on website, in-person sign-up."
                            />
                        </Field>

                        <div className="grid grid-cols-3 gap-3">
                            <Field label="Opt-in keywords">
                                <input name="optInKeywords" value={formData.optInKeywords} onChange={handleInputChange} className={inputCls} placeholder="START, YES" />
                            </Field>
                            <Field label="Opt-out keywords">
                                <input name="optOutKeywords" value={formData.optOutKeywords} onChange={handleInputChange} className={inputCls} placeholder="STOP, UNSUBSCRIBE" />
                            </Field>
                            <Field label="Help keywords">
                                <input name="helpKeywords" value={formData.helpKeywords} onChange={handleInputChange} className={inputCls} placeholder="HELP, INFO" />
                            </Field>
                        </div>

                        <Field label="HELP response message">
                            <textarea
                                name="helpMessage"
                                value={formData.helpMessage}
                                onChange={handleInputChange}
                                className="min-h-[60px] w-full bg-transparent text-[#111] outline-none"
                                placeholder="Sent when a contact texts HELP. Include how they can reach support."
                            />
                        </Field>
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
                        <h2 className="text-[22px] font-[700] text-[#111]">SMS Registration</h2>
                        <p className="text-[14px] text-[#6B7280]">
                            Step {step} of {TOTAL_STEPS}. Business Profile approval unlocks Voice Integrity and CNAM as well.
                        </p>
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

                <div className="max-h-[70vh] overflow-y-auto p-8">
                    {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}
                    {renderStep()}

                    <div className="mt-8 flex gap-3">
                        {step > 1 && (
                            <button onClick={prevStep} className="flex-1 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-200">
                                Back
                            </button>
                        )}
                        {step < TOTAL_STEPS ? (
                            <button onClick={nextStep} className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black transition-all hover:shadow-lg">
                                Next Step
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={submitting} className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black transition-all hover:shadow-lg disabled:opacity-50">
                                {submitting ? 'Submitting...' : 'Submit Registration'}
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

// -----------------------------------------------------------------------------
// Local UI primitives
// -----------------------------------------------------------------------------

const inputCls = 'bg-transparent text-[#111] outline-none';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
        <label className="text-[12px] font-[500] text-[#6B7280]">{label}</label>
        {children}
    </div>
);

const splitCsv = (raw: string): string[] =>
    raw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

export default A2POnboardingModal;
