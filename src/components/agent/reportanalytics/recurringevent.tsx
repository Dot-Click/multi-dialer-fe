import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
import { TableComponent } from "@/components/common/tablecomponent";
import { useEffect, useMemo } from "react";
import { useRecurringEventsReport, type RecurringEventRow } from "@/hooks/useRecurringEventsReport";
import { Loader2 } from "lucide-react";

// Format an ISO date into "DD/MM/YYYY HH:mm"
const formatStartDate = (iso: string | null): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const columns = [
  {
    accessorKey: "name",
    header: () => <span>Name</span>,
    cell: (info: any) => (
      <span className="text-[#1D85F0] dark:text-blue-400 font-[400]">
        {info.getValue() || "-"}
      </span>
    ),
  },
  { accessorKey: "startDate", header: () => <span>Start Date</span> },
  { accessorKey: "repeat", header: () => <span>Repeat</span> },
  { accessorKey: "type", header: () => <span>Type</span> },
];

const RecurringEvent = ({ userId }: { userId?: string }) => {
  const { data, loading, getRecurringEvents } = useRecurringEventsReport();

  useEffect(() => {
    getRecurringEvents(userId || undefined);
  }, [userId, getRecurringEvents]);

  const tableData = useMemo(
    () =>
      (data as RecurringEventRow[]).map((row) => ({
        name: row.name,
        startDate: formatStartDate(row.startDate),
        repeat: row.repeat,
        type: row.type,
      })),
    [data]
  );

  return (
    <Box className="mt-3 w-full h-full">
      <style>
        {`
          /* BASE TABLE STYLING */
          table thead tr th, table thead {
            background: #F7F7F7 !important;
            box-shadow: none !important;
          }
          table thead tr th {
            padding: 10px !important;
            font-size: 14px;
            font-weight: 500;
            border-bottom: 1px solid #EBEDF0 !important;
            color: #0E1011;
          }
          table tbody tr td {
            padding: 10px !important;
            font-size: 14px;
            color:#495057 !important;
            font-weight: 400;
          }
          table tbody tr {
            border-bottom: 1px solid #EBEDF0 !important;
          }
          table tbody tr:last-child {
            border-bottom: none !important;
          }

          /* DARK MODE ADJUSTMENTS */
          :is(.dark) table thead tr th, :is(.dark) table thead { background: #334155 !important; } /* bg-slate-700 */
          :is(.dark) table thead tr th { 
              color: white !important; 
              border-bottom: 1px solid #475569 !important; 
          }
          :is(.dark) table tbody tr td { 
              color: #cbd5e1 !important; /* text-slate-300 */
          }
          :is(.dark) table tbody tr { border-bottom: 1px solid #475569 !important; }

          /* MOBILE ADJUSTMENT */
          @media (max-width: 768px) {
            table tbody tr td {
              padding: 14px 8px !important; /* thoda extra spacing for mobile */
            }
            table thead tr th {
              padding: 12px 8px !important; /* header spacing mobile */
            }
          }
        `}
      </style>

      <main>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500 dark:text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading recurring events...
          </div>
        ) : tableData.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400 dark:text-slate-500 italic">
            No recurring events found.
          </div>
        ) : (
          <TableProvider data={tableData} columns={columns}>
            {() => <TableComponent />}
          </TableProvider>
        )}
      </main>
    </Box>
  );
};

export default RecurringEvent;
