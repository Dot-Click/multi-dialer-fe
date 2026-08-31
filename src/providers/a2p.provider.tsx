import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchA2PDetails, fetchA2PStatus } from '@/store/slices/a2pSlice';
import A2POnboardingModal from '@/components/admin/modals/A2POnboardingModal';
import A2PResubmitCPModal from '@/components/admin/modals/A2PResubmitCPModal';
import A2PResubmitBrandModal from '@/components/admin/modals/A2PResubmitBrandModal';
import A2PResubmitCampaignModal from '@/components/admin/modals/A2PResubmitCampaignModal';

interface A2PContextType {
    status: string;
    openModal: () => void;
    closeModal: () => void;
    openResubmitCP: () => void;
    openResubmitBrand: () => void;
    openResubmitCampaign: () => void;
}

const A2PContext = createContext<A2PContextType | undefined>(undefined);

export const A2PProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { status } = useAppSelector((state) => state.a2p);
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [isResubmitCpOpen, setIsResubmitCpOpen] = useState(false);
    const [isResubmitBrandOpen, setIsResubmitBrandOpen] = useState(false);
    const [isResubmitCampaignOpen, setIsResubmitCampaignOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            // Load both status and details on login so any modal opened
            // afterwards has prefill data ready — avoids the empty-form
            // flash when the resubmit modal opens before details arrive.
            dispatch(fetchA2PStatus());
            dispatch(fetchA2PDetails());
            return;
        }

        setIsOnboardingOpen(false);
        setIsResubmitCpOpen(false);
        setIsResubmitBrandOpen(false);
        setIsResubmitCampaignOpen(false);
    }, [isAuthenticated, dispatch]);

    return (
        <A2PContext.Provider
            value={{
                status,
                openModal: () => setIsOnboardingOpen(true),
                closeModal: () => setIsOnboardingOpen(false),
                openResubmitCP: () => setIsResubmitCpOpen(true),
                openResubmitBrand: () => setIsResubmitBrandOpen(true),
                openResubmitCampaign: () => setIsResubmitCampaignOpen(true),
            }}
        >
            {children}
            {isAuthenticated && (
                <>
                    <A2POnboardingModal
                        isOpen={isOnboardingOpen}
                        onClose={() => setIsOnboardingOpen(false)}
                    />
                    <A2PResubmitCPModal
                        isOpen={isResubmitCpOpen}
                        onClose={() => setIsResubmitCpOpen(false)}
                    />
                    <A2PResubmitBrandModal
                        isOpen={isResubmitBrandOpen}
                        onClose={() => setIsResubmitBrandOpen(false)}
                    />
                    <A2PResubmitCampaignModal
                        isOpen={isResubmitCampaignOpen}
                        onClose={() => setIsResubmitCampaignOpen(false)}
                    />
                </>
            )}
        </A2PContext.Provider>
    );
};

export const useA2P = () => {
    const context = useContext(A2PContext);
    if (context === undefined) {
        throw new Error('useA2P must be used within an A2PProvider');
    }
    return context;
};
