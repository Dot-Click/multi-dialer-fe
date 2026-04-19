import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import { IoAdd } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import {
  useContact,
  type ContactList,
  type ContactFolder,
} from "@/hooks/useContact";
import { useMiscFields } from "@/hooks/useSystemSettings";
import toast from "react-hot-toast";
import * as xlsx from "xlsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImportContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// FIX 1: Added miscFieldId to carry the DB id for misc fields
interface FieldMapping {
  systemField: string;    // display label — shown in the UI (f.fieldName for misc)
  csvHeader: string;      // selected CSV column header
  isMisc: boolean;
  miscFieldId?: string;   // MiscField.id from DB — used as the key in miscMappings payload
}

// Primary system fields — fixed, never dynamic
const PRIMARY_FIELDS = [
  "Name",
  "Email",
  "Phone",
  "Last Dialed Date",
  "List",
  "Tags",
];

type DuplicateScope = "Entire Database" | "File Import";
type DuplicateCheckField =
  | "Phone"
  | "Emails"
  | "Property Addresses"
  | "Mailing Addresses";
type DuplicateHandling = "Keep Old" | "Overwrite" | "Skip";

// ─── CSV Header Parser ────────────────────────────────────────────────────────

const parseFileHeaders = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    
    if (extension === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const firstLine = text.split(/\r?\n/)[0];
          const headers = firstLine
            .split(",")
            .map((h) => h.trim().replace(/^"|"$/g, ""))
            .filter(Boolean);
          resolve(headers);
        } catch {
          reject(new Error("Failed to parse CSV headers"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    } else if (extension === "xlsx" || extension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = xlsx.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const allRows = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          // Find the first row that actually contains some content
          const headerRow = allRows.find(row => 
            row && Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== "")
          );

          if (!headerRow) {
            reject(new Error("No headers detected in the file"));
            return;
          }

          resolve(headerRow.map(h => h?.toString().trim()).filter(Boolean));
        } catch {
          reject(new Error("Failed to parse Excel headers"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Unsupported file format"));
    }
  });
};

// ─── Auto-mapper ──────────────────────────────────────────────────────────────
// FIX 2: Removed all hardcoded misc field aliases (Birthday, Notes, Address etc.)
// Misc fields are dynamic — the admin defines them, we don't know their names at build time.
// Auto-mapping only applies to fixed PRIMARY_FIELDS.

const AUTO_MAP_ALIASES: Record<string, string[]> = {
  Name:               ["name", "full name", "fullname", "contact name", "first name", "firstname"],
  Email:              ["email", "email address", "e-mail", "mail"],
  Phone:              ["phone", "phone number", "mobile", "cell", "telephone", "number"],
  "Last Dialed Date": ["last dialed", "last called", "dialed date", "last dial"],
  List:               ["list", "calling list", "contact list"],
  Tags:               ["tags", "tag", "label", "labels"],
};

const autoMapHeaders = (
  csvHeaders: string[],
  systemFields: string[]
): Record<string, string> => {
  const result: Record<string, string> = {};
  const usedHeaders = new Set<string>();

  for (const sysField of systemFields) {
    const aliases = AUTO_MAP_ALIASES[sysField] || [];
    // Skip fields with no aliases (i.e. dynamic misc fields — never auto-map them)
    if (aliases.length === 0) continue;

    for (const csvHeader of csvHeaders) {
      if (usedHeaders.has(csvHeader)) continue;
      const normalized = csvHeader.toLowerCase().trim();
      if (aliases.some((alias) => normalized === alias || normalized.includes(alias))) {
        result[sysField] = csvHeader;
        usedHeaders.add(csvHeader);
        break;
      }
    }
  }
  return result;
};

