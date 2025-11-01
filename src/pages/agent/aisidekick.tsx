import AgentImprovement from '@/components/agent/dashboard/aisidekick/agentimprovement'
import AiCoaching from '@/components/agent/dashboard/aisidekick/aicoaching'
import AiInsightToday from '@/components/agent/dashboard/aisidekick/aiinsighttoday'
import BestTimeToTalk from '@/components/agent/dashboard/aisidekick/besttimetotalk'
import CallGroup from '@/components/agent/dashboard/aisidekick/callgroup'
import CallOutcome from '@/components/agent/dashboard/aisidekick/calloutcome'
import Compliance from '@/components/agent/dashboard/aisidekick/compliance'
import Efficiency from '@/components/agent/dashboard/aisidekick/efficiency'
import LeadIntelligence from '@/components/agent/dashboard/aisidekick/leadintelligence'
import Pipeline from '@/components/agent/dashboard/aisidekick/pipeline'

const Aisidekick = () => {
    return (
        <div className='flex flex-col  gap-4 w-full '>
            <AiInsightToday />
            <BestTimeToTalk/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  ">
                <LeadIntelligence/>
                <AiCoaching/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CallOutcome/>
                <Efficiency/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Compliance/>
                <CallGroup/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AgentImprovement/>
                <Pipeline/>
            </div>
          
        </div>
    )
}

export default Aisidekick