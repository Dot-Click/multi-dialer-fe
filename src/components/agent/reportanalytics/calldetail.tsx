import { SortedHeader, TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import callsicon from "../../../assets/callsicon.png";  // ✅ Phone icon image import

interface CallRow {
  id: number;
  name: string;
  address: string;
  list: string;
  group: string;
  phone: string;
  result: string;
}

const callData: CallRow[] = [
  { id: 1, name: "Kathryn Murphy", address: "47406 N Franklin Street", list: "High-Value Leads", group: "-", phone: "(252) 555-0126", result: "Other" },
  { id: 2, name: "Robert Fox", address: "93592 Woodside Road", list: "-", group: "-", phone: "(405) 555-0128", result: "Other" },
  { id: 3, name: "Annette Black", address: "6286 Ryan Crossroad", list: "Renewals Q3", group: "-", phone: "(684) 555-0102", result: "Other" },
  { id: 4, name: "Dianne Russell", address: "533 Curtis Crescent", list: "Renewals Q3", group: "-", phone: "(603) 555-0123", result: "Other" }
];

const columns = [
  {
    accessorKey: "name",
    header: (info: any) => <SortedHeader header={info.header} label="Name" />,
    cell: (info: any) => (
      <span style={{ color: "#1D85F0", fontWeight: 500 }}>{info.getValue()}</span> // ✅ Blue Name
    ),
  },
  {
    accessorKey: "address",
    header: (info: any) => <SortedHeader header={info.header} label="Address" />,
  },
  {
    accessorKey: "list",
    header: (info: any) => <SortedHeader header={info.header} label="List" />,
  },
  {
    accessorKey: "group",
    header: (info: any) => <SortedHeader header={info.header} label="Group" />,
  },
  {
    accessorKey: "phone",
    header: (info: any) => <SortedHeader header={info.header} label="Phone Number" />,
    cell: (info: any) => (
      <div className="flex items-center gap-2">
        <img src={callsicon} alt="call" style={{ width: "16px", height: "16px", objectFit: "contain" }} />
        <span style={{ color: "#495057" }}>{info.getValue()}</span> {/* ✅ Same style as previous table */}
      </div>
    ),
  },
  {
    accessorKey: "result",
    header: (info: any) => <SortedHeader header={info.header} label="Result" />,
  },
];

const CallDetail = () => {
  return (
    <Box className="mt-3 flex flex-col gap-2 w-full h-full">
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
            padding: 15px !important;
            font-size: 14px;
            border-bottom: 1px solid #EBEDF0 !important;
            color: #0E1011;
          }

          table tbody tr td {
            padding: 15px !important;
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

      <div className="flex items-center gap-3 w-full flex-wrap">
        <div className="border rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer">
          <span className="text-xs">Caller ID: All</span>
          <FaChevronDown className="text-[12px] text-gray-400" />
        </div>

        <div className="border rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer">
          <FaChevronLeft className="text-[12px] text-gray-400" />
          <span className="text-xs">All Dates</span>
          <FaChevronRight className="text-[12px] text-gray-400" />
        </div>

        <div className="border rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer">
          <span className="text-xs">Select Time Frame</span>
          <FaChevronDown className="text-[12px] text-gray-400" />
        </div>

        <div className="border rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer">
          <span className="text-xs">Days Of The Week: All</span>
          <FaChevronDown className="text-[12px] text-gray-400" />
        </div>
      </div>

      <main>
        <TableProvider data={callData} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </main>
    </Box>
  );
};

export default CallDetail;
