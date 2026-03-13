import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import vector from "@/assets/Vector.png";
import { getUserOverview } from "@/store/slices/reportsSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Loader from "@/components/common/Loader";

const UserOverviews = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { userOverview, loading } = useSelector((state: RootState) => state.reports);

    useEffect(() => {
        dispatch(getUserOverview());
    }, [dispatch]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const data = [
        { 
            id: 1, 
            name: "New Users", 
            number: userOverview?.newUsers?.toLocaleString() || "0"
        },
        { 
            id: 2, 
            name: "Active Subscriptions", 
            number: userOverview?.activeSubscriptions?.toLocaleString() || "0"
        },
        { 
            id: 3, 
            name: "Total agents across platform", 
            number: userOverview?.totalAgents?.toLocaleString() || "0"
        },
        { 
            id: 4, 
            name: "Monthly Revenue (MRR)", 
            number: formatCurrency(userOverview?.currentMonthRevenue || 0) 
        },
    ];

    return (
        <section className="relative bg-white dark:bg-gray-800 outfit rounded-[13.48px] shadow-sm px-[12px] py-[14px] lg:px-[28px] w-full lg:py-[24px] min-h-[120px]">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-[13.48px]">
                    <Loader fullPage={false} />
                </div>
            )}
            
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-1 lg:gap-3">
                    <img src={vector} alt="vector icon" className="h-[13px] md:h-[16px] lg:h-[20px] w-[12px] md:w-[16px] lg:w-[16px]" />
                    <span className="text-[15px] md:text-[17px] text-[#000000] dark:text-white lg:text-[20px] font-[500]">Users Overview</span>
                </div>

                <div className="flex items-center justify-around gap-4 md:gap-20">
                    {data.map((dt) => (
                        <div key={dt.id} className="flex flex-col gap-1">
                            <span className="text-[15px] md:text-[24px] text-[#2C2C2C] dark:text-white lg:text-[26.96px] font-[600]">{dt.number}</span>
                            <span className="text-[10px] md:text-[10px] lg:text-[15.41px] text-[#030213] dark:text-gray-400 font-[400]">{dt.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserOverviews;