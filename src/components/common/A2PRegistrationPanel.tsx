import { useA2P } from '@/providers/a2p.provider';
import { useAppSelector } from '@/store/hooks';

const statusCopy = {
  NOT_STARTED: {
    badge: 'Not started',
    badgeClassName: 'bg-gray-100 text-gray-700',
    title: 'A2P registration is optional',
    description: 'You can keep using calling features without this form. Complete it when you want to enable compliant SMS registration.',
    actionLabel: 'Open A2P Form',
    canOpen: true,
  },
  PENDING: {
    badge: 'Pending review',
    badgeClassName: 'bg-amber-100 text-amber-700',
    title: 'Your registration is under review',
    description: 'Your A2P submission has already been sent. Messaging stays locked until the carrier approves it.',
    actionLabel: 'Submission in Review',
    canOpen: false,
  },
  APPROVED: {
    badge: 'Approved',
    badgeClassName: 'bg-emerald-100 text-emerald-700',
    title: 'SMS registration is approved',
    description: 'Your company is approved for A2P messaging. No additional action is needed here.',
    actionLabel: 'Approved',
    canOpen: false,
  },
  REJECTED: {
    badge: 'Needs update',
    badgeClassName: 'bg-red-100 text-red-700',
    title: 'Your last submission needs changes',
    description: 'Open the form again to correct the registration details and resubmit for review.',
    actionLabel: 'Re-open A2P Form',
    canOpen: true,
  },
} as const;

const A2PRegistrationPanel = () => {
  const { status, openModal } = useA2P();
  const { rejectionReason } = useAppSelector((state) => state.a2p);
  const details = statusCopy[status as keyof typeof statusCopy] ?? statusCopy.NOT_STARTED;

  return (
    <div className="rounded-[12px] bg-white p-6 shadow-sm dark:bg-slate-800">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[24px] font-medium text-[#17181B] dark:text-white">A2P SMS Registration</h2>
            <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${details.badgeClassName}`}>
              {details.badge}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-[16px] font-medium text-[#34363B] dark:text-gray-200">{details.title}</p>
            <p className="max-w-3xl text-[14px] text-[#495057] dark:text-gray-400">{details.description}</p>
            {status === 'REJECTED' && rejectionReason && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700 dark:bg-red-950/30 dark:text-red-300">
                Rejection reason: {rejectionReason}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={openModal}
          disabled={!details.canOpen}
          className={`rounded-[10px] px-4 py-3 text-[14px] font-medium transition-colors ${
            details.canOpen
              ? 'bg-[#FFCA06] text-black hover:bg-[#e5b605]'
              : 'cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
          }`}
        >
          {details.actionLabel}
        </button>
      </div>
    </div>
  );
};

export default A2PRegistrationPanel;
