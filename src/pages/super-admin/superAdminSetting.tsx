import GeneralSetting from "@/components/super-admin/setting/generalSetting"
import NotificationSetting from "@/components/super-admin/setting/notificationSetting"
import SecurityAccess from "@/components/super-admin/setting/securityAccess"
import SystemPreference from "./systemPreference"

const SuperAdminSetting = () => {
  return (
    <section className='w-full min-h-screen flex flex-col gap-5 px-6 py-3 outfit bg-[#F5F6FA]'>

      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col leading-none gap-0">
          <h1 className="text-[#2C2C2C] text-[20px] md:text-[26px]  lg:text-[32px] font-[500]">General Settings</h1>


        </div>

        <div className="flex items-center gap-3">
          <button className="bg-[#EBEDF0] text-[#0E1011] px-[24px] py-2 rounded-[12px] flex gap-2 items-center justify-center">
            <span className="text-[13px] md:text-[16px] font-[500]">Reset to Defaults</span>
          </button>
          <button className="bg-[#FFCA06] text-[#000000] px-[24px] py-2 rounded-[12px] flex gap-2 items-center justify-center">
            <span className="text-[13px] md:text-[16px] font-[500]">Save All Changes</span>
          </button>
        </div>

      </div>

      <GeneralSetting />
      <NotificationSetting />
      <SecurityAccess />
      <SystemPreference/>





    </section>
  )
}

export default SuperAdminSetting