import React, { createContext, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchA2PStatus } from '@/store/slices/a2pSlice';
import A2POnboardingModal from '@/components/admin/modals/A2POnboardingModal';

interface A2PContextType {
    status: string;
}

const A2PContext = createContext<A2PContextType | undefined>(undefined);

export const A2PProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { status } = useAppSelector((state) => state.a2p);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchA2PStatus());
        }
    }, [isAuthenticated, dispatch]);

    return (
        <A2PContext.Provider value={{ status }}>
            {children}
            {isAuthenticated && status === 'NOT_STARTED' && (
                <A2POnboardingModal isOpen={true} />
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