// ─── Step Indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { label: "CHOOSE YOUR FILE", num: 1 },
  { label: "LIST OR FOLDER ASSIGNMENT", num: 2 },
  { label: "MAP YOUR FIELDS", num: 3 },
  { label: "CHECK FOR DUPLICATES", num: 4 },
];

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center gap-0 px-4 py-5 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700 overflow-x-auto shrink-0">
    {STEPS.map((step, idx) => {
      const done = currentStep > step.num;
      const active = currentStep === step.num;
      return (
        <React.Fragment key={step.num}>
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                ${done
                  ? "bg-green-500 border-green-500 text-white"
                  : active
                  ? "bg-[#FFCA06] border-[#FFCA06] text-black"
                  : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500 text-gray-400 dark:text-slate-400"
                }`}
            >
              {done ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : step.num}
            </div>
            <span className={`text-[9px] font-semibold tracking-wide text-center max-w-[80px] leading-tight
              ${done ? "text-green-600 dark:text-green-400"
                : active ? "text-[#b8960a] dark:text-[#FFCA06]"
                : "text-gray-400 dark:text-slate-500"}`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`h-[2px] w-8 sm:w-12 mx-1 mb-5 transition-all duration-300 shrink-0
              ${done ? "bg-green-400" : "bg-gray-200 dark:bg-slate-600"}`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Nav Buttons ──────────────────────────────────────────────────────────────

const NavButtons = ({
  step, totalSteps, onBack, onNext, onSubmit,
}: {
  step: number; totalSteps: number;
  onBack: () => void; onNext: () => void; onSubmit: () => void;
}) => (
  <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/60 shrink-0">
    {step > 1 && (
      <button onClick={onBack}
        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 font-semibold rounded-[12px] hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors text-[14px]"
      >
        ← Back
      </button>
    )}
    {step < totalSteps ? (
      <button onClick={onNext}
        className="flex-1 px-4 py-2.5 bg-[#FFCA06] text-black font-semibold rounded-[12px] hover:bg-[#eab700] transition-colors shadow-sm text-[14px] flex items-center justify-center gap-2"
      >
        Next <LuChevronRight size={16} />
      </button>
    ) : (
      <button onClick={onSubmit}
        className="flex-1 px-4 py-2.5 bg-[#FFCA06] text-black font-semibold rounded-[12px] hover:bg-[#eab700] transition-colors shadow-sm text-[14px]"
      >
        Import Contacts
      </button>
    )}
  </div>
);

// ─── Step 1: Upload File ──────────────────────────────────────────────────────

const Step1Upload = ({ file, setFile }: { file: File | null; setFile: (f: File | null) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (f: File) => {
    const extension = f.name.split(".").pop()?.toLowerCase();
    if (extension !== "csv" && extension !== "xlsx" && extension !== "xls") {
      toast.error("Please upload a CSV or Excel file");
      return;
    }
    setFile(f);
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
          Step 1: Locate And Upload Your File
        </h3>
        <p className="text-[13px] text-gray-500 dark:text-slate-400 leading-relaxed">
          In the following steps, we will walk you through importing your lead files.
          <span className="font-medium text-gray-700 dark:text-slate-300 mt-1 block">
            Accepted formats: <span className="font-bold text-gray-900 dark:text-white">.csv, .xlsx, .xls</span>
          </span>
        </p>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) validate(f); }}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
          ${file
            ? "border-green-300 dark:border-green-700 bg-green-50/30 dark:bg-green-900/10"
            : "border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 hover:border-[#FFCA06] dark:hover:border-yellow-600 hover:bg-yellow-50/20 dark:hover:bg-yellow-900/10"
          }`}
      >
        <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) validate(f); }} className="hidden" accept=".csv,.xlsx,.xls" />
        {file ? (
          <>
            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
              <FiCheckCircle size={28} />
            </div>
            <div className="text-center">
              <p className="text-[14px] font-semibold text-gray-900 dark:text-white">{file.name}</p>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[12px] text-red-500 dark:text-red-400 font-medium hover:underline">
              Remove file
            </button>
          </>
        ) : (
          <>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-full text-yellow-500 dark:text-yellow-400">
              <FiUploadCloud size={28} />
            </div>
            <div className="text-center">
              <p className="text-[14px] font-medium text-gray-800 dark:text-white">Click to upload or drag and drop</p>
              <p className="text-[12px] text-gray-400 dark:text-slate-500 mt-0.5">CSV or Excel files only</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Step 2: List or Group Assignment ────────────────────────────────────────

const Step2Assignment = ({
  lists, folders, selectedList, setSelectedList, selectedFolder, setSelectedFolder, loading,
}: {
  lists: ContactList[]; folders: ContactFolder[];
  selectedList: ContactList | null; setSelectedList: (l: ContactList | null) => void;
  selectedFolder: ContactFolder | null; setSelectedFolder: (f: ContactFolder | null) => void;
  loading: boolean;
}) => {
  const [listSearch, setListSearch] = useState("");
  const [folderSearch, setFolderSearch] = useState("");

  const filteredLists = lists.filter((l) => l.name.toLowerCase().includes(listSearch.toLowerCase()));
  const filteredFolders = folders.filter((f) => f.name.toLowerCase().includes(folderSearch.toLowerCase()));

  return (
    <div className="p-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Step 2: List or Folder Assignment</h3>
        <p className="text-[13px] text-gray-500 dark:text-slate-400 leading-relaxed">
          Select an existing list or folder, or create a new one with <strong className="text-gray-700 dark:text-slate-300">[+]</strong>.
          Select either a <strong className="text-gray-700 dark:text-slate-300">List</strong> OR a <strong className="text-gray-700 dark:text-slate-300">Folder</strong> — not both.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-sm text-gray-400 dark:text-slate-500 italic animate-pulse">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
            {/* Calling Lists */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-gray-700 dark:text-slate-300">Calling Lists</span>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-500 dark:text-slate-400"><IoIosSearch size={14} /></button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-500 dark:text-slate-400"><IoAdd size={14} /></button>
                </div>
              </div>
              <input type="text" placeholder="Search..." value={listSearch} onChange={(e) => setListSearch(e.target.value)}
                className="w-full text-[12px] px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg outline-none text-gray-700 dark:text-slate-300 placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
              <div className={`border rounded-xl overflow-hidden ${selectedFolder ? "opacity-40 pointer-events-none" : ""} border-gray-200 dark:border-slate-600 max-h-[200px] overflow-y-auto custom-scrollbar`}>
                {filteredLists.length === 0
                  ? <p className="text-[12px] text-gray-400 dark:text-slate-500 italic p-3 text-center">No lists found</p>
                  : filteredLists.map((list) => (
                    <div key={list.id} onClick={() => setSelectedList(selectedList?.id === list.id ? null : list)}
                      className={`px-3 py-2.5 text-[13px] cursor-pointer border-b last:border-0 border-gray-100 dark:border-slate-700 transition-colors
                        ${selectedList?.id === list.id ? "bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-white font-medium" : "hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300"}`}
                    >
                      {list.name}
                    </div>
                  ))}
              </div>
            </div>

            {/* OR divider */}
            <div className="flex flex-col items-center gap-1 pt-8">
              <div className="flex-1 w-px bg-gray-200 dark:bg-slate-700 min-h-[80px]" />
              <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">OR</span>
              <div className="flex-1 w-px bg-gray-200 dark:bg-slate-700 min-h-[80px]" />
            </div>

            {/* Folders */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-semibold text-gray-700 dark:text-slate-300">Folders</span>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500">
                    Hold <kbd className="px-1 bg-gray-100 dark:bg-slate-700 rounded text-[9px]">Ctrl</kbd> or{" "}
                    <kbd className="px-1 bg-gray-100 dark:bg-slate-700 rounded text-[9px]">Cmd</kbd> for multi-select
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-500 dark:text-slate-400"><IoIosSearch size={14} /></button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-500 dark:text-slate-400"><IoAdd size={14} /></button>
                </div>
              </div>
              <input type="text" placeholder="Search..." value={folderSearch} onChange={(e) => setFolderSearch(e.target.value)}
                className="w-full text-[12px] px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg outline-none text-gray-700 dark:text-slate-300 placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
              <div className={`border rounded-xl overflow-hidden ${selectedList ? "opacity-40 pointer-events-none" : ""} border-gray-200 dark:border-slate-600 max-h-[200px] overflow-y-auto custom-scrollbar`}>
                {filteredFolders.length === 0
                  ? <p className="text-[12px] text-gray-400 dark:text-slate-500 italic p-3 text-center">No folders found</p>
                  : filteredFolders.map((folder) => (
                    <div key={folder.id} onClick={() => setSelectedFolder(selectedFolder?.id === folder.id ? null : folder)}
                      className={`px-3 py-2.5 text-[13px] cursor-pointer border-b last:border-0 border-gray-100 dark:border-slate-700 transition-colors
                        ${selectedFolder?.id === folder.id ? "bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-white font-medium" : "hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300"}`}
                    >
                      {folder.name}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {(selectedList || selectedFolder) && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <FiCheckCircle size={14} className="text-yellow-600 dark:text-yellow-400 shrink-0" />
              <p className="text-[12px] text-yellow-700 dark:text-yellow-300 font-medium">
                Selected: <span className="font-bold">{selectedList ? selectedList.name : selectedFolder?.name}</span>{" "}
                ({selectedList ? "List" : "Folder"})
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── CSV Header Dropdown ──────────────────────────────────────────────────────

const HeaderDropdown = ({
  value, onChange, csvHeaders, placeholder = "Select CSV column...",
}: {
  value: string; onChange: (val: string) => void;
  csvHeaders: string[]; placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = csvHeaders.filter((h) => h.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative flex-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-1.5 text-[13px] rounded-lg border transition-colors text-left
          ${value
            ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300"
            : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:border-[#FFCA06] dark:hover:border-yellow-600"
          }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {value && (
            <span onClick={(e) => { e.stopPropagation(); onChange(""); }} className="text-red-400 hover:text-red-600 dark:text-red-500 p-0.5 rounded">
              <IoClose size={13} />
            </span>
          )}
          <LuChevronDown size={13} className={`transition-transform duration-200 text-gray-400 dark:text-slate-500 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100 dark:border-slate-700">
            <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search headers..."
              className="w-full text-[12px] px-2 py-1 bg-gray-50 dark:bg-slate-700 rounded-md outline-none text-gray-700 dark:text-slate-300 placeholder:text-gray-400 dark:placeholder:text-slate-500 border border-gray-200 dark:border-slate-600"
            />
          </div>
          <div className="max-h-[160px] overflow-y-auto custom-scrollbar">
            <div onClick={() => { onChange(""); setOpen(false); setSearch(""); }}
              className="px-3 py-2 text-[12px] text-gray-400 dark:text-slate-500 italic cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-50 dark:border-slate-700/50"
            >
              — None —
            </div>
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-[12px] text-gray-400 dark:text-slate-500 italic text-center">No headers found</p>
            ) : (
              filtered.map((h) => (
                <div key={h} onClick={() => { onChange(h); setOpen(false); setSearch(""); }}
                  className={`px-3 py-2 text-[13px] cursor-pointer transition-colors border-b last:border-0 border-gray-50 dark:border-slate-700/30
                    ${value === h ? "bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-white font-medium" : "hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300"}`}
                >
                  {h}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Mapping Row ──────────────────────────────────────────────────────────────

const MappingRow = ({
  systemField, csvHeader, onChange, csvHeaders,
}: {
  systemField: string; csvHeader: string;
  onChange: (val: string) => void; csvHeaders: string[];
}) => (
  <div className="flex items-center gap-2 py-2 border-b border-gray-50 dark:border-slate-700/50 last:border-0">
    <HeaderDropdown value={csvHeader} onChange={onChange} csvHeaders={csvHeaders} placeholder="CSV column header..." />
    <div className="flex items-center shrink-0 text-gray-300 dark:text-slate-600">
      <div className="w-2 h-px bg-current" />
      <div className="w-2 h-px bg-current" />
      <LuChevronRight size={14} className="text-gray-400 dark:text-slate-500" />
    </div>
    <div className="flex-1">
      <div className={`px-3 py-1.5 text-[13px] rounded-lg font-medium truncate border
        ${csvHeader
          ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
          : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300"
        }`}
      >
        {systemField}
      </div>
    </div>
  </div>
);

// ─── Step 3: Map Your Fields ──────────────────────────────────────────────────

const Step3MapFields = ({
  mappings, setMappings, csvHeaders, miscFieldsLoading,
}: {
  mappings: FieldMapping[];
  setMappings: (m: FieldMapping[]) => void;
  csvHeaders: string[];
  miscFieldsLoading: boolean;
}) => {
  // FIX 3: update by miscFieldId for misc rows, by systemField for primary rows
  // This prevents keying collisions if a misc fieldName happens to match a primary field name
  const update = (mapping: FieldMapping, csvHeader: string) =>
    setMappings(
      mappings.map((m) => {
        if (m.isMisc && mapping.isMisc) return m.miscFieldId === mapping.miscFieldId ? { ...m, csvHeader } : m;
        return m.systemField === mapping.systemField ? { ...m, csvHeader } : m;
      })
    );

  const primaryMappings = mappings.filter((m) => !m.isMisc);
  const miscMappings = mappings.filter((m) => m.isMisc);
  const mappedCount = mappings.filter((m) => m.csvHeader).length;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Step 3: Map Your Fields</h3>
          <p className="text-[13px] text-gray-500 dark:text-slate-400">
            Select your CSV column header from the dropdown on the left and match it to the system field on the right.
          </p>
        </div>
        {mappedCount > 0 && (
          <div className="shrink-0 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <span className="text-[11px] font-semibold text-green-700 dark:text-green-400">{mappedCount} auto-mapped</span>
          </div>
        )}
      </div>

      {csvHeaders.length === 0 ? (
        <div className="flex items-center justify-center h-20 text-[13px] text-gray-400 dark:text-slate-500 italic">
          No CSV headers detected. Please go back and re-upload your file.
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Your CSV Column</div>
            <div className="w-8" />
            <div className="flex-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">System Field</div>
          </div>

          {/* Primary Fields */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">Primary Fields</p>
            <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-xl px-3 py-1">
              {primaryMappings.map((m) => (
                <MappingRow key={m.systemField} systemField={m.systemField} csvHeader={m.csvHeader}
                  onChange={(val) => update(m, val)} csvHeaders={csvHeaders} />
              ))}
            </div>
          </div>

          {/* Misc Fields */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Miscellaneous Fields</p>
              {miscFieldsLoading && (
                <span className="text-[10px] text-gray-400 dark:text-slate-500 italic animate-pulse">Loading...</span>
              )}
            </div>
            {miscMappings.length === 0 && !miscFieldsLoading ? (
              <p className="text-[12px] text-gray-400 dark:text-slate-500 italic px-3 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                No miscellaneous fields configured. Add them in System Settings → Misc Fields.
              </p>
            ) : (
              <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-xl px-3 py-1">
                {/* FIX 4: key by miscFieldId (stable DB id) not systemField (display name that could change) */}
                {miscMappings.map((m) => (
                  <MappingRow key={m.miscFieldId} systemField={m.systemField} csvHeader={m.csvHeader}
                    onChange={(val) => update(m, val)} csvHeaders={csvHeaders} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Step 4: Check Duplicates ─────────────────────────────────────────────────

const YellowCheckbox = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <div className="relative flex items-center shrink-0">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 dark:border-slate-500 transition-all checked:bg-[#FFCA06] checked:border-[#FFCA06]" />
      <svg className="absolute h-2.5 w-2.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <span className="text-[13px] text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors font-medium">{label}</span>
  </label>
);

const Step4Duplicates = ({
  dupScope, setDupScope, dupFields, setDupFields, dupHandling, setDupHandling,
}: {
  dupScope: DuplicateScope[]; setDupScope: (v: DuplicateScope[]) => void;
  dupFields: DuplicateCheckField[]; setDupFields: (v: DuplicateCheckField[]) => void;
  dupHandling: DuplicateHandling; setDupHandling: (v: DuplicateHandling) => void;
}) => {
  const [handlingOpen, setHandlingOpen] = useState(false);

  const handlingDescriptions: Record<DuplicateHandling, string> = {
    "Keep Old": "Keep Old (Recommended): Selecting this will keep original records in your database and not allow a new record with the same information to be imported.",
    "Overwrite": "Overwrite: New records will replace existing records with matching information.",
    "Skip": "Skip: Duplicate records will be skipped entirely and not imported.",
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Step 4: Check for Duplicates</h3>
        <p className="text-[13px] text-gray-500 dark:text-slate-400 leading-relaxed">
          <strong className="text-gray-700 dark:text-slate-300">Optional:</strong> Check incoming data for duplicates. Leave all unchecked to skip duplicate checking.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Where to check?</p>
          <div className="space-y-2.5">
            {(["Entire Database", "File Import"] as DuplicateScope[]).map((s) => (
              <YellowCheckbox key={s} checked={dupScope.includes(s)} label={s}
                onChange={() => setDupScope(dupScope.includes(s) ? dupScope.filter((x) => x !== s) : [...dupScope, s])} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">How to check?</p>
          <div className="space-y-2.5">
            {(["Phone", "Emails", "Property Addresses", "Mailing Addresses"] as DuplicateCheckField[]).map((f) => (
              <YellowCheckbox key={f} checked={dupFields.includes(f)} label={f}
                onChange={() => setDupFields(dupFields.includes(f) ? dupFields.filter((x) => x !== f) : [...dupFields, f])} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">How to handle?</p>
          <div className="relative">
            <button onClick={() => setHandlingOpen(!handlingOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-[13px] text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-500 transition-colors"
            >
              {dupHandling}
              <LuChevronDown size={14} className={`transition-transform duration-200 ${handlingOpen ? "rotate-180" : ""}`} />
            </button>
            {handlingOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-lg shadow-xl overflow-hidden">
                {(["Keep Old", "Overwrite", "Skip"] as DuplicateHandling[]).map((h) => (
                  <div key={h} onClick={() => { setDupHandling(h); setHandlingOpen(false); }}
                    className={`px-3 py-2 text-[13px] cursor-pointer transition-colors
                      ${dupHandling === h ? "bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-white font-semibold" : "hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300"}`}
                  >
                    {h}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl">
            <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">{handlingDescriptions[dupHandling]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

const ImportContactModal: React.FC<ImportContactModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { getContactLists, getContactFolders, importContacts } = useContact();
  const { data: miscFieldsData = [], isLoading: miscFieldsLoading } = useMiscFields();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);

  const [lists, setLists] = useState<ContactList[]>([]);
  const [folders, setFolders] = useState<ContactFolder[]>([]);
  const [selectedList, setSelectedList] = useState<ContactList | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<ContactFolder | null>(null);

  const [mappings, setMappings] = useState<FieldMapping[]>([]);

  const [dupScope, setDupScope] = useState<DuplicateScope[]>(["Entire Database", "File Import"]);
  const [dupFields, setDupFields] = useState<DuplicateCheckField[]>(["Phone"]);
  const [dupHandling, setDupHandling] = useState<DuplicateHandling>("Keep Old");

  // FIX 5: allSystemFields now carries miscFieldId correctly on every misc entry
  const allSystemFields = useMemo((): FieldMapping[] => {
    return [
      ...PRIMARY_FIELDS.map((f) => ({
        systemField: f,
        csvHeader: "",
        isMisc: false,
        miscFieldId: undefined,
      })),
      ...miscFieldsData
        .filter((f: any) => !!f.fieldName)
        .map((f: any) => ({
          systemField: f.fieldName,  // shown in UI
          csvHeader: "",
          isMisc: true,
          miscFieldId: f.id,         // key used in the payload
        })),
    ];
  }, [miscFieldsData]);

  // FIX 6: Single useEffect handles both file change and misc fields load.
  // Merged the two separate useEffects to avoid the second one overwriting
  // mappings built by the first (which correctly had miscFieldId).
  useEffect(() => {
    if (!file) {
      // No file — just build empty mappings from current allSystemFields
      setMappings(allSystemFields.map((f) => ({ ...f, csvHeader: "" })));
      setCsvHeaders([]);
      return;
    }

    parseFileHeaders(file)
      .then((headers) => {
        setCsvHeaders(headers);
        const autoMapped = autoMapHeaders(headers, allSystemFields.map((f) => f.systemField));
        setMappings(
          allSystemFields.map((f) => ({
            ...f,
            csvHeader: autoMapped[f.systemField] || "",
          }))
        );
      })
      .catch(() => toast.error("Could not read file headers"));
  }, [file, allSystemFields]); // allSystemFields covers both file change and misc fields load

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      const fetchData = async () => {
        setLoading(true);
        try {
          const [allLists, allFolders] = await Promise.all([getContactLists(), getContactFolders()]);
          setLists(allLists);
          setFolders(allFolders);
        } catch {
          toast.error("Failed to load lists and folders");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setFile(null);
      setCsvHeaders([]);
      setSelectedList(null);
      setSelectedFolder(null);
      setMappings(allSystemFields.map((f) => ({ ...f, csvHeader: "" })));
      setDupScope(["Entire Database", "File Import"]);
      setDupFields(["Phone"]);
      setDupHandling("Keep Old");
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step === 1 && !file) { toast.error("Please upload a file first"); return; }
    if (step === 2 && !selectedList && !selectedFolder) { toast.error("Please select a List or a Folder"); return; }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!file) { toast.error("No file selected"); return; }

    const formData = new FormData();
    formData.append("file", file);
    if (selectedList)   formData.append("contactListId",   selectedList.id);
    if (selectedFolder) formData.append("contactFolderId", selectedFolder.id);

    // Primary fields — keyed by system field name e.g. { "Name": "full_name" }
    const primaryMappings: Record<string, string> = {};
    mappings
      .filter((m) => !m.isMisc && m.csvHeader.trim())
      .forEach((m) => { primaryMappings[m.systemField] = m.csvHeader.trim(); });

    // FIX 7: Misc fields — keyed by MiscField.id e.g. { "3ccbf011-...": "dob_col" }
    // m.miscFieldId is now always set because allSystemFields carries it correctly
    const miscMappings: Record<string, string> = {};
    mappings
      .filter((m) => m.isMisc && m.miscFieldId && m.csvHeader.trim())
      .forEach((m) => { miscMappings[m.miscFieldId!] = m.csvHeader.trim(); });

    formData.append("fieldMappings", JSON.stringify(primaryMappings));
    formData.append("miscMappings",  JSON.stringify(miscMappings));
    formData.append("dupScope",      JSON.stringify(dupScope));
    formData.append("dupFields",     JSON.stringify(dupFields));
    formData.append("dupHandling",   dupHandling);

    try {
      await importContacts(formData);
      toast.success("Contacts imported successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      toast.error("Import failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    // FIX 8: z-1000 → z-[1000] (valid Tailwind arbitrary value)
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-[640px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">Import Wizard</h2>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Step {step} of {STEPS.length}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200">
            <IoClose size={22} />
          </button>
        </div>

        <StepIndicator currentStep={step} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {step === 1 && <Step1Upload file={file} setFile={setFile} />}
          {step === 2 && (
            <Step2Assignment lists={lists} folders={folders} selectedList={selectedList}
              setSelectedList={setSelectedList} selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder} loading={loading} />
          )}
          {step === 3 && (
            <Step3MapFields mappings={mappings} setMappings={setMappings}
              csvHeaders={csvHeaders} miscFieldsLoading={miscFieldsLoading} />
          )}
          {step === 4 && (
            <Step4Duplicates dupScope={dupScope} setDupScope={setDupScope}
              dupFields={dupFields} setDupFields={setDupFields}
              dupHandling={dupHandling} setDupHandling={setDupHandling} />
          )}
        </div>

        <NavButtons step={step} totalSteps={STEPS.length}
          onBack={() => setStep((s) => s - 1)} onNext={handleNext} onSubmit={handleSubmit} />
      </div>
    </div>,
    document.body
  );
};

export default ImportContactModal;