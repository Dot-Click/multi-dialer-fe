import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchA2PDetails, fetchA2PStatus, resubmitCustomerProfile } from '@/store/slices/a2pSlice';
import { A2P_BUSINESS_TYPE_OPTIONS } from './a2pConstants';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Prefilled Business Profile resubmit form. Shows only the fields Twilio
 * evaluates on the Customer Profile (business + address + auth rep); the
 * campaign fields carry over silently from the stored row so users
 * aren't asked to re-approve TCR copy just because their address failed
 * validation. Fields flagged by the classifier (state.stages.customerProfile
 * .suggestedFields) get a subtle red outline to draw the eye.
 */
const A2PResubmitCPModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { details, submitting, error, stages } = useAppSelector((s) => s.a2p);
    const suggested = stages.customerProfile.suggestedFields || [];
    const rejectionMessage = stages.customerProfile.message;

    const [form, setForm] = useState(emptyCpForm);

    useEffect(() => {
        if (!isOpen) return;
        if (!details) dispatch(fetchA2PDetails());
    }, [isOpen, details, dispatch]);

    useEffect(() => {
        if (!isOpen || !details) return;
        setForm({
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
        });
    }, [isOpen, details]);

    if (!isOpen) return null;

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const highlight = (fieldName: string) => (suggested.includes(fieldName) ? 'ring-2 ring-red-300' : '');

    const onSubmit = async () => {
        const result = await dispatch(resubmitCustomerProfile(form));
        if (resubmitCustomerProfile.fulfilled.match(result)) {
            dispatch(fetchA2PStatus());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl">
                <Header title="Fix Business Profile" onClose={onClose} />

                <div className="max-h-[70vh] overflow-y-auto p-8">
                    {rejectionMessage && (
                        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
                            <strong>Twilio flagged:</strong> {rejectionMessage}
                        </div>
                    )}
                    {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}

                    <div className="space-y-4">
                        <Field label="Legal Business Name" className={highlight('legalBusinessName')}>
                            <input name="legalBusinessName" value={form.legalBusinessName} onChange={onChange} className={inputCls} />
                        </Field>
                        <Field label="Business Type" className={highlight('businessType')}>
                            <select name="businessType" value={form.businessType} onChange={onChange} className={inputCls}>
                                <option value="">Select Type</option>
                                {A2P_BUSINESS_TYPE_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="EIN" className={highlight('ein')}>
                            <input name="ein" value={form.ein} onChange={onChange} className={inputCls} />
                        </Field>
                        <Field label="Business Website" className={highlight('businessWebsite')}>
                            <input name="businessWebsite" value={form.businessWebsite} onChange={onChange} className={inputCls} />
                        </Field>
                        <Field label="Street Address" className={highlight('businessAddress')}>
                            <input name="businessAddress" value={form.businessAddress} onChange={onChange} className={inputCls} />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="City" className={highlight('city')}>
                                <input name="city" value={form.city} onChange={onChange} className={inputCls} />
                            </Field>
                            <Field label="State" className={highlight('state')}>
                                <input name="state" value={form.state} onChange={onChange} className={inputCls} />
                            </Field>
                        </div>
                        <Field label="Postal Code" className={highlight('postalCode')}>
                            <input name="postalCode" value={form.postalCode} onChange={onChange} className={inputCls} />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Contact First Name" className={highlight('contactFirstName')}>
                                <input name="contactFirstName" value={form.contactFirstName} onChange={onChange} className={inputCls} />
                            </Field>
                            <Field label="Contact Last Name" className={highlight('contactLastName')}>
                                <input name="contactLastName" value={form.contactLastName} onChange={onChange} className={inputCls} />
                            </Field>
                        </div>
                        <Field label="Contact Email" className={highlight('contactEmail')}>
                            <input name="contactEmail" value={form.contactEmail} onChange={onChange} className={inputCls} />
                        </Field>
                        <Field label="Contact Phone" className={highlight('contactPhone')}>
                            <input name="contactPhone" value={form.contactPhone} onChange={onChange} className={inputCls} />
                        </Field>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button onClick={onSubmit} disabled={submitting} className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black hover:shadow-lg disabled:opacity-50">
                            {submitting ? 'Submitting…' : 'Resubmit Business Profile'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 hover:bg-gray-200">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------------------
// Local helpers
// -----------------------------------------------------------------------------

const emptyCpForm = {
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

const inputCls = 'bg-transparent text-[#111] outline-none';

const Field: React.FC<{ label: string; className?: string; children: React.ReactNode }> = ({
    label, className = '', children,
}) => (
    <div className={`flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2 ${className}`}>
        <label className="text-[12px] font-[500] text-[#6B7280]">{label}</label>
        {children}
    </div>
);

export const Header: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
    <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
        <h2 className="text-[22px] font-[700] text-[#111]">{title}</h2>
        <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
        >
            <X className="h-5 w-5" />
        </button>
    </div>
);

export default A2PResubmitCPModal;
