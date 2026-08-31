import { useA2P } from '@/providers/a2p.provider';
import { useVoiceIntegrity } from '@/providers/voiceIntegrity.provider';
import { useCnam } from '@/providers/cnam.provider';
import { useAppSelector } from '@/store/hooks';
import type { BrandStageState, CampaignStageState, StageState } from '@/store/slices/a2pSlice';

/**
 * Unified Deliverability & Trust settings panel — one card per registration
 * (A2P, Voice Integrity, CNAM). Each card renders a status badge, a
 * description, an optional rejection reason banner, and an action button
 * that opens the appropriate onboarding modal.
 *
 * The A2P card renders a 3-row checklist (Business Profile → Brand →
 * Campaign) so users see which stage failed and what they can do about
 * it — instead of a single "A2P rejected" rollup. Voice Integrity and
 * CNAM read `unblocksDownstream` off the A2P slice to know whether they
 * can proceed regardless of Brand / Campaign state.
 */
const DeliverabilityPanel = () => {
    const vi = useVoiceIntegrity();
    const cnam = useCnam();
    const a2pState = useAppSelector((s) => s.a2p);
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

            {/* Card 1 — A2P — stage checklist */}
            <A2PStageCard />

            {/* Card 2 — Voice Integrity */}
            <SettingCard
                title="Voice Integrity"
                description="Registers your numbers with T-Mobile, AT&T, and Verizon so they aren't labeled 'Spam Likely' on recipients' phones."
                status={viStatusMeta(vi.status)}
                rejectionReason={viRejectionReason}
                planLocked={vi.status === 'blocked-plan-not-eligible'}
                prerequisiteLocked={
                    vi.status === 'blocked-no-business-profile' &&
                    !a2pState.unblocksDownstream.voiceIntegrity
                }
                prerequisiteHint="Submit your Business Profile via A2P Registration first — SMS Brand approval is not required for Voice Integrity."
                pendingLocked={vi.status === 'pending-review'}
                pendingHint="Twilio and the carriers are reviewing your Voice Integrity submission. Approval typically takes 24–48 business hours. Once approved, your numbers will be flagged as branded-caller across T-Mobile, AT&T, and Verizon."
                actionLabel={viActionLabel(vi.status)}
                onAction={vi.openModal}
            />

            {/* Card 3 — CNAM */}
            <SettingCard
                title="Branded Caller Name (CNAM)"
                description="Registers a 15-character business name that appears alongside your number on recipients' phones."
                status={cnamStatusMeta(cnam.status)}
                rejectionReason={cnamRejectionReason}
                planLocked={cnam.status === 'blocked-plan-not-eligible'}
                prerequisiteLocked={
                    (cnam.status === 'blocked-no-business-profile' &&
                        !a2pState.unblocksDownstream.cnam) ||
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
                    cnamDisplayName ? `Display name: "${cnamDisplayName}"` : undefined
                }
                actionLabel={cnamActionLabel(cnam.status)}
                onAction={cnam.openModal}
            />
        </div>
    );
};

// -----------------------------------------------------------------------------
// A2P Stage Card — 3-row checklist
// -----------------------------------------------------------------------------

