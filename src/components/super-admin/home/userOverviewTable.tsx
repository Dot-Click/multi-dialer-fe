import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getUserSubscriptions } from "@/store/slices/reportsSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Loader from "@/components/common/Loader";

const UserOverviewTable = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { userSubscriptions, tableLoading } = useSelector(
        (state: RootState) => state.reports
    );

    const [activeTab, setActiveTab] = useState(1);

    const tabs = [
        { id: 1, name: "All" },
        { id: 2, name: "Active" },
        { id: 3, name: "Inactive" },
    ];

    useEffect(() => {
        dispatch(getUserSubscriptions());
    }, [dispatch]);

    const getStatusClass = (status: string) => {
        const normalized = status.toUpperCase();
        if (normalized === "ACTIVE") return "bg-[#D0FAE5] text-[#428E43]";
        if (normalized === "EXPIRING") return "bg-[#FEF9C2] text-[#894B1F]";
        if (normalized === "EXPIRED") return "bg-[#FEE2E2] text-[#991B1B]";
        return "bg-gray-200 text-gray-700";
    };

    const filteredUsers = userSubscriptions.filter((user) => {
        if (activeTab === 1) return true;
        if (activeTab === 2) return user.status.toUpperCase() === "ACTIVE";
        if (activeTab === 3) return user.status.toUpperCase() === "EXPIRED";
        return true;
    });

    return (
        <section className="relative mt-3 bg-[#FFFFFF] dark:bg-slate-800 h-[400px] flex flex-col gap-4 outfit shadow-sm pt-[23px] rounded-[32px] w-full md:w-[70%]">
            {tableLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-[32px]">
                    <Loader fullPage={false} />
                </div>
            )}
            
            {/* Heading + Buttons */}
            <div className="flex gap-2 justify-between items-center px-[24px] w-full md:w-[80%]">
                <h1 className="text-[#315189] dark:text-white font-[600] text-[13px] md:text-[18.03px] whitespace-nowrap">
                    Users Overview
                </h1>

                <div className="flex gap-2 flex-wrap items-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`rounded-[8.79px] py-[3px] px-[10px] text-[10px] md:text-[15.03px] font-[500] transition-colors ${
                                activeTab === tab.id
                                    ? "bg-[#4E4E4E] dark:bg-slate-900 text-white"
                                    : "bg-[#EAEAEA] dark:bg-slate-600 dark:text-white text-[#717182]"
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto custom-scrollbar outfit flex-1 mb-4 px-[24px]">
                <table className="min-w-full border-separate" style={{ borderSpacing: "0 8px" }}>
                    <thead className="bg-[#FAF9FE] dark:bg-slate-900 sticky top-0 z-10">
                        <tr className="text-[#1D2C45] dark:text-white">
                            <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">User Name</th>
                            <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">Email</th>
                            <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">Subscription Plan</th>
                            <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">Status</th>
                            <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">Created On</th>
                            <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr
                                    key={index}
                                    className="bg-[#FAFAFA] dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm"
                                >
                                    <td className="px-4 py-3 text-[#2C2C2C] dark:text-white text-[13.5px] font-[400] whitespace-nowrap">{user.userName}</td>
                                    <td className="px-4 py-3 text-[#2C2C2C] dark:text-white text-[13.5px] font-[400] whitespace-nowrap">{user.email}</td>
                                    <td className="px-4 py-3 text-[#2C2C2C] dark:text-white text-[13.5px] font-[400] whitespace-nowrap">{user.subscriptionPlan}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1.5 rounded-[75px] text-[10.5px] font-[400] uppercase ${getStatusClass(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-[#2C2C2C] dark:text-white text-[13.5px] font-[400] whitespace-nowrap">{user.createdAt}</td>
                                    <td className="px-4 py-3 text-[#6B7280] dark:text-white text-[16px] font-[500] whitespace-nowrap cursor-pointer">
                                        <BsThreeDotsVertical />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            !tableLoading && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">
                                        No subscription data found.
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default UserOverviewTable;
