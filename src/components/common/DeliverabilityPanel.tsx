import { useA2P } from '@/providers/a2p.provider';
import { useVoiceIntegrity } from '@/providers/voiceIntegrity.provider';
import { useCnam } from '@/providers/cnam.provider';
import { useAppSelector } from '@/store/hooks';

/**
 * Unified Deliverability & Trust settings panel — one card per registration
 * (A2P, Voice Integrity, CNAM). Each card renders a status badge, a
 * description, an optional rejection reason banner, and an action button
 * that opens the appropriate onboarding modal.
 *
 * The cards render in dependency order (A2P → VI → CNAM). Later cards show
 * a locked "complete previous step first" state until their prerequisites
 * are met.
 */
const DeliverabilityPanel = () => {
    const a2p = useA2P();
    const vi = useVoiceIntegrity();
    const cnam = useCnam();
    const a2pRejectionReason = useAppSelector((s) => s.a2p.rejectionReason);
    const viRejectionReason = useAppSelector((s) => s.voiceIntegrity.rejectionReason);
    const cnamRejectionReason = useAppSelector((s) => s.cnam.rejectionReason);
    const cnamDisplayName = useAppSelector((s) => s.cnam.displayName);

    return (
        <div className="space-y-6">
            <div className="rounded-[12px] bg-white p-6 shadow-sm dark:bg-slate-800">
                <h2 className="text-[24px] font-medium text-[#17181B] dark:text-white">
                    Deliverability &amp; Trust
                </h2>
                <p className="mt-1 text-[14px] text-[#495057] dark:text-gray-400">
                    Register your business and phone numbers with the carriers so calls and
                    messages get through, and your brand appears on the recipient's phone.
                </p>
            </div>

            {/* Card 1 — A2P (universal, no plan gate) */}
            <SettingCard
                title="A2P Registration"
                description="Registers your business with the carriers so you can send SMS. Also produces the Business Profile that Voice Integrity and CNAM attach to."
                status={a2pStatusMeta(a2p.status)}
                rejectionReason={a2pRejectionReason}
                planLocked={false}
                prerequisiteLocked={false}
                pendingLocked={a2p.status === 'PENDING'}
                pendingHint="Twilio is reviewing your Business Profile. This typically takes 1–2 business days. Please wait for the review to complete before making changes — resubmitting while review is in progress can create a duplicate profile that Twilio will auto-reject."
                actionLabel={a2pActionLabel(a2p.status)}
                onAction={a2p.openModal}
            />

            {/* Card 2 — Voice Integrity (gated on advancedDeliverabilityEnabled + A2P approved) */}
            <SettingCard
                title="Voice Integrity"
                description="Registers your numbers with T-Mobile, AT&T, and Verizon so they aren't labeled 'Spam Likely' on recipients' phones."
                status={viStatusMeta(vi.status)}
                rejectionReason={viRejectionReason}
                planLocked={vi.status === 'blocked-plan-not-eligible'}
                prerequisiteLocked={vi.status === 'blocked-no-business-profile'}
                prerequisiteHint="Submit your Business Profile via A2P Registration first — SMS Brand approval is not required for Voice Integrity."
                pendingLocked={vi.status === 'pending-review'}
                pendingHint="Twilio and the carriers are reviewing your Voice Integrity submission. Approval typically takes 24–48 business hours. Once approved, your numbers will be flagged as branded-caller across T-Mobile, AT&T, and Verizon."
                actionLabel={viActionLabel(vi.status)}
                onAction={vi.openModal}
            />

            {/* Card 3 — CNAM (gated on plan + VI approved) */}
            <SettingCard
                title="Branded Caller Name (CNAM)"
                description="Registers a 15-character business name that appears alongside your number on recipients' phones."
                status={cnamStatusMeta(cnam.status)}
                rejectionReason={cnamRejectionReason}
                planLocked={cnam.status === 'blocked-plan-not-eligible'}
                prerequisiteLocked={
                    cnam.status === 'blocked-no-business-profile' ||
                    cnam.status === 'blocked-no-voice-integrity'
                }
                prerequisiteHint={
                    cnam.status === 'blocked-no-business-profile'
                        ? 'Submit your Business Profile via A2P Registration first — SMS Brand approval is not required.'
                        : 'Complete Voice Integrity registration first.'
                }
                pendingLocked={cnam.status === 'pending-review'}
                pendingHint="Twilio is reviewing your CNAM registration. Approval typically takes 24–48 business hours. Once approved, your business name will display alongside your number on recipients' phones."
                extraLine={
                    cnamDisplayName ? `Display name: “${cnamDisplayName}”` : undefined
                }
                actionLabel={cnamActionLabel(cnam.status)}
                onAction={cnam.openModal}
            />
        </div>
    );
};

// ---------- Sub-component ---------------------------------------------------

interface StatusMeta {
    label: string;
    className: string;
}

