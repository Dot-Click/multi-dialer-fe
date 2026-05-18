import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import {
    fetchDispositions,
    createDisposition,
    updateDisposition,
    deleteDisposition,
} from "@/store/slices/dispositionSlice"
import type { Disposition, DispositionColor } from "@/store/slices/dispositionSlice"
import { fetchFolders } from "@/store/slices/contactStructureSlice"
import {
    Plus,
    Pencil,
    Trash2,
    GripVertical,
    Tag,
    Save,
    X,
    FolderOpen,
    FolderPlus,
    FolderX,
} from "lucide-react"

const COLOR_MAP: Record<DispositionColor, { bg: string; text: string; border: string; dot: string }> = {
    red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
    orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
    green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
    gray: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" },
    pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", dot: "bg-pink-500" },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(label: string) {
    return label.trim().toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "")
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DispositionBadge({ disposition }: { disposition: Disposition }) {
    const c = COLOR_MAP[disposition.color]
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {disposition.label}
        </span>
    )
}

// ─── Form State ───────────────────────────────────────────────────────────────

type FolderMode = "auto" | "existing" | "none"

interface FormState {
    label: string
    color: DispositionColor
    icon: string
    folderMode: FolderMode
    targetFolderId?: string | null
}

// ─── Disposition Form ─────────────────────────────────────────────────────────

