import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchA2PStatus } from '@/store/slices/a2pSlice';
import A2POnboardingModal from '@/components/admin/modals/A2POnboardingModal';

interface A2PContextType {
    status: string;
    openModal: () => void;
    closeModal: () => void;
}

const A2PContext = createContext<A2PContextType | undefined>(undefined);

export const A2PProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { status } = useAppSelector((state) => state.a2p);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchA2PStatus());
            return;
        }

        setIsModalOpen(false);
    }, [isAuthenticated, dispatch]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <A2PContext.Provider value={{ status, openModal, closeModal }}>
            {children}
            {isAuthenticated && (
                <A2POnboardingModal isOpen={isModalOpen} onClose={closeModal} />
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