const SettingCard: React.FC<{
    title: string;
    description: string;
    status: StatusMeta;
    rejectionReason?: string | null;
    planLocked: boolean;
    prerequisiteLocked: boolean;
    prerequisiteHint?: string;
    // pendingLocked disables the action button when the registration is
    // currently under Twilio review. Two reasons this matters:
    //   1. Nothing the user can do until Twilio decides — clicking through
    //      to the modal only invites confusion.
    //   2. Resubmitting a Customer Profile while the previous one is still
    //      in-review creates a duplicate that Twilio's registry lookup
    //      auto-rejects in seconds, which then leaks back to the user as
    //      "rejected" even though the original submission is still viable.
    pendingLocked?: boolean;
    pendingHint?: string;
    extraLine?: string;
    actionLabel: string;
    onAction: () => void;
}> = ({
    title,
    description,
    status,
    rejectionReason,
    planLocked,
    prerequisiteLocked,
    prerequisiteHint,
    pendingLocked,
    pendingHint,
    extraLine,
    actionLabel,
    onAction,
}) => {
    const disabled = planLocked || prerequisiteLocked || !!pendingLocked;
    const finalStatus = planLocked
        ? { label: 'Not on your plan', className: 'bg-gray-100 text-gray-600' }
        : prerequisiteLocked
        ? { label: 'Locked', className: 'bg-gray-100 text-gray-600' }
        : status;

    return (
        <div className="rounded-[12px] bg-white p-6 shadow-sm dark:bg-slate-800">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-[18px] font-semibold text-[#17181B] dark:text-white">
                            {title}
                        </h3>
                        <span
                            className={`rounded-full px-3 py-1 text-[12px] font-medium ${finalStatus.className}`}
                        >
                            {finalStatus.label}
                        </span>
                    </div>

                    <p className="max-w-3xl text-[14px] text-[#495057] dark:text-gray-400">
                        {description}
                    </p>

                    {extraLine && (
                        <p className="text-[13px] text-[#6B7280]">{extraLine}</p>
                    )}

                    {rejectionReason && !planLocked && !prerequisiteLocked && !pendingLocked && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700 dark:bg-red-950/30 dark:text-red-300">
                            {rejectionReason}
                        </p>
                    )}

                    {planLocked && (
                        <p className="text-[13px] text-[#6B7280]">
                            Available on premium plans. Upgrade to unlock.
                        </p>
                    )}

                    {prerequisiteLocked && prerequisiteHint && (
                        <p className="text-[13px] text-[#6B7280]">{prerequisiteHint}</p>
                    )}

                    {pendingLocked && pendingHint && (
                        <p className="rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                            {pendingHint}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onAction}
                    disabled={disabled}
                    title={pendingLocked ? 'Waiting for Twilio review to complete' : undefined}
                    className={`rounded-[10px] px-4 py-3 text-[14px] font-medium transition-colors ${
                        disabled
                            ? 'cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
                            : 'bg-[#FFCA06] text-black hover:bg-[#e5b605]'
                    }`}
                >
                    {actionLabel}
                </button>
            </div>
        </div>
    );
};

// ---------- Status → Badge mapping helpers ---------------------------------

function a2pStatusMeta(status: string): StatusMeta {
    switch (status) {
        case 'PENDING':  return { label: 'Pending review', className: 'bg-amber-100 text-amber-700' };
        case 'APPROVED': return { label: 'Approved',       className: 'bg-emerald-100 text-emerald-700' };
        case 'REJECTED': return { label: 'Needs update',   className: 'bg-red-100 text-red-700' };
        default:         return { label: 'Not started',    className: 'bg-gray-100 text-gray-700' };
    }
}

function a2pActionLabel(status: string): string {
    switch (status) {
        case 'PENDING':  return 'Awaiting Twilio Review';
        case 'APPROVED': return 'Approved';
        case 'REJECTED': return 'Re-open A2P Form';
        default:         return 'Open A2P Form';
    }
}

function viStatusMeta(status: string): StatusMeta {
    switch (status) {
        case 'pending-review':   return { label: 'Pending review', className: 'bg-amber-100 text-amber-700' };
        case 'twilio-approved':  return { label: 'Approved',       className: 'bg-emerald-100 text-emerald-700' };
        case 'twilio-rejected':  return { label: 'Needs update',   className: 'bg-red-100 text-red-700' };
        default:                 return { label: 'Not started',    className: 'bg-gray-100 text-gray-700' };
    }
}

function viActionLabel(status: string): string {
    switch (status) {
        case 'pending-review':  return 'Awaiting Twilio Review';
        case 'twilio-approved': return 'Approved';
        case 'twilio-rejected': return 'Resubmit';
        default:                return 'Set up Voice Integrity';
    }
}

function cnamStatusMeta(status: string): StatusMeta {
    switch (status) {
        case 'pending-review':  return { label: 'Pending review', className: 'bg-amber-100 text-amber-700' };
        case 'twilio-approved': return { label: 'Approved',       className: 'bg-emerald-100 text-emerald-700' };
        case 'twilio-rejected': return { label: 'Needs update',   className: 'bg-red-100 text-red-700' };
        default:                return { label: 'Not started',    className: 'bg-gray-100 text-gray-700' };
    }
}

function cnamActionLabel(status: string): string {
    switch (status) {
        case 'pending-review':  return 'Awaiting Twilio Review';
        case 'twilio-approved': return 'Approved';
        case 'twilio-rejected': return 'Resubmit CNAM';
        default:                return 'Set up CNAM';
    }
}

export default DeliverabilityPanel;
