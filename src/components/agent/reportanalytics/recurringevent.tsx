import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
import { TableComponent } from "@/components/common/tablecomponent";

const eventData = [
  {
    name: "Kathryn Murphy",
    startDate: "18/06/2021 09:13",
    repeat: 2,
    type: "Email",
  },
  { name: "Robert Fox", startDate: "29/10/2024 15:36", repeat: 3, type: "SMS" },
  {
    name: "Annette Black",
    startDate: "2021/11/2013 20:01",
    repeat: 1,
    type: "Call back",
  },
  {
    name: "Dianne Russell",
    startDate: "10/06/2021 19:30",
    repeat: 0,
    type: "Email",
  },
  {
    name: "Kathryn Murphy",
    startDate: "18/06/2021 09:13",
    repeat: 2,
    type: "Email",
  },
  { name: "Robert Fox", startDate: "29/10/2024 15:36", repeat: 3, type: "SMS" },
  {
    name: "Annette Black",
    startDate: "2021/11/2013 20:01",
    repeat: 1,
    type: "Call back",
  },
  {
    name: "Dianne Russell",
    startDate: "10/06/2021 19:30",
    repeat: 0,
    type: "Email",
  },
];

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

const RecurringEvent = () => {
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
        <TableProvider data={eventData} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </main>
    </Box>
  );
};

export default RecurringEvent;
