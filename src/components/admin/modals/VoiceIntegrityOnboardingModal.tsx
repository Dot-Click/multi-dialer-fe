import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, FileWarning, ShieldAlert, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    submitVoiceIntegrityOnboarding,
    refreshVoiceIntegrityStatus,
} from '@/store/slices/voiceIntegritySlice';
import type { VoiceIntegrityAttributes } from '@/store/slices/voiceIntegritySlice';
import { useA2P } from '@/providers/a2p.provider';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const USE_CASE_OPTIONS = [
    { value: 'sales_dialer', label: 'Sales / Outbound Dialer' },
    { value: 'customer_care', label: 'Customer Care' },
    { value: 'appointment_reminders', label: 'Appointment Reminders' },
    { value: 'debt_collection', label: 'Debt Collection' },
    { value: 'other', label: 'Other' },
];

const defaultFormData: VoiceIntegrityAttributes = {
    useCase: 'sales_dialer',
    businessEmployeeCount: 1,
    averageBusinessDayCallVolume: 100,
    notes: '',
};

/**
 * Voice Integrity onboarding modal.
 *
 * State machine (mirrors backend service):
 *   not-started    → show form, no dismiss (must submit or approve)
 *   twilio-rejected → show Twilio's exact rejection reason + form, no dismiss
 *   pending-review → show "on approval" panel; dismissable (but auto-reopens next visit)
 *   twilio-approved → modal doesn't render (provider hides it)
 *
 * The modal cannot be closed while the trust product isn't approved — that's
 * the "prompt until approved" behavior. Only the pending-review panel has a
 * "Got it" button; the form states do not.
 */
const VoiceIntegrityOnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { openModal: openA2PModal } = useA2P();
    const { status, rejectionReason, loading, error } = useAppSelector(
        (state) => state.voiceIntegrity
    );
    const [formData, setFormData] = useState<VoiceIntegrityAttributes>(defaultFormData);

    // Reset the form when the modal transitions from approved → rejected so
    // the user isn't looking at stale submitted values.
    useEffect(() => {
        if (status === 'twilio-rejected') {
            setFormData(defaultFormData);
        }
    }, [status]);

    if (!isOpen) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'businessEmployeeCount' || name === 'averageBusinessDayCallVolume'
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async () => {
        await dispatch(submitVoiceIntegrityOnboarding(formData));
    };

    const handleRefresh = () => {
        dispatch(refreshVoiceIntegrityStatus());
    };

    const showForm = status === 'not-started' || status === 'twilio-rejected' || status === 'draft';
    const showPending = status === 'pending-review';
    const showNeedsA2P = status === 'blocked-no-business-profile';

    const handleGoToA2P = () => {
        onClose();       // close VI modal
        openA2PModal();  // open A2P registration modal in its place
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-8 py-6">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-[#FFF5CC] p-2">
                            <ShieldAlert className="h-5 w-5 text-[#B58900]" />
                        </div>
                        <div>
                            <h2 className="text-[22px] font-[700] text-[#111]">
                                Voice Integrity Registration
                            </h2>
                            <p className="text-[14px] text-[#6B7280]">
                                Register your outbound numbers with T-Mobile, AT&amp;T and Verizon
                                to prevent them being labeled as "Spam Likely".
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Dismiss for now"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                            {error}
                        </p>
                    )}

                    {status === 'twilio-rejected' && rejectionReason && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                            <p className="mb-1 text-[13px] font-semibold text-red-900">
                                Twilio rejected your last submission
                            </p>
                            <p className="whitespace-pre-wrap text-[13px] text-red-700">
                                {rejectionReason}
                            </p>
                            <p className="mt-2 text-[12px] text-red-600">
                                Correct the details below and resubmit.
                            </p>
                        </div>
                    )}

                    {showNeedsA2P && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                                <div>
                                    <p className="text-[14px] font-semibold text-amber-900">
                                        Business Profile approval needed first
                                    </p>
                                    <p className="mt-1 text-[13px] text-amber-800">
                                        Voice Integrity attaches to your Business Profile.
                                        Submit the profile through A2P Registration — you
                                        don't need SMS Brand approval for Voice Integrity to
                                        unlock, just the Business Profile itself.
                                    </p>
                                </div>
                            </div>

                            <p className="text-[13px] text-[#6B7280]">
                                Once Twilio approves your Business Profile (typically 1 – 2
                                business days), Voice Integrity registration unlocks
                                automatically — even if the SMS Brand step is still pending
                                or rejected.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleGoToA2P}
                                    className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black transition-all hover:shadow-lg"
                                >
                                    Register for A2P
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {showPending && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
                                <Clock className="h-5 w-5 text-amber-700" />
                                <div>
                                    <p className="text-[14px] font-semibold text-amber-900">
                                        Submission under review
                                    </p>
                                    <p className="text-[13px] text-amber-800">
                                        Twilio and the carriers are reviewing your registration.
                                        This typically takes 24 – 48 business hours. You can keep
                                        using the platform in the meantime.
                                    </p>
                                </div>
                            </div>

                            <p className="text-[13px] text-[#6B7280]">
                                We'll automatically switch your caller-ID reputation source to
                                Twilio's per-carrier data the moment the trust product is
                                approved.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black transition-all hover:shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Checking…' : 'Check status'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'twilio-approved' && (
                        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
                            <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                            <p className="text-[14px] font-semibold text-emerald-900">
                                Your numbers are registered with the carriers.
                            </p>
                        </div>
                    )}

                    {showForm && (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                <label className="text-[12px] font-[500] text-[#6B7280]">
                                    Use case
                                </label>
                                <select
                                    name="useCase"
                                    value={formData.useCase}
                                    onChange={handleInputChange}
                                    className="bg-transparent text-[#111] outline-none"
                                >
                                    {USE_CASE_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                    <label className="text-[12px] font-[500] text-[#6B7280]">
                                        Employees
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        name="businessEmployeeCount"
                                        value={formData.businessEmployeeCount}
                                        onChange={handleInputChange}
                                        className="bg-transparent text-[#111] outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                    <label className="text-[12px] font-[500] text-[#6B7280]">
                                        Avg. calls / business day
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        name="averageBusinessDayCallVolume"
                                        value={formData.averageBusinessDayCallVolume}
                                        onChange={handleInputChange}
                                        className="bg-transparent text-[#111] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                <label className="text-[12px] font-[500] text-[#6B7280]">
                                    Notes for the carrier reviewers (optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="bg-transparent text-[#111] outline-none resize-none"
                                    placeholder="Anything the reviewers should know about your calling patterns…"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black transition-all hover:shadow-lg disabled:opacity-50"
                                >
                                    {loading
                                        ? 'Submitting…'
                                        : status === 'twilio-rejected'
                                        ? 'Resubmit for Review'
                                        : 'Submit for Review'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 bg-gray-50 px-8 py-4 text-center">
                    <p className="text-[12px] text-[#6B7280]">
                        You can continue to use calling features while your registration is
                        pending. Approval is required to remove "Spam Likely" labels.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VoiceIntegrityOnboardingModal;
