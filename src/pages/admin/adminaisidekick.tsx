import AdminAgentImprovement from '@/components/admin/dashboard/aisidekick/adminagentimprovement'
import AdminAiCoaching from '@/components/admin/dashboard/aisidekick/adminaicoaching'
import AdminAiInsightToday from '@/components/admin/dashboard/aisidekick/adminaiinsighttoday'
import AdminBestTimeToTalk from '@/components/admin/dashboard/aisidekick/adminbesttimetotalk'
import AdminCallGroup from '@/components/admin/dashboard/aisidekick/admincallgroup'
import AdminCallOutcome from '@/components/admin/dashboard/aisidekick/admincalloutcome'
import AdminCompliance from '@/components/admin/dashboard/aisidekick/admincompliance'
import AdminEfficiency from '@/components/admin/dashboard/aisidekick/adminefficiency'
import AdminLeadIntelligence from '@/components/admin/dashboard/aisidekick/adminleadintelligence'
import AdminPipeline from '@/components/admin/dashboard/aisidekick/adminpipeline'
import { useAppSelector } from '@/store/hooks'
import type { AppearanceSettings } from '@/store/slices/appearanceSlice'

const AdminAisidekick = () => {
    const { settings } = useAppSelector((state) => state.appearance);

    // Helpers to easily handle missing state or loading scenario
    const show = (key: keyof AppearanceSettings, defaultVal = true) => {
        if (!settings) return defaultVal;
        return settings[key] ?? defaultVal;
    };

    return (
        <div className='flex flex-col gap-4 w-full '>
            {/* Always shown or no toggle associated in typical settings */}
            <AdminAiInsightToday />
            
            {show('bestTimeToCall') && <AdminBestTimeToTalk />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {show('leadIntelligence') && <AdminLeadIntelligence />}
                {show('aiCoachingCallAnalysis') && <AdminAiCoaching />}
                {show('callOutcomeIntelligence') && <AdminCallOutcome />}
                {show('efficiencyAutomation') && <AdminEfficiency />}
                {show('complianceRiskMonitoring') && <AdminCompliance />}
                {show('callingGroupsAiSidekick') && <AdminCallGroup />}
                {show('agentImprovementScores') && <AdminAgentImprovement />}
                {show('pipelineAccelerationIndex') && <AdminPipeline />}
            </div>
        </div>
    )
}

export default AdminAisidekick