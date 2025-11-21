import { TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

// === Data structure ===
interface EmailRecord {
  id: number;
  name: string;
  address: string;
  label: string;
  listGroup: string;
  type: string;
  date: string;
}

const emailStatusData: EmailRecord[] = [
  { id: 1, name: "Kathryn Murphy", address: "47406 N Franklin Street", label: "Text", listGroup: "High-Value Leads", type: "C2C Session", date: "18/06/2021 09:13" },
  { id: 2, name: "Robert Fox", address: "93592 Woodside Road", label: "Text", listGroup: "-", type: "PowerDial", date: "29/10/2024 15:36" },
  { id: 3, name: "Annette Black", address: "6286 Ryan Crossroad", label: "Text", listGroup: "Renewals Q3", type: "PowerDial", date: "2013/11/20 20:01" },
  { id: 4, name: "Dianne Russell", address: "533 Curtis Crescent", label: "Text", listGroup: "Renewals Q3", type: "PowerDial", date: "10/06/2021 19:30" },
  { id: 5, name: "Kathryn Murphy", address: "47406 N Franklin Street", label: "Text", listGroup: "High-Value Leads", type: "C2C Session", date: "18/06/2021 09:13" },
  { id: 6, name: "Kathryn Murphy", address: "47406 N Franklin Street", label: "Text", listGroup: "High-Value Leads", type: "C2C Session", date: "18/06/2021 09:13" },
  { id: 7, name: "Robert Fox", address: "93592 Woodside Road", label: "Text", listGroup: "-", type: "PowerDial", date: "29/10/2024 15:36" },
];

// === Table Columns — NO ARROWS ===
const columns = [
  {
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        className="w-5 h-5 rounded-none border-[2px]"  // <- Square & thoda bada
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        className="w-5 h-5 rounded-none border-[2px]"  // <- Square & thoda bada
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },

  {
    accessorKey: "name",
    header: () => <span>Name</span>,
    cell: (info: any) => (
      <a className="text-[#1D85F0] font-[400] text-[14px]" href="#">
        {info.getValue()}
      </a>
    ),
  },

  { accessorKey: "address", header: () => <span>Address</span> },
  { accessorKey: "label", header: () => <span>Label</span> },
  { accessorKey: "listGroup", header: () => <span>List / Group</span> },
  { accessorKey: "type", header: () => <span>Type</span> },
  { accessorKey: "date", header: () => <span>Date</span> },
];


// === Stats Data ===
const statsData = [
  { title: "Total", value: 0, percentage: null },
  { title: "Opened", value: 0, percentage: 0 },
  { title: "Queue", value: 0, percentage: 0 },
  { title: "Spam", value: 0, percentage: 0 },
  { title: "Failed", value: 0, percentage: 0 },
  { title: "Failed", value: 0, percentage: 0 },
  { title: "Clicked", value: 0, percentage: 0 },
  { title: "Unsubscribed", value: 0, percentage: 0 },
  { title: "Unopened", value: 0, percentage: 0 },
  { title: "Blocked", value: 0, percentage: 0 },
];

// === Stat Card Component ===
const StatCard = ({ title, value, percentage }: { title: string; value: number; percentage: number | null }) => (
  <div className="bg-white flex flex-col gap-0.5 border border-[#EBEDF0] rounded-lg p-[16px] text-center sm:text-left">
    <p className="text-[12px] font-[400] text-[#495057]">{title}</p>
    <p className="text-[14px] font-[500] text-[#2B3034]">
      {value}
      {percentage !== null && ` = ${percentage}%`}
    </p>
  </div>
);

// === Filter Dropdown Component ===
const FilterDropdown = ({ label }: { label: string }) => (
  <div className="border border-[#D8DCE1] font-[400] rounded-[12px] px-[16px] h-[35px] flex justify-between w-[240px] items-center gap-2 cursor-pointer">
    <span className="text-[16px] text-[#0E1011]">{label}</span>
    <FaChevronDown className="text-[13px] text-[#71717A]" />
  </div>
);

// === Main EmailStatus Component ===
const EmailStatus = () => {
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (
      window.location.pathname === "/admin/reports-analytics" ||
      window.location.pathname === "/reports-analytics"
    ) {
      setShowFilters(true);
    } else {
      setShowFilters(false);
    }
  }, []);

  return (
    <Box className="mt-1.5 w-full h-full">
    <style>
      {`
        /* THEAD */
        table thead tr th,
        table thead {
          background: #F7F7F7 !important;
        }
  
        table thead tr th {
          color: #0E1011 !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          padding: 10px 12px !important;
          border-bottom: 1px solid #EBEDF0 !important;
          text-align: left !important;
        }
  
        /* TBODY */
        table tbody tr td {
          padding: 15px 12px !important;
          font-size: 14px !important;
          color: #495057 !important;
          font-weight: 400 !important;
          text-align: left !important;
        }
  
        table tbody tr td:nth-child(2) a {
          color: #1D85F0 !important;
        }
  
        table tbody tr {
          border-bottom: 1px solid #EBEDF0 !important;
        }
  
        table tbody tr:last-child {
          border-bottom: none !important;
        }
  
        /* === MOBILE RESPONSIVE === */
        @media (max-width: 768px) {
          .responsive-table-wrapper {
            overflow-x: auto;
          }
          table {
            min-width: 600px; /* Mobile scroll */
          }
        }
      `}
    </style>
  
    <main>
      {/* Filters & Stats */}
      {showFilters && (
        <div className="mb-3">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <FilterDropdown label="Email Status: All" />
            <FilterDropdown label="Send Type: All" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {statsData.map((stat, index) => (
              <StatCard
                key={`${stat.title}-${index}`}
                title={stat.title}
                value={stat.value}
                percentage={stat.percentage}
              />
            ))}
          </div>
        </div>
      )}
  
      {/* TABLE */}
      <div className="responsive-table-wrapper">
        <TableProvider data={emailStatusData} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </div>
    </main>
  </Box>
  
  );
};

export default EmailStatus;
