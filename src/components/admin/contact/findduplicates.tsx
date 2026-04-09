import { useEffect } from "react";
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

// --- Updated Columns Definition ---

const columns = [
  {
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
  },
  {
    accessorKey: "name",
    header: (info: any) => <SortedHeader header={info.header} label="Name" />,
  },
  {
    accessorKey: "lastDialedDate",
    header: (info: any) => <SortedHeader header={info.header} label="Last Dialed Date" />,
  },
  {
    accessorKey: "phone",
    header: (info: any) => <SortedHeader header={info.header} label="Phone Number" />,
    cell: ({ getValue }: any) => (
      <div className="flex items-center gap-2">
        <FiSmartphone size={15} className="text-[#495057] dark:text-gray-300" strokeWidth={2.5} />
        <span className="text-[#495057] dark:text-gray-300">{getValue() || "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: (info: any) => <SortedHeader header={info.header} label="Email" />,
    cell: ({ getValue }: any) => (
      <span className="text-[#495057] dark:text-gray-300">{getValue() || "-"}</span>
    ),
  },
  {
    accessorKey: "list",
    header: (info: any) => <SortedHeader header={info.header} label="List" />,
  },
  {
    accessorKey: "tags",
    header: (info: any) => <SortedHeader header={info.header} label="Tags" />,
    cell: ({ getValue }: any) => {
      const tagsString = getValue();
      const tags = tagsString && tagsString !== "-" ? tagsString.split(",") : [];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.length > 0 ? (
            tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md w-fit text-xs font-medium border border-gray-200"
                >
                  {tag.trim()}
                </Badge>
            ))
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      );
    },
  },
];

// --- Final Component ---

const FindDuplicates = () => {
  const dispatch = useAppDispatch();
  const { duplicateContacts, isLoading } = useAppSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(fetchDuplicateContacts());
  }, [dispatch]);

  if (isLoading && duplicateContacts.length === 0) {
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
          /* Remove header background */
          table thead tr th,
          table thead {
            background: transparent !important;
            box-shadow: none !important;
          }
          table thead tr th > div {
            background: transparent !important;
          }

          /* Reduce padding & tighten rows */
          table thead tr th {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
            font-size: 13px; /* Text size reduced */
            border-bottom: 1px solid #EBEDF0 !important;
            color:#0E1011;
            font-weight: 500;
          }
          .dark table thead tr th {
            color: #FFFFFF !important;
            border-bottom: 1px solid #2D3748 !important;
          }
          /* Reduce padding & tighten rows */
          table tbody tr td {
            padding-top: 16px !important;
            padding-bottom: 16px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
            font-size: 13px; /* Text size reduced */
            vertical-align: top;
            color: #495057;
          }
          .dark table tbody tr td {
            color: #CBD5E0 !important;
          }

          /* Add darker border to rows */
          table tbody tr {
            border-bottom: 1px solid #EBEDF0 !important;
            transition: border-color 0.2s ease-in-out;
          }
          .dark table tbody tr {
            border-bottom: 1px solid #2D3748 !important;
          }

          table tbody tr:last-child {
            border-bottom: none !important;
          }
        `}
      </style>

      <main>
        {duplicateContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400">No duplicate contacts found.</p>
          </div>
        ) : (
          <TableProvider data={duplicateContacts} columns={columns}>
            {() => <TableComponent />}
          </TableProvider>
        )}
      </main>
    </Box>
  );
};

export default FindDuplicates;
