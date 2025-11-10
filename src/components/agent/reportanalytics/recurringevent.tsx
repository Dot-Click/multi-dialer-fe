

import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
import { SortedHeader, TableComponent } from "@/components/common/tablecomponent";

const eventData = [
  { name: "Kathryn Murphy", startDate: "18/06/2021 09:13", repeat: 2, type: "Email" },
  { name: "Robert Fox", startDate: "29/10/2024 15:36", repeat: 3, type: "SMS" },
  { name: "Annette Black", startDate: "2021/11/2013 20:01", repeat: 1, type: "Call back" },
  { name: "Dianne Russell", startDate: "10/06/2021 19:30", repeat: 0, type: "Email" },
  { name: "Kathryn Murphy", startDate: "18/06/2021 09:13", repeat: 2, type: "Email" },
  { name: "Robert Fox", startDate: "29/10/2024 15:36", repeat: 3, type: "SMS" },
  { name: "Annette Black", startDate: "2021/11/2013 20:01", repeat: 1, type: "Call back" },
  { name: "Dianne Russell", startDate: "10/06/2021 19:30", repeat: 0, type: "Email" },
];

const columns = [
  {
    accessorKey: "name",
    header: (info: any) => <SortedHeader header={info.header} label="Name" />,
    cell: (info: any) => (
      <span style={{ color: "#1D85F0", fontWeight: 500 }}>{info.getValue()}</span>
    ),
  },
  {
    accessorKey: "startDate",
    header: (info: any) => <SortedHeader header={info.header} label="Start Date" />,
  },
  {
    accessorKey: "repeat",
    header: (info: any) => <SortedHeader header={info.header} label="Repeat" />,
  },
  {
    accessorKey: "type",
    header: (info: any) => <SortedHeader header={info.header} label="Type" />,
  },
];

const RecurringEvent = () => {
  return (
    <Box className="mt-3 w-full h-full">

      {/* ✅ Same table style jaisa pehle pages me kiya tha */}
    <style>
                {`
          table thead tr th,
          table thead {
            background: #F7F7F7 !important;
            box-shadow: none !important;
          }
          table thead tr th > div {
            background: transparent !important;
          }

          table thead tr th {
            padding: 10px !important;
            font-size: 14px;
            border-bottom: 1px solid #EBEDF0 !important;
            color: #0E1011;
          }

          table tbody tr td {
            padding: 10px !important;
            font-size: 14px;
          }

          table tbody tr {
            border-bottom: 1px solid #EBEDF0 !important;
          }

          table tbody tr:last-child {
            border-bottom: none !important;
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
