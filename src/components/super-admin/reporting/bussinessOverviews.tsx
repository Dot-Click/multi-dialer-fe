import { useEffect } from "react";
import vector from "@/assets/Vector.png";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getBusinessOverview } from "@/store/slices/reportsSlice";
import Loader from "@/components/common/Loader";

const BussinessOverviews = () => {
  const dispatch = useAppDispatch();
  const { businessOverview, loading } = useAppSelector((state) => state.reports);

  useEffect(() => {
    dispatch(getBusinessOverview());
  }, [dispatch]);

  const data = [
    {
      id: 1,
      name: "Total Revenue (MRR)",
      number: `$${businessOverview?.totalRevenue?.toLocaleString() || 0}`,
    },
    {
      id: 2,
      name: "Active Subscriptions",
      number: businessOverview?.activeSubscriptions?.toLocaleString() || 0,
    },
    {
      id: 3,
      name: "Active Users",
      number: businessOverview?.activeUsers?.toLocaleString() || 0,
    },
    {
      id: 4,
      name: "Total Agents Across Platform",
      number: businessOverview?.totalAgents?.toLocaleString() || 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[120px]">
        <Loader fullPage={false} />
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-800 outfit rounded-[13.48px] shadow-sm px-[12px] py-[14px] lg:px-[28px] w-full lg:py-[24px]">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-1 lg:gap-3">
          <img
            src={vector}
            alt="vector icon"
            className="h-[13px] md:h-[16px] lg:h-[20px] w-[12px] md:w-[16px] lg:w-[16px]"
          />
          <span className="text-[12px] work-sans md:text-[17px] text-[#000000] dark:text-white lg:text-[20px] font-[500]">
            Business Overview
          </span>
        </div>

        <div className="flex items-center justify-around gap-3 md:gap-5 lg:gap-7">
          {data.map((dt, index) => (
            <div
              key={dt.id}
              className={`flex pl-4 flex-col gap-1
                                ${index !== 0 ? "border-l border-[#E5E7EB] dark:border-slate-600" : ""}
                            `}
            >
              <span className="text-[13px] md:text-[18px] text-[#2C2C2C] dark:text-white lg:text-[25px] font-[600]">
                {dt.number}
              </span>
              <span className="text-[8px] md:text-[9px] lg:text-[13px] text-[#030213] dark:text-gray-400 font-[400]">
                {dt.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BussinessOverviews;
