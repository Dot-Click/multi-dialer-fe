import AdminCallStatisctics from '@/components/admin/dashboard/workspace/admincallstatistics'
import AdminDialerHealth from '@/components/admin/dashboard/workspace/admindialerhealth'
import AdminFoldersList from '@/components/admin/dashboard/workspace/adminfolderlist'
import AdminGoToCalender from '@/components/admin/dashboard/workspace/admingotocalender'
import AdminGroup from '@/components/admin/dashboard/workspace/admingroup'
import AdminHotList from '@/components/admin/dashboard/workspace/adminhotlist'
import AdminRecentActivity from '@/components/admin/dashboard/workspace/adminrecentactivity'
import AdminSalesAgent from '@/components/admin/dashboard/workspace/adminsalesagent'
import AdminCallMetrics from '@/components/admin/dashboard/workspace/admincallmetrics'

const AdminWorkspace = () => {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-3 md:flex-row flex-col justify-between items-start'>
        <AdminGoToCalender />
        <AdminHotList />
      </div>
      <div className='flex flex-col md:flex-row gap-2'>
        <div className='flex flex-col w-full md:w-[45%] gap-5'>
          <AdminGroup />
          <AdminDialerHealth />
        </div>
        <div className='w-full md:w-[55%]'>
          <AdminCallStatisctics />
        </div>
      </div>
      <div className='flex gap-6 md:flex-row flex-col justify-between items-start'>
        <AdminFoldersList />
        <AdminRecentActivity/>
      </div>
      <div className='flex gap-6 md:flex-row flex-col justify-between items-start'>
        <AdminSalesAgent />
        <AdminCallMetrics/>
      </div>

  

    </div>
  )
}

export default AdminWorkspace