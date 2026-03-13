import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import expiringIcon from "@/assets/expiringIcon.png"
import custIcon from "@/assets/custIcon.png"
import subscriptionIcon from "@/assets/subscriptionIcon.png"
import { getDashboardAlerts } from "@/store/slices/reportsSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Loader from "@/components/common/Loader";

const DashboardAlert = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { alerts, subscriptionStatus, alertsLoading } = useSelector(
    (state: RootState) => state.reports
  );

  useEffect(() => {
    dispatch(getDashboardAlerts());
  }, [dispatch]);

  return (
    <section className="relative mt-3 h-[450px] bg-[#FFFFFF] dark:bg-gray-800 flex flex-col gap-4 work-sans px-[24px] shadow-sm pt-[18px] pb-[32px] rounded-[32px] w-full md:w-[50%]">
      {alertsLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-[32px]">
          <Loader fullPage={false} />
        </div>
      )}

      <div>
        <h1 className="text-[#000000] dark:text-white font-[500] text-[20px]">
          Dashboard Alerts / Status
        </h1>
      </div>

      <div className="flex flex-col gap-3">

        <div className="flex gap-5 items-center bg-[#F8F8F8] dark:bg-slate-900 rounded-[13px] px-4 py-4">
          <span>
            <img src={expiringIcon} alt="failedIcon" className="h-5 object-contain" />
          </span>
          <div className="flex flex-col leading-none ">
            <p className="text-[#495057] dark:text-gray-400 text-[16px] font-[500]">
              Expiring Subscriptions
            </p>
            <p className="text-[#000000] dark:text-white font-[600] text-[26px]">
              {alerts?.expiringSubscriptions ?? 0}
            </p>
          </div>

        </div>


        <div className="flex gap-5 items-center bg-[#F8F8F8] dark:bg-slate-900 rounded-[13px] px-4 py-4">
          <span>
            <img src={custIcon} alt="failedIcon" className="h-5 object-contain" />
          </span>
          <div className="flex flex-col leading-none ">
            <p className="text-[#495057] dark:text-gray-400 text-[16px] font-[500]">
              New Customers
            </p>
            <p className="text-[#000000] dark:text-white font-[600] text-[26px]">
              {alerts?.newCustomers ?? 0}
            </p>
          </div>

        </div>

        <div className="flex gap-5 bg-[#F8F8F8] dark:bg-slate-900 rounded-[13px] px-4 py-4">
          <span className="mt-1">
            <img src={subscriptionIcon} alt="failedIcon" className="h-3 object-contain" />
          </span>
          <div className="flex flex-col gap-4 leading-none w-full">
            <p className="text-[#495057] dark:text-gray-400 text-[16px] font-[500]">
              Subscription Status
            </p>
            <div className="w-full flex flex-col gap-2 ">

              <span className="flex justify-between items-center">
                <h1 className="text-[#000000] dark:text-white text-[18px] font-[500]">Active</h1>
                <h1 className="text-[#04A771] dark:text-green-600 text-[18px] font-[500]">
                  {subscriptionStatus?.active ?? 0}
                </h1>
              </span>

              <span className="flex justify-between items-center">
                <h1 className="text-[#000000] dark:text-white text-[18px] font-[500]">Inactive</h1>
                <h1 className="text-[#E70028] dark:text-red-700 text-[18px] font-[500]">
                  {subscriptionStatus?.inactive ?? 0}
                </h1>
              </span>

            </div>
          </div>

        </div>

      </div>

    </section>
  )
}

export default DashboardAlert