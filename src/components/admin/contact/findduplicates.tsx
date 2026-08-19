import { useEffect, useMemo } from "react";
import { SortedHeader, TableComponent } from "@/components/common/tablecomponent";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDuplicateContacts } from "@/store/slices/contactSlice";
// --- Your local icon asset ---
// import callsicon from "../../../assets/callsicon.png";
// --- Icons imported from react-icons library ---
// import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FiSmartphone, FiMail, FiHome, FiMapPin, FiUsers } from "react-icons/fi";

// --- Column Definitions ---
// Labels match ManageColumnsModal's fields so "Manage Columns" can
// toggle/reorder these. "Group", "Reason" and "Locations" are page-specific
// extra fields (passed to the modal via `extraFields`) — like every other
// column, their position in the table is just wherever they land in
// visibleColumns, so the user can drag them next to Name if they want them
// always in view without scrolling.

const PLAIN_TEXT_FIELDS: { key: string; accessorKey: string; label: string }[] = [
  { key: "Last Dialed", accessorKey: "lastDialedDate", label: "Last Dialed Date" },
  { key: "List", accessorKey: "list", label: "List" },
  { key: "Address", accessorKey: "address", label: "Address" },
  { key: "City", accessorKey: "city", label: "City" },
  { key: "State", accessorKey: "state", label: "State" },
  { key: "Zip", accessorKey: "zip", label: "Zip" },
  { key: "Status", accessorKey: "status", label: "Status" },
];

export const DEFAULT_DUPLICATE_VISIBLE_COLUMNS = ["Name", "Group", "Last Dialed", "Phone", "Email", "Tags", "Reason", "Locations"];

// The extra, page-specific fields Manage Columns should offer here in
// addition to its own static list — these aren't real contact fields, they're
// unique to the duplicates view.
export const DUPLICATE_EXTRA_FIELDS = ["Group", "Reason", "Locations"];

const selectColumn = {
  id: "select",
  header: ({ table }: any) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }: any) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
};

const nameColumn = {
  accessorKey: "name",
  header: (info: any) => <SortedHeader header={info.header} label="Name" />,
};

const phoneColumn = {
  accessorKey: "phone",
  header: (info: any) => <SortedHeader header={info.header} label="Phone Number" />,
  cell: ({ getValue }: any) => (
    <div className="flex items-center gap-2">
      <FiSmartphone size={15} className="text-[#495057] dark:text-gray-300" strokeWidth={2.5} />
      <span className="text-[#495057] dark:text-gray-300">{getValue() || "-"}</span>
    </div>
  ),
};

const emailColumn = {
  accessorKey: "email",
  header: (info: any) => <SortedHeader header={info.header} label="Email" />,
  cell: ({ getValue }: any) => (
    <span className="text-[#495057] dark:text-gray-300">{getValue() || "-"}</span>
  ),
};

