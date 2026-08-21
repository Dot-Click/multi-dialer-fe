import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchVoiceIntegrityStatus } from '@/store/slices/voiceIntegritySlice';
import type { VoiceIntegrityStatus } from '@/store/slices/voiceIntegritySlice';
import VoiceIntegrityOnboardingModal from '@/components/admin/modals/VoiceIntegrityOnboardingModal';

interface VoiceIntegrityContextType {
    status: VoiceIntegrityStatus;
    /** True while the modal is being shown to the user. */
    isModalOpen: boolean;
    /** Reopen the modal after the user dismissed it (e.g. from a settings link). */
    openModal: () => void;
}

const VoiceIntegrityContext = createContext<VoiceIntegrityContextType | undefined>(undefined);

/**
 * Wraps the authenticated ADMIN-scoped routes. On mount / auth change it
 * fetches the current Voice Integrity status and — until the trust product
 * is approved — keeps the onboarding modal on screen every visit.
 *
 * Auto-open rules (per product requirement "modal should prompt until they
 * don't get approved"):
 *   not-started    → modal open, form shown
 *   draft          → modal open, form shown (resumable partial onboarding)
 *   pending-review → modal open, "under review" panel shown
 *   twilio-rejected → modal open, Twilio's exact rejection reason + form
 *   twilio-approved → modal hidden
 *
 * The user only sees this on admin routes. Agents don't own the trust
 * product; they get no modal.
 */
export const VoiceIntegrityProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { status, lastFetchedAt } = useAppSelector((state) => state.voiceIntegrity);
    // Session-scoped dismiss flag: the user pressed Cancel this session. Cleared
    // on logout (auth flips false), so the modal re-prompts on next login —
    // that keeps the "prompt until approved" spirit without trapping the user
    // in the modal for a full 24-48h review window.
    const [dismissedThisSession, setDismissedThisSession] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchVoiceIntegrityStatus());
        } else {
            setDismissedThisSession(false);
        }
    }, [isAuthenticated, dispatch]);

    // If the status transitions back into a state that needs action (e.g. from
    // pending → rejected), re-prompt even if the user dismissed earlier.
    useEffect(() => {
        if (status === 'twilio-rejected') {
            setDismissedThisSession(false);
        }
    }, [status]);

    const isModalOpen = useMemo(() => {
        if (!isAuthenticated) return false;
        if (lastFetchedAt === null) return false;
        if (dismissedThisSession) return false;
        return status !== 'twilio-approved';
    }, [isAuthenticated, lastFetchedAt, dismissedThisSession, status]);

    const openModal = () => setDismissedThisSession(false);
    const handleClose = () => setDismissedThisSession(true);

    return (
        <VoiceIntegrityContext.Provider value={{ status, isModalOpen, openModal }}>
            {children}
            {isAuthenticated && (
                <VoiceIntegrityOnboardingModal isOpen={isModalOpen} onClose={handleClose} />
            )}
        </VoiceIntegrityContext.Provider>
    );
};

export const useVoiceIntegrity = () => {
    const context = useContext(VoiceIntegrityContext);
    if (context === undefined) {
        throw new Error('useVoiceIntegrity must be used within a VoiceIntegrityProvider');
    }
    return context;
};
