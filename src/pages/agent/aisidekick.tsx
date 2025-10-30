import AiInsightToday from '@/components/agent/dashboard/aisidekick/aiinsighttoday'
import BestTimeToTalk from '@/components/agent/dashboard/aisidekick/besttimetotalk'
import LeadIntelligence from '@/components/agent/dashboard/aisidekick/leadintelligence'

const Aisidekick = () => {
    return (
        <div className='flex flex-col  gap-4 w-full '>
            <AiInsightToday />
            <BestTimeToTalk/>
            <div>
                <LeadIntelligence/>
            </div>
        </div>
    )
}

export default Aisidekick