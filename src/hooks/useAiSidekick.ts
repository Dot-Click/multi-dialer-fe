import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface SidekickInsights {
    callsAnalyzed: number;
    successPrediction: string;
    urgentFollowUps: number;
    newLeadsIdentified: number;
}

export interface BestTimeToCallData {
    dialedVsTalked: { time: string; Dialed: number; Talked: number }[];
    answeredPercentage: { time: string; series1: number; series2: number }[];
}

export interface LeadIntelligenceData {
    summary: {
        avgLeadScore: string;
        engagementPrediction: string;
        urgentLeads: number;
    };
    pieData: { name: string; value: number }[];
    overallScore: number;
    sentimentTrend: { name: string; Positive: number; Neutral: number; Negative: number }[];
}

export interface AiCoachingData {
    coachingEvents: {
        count: number;
        total: number;
        successPercentage: number;
    };
    objectionDetection: {
        rate: number;
        data: { name: string; value: number }[];
    };
    confidenceIndex: {
        score: number;
        data: { name: string; value: number }[];
    };
    keywordScore: number;
}

export interface CallOutcomeData {
    predictedOutcomes: {
        appointmentSet: string;
        interested: string;
        notInterested: number;
    };
    qualityScore: number;
    keywordData: { label: string; percentage: number; color: string }[];
}

export interface EfficiencyData {
    timeSaved: number;
    tasksAutomated: number;
    tasksAutomatedPercentage: number;
    aiHandled: {
        percentage: number;
        data: { name: string; value: number }[];
    };
}

export interface ComplianceData {
    flags: number;
    flagsPercentage: number;
    riskRate: number;
    riskData: { name: string; value: number }[];
}

export interface CallGroupLead {
    id: string;
    name: string;
    score: string;
    tag: string;
}

export interface ImprovementData {
    improvement: {
        current: number;
        target: number;
    };
    pipeline: {
        dealsAccelerated: number;
        speedIncrease: number;
        accelerationPercentage: number;
    };
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

export const useBestTimeToCall = (day: string) => {
    return useQuery({
        queryKey: ['best-time-to-call', day],
        queryFn: async (): Promise<BestTimeToCallData> => {
            const response = await api.get(`/calling/best-time-to-call?day=${day}`);
            return response.data.data || response.data;
        }
    });
};

export const useLeadIntelligence = () => {
    return useQuery({
        queryKey: ['lead-intelligence'],
        queryFn: async (): Promise<LeadIntelligenceData> => {
            const response = await api.get('/calling/lead-intelligence');
            return response.data.data || response.data;
        }
    });
};

export const useAiCoaching = () => {
    return useQuery({
        queryKey: ['ai-coaching'],
        queryFn: async (): Promise<AiCoachingData> => {
            const response = await api.get('/calling/ai-coaching');
            return response.data.data || response.data;
        }
    });
};

export const useCallOutcome = () => {
    return useQuery({
        queryKey: ['call-outcome'],
        queryFn: async (): Promise<CallOutcomeData> => {
            const response = await api.get('/calling/call-outcome');
            return response.data.data || response.data;
        }
    });
};

export const useEfficiency = () => {
    return useQuery({
        queryKey: ['efficiency'],
        queryFn: async (): Promise<EfficiencyData> => {
            const response = await api.get('/calling/efficiency');
            return response.data.data || response.data;
        }
    });
};

export const useCompliance = () => {
    return useQuery({
        queryKey: ['compliance'],
        queryFn: async (): Promise<ComplianceData> => {
            const response = await api.get('/calling/compliance');
            return response.data.data || response.data;
        }
    });
};

export const useCallGroup = () => {
    return useQuery({
        queryKey: ['call-group'],
        queryFn: async (): Promise<CallGroupLead[]> => {
            const response = await api.get('/calling/call-group');
            return response.data.data || response.data;
        }
    });
};

export const useImprovement = () => {
    return useQuery({
        queryKey: ['improvement'],
        queryFn: async (): Promise<ImprovementData> => {
            const response = await api.get('/calling/improvement');
            return response.data.data || response.data;
        }
    });
};
