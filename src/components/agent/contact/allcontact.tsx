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
    <Box className="mt-3 m-2 w-full h-full">
      <main>
        {isLoading ? (
          <ContactTableSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <span className="text-red-500 dark:text-red-400 text-sm">{error}</span>
          </div>
        ) : (
          <TableProvider data={filteredContacts} columns={columns}>
            {({ selectedRows }) => (
              <>
                <SelectionHandler selectedRows={selectedRows} />
                <TableComponent />
              </>
            )}
          </TableProvider>
        )}
      </main>
    </Box>
  );
};

export default AllContact;