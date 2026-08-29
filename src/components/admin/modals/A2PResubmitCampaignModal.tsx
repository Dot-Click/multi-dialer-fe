import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchA2PDetails, fetchA2PStatus, resubmitCampaign } from '@/store/slices/a2pSlice';
import {
    A2P_INDUSTRY_OPTIONS,
    A2P_USE_CASE_OPTIONS,
    CAMPAIGN_STARTER_TEMPLATE,
} from './a2pConstants';
import { Header } from './A2PResubmitCPModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Prefilled campaign resubmit form. Only campaign fields are editable —
 * business info is fixed at this point (brand already approved). No TCR
 * fee, so no confirmation checkbox.
 */
const A2PResubmitCampaignModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { details, submitting, error, stages } = useAppSelector((s) => s.a2p);
    const campaign = stages.campaign;

    const [form, setForm] = useState({
        useCase: '',
        businessIndustry: '',
        messageSamples: CAMPAIGN_STARTER_TEMPLATE.messageSamples,
        optInDetails: CAMPAIGN_STARTER_TEMPLATE.optInDetails,
        optInKeywords: CAMPAIGN_STARTER_TEMPLATE.optInKeywords,
        optOutKeywords: CAMPAIGN_STARTER_TEMPLATE.optOutKeywords,
        helpKeywords: CAMPAIGN_STARTER_TEMPLATE.helpKeywords,
        helpMessage: CAMPAIGN_STARTER_TEMPLATE.helpMessage,
    });

    useEffect(() => {
        if (!isOpen) return;
        if (!details) dispatch(fetchA2PDetails());
    }, [isOpen, details, dispatch]);

    useEffect(() => {
        if (!isOpen || !details) return;
        setForm({
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
    }, [isOpen, details]);

    if (!isOpen) return null;

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const updateSample = (i: number, value: string) => {
        setForm((prev) => {
            const next = [...prev.messageSamples];
            next[i] = value;
            return { ...prev, messageSamples: next };
        });
    };
    const addSample = () =>
        setForm((prev) => ({ ...prev, messageSamples: [...prev.messageSamples, ''] }));
    const removeSample = (i: number) =>
        setForm((prev) => ({
            ...prev,
            messageSamples: prev.messageSamples.filter((_, idx) => idx !== i),
        }));

    const onSubmit = async () => {
        const payload = {
            useCase: form.useCase,
            businessIndustry: form.businessIndustry,
            messageSamples: form.messageSamples.map(s => s.trim()).filter(Boolean),
            optInDetails: form.optInDetails,
            optInKeywords: splitCsv(form.optInKeywords),
            optOutKeywords: splitCsv(form.optOutKeywords),
            helpKeywords: splitCsv(form.helpKeywords),
            helpMessage: form.helpMessage,
        };
        const result = await dispatch(resubmitCampaign(payload));
        if (resubmitCampaign.fulfilled.match(result)) {
            dispatch(fetchA2PStatus());
            onClose();
        }
    };

    const suggested = campaign.suggestedFields || [];
    const highlight = (name: string) => (suggested.includes(name) ? 'ring-2 ring-red-300' : '');

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl">
                <Header title="Fix Campaign" onClose={onClose} />
                <div className="max-h-[70vh] overflow-y-auto p-8">
                    {campaign.message && (
                        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
                            <strong>TCR flagged:</strong> {campaign.message}
                        </div>
                    )}
                    <p className="mb-4 text-[13px] text-[#6B7280]">
                        Campaign resubmit is free — no TCR fee. Attempts so far: {campaign.resubmitCount}.
                    </p>
                    {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}

                    <div className="space-y-4">
                        <Field label="Industry" className={highlight('businessIndustry')}>
                            <select name="businessIndustry" value={form.businessIndustry} onChange={onChange} className={inputCls}>
                                <option value="">Select industry</option>
                                {A2P_INDUSTRY_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Use Case" className={highlight('useCase')}>
                            <select name="useCase" value={form.useCase} onChange={onChange} className={inputCls}>
                                <option value="">Select use case</option>
                                {A2P_USE_CASE_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>

                        <div className={`space-y-2 ${highlight('messageSamples') ? 'rounded-[12px] p-2 ring-2 ring-red-300' : ''}`}>
                            <label className="text-[12px] font-[500] text-[#6B7280]">Message Samples</label>
                            {form.messageSamples.map((sample, i) => (
                                <div key={i} className="flex gap-2">
                                    <textarea
                                        value={sample}
                                        onChange={(e) => updateSample(i, e.target.value)}
                                        className="min-h-[60px] flex-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2 text-[#111] outline-none"
                                    />
                                    {form.messageSamples.length > 1 && (
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

                        <Field label="Opt-in details" className={highlight('optInDetails')}>
                            <textarea
                                name="optInDetails"
                                value={form.optInDetails}
                                onChange={onChange}
                                className="min-h-[60px] w-full bg-transparent text-[#111] outline-none"
                            />
                        </Field>

                        <div className="grid grid-cols-3 gap-3">
                            <Field label="Opt-in keywords" className={highlight('optInKeywords')}>
                                <input name="optInKeywords" value={form.optInKeywords} onChange={onChange} className={inputCls} />
                            </Field>
                            <Field label="Opt-out keywords" className={highlight('optOutKeywords')}>
                                <input name="optOutKeywords" value={form.optOutKeywords} onChange={onChange} className={inputCls} />
                            </Field>
                            <Field label="Help keywords" className={highlight('helpKeywords')}>
                                <input name="helpKeywords" value={form.helpKeywords} onChange={onChange} className={inputCls} />
                            </Field>
                        </div>

                        <Field label="HELP response message" className={highlight('helpMessage')}>
                            <textarea
                                name="helpMessage"
                                value={form.helpMessage}
                                onChange={onChange}
                                className="min-h-[60px] w-full bg-transparent text-[#111] outline-none"
                            />
                        </Field>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={onSubmit}
                            disabled={submitting}
                            className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black hover:shadow-lg disabled:opacity-50"
                        >
                            {submitting ? 'Submitting…' : 'Resubmit Campaign'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
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

const splitCsv = (raw: string): string[] =>
    raw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

export default A2PResubmitCampaignModal;