const A2PStageCard = () => {
    const a2p = useA2P();
    const state = useAppSelector((s) => s.a2p);
    const { stages, unblocksDownstream, status: overallStatus, customerProfileApproved } = state;

    const overall = overallStatusMeta(overallStatus);
    const notStarted = overallStatus === 'NOT_STARTED';

    return (
        <div className="rounded-[12px] bg-white p-6 shadow-sm dark:bg-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-[18px] font-semibold text-[#17181B] dark:text-white">
                        A2P Registration
                    </h3>
                    <p className="mt-1 max-w-3xl text-[14px] text-[#495057] dark:text-gray-400">
                        Registers your business with the carriers so you can send SMS. Also
                        produces the Business Profile that Voice Integrity and CNAM attach to.
                    </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${overall.className}`}>
                    {overall.label}
                </span>
            </div>

            {notStarted ? (
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={a2p.openModal}
                        className="rounded-[10px] bg-[#FFCA06] px-4 py-3 text-[14px] font-medium text-black hover:bg-[#e5b605]"
                    >
                        Open A2P Form
                    </button>
                </div>
            ) : (
                <>
                    <ul className="mt-5 space-y-3">
                        <StageRow
                            title="Business Profile"
                            stage={stages.customerProfile}
                            approvedLabel="Approved"
                            onFix={a2p.openResubmitCP}
                            fixLabel="Fix and resubmit"
                        />
                        <StageRow
                            title="Brand (TCR)"
                            stage={stages.brand}
                            approvedLabel="Approved"
                            waitingFor={!customerProfileApproved ? 'Waiting for Business Profile' : null}
                            onFix={a2p.openResubmitBrand}
                            fixLabel="Fix and resubmit"
                            fixSuffix={` — $${stages.brand.resubmitFeeUsd} TCR fee`}
                        />
                        <StageRow
                            title="Campaign"
                            stage={stages.campaign}
                            approvedLabel="Verified"
                            waitingFor={
                                stages.brand.status !== 'APPROVED'
                                    ? 'Waiting for brand approval'
                                    : null
                            }
                            onFix={a2p.openResubmitCampaign}
                            fixLabel="Fix and resubmit"
                        />
                    </ul>

                    {customerProfileApproved && (unblocksDownstream.voiceIntegrity || unblocksDownstream.cnam) && (
                        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                            Voice Integrity and CNAM can proceed — your Business Profile is approved.
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

interface StatusMeta {
    label: string;
    className: string;
    icon: string;
}

const StageRow: React.FC<{
    title: string;
    stage: StageState | BrandStageState | CampaignStageState;
    approvedLabel: string;
    waitingFor?: string | null;
    onFix: () => void;
    fixLabel: string;
    fixSuffix?: string;
}> = ({ title, stage, approvedLabel, waitingFor, onFix, fixLabel, fixSuffix = '' }) => {
    const meta = stageRowMeta(stage.status, approvedLabel, waitingFor ?? null);
    const isRejected = meta.icon === '❌';
    const isTerminal = isRejected && stage.retriable === false;

    return (
        <li className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3 sm:flex-row sm:items-start sm:justify-between dark:border-slate-700">
            <div className="flex items-start gap-3">
                <span className="text-[16px] leading-6">{meta.icon}</span>
                <div>
                    <p className="text-[14px] font-medium text-[#17181B] dark:text-white">{title}</p>
                    <p className={`text-[13px] ${isRejected ? 'text-red-700 dark:text-red-300' : 'text-[#6B7280]'}`}>
                        {meta.label}
                        {isRejected && stage.message ? ` — ${stage.message}` : ''}
                    </p>
                    {waitingFor && !stage.status && (
                        <p className="text-[12px] text-[#6B7280]">{waitingFor}</p>
                    )}
                </div>
            </div>
            {isRejected && (
                <div className="flex flex-col items-end gap-1">
                    {isTerminal ? (
                        <span className="text-[12px] text-[#6B7280]">
                            Not retriable — contact support
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={onFix}
                            className="rounded-[8px] bg-[#FFCA06] px-3 py-1.5 text-[13px] font-medium text-black hover:bg-[#e5b605]"
                        >
                            {fixLabel}
                        </button>
                    )}
                    {!isTerminal && fixSuffix && (
                        <span className="text-[11px] text-[#6B7280]">{fixSuffix.replace(/^ — /, '')}</span>
                    )}
                </div>
            )}
        </li>
    );
};

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
        ? { label: 'Not on your plan', className: 'bg-gray-100 text-gray-600', icon: '' }
        : prerequisiteLocked
        ? { label: 'Locked', className: 'bg-gray-100 text-gray-600', icon: '' }
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

// -----------------------------------------------------------------------------
// Status → row/badge mapping
// -----------------------------------------------------------------------------

function overallStatusMeta(status: string): StatusMeta {
    switch (status) {
        case 'PENDING':  return { label: 'In progress', className: 'bg-amber-100 text-amber-700', icon: '⏳' };
        case 'APPROVED': return { label: 'Approved',    className: 'bg-emerald-100 text-emerald-700', icon: '✅' };
        case 'REJECTED': return { label: 'Needs attention', className: 'bg-red-100 text-red-700', icon: '❌' };
        default:         return { label: 'Not started', className: 'bg-gray-100 text-gray-700', icon: '' };
    }
}

/**
 * Maps a per-stage raw status string to the row's icon and short label.
 * CP + Brand + Campaign each use their own Twilio-side enum, so the
 * function walks all three vocabularies.
 */
function stageRowMeta(
    status: string | null,
    approvedLabel: string,
    waitingFor: string | null,
): { label: string; icon: string } {
    if (!status) return { label: waitingFor ?? 'Not submitted yet', icon: '⏸' };
    switch (status) {
        case 'twilio-approved':
        case 'APPROVED':
        case 'VERIFIED':
            return { label: approvedLabel, icon: '✅' };
        case 'twilio-rejected':
        case 'FAILED':
            return { label: 'Rejected', icon: '❌' };
        case 'draft':
        case 'pending-review':
        case 'in-review':
        case 'PENDING':
        case 'IN_REVIEW':
        case 'IN_PROGRESS':
            return { label: 'Under review', icon: '⏳' };
        case 'SUSPENDED':
            return { label: 'Suspended', icon: '❌' };
        default:
            return { label: status, icon: '⏳' };
    }
}

function viStatusMeta(status: string): StatusMeta {
    switch (status) {
        case 'pending-review':   return { label: 'Pending review', className: 'bg-amber-100 text-amber-700', icon: '' };
        case 'twilio-approved':  return { label: 'Approved',       className: 'bg-emerald-100 text-emerald-700', icon: '' };
        case 'twilio-rejected':  return { label: 'Needs update',   className: 'bg-red-100 text-red-700', icon: '' };
        default:                 return { label: 'Not started',    className: 'bg-gray-100 text-gray-700', icon: '' };
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
        case 'pending-review':  return { label: 'Pending review', className: 'bg-amber-100 text-amber-700', icon: '' };
        case 'twilio-approved': return { label: 'Approved',       className: 'bg-emerald-100 text-emerald-700', icon: '' };
        case 'twilio-rejected': return { label: 'Needs update',   className: 'bg-red-100 text-red-700', icon: '' };
        default:                return { label: 'Not started',    className: 'bg-gray-100 text-gray-700', icon: '' };
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
