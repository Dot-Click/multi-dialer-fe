import { SortedHeader, TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import { useState, useEffect } from "react";

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

// === Table columns ===
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
  { accessorKey: "name", header: (info: any) => <SortedHeader header={info.header} label="Name" />, cell: (info: any) => <a href="#" className="text-blue-600 hover:underline">{info.getValue()}</a> },
  { accessorKey: "address", header: (info: any) => <SortedHeader header={info.header} label="Address" /> },
  { accessorKey: "label", header: (info: any) => <SortedHeader header={info.header} label="Label" /> },
  { accessorKey: "listGroup", header: (info: any) => <SortedHeader header={info.header} label="List / Group" /> },
  { accessorKey: "type", header: (info: any) => <SortedHeader header={info.header} label="Type" /> },
  { accessorKey: "date", header: (info: any) => <SortedHeader header={info.header} label="Date" /> },
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
  <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-center sm:text-left">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="text-sm font-semibold text-gray-800">
      {value}
      {percentage !== null && ` = ${percentage}%`}
    </p>
  </div>
);

// === Filter Dropdown Component ===
const FilterDropdown = ({ label, options }: { label: string; options: string[] }) => (
  <div className="w-full sm:w-60">
    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none text-xs">
      <option>{label}</option>
      {options.map((option) => (
        <option key={option} value={option.toLowerCase()}>{option}</option>
      ))}
    </select>
  </div>
);

// === Main EmailStatus Component ===
const EmailStatus = () => {
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Show filters & stats only on /admin/reports-analytics
    if (window.location.pathname === "/admin/reports-analytics") {
      setShowFilters(true);
    } else {
      setShowFilters(false);
    }
  }, []);

  return (
    <Box className="mt-1.5 w-full h-full">
      <main>
        {/* Filters & Stats - only show if route matches */}
        {showFilters && (
          <div className="mb-3">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-1">
              <FilterDropdown label="Email Status: All" options={["Sent", "Opened", "Failed"]} />
              <FilterDropdown label="Send Type: All" options={["Manual", "Automated"]} />
            </div>

            {/* Stats Cards */}
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

        {/* Table */}
        <TableProvider data={emailStatusData} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </main>
    </Box>
  );
};

export default EmailStatus;
