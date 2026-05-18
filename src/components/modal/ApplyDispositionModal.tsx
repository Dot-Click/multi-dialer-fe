"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDispositions } from "@/store/slices/dispositionSlice";
import { fetchFolders } from "@/store/slices/contactStructureSlice";
import { fetchContactById } from "@/store/slices/contactSlice";
import toast from "react-hot-toast";
import { X, Tag, Check, Loader2, Search, FolderOpen } from "lucide-react";

const COLOR_DOT: Record<string, string> = {
    red: "bg-red-500", orange: "bg-orange-500", yellow: "bg-yellow-400",
    green: "bg-emerald-500", blue: "bg-blue-500", purple: "bg-violet-500",
    gray: "bg-gray-400", pink: "bg-pink-500",
};

const COLOR_ACTIVE: Record<string, string> = {
    red: "bg-red-50 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400",
    orange: "bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400",
    yellow: "bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-400",
    green: "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400",
    blue: "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400",
    purple: "bg-violet-50 border-violet-300 text-violet-700 dark:bg-violet-900/20 dark:border-violet-700 dark:text-violet-400",
    gray: "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700/30 dark:border-gray-600 dark:text-gray-300",
    pink: "bg-pink-50 border-pink-300 text-pink-700 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-400",
};

const COLOR_IDLE = "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700";

interface Props {
    contactId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ApplyDispositionModal({ contactId, onClose, onSuccess }: Props) {
    const dispatch = useAppDispatch();
    const { dispositions } = useAppSelector(s => s.dispositions);
    const { folders } = useAppSelector(s => s.contactStructure);

    const [search, setSearch] = useState("");
    const [selectedDispId, setSelectedDispId] = useState<string | null>(null);
    const [overrideFolderId, setOverrideFolderId] = useState<string | null>(null);
    const [showFolderOverride, setShowFolderOverride] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        if (dispositions.length === 0) dispatch(fetchDispositions());
        if (!folders || folders.length === 0) dispatch(fetchFolders());
    }, []);

    const activeDispositions = useMemo(() => dispositions.filter(d => d.isActive), [dispositions]);
    const filtered = useMemo(() => {
        if (!search.trim()) return activeDispositions;
        const q = search.toLowerCase();
        return activeDispositions.filter(d => d.label.toLowerCase().includes(q));
    }, [activeDispositions, search]);

    const systemItems = filtered.filter(d => d.isSystem);
    const customItems = filtered.filter(d => !d.isSystem);

    const selectedDisp = dispositions.find(d => d.id === selectedDispId) ?? null;

    // When disposition is selected, auto-set the folder to its targetFolderId
    function handleSelectDisp(id: string) {
        const d = dispositions.find(x => x.id === id);
        if (!d) return;
        setSelectedDispId(id);
        setOverrideFolderId(d.targetFolderId ?? null);
        setShowFolderOverride(false);
    }

    async function handleApply() {
        if (!selectedDispId) return;
        setApplying(true);
        try {
            // const result = await dispatch(applyDisposition({
            //     contactId,
            //     dispositionId: selectedDispId,
            //     overrideFolderId: overrideFolderId || undefined,
            //     source: "MANUAL",
            // })).unwrap();

            const folderName = overrideFolderId
                ? folders?.find(f => f.id === overrideFolderId)?.name
                : undefined;

            toast.success(
                folderName
                    ? `Disposition applied · Moved to ${folderName}`
                    : "Disposition applied"
            );

            // Refresh contact detail
            await dispatch(fetchContactById(contactId));
            onSuccess?.();
            onClose();
        } catch (err: any) {
            toast.error(err?.message || "Failed to apply disposition");
        } finally {
            setApplying(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 w-full max-w-md max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">Apply Disposition</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-5 pt-4 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search dispositions..."
                            className="w-full h-8 pl-8 pr-3 text-sm rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                </div>

                {/* Disposition List */}
                <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 min-h-0">

                    {/* Call Outcomes (System) */}
                    {systemItems.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Call Outcomes
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {systemItems.map(d => {
                                    const isActive = selectedDispId === d.id;
                                    return (
                                        <button
                                            key={d.id}
                                            onClick={() => handleSelectDisp(d.id)}
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150 active:scale-95 ${isActive
                                                    ? (COLOR_ACTIVE[d.color] ?? COLOR_ACTIVE.gray)
                                                    : COLOR_IDLE
                                                }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full shrink-0 ${COLOR_DOT[d.color] ?? "bg-gray-400"}`} />
                                            {d.label}
                                            {isActive && <Check className="w-3 h-3 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Custom Dispositions */}
                    {customItems.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Dispositions
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {customItems.map(d => {
                                    const isActive = selectedDispId === d.id;
                                    return (
                                        <button
                                            key={d.id}
                                            onClick={() => handleSelectDisp(d.id)}
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150 active:scale-95 ${isActive
                                                    ? (COLOR_ACTIVE[d.color] ?? COLOR_ACTIVE.gray)
                                                    : COLOR_IDLE
                                                }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full shrink-0 ${COLOR_DOT[d.color] ?? "bg-gray-400"}`} />
                                            {d.label}
                                            {isActive && <Check className="w-3 h-3 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {filtered.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6">No dispositions found</p>
                    )}
                </div>

                {/* Folder Action Section */}
                {selectedDisp && (
                    <div className="mx-5 mb-3 mt-2 rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1.5">
                            <FolderOpen className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Folder Action</span>
                        </div>

                        {selectedDisp.targetFolderId && !showFolderOverride ? (
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    Contact will be moved to:{" "}
                                    <span className="font-semibold text-gray-800 dark:text-white">
                                        {folders?.find(f => f.id === (overrideFolderId || selectedDisp.targetFolderId))?.name || "..."}
                                    </span>
                                </p>
                                <button
                                    onClick={() => setShowFolderOverride(true)}
                                    className="text-xs text-blue-500 hover:text-blue-600 font-medium underline ml-3"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-gray-500 dark:text-gray-400">
                                    {selectedDisp.targetFolderId ? "Override folder:" : "Move contact to folder (optional):"}
                                </label>
                                <select
                                    value={overrideFolderId || ""}
                                    onChange={e => setOverrideFolderId(e.target.value || null)}
                                    className="h-8 w-full px-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                >
                                    <option value="">No folder action</option>
                                    {folders?.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="flex gap-3 px-5 pb-5 pt-2 border-t border-gray-100 dark:border-slate-700">
                    <button
                        onClick={onClose}
                        className="flex-1 h-9 rounded-xl text-sm border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={!selectedDispId || applying}
                        className="flex-1 h-9 rounded-xl text-sm font-semibold bg-[#FFCA06] hover:bg-[#f0bc00] text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
                    >
                        {applying
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying...</>
                            : <><Check className="w-3.5 h-3.5" /> Apply Disposition</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
