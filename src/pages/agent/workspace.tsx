import CallStatisctics from '@/components/agent/dashboard/workspace/callstatistics'
import DialerHealth from '@/components/agent/dashboard/workspace/dialerhealth'
import FoldersList from '@/components/agent/dashboard/workspace/folderlist'
import GoToCalender from '@/components/agent/dashboard/workspace/gotocalender'
import HotList from '@/components/agent/dashboard/workspace/hotlist'
import RecentActivity from '@/components/agent/dashboard/workspace/recentactivity'

const Workspace = () => {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-3 md:flex-row flex-col justify-between items-start'>
        <GoToCalender />
        <HotList />
      </div>
      <div className='flex flex-col md:flex-row gap-2'>
        <div className='flex flex-col w-full md:w-[45%] gap-5'>
          {/* <Group /> */}
          <DialerHealth />
        </div>
        <div className='w-full md:w-[55%]'>
          <CallStatisctics />
        </div>
      </div>
      <div className='flex gap-6 md:flex-row flex-col justify-between items-start'>
        <FoldersList />
        <RecentActivity />
      </div>



    </div>
  )
}

export default Workspace