import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellRing, CheckCircle2, Circle, X } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * A small reminder — not a form. Lists the deliverability setups the admin
 * still needs to complete (A2P / VI / CNAM) with their current statuses,
 * then hands them a single "Go to Settings" button to actually do the work.
 *
 * The actual onboarding forms live in the settings panel and open via each
 * feature's own modal from there. This one just nudges.
 */
const DeliverabilityReminderModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const a2pStatus = useAppSelector((s) => s.a2p.status);
    const viStatus = useAppSelector((s) => s.voiceIntegrity.status);
    const cnamStatus = useAppSelector((s) => s.cnam.status);

    if (!isOpen) return null;

    const rows = [
        {
            title: 'A2P Registration',
            subtitle: 'Business Profile for SMS + trust chain',
            state: a2pRowState(a2pStatus),
        },
        {
            title: 'Voice Integrity',
            subtitle: 'Prevents "Spam Likely" labels on your calls',
            state: viRowState(viStatus),
        },
        {
            title: 'Branded Caller Name (CNAM)',
            subtitle: 'Shows your business name on recipients\' phones',
            state: cnamRowState(cnamStatus),
        },
    ];

    const goToSettings = () => {
        onClose();
        navigate('/admin/system-settings', { state: { tab: 'Deliverability & Trust' } });
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-[#FFF5CC] p-2">
                            <BellRing className="h-5 w-5 text-[#B58900]" />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-[700] text-[#111]">
                                Finish your deliverability setup
                            </h2>
                            <p className="text-[13px] text-[#6B7280]">
                                A few registrations still need attention.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Dismiss"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <ul className="divide-y divide-gray-100">
                    {rows.map((row) => (
                        <li key={row.title} className="flex items-center gap-3 px-6 py-4">
                            {row.state.done ? (
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                            ) : (
                                <Circle className="h-5 w-5 shrink-0 text-gray-300" />
                            )}
                            <div className="flex-1">
                                <p className="text-[14px] font-semibold text-[#111]">{row.title}</p>
                                <p className="text-[12px] text-[#6B7280]">{row.subtitle}</p>
                            </div>
                            <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${row.state.badge.className}`}
                            >
                                {row.state.badge.label}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                    <button
                        onClick={goToSettings}
                        className="flex-1 rounded-xl bg-[#FFCA06] py-3 font-semibold text-black transition-all hover:shadow-lg"
                    >
                        Go to Settings
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-200"
                    >
                        Remind me later
                    </button>
                </div>
            </div>
        </div>
    );
};

interface RowState {
    done: boolean;
    badge: { label: string; className: string };
}

function a2pRowState(status: string): RowState {
    switch (status) {
        case 'APPROVED': return { done: true, badge: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700' } };
        case 'PENDING':  return { done: false, badge: { label: 'Pending review', className: 'bg-amber-100 text-amber-700' } };
        case 'REJECTED': return { done: false, badge: { label: 'Needs update', className: 'bg-red-100 text-red-700' } };
        default:         return { done: false, badge: { label: 'Not started', className: 'bg-gray-100 text-gray-700' } };
    }
}

function viRowState(status: string): RowState {
    switch (status) {
        case 'twilio-approved':          return { done: true, badge: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700' } };
        case 'pending-review':           return { done: false, badge: { label: 'Pending review', className: 'bg-amber-100 text-amber-700' } };
        case 'twilio-rejected':          return { done: false, badge: { label: 'Needs update', className: 'bg-red-100 text-red-700' } };
        case 'blocked-plan-not-eligible':return { done: true, badge: { label: 'Not on your plan', className: 'bg-gray-100 text-gray-600' } };
        case 'blocked-no-twilio':
        case 'blocked-no-business-profile': return { done: false, badge: { label: 'Locked', className: 'bg-gray-100 text-gray-600' } };
        default:                         return { done: false, badge: { label: 'Not started', className: 'bg-gray-100 text-gray-700' } };
    }
}

function cnamRowState(status: string): RowState {
    switch (status) {
        case 'twilio-approved':          return { done: true, badge: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700' } };
        case 'pending-review':           return { done: false, badge: { label: 'Pending review', className: 'bg-amber-100 text-amber-700' } };
        case 'twilio-rejected':          return { done: false, badge: { label: 'Needs update', className: 'bg-red-100 text-red-700' } };
        case 'blocked-plan-not-eligible':return { done: true, badge: { label: 'Not on your plan', className: 'bg-gray-100 text-gray-600' } };
        case 'blocked-no-twilio':
        case 'blocked-no-business-profile':
        case 'blocked-no-voice-integrity': return { done: false, badge: { label: 'Locked', className: 'bg-gray-100 text-gray-600' } };
        default:                         return { done: false, badge: { label: 'Not started', className: 'bg-gray-100 text-gray-700' } };
    }
}

export default DeliverabilityReminderModal;
