import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface AccessStatus {
    /** Dialer / feature access is blocked (trial expired and no active subscription). */
    locked: boolean;
    /** Whether this user may purchase/manage the subscription (account owner only). */
    canPurchase: boolean;
}

/**
 * Resolves whether the current user's dialer/feature access is locked.
 * Agents inherit their owning admin's subscription status (resolved server-side).
 */
export const useAccessStatus = () => {
    return useQuery({
        queryKey: ['access-status'],
        queryFn: async (): Promise<AccessStatus> => {
            const response = await api.get('/billing/access-status');
            return response.data.data || response.data;
        },
        staleTime: 60_000,
    });
};