const tagsColumn = {
  accessorKey: "tags",
  header: (info: any) => <SortedHeader header={info.header} label="Tags" />,
  cell: ({ getValue }: any) => {
    const rawTags = getValue();
    const tags = Array.isArray(rawTags) ? rawTags :
                 (typeof rawTags === 'string' && rawTags.length > 0 ? rawTags.split(',') : []);

    return (
      <div className="flex flex-wrap gap-1">
        {tags.length > 0 ? (
          tags.map((tag: any, index: number) => {
            const tagValue = typeof tag === 'string' ? tag.trim() : JSON.stringify(tag);
            return (
              <Badge
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md w-fit text-xs font-medium border border-gray-200"
              >
                {tagValue}
              </Badge>
            );
          })
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
    );
  },
};

const descriptionColumn = {
  accessorKey: "description",
  header: (info: any) => <SortedHeader header={info.header} label="Description" />,
  cell: ({ getValue }: any) => {
    const value = getValue();
    return (
      <span
        title={value || undefined}
        className="text-[#495057] dark:text-gray-300 block max-w-[220px] truncate"
      >
        {value || "-"}
      </span>
    );
  },
};

// Badge styling per match reason, so it's immediately clear WHY two contacts
// were flagged together — not just that they were. Colors are distinct per
// field so a contact matched on multiple fields (e.g. Phone + Address) shows
// a stack of differently-colored badges instead of one ambiguous label.
const REASON_BADGE_STYLES: Record<string, { className: string; icon: JSX.Element }> = {
  "Phone Match": {
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/40",
    icon: <FiSmartphone size={11} />,
  },
  "Email Match": {
    className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/40",
    icon: <FiMail size={11} />,
  },
  "Property Address Match": {
    className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/40",
    icon: <FiHome size={11} />,
  },
  "Mailing Address Match": {
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/40",
    icon: <FiMapPin size={11} />,
  },
};

const reasonColumn = {
  accessorKey: "duplicateReason",
  header: (info: any) => <SortedHeader header={info.header} label="Match Reason" />,
  cell: ({ getValue }: any) => {
    const raw = getValue();
    const reasons = typeof raw === "string" && raw.length > 0 && raw !== "-"
      ? raw.split(",").map((r: string) => r.trim()).filter(Boolean)
      : [];

    if (reasons.length === 0) {
      return <span className="text-gray-400 text-xs">Unknown</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {reasons.map((reason: string) => {
          const style = REASON_BADGE_STYLES[reason] || {
            className: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/40",
            icon: null,
          };
          return (
            <span
              key={reason}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border whitespace-nowrap ${style.className}`}
            >
              {style.icon}
              {reason}
            </span>
          );
        })}
      </div>
    );
  },
};

// "Group of N" badge — the plainest possible signal that this row is part of
// a matched cluster and roughly how big that cluster is, reinforcing the row
// banding below (getRowClassName) that visually couples the group together.
const groupColumn = {
  accessorKey: "duplicateGroupSize",
  header: (info: any) => <SortedHeader header={info.header} label="Group" />,
  cell: ({ getValue }: any) => {
    const size = getValue() || 1;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
        <FiUsers size={11} />
        Group of {size}
      </span>
    );
  },
};

const locationsColumn = {
  accessorKey: "locationContext",
  header: (info: any) => <SortedHeader header={info.header} label="Locations" />,
  cell: ({ getValue }: any) => (
    <span className="text-[11px] text-gray-400 dark:text-gray-500 italic block leading-tight">
      {getValue() || "-"}
    </span>
  ),
};

const plainColumns = PLAIN_TEXT_FIELDS.reduce<Record<string, any>>((acc, { key, accessorKey, label }) => {
  acc[key] = {
    accessorKey,
    header: (info: any) => <SortedHeader header={info.header} label={label} />,
    cell: ({ getValue }: any) => (
      <span className="text-[#495057] dark:text-gray-300">{getValue() || "-"}</span>
    ),
  };
  return acc;
}, {});

const colByLabel: Record<string, any> = {
  Name: nameColumn,
  Group: groupColumn,
  Phone: phoneColumn,
  Email: emailColumn,
  Tags: tagsColumn,
  Description: descriptionColumn,
  Reason: reasonColumn,
  Locations: locationsColumn,
  ...plainColumns,
};

// --- Final Component ---

const FindDuplicates = ({
  onSelectionChange,
  listId,
  folderId,
  visibleColumns,
}: {
  onSelectionChange?: (rows: any[]) => void
  listId?: string
  folderId?: string
  visibleColumns?: string[]
}) => {
  const dispatch = useAppDispatch();
  const { duplicateContacts, isLoading } = useAppSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(fetchDuplicateContacts({ listId, folderId }));
  }, [dispatch, listId, folderId]);

  const columns = useMemo(() => {
    const labels = visibleColumns && visibleColumns.length > 0 ? visibleColumns : DEFAULT_DUPLICATE_VISIBLE_COLUMNS;
    const ordered = labels.map((label) => colByLabel[label]).filter(Boolean);
    return [selectColumn, ...ordered];
  }, [visibleColumns]);

  // The backend already returns duplicateContacts pre-sorted so every member
  // of a matched cluster (same duplicateGroupId) is adjacent. Derive a stable
  // 0-based order index per group here so we can alternate a background tint
  // across groups, and mark each group's first row with a top border — the
  // "coupled right near one another" visual Jason asked for, on top of the
  // Match Reason / Group badges above.
  //
  // This index is only meaningful in that default, server-grouped order:
  // TanStack's client-side getSortedRowModel is a per-column sort (Name,
  // Phone, Email, ...), and duplicate members of a group almost never share
  // those values, so a re-sort scatters a group's rows across the table
  // instead of keeping them adjacent. Recomputing this index from the
  // post-sort row order wouldn't produce coherent banding either — there's
  // no "first row of the cluster" once the cluster isn't contiguous, so the
  // tint/border would still land on effectively arbitrary rows. Instead we
  // suppress the tint/border entirely while a column sort is active (see
  // `isDefaultOrder` below) and keep the "Group of N" / Match Reason badges,
  // which stay correct regardless of row order.
  const { groupOrderIndex, groupStartIds } = useMemo(() => {
    const orderIndex = new Map<string, number>();
    const startIds = new Set<string>();
    let nextIndex = 0;
    for (const c of duplicateContacts) {
      const groupId = (c as any).duplicateGroupId;
      if (!groupId) continue;
      if (!orderIndex.has(groupId)) {
        orderIndex.set(groupId, nextIndex++);
        startIds.add(c.id);
      }
    }
    return { groupOrderIndex: orderIndex, groupStartIds: startIds };
  }, [duplicateContacts]);

  const getRowClassName = (row: any) => {
    const original = row.original || {};
    const groupId = original.duplicateGroupId;
    if (!groupId) return undefined;
    const idx = groupOrderIndex.get(groupId) ?? 0;
    const isGroupStart = groupStartIds.has(original.id);
    return [
      idx % 2 === 0 ? "bg-amber-50/50 dark:bg-amber-900/10" : "",
      isGroupStart ? "border-t-2 border-t-[#FFCA06]" : "",
    ].filter(Boolean).join(" ");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFCA06]"></div>
      </div>
    );
  }

  return (
    <Box className="mt-3 w-full h-full">
      <style>
        {`
          /* ... unchanged styles ... */
        `}
      </style>

      <main>
        {duplicateContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400">No duplicate contacts found.</p>
          </div>
        ) : (
          <TableProvider data={duplicateContacts} columns={columns}>
            {({ selectedRows, table }) => {
              // Sync selected rows back to parent
              useEffect(() => {
                onSelectionChange?.(selectedRows || []);
              }, [selectedRows]);

              // Group banding assumes the server's default clustered order.
              // Once the user clicks a column header (TanStack's client-side
              // getSortedRowModel takes over), that adjacency is gone, so
              // stop passing getRowClassName rather than render a tint/border
              // pattern that no longer lines up with the actual clusters.
              // "Group of N" and Match Reason badges are unaffected — they're
              // derived per-row from the contact's own data, not row order.
              const isDefaultOrder = table.getState().sorting.length === 0;

              return (
                <TableComponent
                  getRowClassName={isDefaultOrder ? getRowClassName : undefined}
                />
              );
            }}
          </TableProvider>
        )}
      </main>
    </Box>
  );
};

export default FindDuplicates;
