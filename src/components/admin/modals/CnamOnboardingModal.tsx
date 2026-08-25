import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ShieldCheck, X, ShieldQuestion } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    submitCnamOnboarding,
    refreshCnamStatus,
} from '@/store/slices/cnamSlice';
import type { CnamAttributes } from '@/store/slices/cnamSlice';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const CNAM_MAX = 15;

/**
 * CNAM Onboarding modal.
 *
 * Panels (mirrors backend CnamStatus):
 *   not-started / draft / twilio-rejected → display-name form
 *   pending-review                        → "under review" panel
 *   twilio-approved                       → provider hides the modal
 *   blocked-no-voice-integrity            → "complete Voice Integrity first"
 *
 * blocked-no-twilio, blocked-no-business-profile, blocked-plan-not-eligible
 * are hidden by the provider (nothing the admin can do here).
 */
const CnamOnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { status, displayName, rejectionReason, loading, error } = useAppSelector(
        (state) => state.cnam
    );
    const [formData, setFormData] = useState<CnamAttributes>({
        displayName: '',
        useCase: 'sales_dialer',
        notes: '',
    });

    // Seed the form with the last-submitted display name when transitioning
    // into a rejected state so the admin can tweak instead of retyping.
    useEffect(() => {
        if (status === 'twilio-rejected' && displayName) {
            setFormData((prev) => ({ ...prev, displayName }));
        }
    }, [status, displayName]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'displayName' ? value.slice(0, CNAM_MAX) : value,
        }));
    };

    const handleSubmit = async () => {
        await dispatch(submitCnamOnboarding(formData));
    };

    const handleRefresh = () => dispatch(refreshCnamStatus());

    const showForm =
        status === 'not-started' || status === 'twilio-rejected' || status === 'draft';
    const showPending = status === 'pending-review';
    const showBlockedByVI = status === 'blocked-no-voice-integrity';

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-8 py-6">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-[#E6F4EA] p-2">
                            <ShieldCheck className="h-5 w-5 text-[#0F7A3D]" />
                        </div>
                        <div>
                            <h2 className="text-[22px] font-[700] text-[#111]">
                                Branded Caller Name (CNAM)
                            </h2>
                            <p className="text-[14px] text-[#6B7280]">
                                Register the business name that appears alongside your number on
                                the recipient's phone.
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
                                Twilio rejected your CNAM registration
                            </p>
                            <p className="whitespace-pre-wrap text-[13px] text-red-700">
                                {rejectionReason}
                            </p>
                            <p className="mt-2 text-[12px] text-red-600">
                                Adjust the display name below and resubmit.
                            </p>
                        </div>
                    )}

                    {showBlockedByVI && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <ShieldQuestion className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                                <div>
                                    <p className="text-[14px] font-semibold text-amber-900">
                                        Voice Integrity approval is required first
                                    </p>
                                    <p className="mt-1 text-[13px] text-amber-800">
                                        Carriers use Voice Integrity to verify your number's
                                        spam-label reputation before honoring a branded name.
                                        Once Voice Integrity is approved, CNAM registration
                                        unlocks automatically.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 transition-all hover:bg-gray-200"
                            >
                                Got it
                            </button>
                        </div>
                    )}

                    {showPending && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
                                <Clock className="h-5 w-5 text-amber-700" />
                                <div>
                                    <p className="text-[14px] font-semibold text-amber-900">
                                        Under review
                                    </p>
                                    <p className="text-[13px] text-amber-800">
                                        Twilio is reviewing your CNAM registration. Approval
                                        typically takes 1 – 3 business days. Your display name
                                        will be pushed to the carriers once approved.
                                    </p>
                                </div>
                            </div>

                            {displayName && (
                                <p className="text-[13px] text-[#6B7280]">
                                    Submitted display name:{' '}
                                    <span className="font-semibold text-[#111]">{displayName}</span>
                                </p>
                            )}

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
                                CNAM registered. Recipients now see your branded name.
                            </p>
                        </div>
                    )}

                    {showForm && (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                <label className="text-[12px] font-[500] text-[#6B7280]">
                                    Display name (max {CNAM_MAX} characters)
                                </label>
                                <input
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    maxLength={CNAM_MAX}
                                    className="bg-transparent text-[#111] outline-none uppercase tracking-wide"
                                    placeholder="SLINGVO REALTY"
                                />
                                <p className="text-[11px] text-[#9CA3AF]">
                                    {formData.displayName.length}/{CNAM_MAX} characters. This is
                                    exactly what recipients will see next to your number.
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                <label className="text-[12px] font-[500] text-[#6B7280]">
                                    Use case
                                </label>
                                <select
                                    name="useCase"
                                    value={formData.useCase}
                                    onChange={handleChange}
                                    className="bg-transparent text-[#111] outline-none"
                                >
                                    <option value="sales_dialer">Sales / Outbound Dialer</option>
                                    <option value="customer_care">Customer Care</option>
                                    <option value="appointment_reminders">Appointment Reminders</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1 rounded-[12px] bg-[#F3F4F6] px-4 py-2">
                                <label className="text-[12px] font-[500] text-[#6B7280]">
                                    Notes for reviewers (optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="bg-transparent text-[#111] outline-none resize-none"
                                    placeholder="Anything the reviewers should know…"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.displayName.trim()}
                                    className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black transition-all hover:shadow-lg disabled:opacity-50"
                                >
                                    {loading
                                        ? 'Submitting…'
                                        : status === 'twilio-rejected'
                                        ? 'Resubmit CNAM'
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
                        You can continue to use calling features while your CNAM registration is
                        under review.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CnamOnboardingModal;
