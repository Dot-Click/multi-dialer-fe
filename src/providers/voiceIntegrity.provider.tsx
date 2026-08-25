import React, { createContext, useContext, useEffect, useState } from 'react';
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
    const { status } = useAppSelector((state) => state.voiceIntegrity);
    // The form modal no longer auto-opens on login — the lightweight
    // DeliverabilityReminderModal drives the nudge. This modal only opens
    // when the user explicitly clicks "Set up Voice Integrity" from the
    // Deliverability & Trust settings panel (openModal() below).
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchVoiceIntegrityStatus());
        } else {
            setIsModalOpen(false);
        }
    }, [isAuthenticated, dispatch]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <VoiceIntegrityContext.Provider value={{ status, isModalOpen, openModal }}>
            {children}
            {isAuthenticated && (
                <VoiceIntegrityOnboardingModal isOpen={isModalOpen} onClose={closeModal} />
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
