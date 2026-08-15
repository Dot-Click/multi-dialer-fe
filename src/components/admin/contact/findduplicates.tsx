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
import { FiSmartphone } from "react-icons/fi";

// --- Column Definitions ---
// Labels match ManageColumnsModal's STATIC_FIELDS so "Manage Columns" can
// toggle/reorder these. "Reason" and "Locations" aren't part of that list —
// they're specific to this page and always shown, same treatment as "select".

const PLAIN_TEXT_FIELDS: { key: string; accessorKey: string; label: string }[] = [
  { key: "Last Dialed", accessorKey: "lastDialedDate", label: "Last Dialed Date" },
  { key: "List", accessorKey: "list", label: "List" },
  { key: "Address", accessorKey: "address", label: "Address" },
  { key: "City", accessorKey: "city", label: "City" },
  { key: "State", accessorKey: "state", label: "State" },
  { key: "Zip", accessorKey: "zip", label: "Zip" },
  { key: "Description", accessorKey: "description", label: "Description" },
  { key: "Status", accessorKey: "status", label: "Status" },
];

export const DEFAULT_DUPLICATE_VISIBLE_COLUMNS = ["Name", "Last Dialed", "Phone", "Email", "Tags"];

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

// Fixed pixel widths so the two sticky-right columns stack cleanly without
// overlapping (Locations is the rightmost, at offset 0; Reason sits just to
// its left, offset by Locations' own width).
const LOCATIONS_STICKY_WIDTH = 160;
const REASON_STICKY_WIDTH = 130;

const reasonColumn = {
  accessorKey: "duplicateReason",
  header: (info: any) => <SortedHeader header={info.header} label="Reason" />,
  cell: ({ getValue }: any) => (
    <span className="text-red-500 font-medium text-xs dark:text-red-400">
      {getValue() || "Unknown"}
    </span>
  ),
  meta: {
    sticky: "right" as const,
    stickyOffsetPx: LOCATIONS_STICKY_WIDTH,
    stickyWidthPx: REASON_STICKY_WIDTH,
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
  meta: {
    sticky: "right" as const,
    stickyOffsetPx: 0,
    stickyWidthPx: LOCATIONS_STICKY_WIDTH,
  },
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
  Phone: phoneColumn,
  Email: emailColumn,
  Tags: tagsColumn,
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
    return [selectColumn, ...ordered, reasonColumn, locationsColumn];
  }, [visibleColumns]);

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
            {({ selectedRows }) => {
              // Sync selected rows back to parent
              useEffect(() => {
                onSelectionChange?.(selectedRows || []);
              }, [selectedRows]);

              return <TableComponent />;
            }}
          </TableProvider>
        )}
      </main>
    </Box>
  );
};

export default FindDuplicates;
