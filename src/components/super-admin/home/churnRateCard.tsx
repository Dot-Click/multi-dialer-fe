import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import vector from "@/assets/Vector.png";
import { getChurnRate } from "@/store/slices/reportsSlice";
import type { RootState, AppDispatch } from "@/store/store";

const ChurnRateCard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { churnRate, churnLoading } = useSelector((state: RootState) => state.reports);

    useEffect(() => {
        dispatch(getChurnRate());
    }, [dispatch]);

    const stats = [
        {
            id: 1,
            name: "Monthly Churn Rate",
            number: churnRate ? `${churnRate.churnRate}%` : "0%",
            highlight: true,
        },
        {
            id: 2,
            name: "Cancelled This Month",
            number: churnRate?.cancelledThisMonth?.toLocaleString() ?? "0",
        },
        {
            id: 3,
            name: "Active at Month Start",
            number: churnRate?.activeAtStart?.toLocaleString() ?? "0",
        },
        {
            id: 4,
            name: "Period",
            number: churnRate?.month ?? "—",
        },
    ];

    if (churnLoading) {
        return (
            <section className="bg-white dark:bg-gray-800 outfit rounded-[13.48px] shadow-sm px-[12px] py-[14px] lg:px-[28px] w-full lg:py-[24px] min-h-[120px]">
                <div className="flex flex-col gap-5 animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="flex items-center justify-around gap-4 md:gap-20">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white dark:bg-gray-800 outfit rounded-[13.48px] shadow-sm px-[12px] py-[14px] lg:px-[28px] w-full lg:py-[24px] min-h-[120px]">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-1 lg:gap-3">
                    <img src={vector} alt="vector icon" className="h-[13px] md:h-[16px] lg:h-[20px] w-[12px] md:w-[16px] lg:w-[16px]" />
                    <span className="text-[15px] md:text-[17px] text-[#000000] dark:text-white lg:text-[20px] font-[500]">Churn Overview</span>
                </div>

                <div className="flex items-center justify-around gap-4 md:gap-20">
                    {stats.map((stat) => (
                        <div key={stat.id} className="flex flex-col gap-1">
                            <span className={`text-[15px] md:text-[24px] lg:text-[26.96px] font-[600] ${
                                stat.highlight
                                    ? (churnRate && churnRate.churnRate > 10
                                        ? "text-red-500"
                                        : churnRate && churnRate.churnRate > 5
                                        ? "text-amber-500 dark:text-amber-400"
                                        : "text-[#2C2C2C] dark:text-white")
                                    : "text-[#2C2C2C] dark:text-white"
                            }`}>
                                {stat.number}
                            </span>
                            <span className="text-[10px] md:text-[10px] lg:text-[15.41px] text-[#030213] dark:text-gray-400 font-[400]">{stat.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ChurnRateCard;
