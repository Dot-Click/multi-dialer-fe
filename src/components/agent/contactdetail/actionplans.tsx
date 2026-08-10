import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { FiCalendar, FiUser, FiX, FiPhone, FiCheckSquare, FiMail, FiFileText, FiCheck, FiAlertCircle } from "react-icons/fi";
import { useAppSelector } from "@/store/hooks";
import {
    useContactActionPlans,
    useUnassignActionPlan,
} from "@/hooks/useSystemSettings";
import type { ContactActionPlanStepExecution } from "@/hooks/useSystemSettings";
import TakeActionModal from "@/components/modal/takeactionmodal";
import { format } from "date-fns";

const STEP_ICONS: Record<ContactActionPlanStepExecution["step"]["actionType"], typeof FiPhone> = {
    PHONE_CALL: FiPhone,
    TASK: FiCheckSquare,
    EMAIL: FiMail,
    LETTER: FiFileText,
    MAILING_LABEL: FiFileText,
};

const STEP_TYPE_LABEL: Record<ContactActionPlanStepExecution["step"]["actionType"], string> = {
    PHONE_CALL: "Call",
    TASK: "Task",
    EMAIL: "Email",
    LETTER: "Letter",
    MAILING_LABEL: "Mailing Label",
};

// Statuses that mean "this step is done" — whether it succeeded (SENT,
// COMPLETED, DONE) or not (FAILED, MISSED, CANCELLED, SKIPPED). Anything not
// in this set (PENDING, PROCESSING, DUE, OPEN, IN_PROGRESS) is still pending.
const RESOLVED_STATUSES = new Set(["SENT", "COMPLETED", "DONE", "FAILED", "MISSED", "CANCELLED", "SKIPPED"]);

type StepPhase = "completed" | "current" | "future" | "failed";

/**
 * Prefer the linked Callback/Task's own status once a PHONE_CALL/TASK step
 * has fired — it reflects what actually happened (e.g. MISSED, COMPLETED),
 * not just that the reminder was created. Falls back to the execution row's
 * own status (PENDING = not due yet, SENT = fired, FAILED/SKIPPED) for EMAIL
 * steps and for PHONE_CALL/TASK steps that haven't fired yet.
 */
function getStepDisplay(exec: ContactActionPlanStepExecution) {
    if (exec.callback) {
        return { date: exec.callback.scheduledAt, status: exec.callback.status };
    }
    if (exec.task) {
        return { date: exec.task.dueAt, status: exec.task.status };
    }
    return { date: exec.dueAt, status: exec.status };
}

function isStepResolved(exec: ContactActionPlanStepExecution) {
    return RESOLVED_STATUSES.has(getStepDisplay(exec).status);
}

/** "Email sent Aug 5" / "Call due Aug 12" / "Email scheduled Aug 15" / "Call missed Aug 3" */
function getStepVerb(exec: ContactActionPlanStepExecution, phase: StepPhase) {
    if (phase === "future") return "scheduled";
    if (phase === "current") return "due";
    const status = getStepDisplay(exec).status;
    if (status === "SENT" || status === "COMPLETED" || status === "DONE") {
        return exec.step.actionType === "EMAIL" ? "sent" : "completed";
    }
    if (status === "FAILED") return "failed to send";
    if (status === "MISSED") return "missed";
    if (status === "CANCELLED") return "cancelled";
    if (status === "SKIPPED") return "skipped";
    return status.toLowerCase();
}

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
                {/* A contact can only have one ACTIVE plan at a time (enforced
                    server-side, backed by a DB constraint) — so there's no
                    "assign another" affordance while one is active; remove
                    the current plan first to free up the slot. */}
                {activeAssignments.length > 0 && (
                    <span className="text-[#848C94] dark:text-gray-400 text-[12px]">
                        Remove the current plan to assign a different one
                    </span>
                )}
            </div>

            {isLoading ? (
                <p className="text-[#848C94] text-[14px] text-center py-8">Loading...</p>
            ) : activeAssignments.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {activeAssignments.map((a) => (
                        <div
                            key={a.id}
                            className="flex flex-col gap-3 bg-[#F9FAFB] dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[14px] px-4 py-3"
                        >
                            <div className="flex items-center justify-between gap-4">
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

                            {a.stepExecutions.length > 0 && (() => {
                                const steps = a.stepExecutions;
                                const total = steps.length;
                                const completedCount = steps.filter(isStepResolved).length;
                                const firstUnresolvedIndex = steps.findIndex((s) => !isStepResolved(s));

                                return (
                                    <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-slate-700 pt-2.5">
                                        <p className="text-[11px] font-[600] text-[#848C94] dark:text-gray-400 uppercase tracking-wide">
                                            {completedCount >= total
                                                ? `All ${total} step${total === 1 ? "" : "s"} complete`
                                                : `Step ${Math.min(completedCount + 1, total)} of ${total}`}
                                        </p>
                                        <div className="flex flex-col gap-1">
                                            {steps.map((exec, idx) => {
                                                const { date, status } = getStepDisplay(exec);
                                                const resolved = isStepResolved(exec);
                                                const phase: StepPhase =
                                                    exec.step.actionType === "EMAIL" && status === "FAILED"
                                                        ? "failed"
                                                        : resolved
                                                            ? "completed"
                                                            : idx === firstUnresolvedIndex
                                                                ? "current"
                                                                : "future";
                                                const TypeIcon = STEP_ICONS[exec.step.actionType];
                                                const verb = getStepVerb(exec, phase);
                                                const label = `${STEP_TYPE_LABEL[exec.step.actionType]} ${verb} ${format(new Date(date), "MMM d")}`;

                                                return (
                                                    <div
                                                        key={exec.id}
                                                        className={`flex items-center gap-2 rounded-[8px] px-2 py-1.5 text-[12px] transition-colors ${phase === "current"
                                                                ? "bg-[#FFF7DB] dark:bg-yellow-900/20 font-[600] text-[#0E1011] dark:text-white"
                                                                : phase === "failed"
                                                                    ? "text-[#B3261E] dark:text-red-400"
                                                                    : phase === "completed"
                                                                        ? "text-[#848C94] dark:text-gray-500"
                                                                        : "text-[#848C94] dark:text-gray-500 opacity-50"
                                                            }`}
                                                    >
                                                        {phase === "completed" ? (
                                                            <FiCheck size={14} className="shrink-0 text-[#1A7F37]" />
                                                        ) : phase === "failed" ? (
                                                            <FiAlertCircle size={14} className="shrink-0 text-[#B3261E]" />
                                                        ) : (
                                                            <TypeIcon size={12} className="shrink-0" />
                                                        )}
                                                        <span className="truncate">{label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
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
