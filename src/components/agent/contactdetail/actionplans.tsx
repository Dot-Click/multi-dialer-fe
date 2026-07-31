import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { FiCalendar, FiUser, FiX } from "react-icons/fi";
import { useAppSelector } from "@/store/hooks";
import { useContactActionPlans, useUnassignActionPlan } from "@/hooks/useSystemSettings";
import TakeActionModal from "@/components/modal/takeactionmodal";
import { format } from "date-fns";

const ActionPlans = () => {
    const { currentContact } = useAppSelector((state) => state.contacts);
    const { data: assignments, isLoading, refetch } = useContactActionPlans(currentContact?.id);
    const unassign = useUnassignActionPlan();
    const [isAssignOpen, setIsAssignOpen] = useState(false);

    const activeAssignments = assignments?.filter((a) => a.status === "ACTIVE") || [];

    const handleRemove = (assignmentId: string) => {
        if (!window.confirm("Remove this contact from the Action Plan? Steps already scheduled won't be cancelled.")) return;
        unassign.mutate(assignmentId);
    };

    return (
        <div className="flex gap-6 flex-col min-h-40">
            <div className="flex items-center justify-between">
                <h1 className="text-[#0E1011] dark:text-white text-[18px] font-[500]">Action Plans:</h1>
                {activeAssignments.length > 0 && (
                    <button
                        onClick={() => setIsAssignOpen(true)}
                        className="flex bg-[#EBEDF0] dark:bg-slate-700 dark:text-white py-[8px] px-[16px] h-[38px] cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-600 rounded-[10px] gap-2 items-center justify-center text-[13px] font-[500]"
                    >
                        <IoIosAdd className="text-lg" /> Assign Another Plan
                    </button>
                )}
            </div>

            {isLoading ? (
                <p className="text-[#848C94] text-[14px] text-center py-8">Loading...</p>
            ) : activeAssignments.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {activeAssignments.map((a) => (
                        <div
                            key={a.id}
                            className="flex items-center justify-between gap-4 bg-[#F9FAFB] dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[14px] px-4 py-3"
                        >
                            <div className="min-w-0">
                                <p className="text-[#0E1011] dark:text-white text-[15px] font-semibold truncate">{a.plan.name}</p>
                                <div className="flex items-center gap-4 mt-1 text-[#848C94] text-[12px]">
                                    <span className="flex items-center gap-1">
                                        <FiUser size={12} /> {a.assignedTo.fullName || a.assignedTo.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiCalendar size={12} /> Started {format(new Date(a.startDate), "MMM d, yyyy")}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemove(a.id)}
                                disabled={unassign.isPending}
                                title="Remove from Plan"
                                className="shrink-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center md:mt-8 lg:mt-16 gap-1.5 items-center w-full text-center md:w-[50%] mx-auto flex-col">
                    <h1 className="text-[#000000] dark:text-white text-[14px] font-[500]">No Data Available</h1>
                    <p className="text-[#848C94] text-[14px] font-[400]">There are no action plan assigned yet</p>
                    <button
                        onClick={() => setIsAssignOpen(true)}
                        className="flex bg-[#EBEDF0] dark:bg-slate-700 dark:text-white py-[12px] px-[24px] h-[48px] cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-600 rounded-[12px] gap-3 items-center justify-center"
                    >
                        <span><IoIosAdd className="text-[#0E1011] dark:text-white text-2xl" /></span>
                        <span className="text-[#0E1011] dark:text-white text-[16px] font-[500]">Assign Action Plan</span>
                    </button>
                </div>
            )}

            <TakeActionModal
                isOpen={isAssignOpen}
                onClose={() => { setIsAssignOpen(false); refetch(); }}
                contactId={currentContact?.id}
            />
        </div>
    );
};

export default ActionPlans;
