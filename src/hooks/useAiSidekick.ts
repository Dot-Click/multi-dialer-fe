import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface SidekickInsights {
    callsAnalyzed: number;
    successPrediction: string;
    urgentFollowUps: number;
}

export const useSidekickInsights = () => {
    return useQuery({
        queryKey: ['sidekick-insights'],
        queryFn: async (): Promise<SidekickInsights> => {
            const response = await api.get('/calling/sidekick-insights');
            return response.data.data || response.data;
        }
    });
};
