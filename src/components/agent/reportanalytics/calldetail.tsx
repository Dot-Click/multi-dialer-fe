


import React from "react";
import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import callsicon from "../../../assets/callsicon.png";
import { TableComponent } from "@/components/common/tablecomponent";

// ----------------------
// SortedHeader Component
// ----------------------
interface SortedHeaderProps {
  header: any;
  label: string;
}

const SortedHeader: React.FC<SortedHeaderProps> = ({ header, label }) => {
  const isSorted = header.column.getIsSorted();
  return (
    <div className="flex items-center gap-1 cursor-pointer">
      <span>{label}</span>
      {isSorted === "asc" && <span>↑</span>}
      {isSorted === "desc" && <span>↓</span>}
    </div>
  );
};

// ----------------------
// Table Data & Columns
// ----------------------
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
      <span className="text-[#1D85F0] font-[400] text-[14px]">{info.getValue()}</span>
    ),
  },
  {
    accessorKey: "address",
    header: (info: any) => <SortedHeader header={info.header} label="Address" />,
    cell: (info: any) => (
      <span className="text-[#495057] font-[400]">{info.getValue()}</span>
    ),
  },
  {
    accessorKey: "list",
    header: (info: any) => <SortedHeader header={info.header} label="List" />,
    cell: (info: any) => (
      <span className="text-[#495057] font-[400]">{info.getValue()}</span>
    ),
  },
  {
    accessorKey: "group",
    header: (info: any) => <SortedHeader header={info.header} label="Group" />,
    cell: (info: any) => (
      <span className="text-[#495057] font-[400]">{info.getValue()}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: (info: any) => <SortedHeader header={info.header} label="Phone Number" />,
    cell: (info: any) => (
      <div className="flex items-center gap-2">
        <img src={callsicon} alt="call" className="w-4 h-4 object-contain" />
        <span className="text-[#495057] font-[400]">{info.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "result",
    header: (info: any) => <SortedHeader header={info.header} label="Result" />,
    cell: (info: any) => (
      <span className="text-[#495057] font-[400]">{info.getValue()}</span>
    ),
  },
];

// ----------------------
// Main Component
// ----------------------
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
      padding: 8px !important;
      font-size: 14px;
      border-bottom: 1px solid #EBEDF0 !important;
      color: #0E1011;
      font-weight:500;
      text-align: left;
    }
    table tbody tr td {
      padding: 16px 6px !important; /* desktop padding */
      font-size: 14px;
    }
    table tbody tr {
      border-bottom: 1px solid #EBEDF0 !important;
    }
    table tbody tr:last-child {
      border-bottom: none !important;
    }

    /* Mobile spacing adjustments */
    @media (max-width: 768px) {
      .responsive-table-wrapper {
        overflow-x: auto;
      }
      table {
        width: 100% !important;
        min-width: 600px;
      }
      table tbody tr td {
        padding: 20px 12px !important; /* mobile spacing */
      }
      table thead tr th {
        padding: 12px 12px !important; /* mobile spacing */
      }
      .filters-wrapper {
        flex-wrap: wrap !important;
      }
    }
  `}
</style>


      {/* Filters */}
      <div className="flex items-center gap-3 mb-2 w-full filters-wrapper">
        <div className="border border-[#D8DCE1] rounded-[12px] px-[16px] h-[40px] flex justify-between w-[210px] items-center gap-2 cursor-pointer">
          <span className="text-[16px]">Caller ID: All</span>
          <FaChevronDown className="text-[13px] text-[#71717A]" />
        </div>

        <div className="flex items-center gap-[16px] border border-[#D8DCE1] rounded-[12px] px-[16px] h-[40px] cursor-pointer">
          <IoIosArrowBack className="text-[13px] text-[#71717A]" />
          <span className="text-[16px]">All Dates</span>
          <IoIosArrowForward className="text-[13px] text-[#71717A]" />
        </div>

        <div className="flex items-center gap-[16px] border border-[#D8DCE1] rounded-[12px] px-[16px] h-[40px] cursor-pointer">
          <span className="text-[16px]">Select Time Frame</span>
        </div>

        <div className="border border-[#D8DCE1] rounded-[12px] px-[16px] h-[40px] flex justify-between w-[240px] items-center gap-2 cursor-pointer">
          <span className="text-[16px]">Days Of The Week: All</span>
          <FaChevronDown className="text-[13px] text-[#71717A]" />
        </div>
      </div>

      {/* Table */}
      <div className="responsive-table-wrapper">
        <TableProvider data={callData} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-[14px] text-[#495057]">
          <span>1 - 50 of 146</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#495057]">Page</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 bg-[#17181B] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                1
              </button>
              <button className="px-3 py-1.5 bg-white text-[#495057] text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 bg-white text-[#495057] text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                3
              </button>
            </div>
          </div>
          
          <div className="border border-[#D8DCE1] rounded-[12px] px-[12px] h-[36px] flex justify-between items-center gap-2 cursor-pointer bg-white min-w-[80px]">
            <span className="text-[14px] text-[#495057]">50</span>
            <FaChevronDown className="text-[12px] text-[#71717A]" />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default CallDetail;
