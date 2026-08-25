import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import DeliverabilityReminderModal from '@/components/admin/modals/DeliverabilityReminderModal';

/**
 * Auto-opens a lightweight reminder modal on login when the admin still has
 * deliverability setup pending (A2P not approved, or VI/CNAM available on
 * their plan but not yet done).
 *
 * The reminder is NOT the form — it's just a nudge. Its "Go to Settings"
 * button deep-links to the Deliverability & Trust settings panel, where the
 * actual onboarding modals live behind action buttons.
 *
 * Behavior:
 *   - Opens once per session, after each provider's first status fetch has
 *     completed (so we don't flash open with initial "not-started" state).
 *   - Dismissable per session; re-appears on next login/reload.
 *   - Skipped entirely when there's nothing actionable — either everything
 *     is approved, or the pending items are hard-locked (plan / ops).
 *   - Never re-opens if the admin is already on the Deliverability tab
 *     (they've clearly seen the message).
 */
export const DeliverabilityReminderProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isAuthenticated } = useAppSelector((s) => s.auth);
    const a2p = useAppSelector((s) => s.a2p);
    const vi = useAppSelector((s) => s.voiceIntegrity);
    const cnam = useAppSelector((s) => s.cnam);
    const location = useLocation();
    const [dismissedThisSession, setDismissedThisSession] = useState(false);

    // Reset the session-dismiss flag on logout so the reminder returns after
    // the next login.
    useEffect(() => {
        if (!isAuthenticated) setDismissedThisSession(false);
    }, [isAuthenticated]);

    const isOpen = useMemo(() => {
        if (!isAuthenticated) return false;
        if (dismissedThisSession) return false;

        // Skip on the Deliverability settings tab — user is already there.
        const onSettings =
            location.pathname === '/admin/system-settings' &&
            (location.state as any)?.tab === 'Deliverability & Trust';
        if (onSettings) return false;

        // Only decide after every provider has done its first fetch. Any of
        // them still null means we're not sure yet — hold off.
        if (
            vi.lastFetchedAt === null ||
            cnam.lastFetchedAt === null
        ) {
            return false;
        }

        return isAnyActionable(a2p.status, vi.status, cnam.status);
    }, [
        isAuthenticated,
        dismissedThisSession,
        location.pathname,
        location.state,
        a2p.status,
        vi.status,
        vi.lastFetchedAt,
        cnam.status,
        cnam.lastFetchedAt,
    ]);

    const handleClose = () => setDismissedThisSession(true);

    return (
        <>
            {children}
            {isAuthenticated && (
                <DeliverabilityReminderModal isOpen={isOpen} onClose={handleClose} />
            )}
        </>
    );
};

/**
 * "Actionable" = the admin can do something about this setup right now.
 * Approved → done. Plan-locked → they'd need to upgrade, not something we
 * nudge here. Prerequisite-locked → they can't act on this ONE, but they
 * can act on whatever comes before it, so surface the reminder if any of
 * A2P/VI/CNAM is genuinely open.
 */
function isAnyActionable(a2p: string, vi: string, cnam: string): boolean {
    return (
        isA2PActionable(a2p) ||
        isViActionable(vi) ||
        isCnamActionable(cnam)
    );
}

function isA2PActionable(status: string): boolean {
    return status === 'NOT_STARTED' || status === 'REJECTED';
}

function isViActionable(status: string): boolean {
    return status === 'not-started' || status === 'draft' || status === 'twilio-rejected';
}

function isCnamActionable(status: string): boolean {
    return status === 'not-started' || status === 'draft' || status === 'twilio-rejected';
}
