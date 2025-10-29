import AiInsightToday from '@/components/agent/dashboard/aisidekick/aiinsighttoday'
import BestTimeToTalk from '@/components/agent/dashboard/aisidekick/besttimetotalk'

const Aisidekick = () => {
    return (
        <div className='flex flex-col items-center gap-4 w-full '>
            <AiInsightToday />
            <BestTimeToTalk/>
        </div>
    )
}

export default Aisidekick