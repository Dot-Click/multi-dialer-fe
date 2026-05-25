import { useEffect, useMemo } from "react";
import { TableComponent } from "@/components/common/tablecomponent";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import { checkBoxProps } from "@/components/common/tablecomponent";
import callsicon from "../../../assets/callsicon.png";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContacts, fetchContactsByList, fetchContactsByFolder, type Contact } from "@/store/slices/contactSlice";
import type { Disposition } from "@/store/slices/dispositionSlice";
import { fetchDispositions } from "@/store/slices/dispositionSlice";

interface AllContactProps {
  onSelectionChange?: (selectedContacts: Contact[]) => void;
  listId?: string;
  folderId?: string;
  visibleColumns?: string[];
  searchTerm?: string;
}

// ─── Skeleton Loader ───────────────────────────────────────────────────────────
const ContactTableSkeleton = () => {
  const rows = Array.from({ length: 8 });
  const cols = Array.from({ length: 6 });

  return (
    <div className="w-full animate-pulse">
      {/* Header row */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-slate-700">
        <div className="h-4 w-4 rounded bg-gray-200 dark:bg-slate-700 shrink-0" />
        {cols.map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-gray-200 dark:bg-slate-700"
            style={{ width: `${[14, 18, 14, 16, 20, 12][i]}%` }}
          />
        ))}
      </div>

      {/* Data rows */}
      {rows.map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={`flex items-center gap-4 px-4 py-3.5 border-b border-gray-50 dark:border-slate-800 ${rowIdx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50/40 dark:bg-slate-800/40"
            }`}
        >
          {/* Checkbox */}
          <div className="h-4 w-4 rounded bg-gray-200 dark:bg-slate-700 shrink-0" />

          {/* Name — slightly wider + blue tint to hint it's a link */}
          <div className="h-3 rounded bg-blue-100 dark:bg-blue-900/30" style={{ width: "14%" }} />

          {/* Last Dialed */}
          <div className="h-3 rounded bg-gray-200 dark:bg-slate-700" style={{ width: "18%" }} />

          {/* Phone — icon + text */}
          <div className="flex items-center gap-2" style={{ width: "14%" }}>
            <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0" />
            <div className="h-3 rounded bg-gray-200 dark:bg-slate-700 flex-1" />
          </div>

          {/* Email */}
          <div className="h-3 rounded bg-gray-200 dark:bg-slate-700" style={{ width: "20%" }} />

          {/* List */}
          <div className="h-3 rounded bg-gray-200 dark:bg-slate-700" style={{ width: "12%" }} />

          {/* Tags — pill shape */}
          <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AllContact = ({ onSelectionChange, listId, folderId, visibleColumns, searchTerm }: AllContactProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { contacts, isLoading, error } = useAppSelector((state) => state.contacts);
  const { dispositions } = useAppSelector((state) => state.dispositions);

  const isAdmin = location.pathname.startsWith("/admin");
  const linkPath = isAdmin ? "/admin/contact-detail" : "contact-detail";

  useEffect(() => {
    if (folderId) {
      dispatch(fetchContactsByFolder(folderId));
    } else if (listId) {
      dispatch(fetchContactsByList(listId));
    } else {
      dispatch(fetchContacts());
    }
    // Ensure dispositions are loaded for the badge column
    dispatch(fetchDispositions());
  }, [dispatch, listId, folderId]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;
    const lowerSearch = searchTerm.toLowerCase();
    return contacts.filter((contact) => {
      const matchName = String(contact.name || "").toLowerCase().includes(lowerSearch);
      const matchEmail = String(contact.email || "").toLowerCase().includes(lowerSearch);
      const matchPhone = String(contact.phone || "").toLowerCase().includes(lowerSearch);
      const matchTags = String(contact.tags || "").toLowerCase().includes(lowerSearch);
      const matchList = String(contact.list || "").toLowerCase().includes(lowerSearch);

      return matchName || matchEmail || matchPhone || matchTags || matchList;
    });
  }, [contacts, searchTerm]);

  const allColumns = [
    {
      id: "select",
      header: (context: any) => {
        const props = checkBoxProps(context);
        return <Checkbox {...props} />;
      },
      cell: (context: any) => {
        const props = checkBoxProps(context);
        return <Checkbox {...props} />;
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
      cell: (info: any) => (
        <Link
          to={`${linkPath}/${info.row.original.id}`}
          className="text-[#1D85F0] dark:text-blue-400 cursor-pointer hover:underline"
        >
          {info.getValue()}
        </Link>
      ),
    },
    {
      accessorKey: "lastDialedDate",
      header: "Last Dialed Date",
      enableSorting: false,
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      enableSorting: false,
      cell: (info: any) => (
        <div className="flex items-center gap-2">
          <img
            src={callsicon}
            alt="call"
            className="w-4 h-4 object-contain dark:invert dark:opacity-60"
          />
          <span className="text-[#495057] dark:text-slate-300">{info.getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: false,
      cell: (info: any) => (
        <span className="text-[#495057] dark:text-slate-300">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "list",
      header: "List",
      enableSorting: false,
      cell: (info: any) => (
        <span className="text-[#495057] dark:text-slate-300">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      enableSorting: false,
      cell: (info: any) => {
        const tags = info.getValue()?.split(",") || [];
        return (
          <div className="flex flex-col items-start gap-1">
            {tags.map((tag: string, index: number) =>
              tag.trim() !== "-" ? (
                <Badge
                  key={index}
                  className="bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-slate-200 py-1 px-2 rounded-full w-fit text-xs font-medium"
                >
                  {tag.trim()}
                </Badge>
              ) : (
                <span key={index} className="text-gray-400 dark:text-slate-500">-</span>
              )
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "disposition",
      header: "Disposition",
      enableSorting: false,
      cell: (info: any) => {
        const value: string | null = info.getValue();
        if (!value) return null;
        const disp = dispositions.find((d: Disposition) => d.value === value);
        if (!disp) return <span className="text-xs text-gray-400">{value}</span>;
        const dotColors: Record<string, string> = {
          red: "bg-red-500", orange: "bg-orange-500", yellow: "bg-yellow-400",
          green: "bg-emerald-500", blue: "bg-blue-500", purple: "bg-violet-500",
          gray: "bg-gray-400", pink: "bg-pink-500",
        };
        const bgColors: Record<string, string> = {
          red: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
          orange: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
          yellow: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
          green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
          blue: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
          purple: "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
          gray: "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-300",
          pink: "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
        };
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${bgColors[disp.color] ?? bgColors.gray}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[disp.color] ?? dotColors.gray}`} />
            {disp.label}
          </span>
        );
      },
    },
  ];

  const columns = useMemo(() => {
    if (!visibleColumns || visibleColumns.length === 0) return allColumns;

    return allColumns.filter((col) => {
      if (col.id === "select") return true;
      return visibleColumns.some((vc) => {
        if (vc === "Name" && col.accessorKey === "name") return true;
        if (vc === "Email" && col.accessorKey === "email") return true;
        if (vc === "Phone" && col.accessorKey === "phone") return true;
        if (vc === "Last Dialed" && col.accessorKey === "lastDialedDate") return true;
        if (vc === "List" && col.accessorKey === "list") return true;
        if (vc === "Tags" && col.accessorKey === "tags") return true;
        if (vc === "Disposition" && col.accessorKey === "disposition") return true;
        return false;
      });
    });
  }, [visibleColumns, linkPath]);

  const SelectionHandler = ({ selectedRows }: { selectedRows: Contact[] | undefined }) => {
    useEffect(() => {
      if (onSelectionChange) {
        onSelectionChange(selectedRows || []);
      }
    }, [selectedRows, onSelectionChange]);
    return null;
  };

  return (
    <Box className="mt-3 w-full h-full flex flex-col">
      <main className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <ContactTableSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <span className="text-red-500 dark:text-red-400 text-sm">{error}</span>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col pb-20">
            <TableProvider data={filteredContacts} columns={columns}>
              {({ selectedRows }) => (
                <>
                  <SelectionHandler selectedRows={selectedRows} />
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <TableComponent />
                  </div>
                </>
              )}
            </TableProvider>
          </div>
        )}
      </main>
    </Box>
  );
};

export default AllContact;