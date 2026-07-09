import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface PlanLimits {
    planKey: string | null;
    displayName: string | null;
    matched: boolean;
    maxDialerLines: number | null;
    includedAgentSeats: number | null;
    maxAgentSeats: number | null;
    extraAgentSeatPriceCents: number | null;
    /** How many overage agent seats this admin currently has paid for and active. */
    activePaidOverageSeats: number;
    includedNumbers: number | null;
    extraNumberPriceCents: number | null;
    callRecordingEnabled: boolean;
    aiInsightsLevel: 'NONE' | 'BASIC' | 'FULL';
    stirShakenEnabled: boolean;
    smartNumberRotationEnabled: boolean;
    teamDashboardEnabled: boolean;
    priorityRoutingEnabled: boolean;
    aiCallCoachingEnabled: boolean;
    advancedDeliverabilityEnabled: boolean;
}

/**
 * Resolves the current user's effective plan entitlements (agents inherit
 * their owning admin's plan, resolved server-side).
 */
export const usePlanLimits = () => {
    return useQuery({
        queryKey: ['plan-limits'],
        queryFn: async (): Promise<PlanLimits> => {
            const response = await api.get('/plan-limits/mine');
            return response.data.data || response.data;
        },
        staleTime: 60_000,
    });
};
