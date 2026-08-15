import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import {
    fetchDispositions,
    createDisposition,
    updateDisposition,
    deleteDisposition,
    setPersonalDispositionOrder,
    reorderLocal,
} from "@/store/slices/dispositionSlice"
import type { Disposition } from "@/store/slices/dispositionSlice"
import { fetchFolders } from "@/store/slices/contactStructureSlice"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Plus, Tag } from "lucide-react"
import {
    slugify,
    DispositionForm,
    SortableDispositionRow,
    DispositionRow,
    type FormState,
} from "@/components/common/dispositionUI"

// Agent-facing Dispositions settings: agents see the team's shared
// dispositions alongside their own personal ones in a single list they can
// freely create/reorder for their own tagging needs. Team-owned rows can be
// dragged (a personal-order preference, doesn't affect the admin's or other
// agents' view) but can't be edited/deleted here — that stays admin-only.
// System "Call Outcomes" are a separate, admin-ordered, non-draggable category.
export default function AgentDispositionSettings() {
    const dispatch = useDispatch<AppDispatch>()
    const { dispositions } = useSelector((state: RootState) => state.dispositions)
    const { folders } = useSelector((state: RootState) => state.contactStructure)

    const [showAddForm, setShowAddForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    useEffect(() => {
        dispatch(fetchDispositions())
        dispatch(fetchFolders())
    }, [dispatch])

    // System "Call Outcomes" stay a separate, admin-ordered category — not
    // part of the mergeable/draggable Dispositions list below.
    const callOutcomes = useMemo(
        () => [...dispositions].filter(d => d.isOwn === false && d.isSystem).sort((a, b) => a.order - b.order),
        [dispositions]
    )
    // The merged Dispositions list: team dispositions (isOwn === false) plus
    // this agent's own (isOwn === true), sorted by the agent's effective
    // order (personal override if set, else the row's own order — see
    // getDispositions on the backend).
    const mergedDispositions = useMemo(
        () => [...dispositions].filter(d => !d.isSystem).sort((a, b) => a.order - b.order),
        [dispositions]
    )
    const myDispositionCount = useMemo(() => dispositions.filter(d => d.isOwn === true).length, [dispositions])

    function handleAdd(data: FormState) {
        const payload: any = {
            label: data.label,
            value: slugify(data.label),
            color: data.color,
            icon: data.icon,
            isSystem: false,
            isActive: true,
            order: myDispositionCount + 1,
        }

        if (data.folderMode === "auto") {
            payload.autoCreateFolder = true
        } else if (data.folderMode === "existing") {
            payload.targetFolderId = data.targetFolderId || null
        } else {
            payload.targetFolderId = null
        }

        dispatch(createDisposition(payload))
        setShowAddForm(false)
    }

    function handleEdit(id: string, data: FormState) {
        const existing = dispositions.find(d => d.id === id)
        const updatePayload: any = {
            label: data.label,
            color: data.color,
            icon: data.icon,
        }

        if (data.folderMode === "auto") {
            if (existing?.targetFolderId) {
                updatePayload.targetFolderId = existing.targetFolderId
            } else {
                updatePayload.autoCreateFolder = true
            }
        } else if (data.folderMode === "existing") {
            updatePayload.targetFolderId = data.targetFolderId || null
        } else {
            updatePayload.targetFolderId = null
        }

        dispatch(updateDisposition({ id, data: updatePayload }))
        setEditingId(null)
    }

    function handleDelete(id: string) {
        dispatch(deleteDisposition(id))
    }

    function handleToggleActive(id: string) {
        const disp = dispositions.find(d => d.id === id)
        if (disp) {
            dispatch(updateDisposition({ id, data: { isActive: !disp.isActive } }))
        }
    }

    // Dragging any row — team-owned or personal — just reshuffles this
    // agent's own view. Persisted as a personal-order overlay, never as a
    // write to the shared Disposition.order field.
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const fromIndex = mergedDispositions.findIndex(d => d.id === active.id)
        const toIndex = mergedDispositions.findIndex(d => d.id === over.id)
        if (fromIndex === -1 || toIndex === -1) return

        const reordered = arrayMove(mergedDispositions, fromIndex, toIndex)
        const orderData = reordered.map((d, idx) => ({ id: d.id, order: idx }))

        dispatch(reorderLocal(orderData))
        dispatch(setPersonalDispositionOrder(orderData))
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[18px] font-semibold text-[#212529] dark:text-white">
                        Dispositions
                    </h2>
                    <p className="text-sm text-[#6C757D] dark:text-gray-400 mt-0.5">
                        Team dispositions are set by your admin — you can reorder them for yourself and add your own.
                    </p>
                </div>
                <button
                    onClick={() => { setShowAddForm(true); setEditingId(null) }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFCA06] text-black text-sm font-medium hover:bg-[#f0bc00] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add My Disposition
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <DispositionForm
                    onSave={handleAdd}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {/* Dispositions — team + mine, merged, personally reorderable */}
            <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-[#6C757D] dark:text-gray-400 uppercase tracking-wider">
                    DISPOSITIONS
                </span>

                {mergedDispositions.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-dashed border-[#DEE2E6] dark:border-slate-600 p-8 flex flex-col items-center gap-2">
                        <Tag className="w-8 h-8 text-[#ADB5BD] dark:text-gray-500" />
                        <p className="text-sm text-[#6C757D] dark:text-gray-400">No dispositions yet</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="text-sm text-[#FFCA06] font-medium hover:underline"
                        >
                            + Add one
                        </button>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#E9ECEF] dark:border-slate-700 overflow-hidden">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={mergedDispositions.map(d => d.id)} strategy={verticalListSortingStrategy}>
                                {mergedDispositions.map((disp, idx) => (
                                    <SortableDispositionRow
                                        key={disp.id}
                                        disposition={disp}
                                        folders={folders}
                                        isEditing={editingId === disp.id}
                                        isLast={idx === mergedDispositions.length - 1}
                                        canManage={disp.isOwn === true}
                                        onEdit={() => setEditingId(disp.id)}
                                        onSaveEdit={(data) => handleEdit(disp.id, data)}
                                        onCancelEdit={() => setEditingId(null)}
                                        onToggle={() => handleToggleActive(disp.id)}
                                        onDelete={disp.isOwn ? () => handleDelete(disp.id) : null}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                )}
            </div>

            {/* Call Outcomes — read-only, admin-ordered */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#6C757D] dark:text-gray-400 uppercase tracking-wider">
                        CALL OUTCOMES
                    </span>
                    <span className="text-xs text-[#ADB5BD] dark:text-gray-500">(managed by your admin)</span>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#E9ECEF] dark:border-slate-700 overflow-hidden">
                    {callOutcomes.map((disp, idx) => (
                        <DispositionRow
                            key={disp.id}
                            disposition={disp}
                            folders={folders}
                            isEditing={false}
                            isLast={idx === callOutcomes.length - 1}
                            isReadOnly
                            onEdit={() => { }}
                            onSaveEdit={() => { }}
                            onCancelEdit={() => { }}
                            onToggle={() => { }}
                            onDelete={null}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
