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

const AdminAisidekick = () => {
    return (
        <div className='flex flex-col  gap-4 w-full '>
            <AdminAiInsightToday />
            <AdminBestTimeToTalk/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  ">
                <AdminLeadIntelligence/>
                <AdminAiCoaching/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminCallOutcome/>
                <AdminEfficiency/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminCompliance/>
                <AdminCallGroup/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminAgentImprovement/>
                <AdminPipeline/>
            </div>
          
        </div>
    )
}

export default AdminAisidekick