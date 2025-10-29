import GoToCalender from '@/components/agent/dashboard/workspace/gotocalender'
import HotList from '@/components/agent/dashboard/workspace/hotlist'
import React from 'react'

const Workspace = () => {
  return (
    <div>
      <div className='flex gap-6 md:flex-row flex-col justify-between items-center'>
      <GoToCalender/>
      <HotList/>
      </div>
    </div>
  )
}

export default Workspace