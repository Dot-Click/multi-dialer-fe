import AdminCallStatisctics from '@/components/admin/dashboard/workspace/admincallstatistics'
import AdminDialerHealth from '@/components/admin/dashboard/workspace/admindialerhealth'
import AdminFoldersList from '@/components/admin/dashboard/workspace/adminfolderlist'
import AdminGoToCalender from '@/components/admin/dashboard/workspace/admingotocalender'
import AdminGroup from '@/components/admin/dashboard/workspace/admingroup'
import AdminHotList from '@/components/admin/dashboard/workspace/adminhotlist'
import AdminRecentActivity from '@/components/admin/dashboard/workspace/adminrecentactivity'
import AdminSalesAgent from '@/components/admin/dashboard/workspace/adminsalesagent'
import AdminCallMetrics from '@/components/admin/dashboard/workspace/admincallmetrics'
import { useAppSelector } from '@/store/hooks'
import type { AppearanceSettings } from '@/store/slices/appearanceSlice'

const AdminWorkspace = () => {
  const { settings } = useAppSelector((state) => state.appearance);

  const show = (key: keyof AppearanceSettings, defaultVal = true) => {
    if (!settings) return defaultVal;
    return settings[key] ?? defaultVal;
  };

  return ( 
    <div className='flex flex-col gap-3'>
      <div className={`flex gap-3 md:flex-row flex-col justify-between items-start ${(!show('calendar') || !show('hotlist')) ? '[&>*]:!w-full' : ''}`}>
        {show('calendar') && <AdminGoToCalender />}
        {show('hotlist') && <AdminHotList />}
      </div>
      
      <div className='flex flex-col md:flex-row gap-2'>
        {(show('callingGroupsWorkspace') || show('dialerHealth')) && (
          <div className={`flex flex-col w-full ${!show('callStatistics') ? 'md:!w-full' : 'md:w-[45%]'} gap-5`}>
            {show('callingGroupsWorkspace') && <AdminGroup />}
            {show('dialerHealth') && <AdminDialerHealth />}
          </div>
        )}
        {show('callStatistics') && (
          <div className={`w-full ${(!show('callingGroupsWorkspace') && !show('dialerHealth')) ? 'md:!w-full' : 'md:w-[55%]'}`}>
            <AdminCallStatisctics />
          </div>
        )}
      </div>

      <div className={`flex gap-6 md:flex-row flex-col justify-between items-start ${(!show('foldersLists') || !show('recentActivity')) ? '[&>*]:!w-full' : ''}`}>
        {show('foldersLists') && <AdminFoldersList />}
        {show('recentActivity') && <AdminRecentActivity />}
      </div>

      <div className='flex gap-6 md:flex-row flex-col justify-between items-start'>
        <AdminSalesAgent />
        <AdminCallMetrics />
      </div>
    </div>
  )
}

export default AdminWorkspace