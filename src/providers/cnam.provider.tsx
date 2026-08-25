import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCnamStatus } from '@/store/slices/cnamSlice';
import type { CnamStatus } from '@/store/slices/cnamSlice';
import CnamOnboardingModal from '@/components/admin/modals/CnamOnboardingModal';

interface CnamContextType {
    status: CnamStatus;
    isModalOpen: boolean;
    openModal: () => void;
}

const CnamContext = createContext<CnamContextType | undefined>(undefined);

/**
 * Wraps authenticated ADMIN routes AFTER the VoiceIntegrityProvider. On auth
 * change it fetches CNAM status and auto-opens the modal until the trust
 * product is approved — unless a hard gate blocks the flow (missing plan,
 * missing subaccount, missing business profile), in which case the modal
 * stays hidden entirely.
 *
 * Note: `blocked-no-voice-integrity` DOES open the modal — that panel tells
 * the admin they need to finish VI first. VI's own modal is what actually
 * drives them there; this one just informs.
 */
export const CnamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { status } = useAppSelector((state) => state.cnam);
    // The form modal no longer auto-opens on login — the lightweight
    // DeliverabilityReminderModal drives the nudge. This modal only opens
    // when the user explicitly clicks "Set up CNAM" from the Deliverability
    // settings panel.
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCnamStatus());
        } else {
            setIsModalOpen(false);
        }
    }, [isAuthenticated, dispatch]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <CnamContext.Provider value={{ status, isModalOpen, openModal }}>
            {children}
            {isAuthenticated && <CnamOnboardingModal isOpen={isModalOpen} onClose={closeModal} />}
        </CnamContext.Provider>
    );
};

export const useCnam = () => {
    const context = useContext(CnamContext);
    if (context === undefined) {
        throw new Error('useCnam must be used within a CnamProvider');
    }
    return context;
};