function DispositionForm({
    initial,
    existingFolderId,
    onSave,
    onCancel,
}: {
    initial?: Partial<FormState>
    existingFolderId?: string | null  // the disposition's current targetFolderId (from DB)
    onSave: (data: FormState) => void
    onCancel: () => void
}) {
    const { folders } = useSelector((state: RootState) => state.contactStructure)

    // Derive initial folderMode from existing data
    const derivedMode: FolderMode =
        initial?.folderMode ??
        (existingFolderId ? "existing" : initial?.label ? "none" : "auto")

    const [form, setForm] = useState<FormState>({
        label: initial?.label ?? "",
        color: initial?.color ?? "blue",
        icon: initial?.icon ?? "Tag",
        folderMode: derivedMode,
        targetFolderId: initial?.targetFolderId ?? existingFolderId ?? null,
    })

    const preview: Disposition = {
        id: "preview",
        label: form.label || "Preview",
        value: slugify(form.label || "preview"),
        color: form.color,
        icon: form.icon,
        isSystem: false,
        isActive: true,
        order: 0,
    }

    const currentFolder = folders?.find(f => f.id === existingFolderId)

    function handleFolderMode(mode: FolderMode) {
        setForm(f => ({
            ...f,
            folderMode: mode,
            targetFolderId: mode === "existing" ? (existingFolderId ?? null) : null,
        }))
    }

    return (
        <div className="bg-[#F8F9FA] dark:bg-slate-700 rounded-xl p-5 border border-[#E9ECEF] dark:border-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Label */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#6C757D] dark:text-gray-400 uppercase tracking-wider">
                        Label
                    </label>
                    <input
                        type="text"
                        value={form.label}
                        onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                        placeholder="e.g. Interested"
                        className="h-9 px-3 rounded-lg border border-[#DEE2E6] dark:border-slate-500 bg-white dark:bg-slate-800 text-sm text-[#212529] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FFCA06] focus:border-transparent"
                    />
                </div>

                {/* Color */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#6C757D] dark:text-gray-400 uppercase tracking-wider">
                        Color
                    </label>
                    <div className="flex gap-2 flex-wrap items-center h-9">
                        {(Object.keys(COLOR_MAP) as DispositionColor[]).map(col => (
                            <button
                                key={col}
                                onClick={() => setForm(f => ({ ...f, color: col }))}
                                className={`w-6 h-6 rounded-full ${COLOR_MAP[col].dot} transition-all ${form.color === col
                                    ? "ring-2 ring-offset-2 ring-[#FFCA06] scale-110"
                                    : "hover:scale-110"
                                    }`}
                                title={col}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Folder Action ── */}
            <div className="mt-5 pt-4 border-t border-[#E9ECEF] dark:border-slate-600">
                <div className="mb-2">
                    <p className="text-xs font-semibold text-[#6C757D] dark:text-gray-400 uppercase tracking-wider">
                        Folder Action
                    </p>
                    <p className="text-xs text-[#ADB5BD] dark:text-gray-500 mt-0.5">
                        When this disposition is applied to a contact, they will be moved to the linked folder.
                    </p>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                    {/* Option A: Auto-create */}
                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.folderMode === "auto"
                        ? "border-[#FFCA06] bg-yellow-50/60 dark:bg-yellow-900/10"
                        : "border-[#DEE2E6] dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500"
                        }`}>
                        <input
                            type="radio"
                            name="folderMode"
                            checked={form.folderMode === "auto"}
                            onChange={() => handleFolderMode("auto")}
                            className="mt-0.5 accent-[#FFCA06]"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <FolderPlus className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                                <span className="text-sm font-medium text-[#212529] dark:text-white">
                                    Auto-create a folder named after this disposition
                                </span>
                            </div>
                            {form.folderMode === "auto" && (
                                <p className="text-xs text-[#6C757D] dark:text-gray-400 mt-1">
                                    {existingFolderId && currentFolder
                                        ? <>Currently linked to: <span className="font-semibold text-gray-700 dark:text-gray-200">{currentFolder.name}</span></>
                                        : form.label.trim()
                                            ? <>A folder named <span className="font-semibold text-gray-700 dark:text-gray-200">"{form.label.trim()}"</span> will be created automatically.</>
                                            : "Enter a label first — the folder name will match it."
                                    }
                                </p>
                            )}
                        </div>
                    </label>

                    {/* Option B: Link existing */}
                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.folderMode === "existing"
                        ? "border-blue-400 bg-blue-50/60 dark:bg-blue-900/10"
                        : "border-[#DEE2E6] dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500"
                        }`}>
                        <input
                            type="radio"
                            name="folderMode"
                            checked={form.folderMode === "existing"}
                            onChange={() => handleFolderMode("existing")}
                            className="mt-0.5 accent-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <FolderOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="text-sm font-medium text-[#212529] dark:text-white">
                                    Link to an existing folder
                                </span>
                            </div>
                            {form.folderMode === "existing" && (
                                <div className="mt-2">
                                    <select
                                        value={form.targetFolderId || ""}
                                        onChange={e => setForm(f => ({ ...f, targetFolderId: e.target.value || null }))}
                                        className="w-full h-8 px-2 rounded-lg border border-[#DEE2E6] dark:border-slate-500 bg-white dark:bg-slate-800 text-sm text-[#212529] dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    >
                                        <option value="">Search folders...</option>
                                        {folders?.map(folder => (
                                            <option key={folder.id} value={folder.id}>
                                                {folder.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </label>

                    {/* Option C: None */}
                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.folderMode === "none"
                        ? "border-gray-400 bg-gray-50/60 dark:bg-gray-700/20"
                        : "border-[#DEE2E6] dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500"
                        }`}>
                        <input
                            type="radio"
                            name="folderMode"
                            checked={form.folderMode === "none"}
                            onChange={() => handleFolderMode("none")}
                            className="mt-0.5 accent-gray-500"
                        />
                        <div className="flex items-center gap-2">
                            <FolderX className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="text-sm font-medium text-[#212529] dark:text-white">
                                No folder action
                            </span>
                            <span className="text-xs text-[#ADB5BD] dark:text-gray-500">
                                — contact stays wherever it is
                            </span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Preview + Actions */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#DEE2E6] dark:border-slate-600">
                <div className="flex items-center gap-2 text-sm text-[#6C757D] dark:text-gray-400">
                    <span className="text-xs font-medium">Preview:</span>
                    <DispositionBadge disposition={preview} />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#6C757D] dark:text-gray-400 bg-white dark:bg-slate-800 border border-[#DEE2E6] dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button
                        onClick={() => form.label.trim() && onSave(form)}
                        disabled={!form.label.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#FFCA06] text-black hover:bg-[#f0bc00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save className="w-3.5 h-3.5" /> Save
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DispositionSettings() {
    const dispatch = useDispatch<AppDispatch>()
    const { dispositions } = useSelector((state: RootState) => state.dispositions)
    const { folders } = useSelector((state: RootState) => state.contactStructure)

    const [showAddForm, setShowAddForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        dispatch(fetchDispositions())
        dispatch(fetchFolders())
    }, [dispatch])

    function handleAdd(data: FormState) {
        const payload: any = {
            label: data.label,
            value: slugify(data.label),
            color: data.color,
            icon: data.icon,
            isSystem: false,
            isActive: true,
            order: dispositions.length + 1,
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
            // If already linked, keep existing folder — no new folder created on edit
            if (existing?.targetFolderId) {
                updatePayload.targetFolderId = existing.targetFolderId
            } else {
                // No existing folder → signal backend to auto-create
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

    const systemDispositions = dispositions.filter(d => d.isSystem)
    const customDispositions = dispositions.filter(d => !d.isSystem)

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[18px] font-semibold text-[#212529] dark:text-white">
                        Dispositions
                    </h2>
                    <p className="text-sm text-[#6C757D] dark:text-gray-400 mt-0.5">
                        Manage call outcomes used to mark contacts after a call
                    </p>
                </div>
                <button
                    onClick={() => { setShowAddForm(true); setEditingId(null) }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFCA06] text-black text-sm font-medium hover:bg-[#f0bc00] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Disposition
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <DispositionForm
                    onSave={handleAdd}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {/* System Dispositions — Call Outcomes */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#6C757D] dark:text-gray-400 uppercase tracking-wider">
                        CALL OUTCOMES
                    </span>
                    <span className="text-xs text-[#ADB5BD] dark:text-gray-500">(cannot be deleted)</span>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#E9ECEF] dark:border-slate-700 overflow-hidden">
                    {systemDispositions.map((disp, idx) => (
                        <DispositionRow
                            key={disp.id}
                            disposition={disp}
                            folders={folders}
                            isEditing={editingId === disp.id}
                            isLast={idx === systemDispositions.length - 1}
                            onEdit={() => setEditingId(disp.id)}
                            onSaveEdit={(data) => handleEdit(disp.id, data)}
                            onCancelEdit={() => setEditingId(null)}
                            onToggle={() => handleToggleActive(disp.id)}
                            onDelete={null}
                        />
                    ))}
                </div>
            </div>

            {/* Custom Dispositions */}
            <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-[#6C757D] dark:text-gray-400 uppercase tracking-wider">
                    DISPOSITIONS
                </span>

                {customDispositions.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-dashed border-[#DEE2E6] dark:border-slate-600 p-8 flex flex-col items-center gap-2">
                        <Tag className="w-8 h-8 text-[#ADB5BD] dark:text-gray-500" />
                        <p className="text-sm text-[#6C757D] dark:text-gray-400">No custom dispositions yet</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="text-sm text-[#FFCA06] font-medium hover:underline"
                        >
                            + Add one
                        </button>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#E9ECEF] dark:border-slate-700 overflow-hidden">
                        {customDispositions.map((disp, idx) => (
                            <DispositionRow
                                key={disp.id}
                                disposition={disp}
                                folders={folders}
                                isEditing={editingId === disp.id}
                                isLast={idx === customDispositions.length - 1}
                                onEdit={() => setEditingId(disp.id)}
                                onSaveEdit={(data) => handleEdit(disp.id, data)}
                                onCancelEdit={() => setEditingId(null)}
                                onToggle={() => handleToggleActive(disp.id)}
                                onDelete={() => handleDelete(disp.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function DispositionRow({
    disposition,
    folders,
    isEditing,
    isLast,
    onEdit,
    onSaveEdit,
    onCancelEdit,
    onToggle,
    onDelete,
}: {
    disposition: Disposition
    folders: any[]
    isEditing: boolean
    isLast: boolean
    onEdit: () => void
    onSaveEdit: (data: FormState) => void
    onCancelEdit: () => void
    onToggle: () => void
    onDelete: (() => void) | null
}) {
    const linkedFolder = folders?.find(f => f.id === disposition.targetFolderId)

    return (
        <div className={`${!isLast ? "border-b border-[#F1F3F5] dark:border-slate-700" : ""}`}>
            <div className={`flex items-center gap-3 px-4 py-3 ${!disposition.isActive ? "opacity-50" : ""}`}>
                {/* Drag handle */}
                <GripVertical className="w-4 h-4 text-[#CED4DA] dark:text-gray-600 cursor-grab flex-shrink-0" />

                {/* Color dot */}
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${COLOR_MAP[disposition.color]?.dot ?? "bg-gray-400"}`} />

                {/* Label + badges */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[#212529] dark:text-white truncate">
                            {disposition.label}
                        </span>
                        <span className="text-xs text-[#ADB5BD] dark:text-gray-500 font-mono bg-[#F8F9FA] dark:bg-slate-700 px-1.5 py-0.5 rounded">
                            {disposition.value}
                        </span>
                        {disposition.isSystem && (
                            <span className="text-[10px] font-medium text-[#6C757D] dark:text-gray-400 bg-[#F1F3F5] dark:bg-slate-700 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                System
                            </span>
                        )}
                        {linkedFolder && (
                            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <FolderOpen className="w-3 h-3" />
                                {linkedFolder.name}
                            </span>
                        )}
                    </div>
                </div>

                {/* Active toggle */}
                <button
                    onClick={onToggle}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${disposition.isActive ? "bg-[#FFCA06]" : "bg-[#DEE2E6] dark:bg-slate-600"
                        }`}
                >
                    <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${disposition.isActive ? "translate-x-4" : "translate-x-0.5"
                            }`}
                    />
                </button>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                    <button
                        onClick={onEdit}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6C757D] dark:text-gray-400 hover:bg-[#F8F9FA] dark:hover:bg-slate-700 hover:text-[#212529] dark:hover:text-white transition-colors"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6C757D] dark:text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Inline Edit Form */}
            {isEditing && (
                <div className="px-4 pb-4">
                    <DispositionForm
                        initial={{
                            label: disposition.label,
                            color: disposition.color,
                            icon: disposition.icon,
                            folderMode: disposition.targetFolderId ? "existing" : "none",
                            targetFolderId: disposition.targetFolderId,
                        }}
                        existingFolderId={disposition.targetFolderId}
                        onSave={onSaveEdit}
                        onCancel={onCancelEdit}
                    />
                </div>
            )}
        </div>
    )
}