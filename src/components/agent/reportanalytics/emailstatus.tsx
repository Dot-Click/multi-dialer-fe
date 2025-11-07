import { SortedHeader, TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";

// Step 1: Data ka structure define karein
interface EmailRecord {
  id: number;
  name: string;
  address: string;
  label: string;
  listGroup: string;
  type: string;
  date: string;
}

// Step 2: Sample data banayein jo table mein dikhega
const emailStatusData: EmailRecord[] = [
  {
    id: 1,
    name: "Kathryn Murphy",
    address: "47406 N Franklin Street",
    label: "Text",
    listGroup: "High-Value Leads",
    type: "C2C Session",
    date: "18/06/2021 09:13",
  },
  {
    id: 2,
    name: "Robert Fox",
    address: "93592 Woodside Road",
    label: "Text",
    listGroup: "-",
    type: "PowerDial",
    date: "29/10/2024 15:36",
  },
  {
    id: 3,
    name: "Annette Black",
    address: "6286 Ryan Crossroad",
    label: "Text",
    listGroup: "Renewals Q3",
    type: "PowerDial",
    date: "2021/11/2013 20:01",
  },
  {
    id: 4,
    name: "Dianne Russell",
    address: "533 Curtis Crescent",
    label: "Text",
    listGroup: "Renewals Q3",
    type: "PowerDial",
    date: "10/06/2021 19:30",
  },
  {
    id: 5,
    name: "Kathryn Murphy",
    address: "47406 N Franklin Street",
    label: "Text",
    listGroup: "High-Value Leads",
    type: "C2C Session",
    date: "18/06/2021 09:13",
  },
  {
    id: 6,
    name: "Kathryn Murphy",
    address: "47406 N Franklin Street",
    label: "Text",
    listGroup: "High-Value Leads",
    type: "C2C Session",
    date: "18/06/2021 09:13",
  },
  {
    id: 7,
    name: "Robert Fox",
    address: "93592 Woodside Road",
    label: "Text",
    listGroup: "-",
    type: "PowerDial",
    date: "29/10/2024 15:36",
  },
];

// Step 3: Table ke columns ko define karein
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
    cell: (info: any) => <a href="#" className="text-blue-600 hover:underline">{info.getValue()}</a>,
  },
  {
    accessorKey: "address",
    header: (info: any) => <SortedHeader header={info.header} label="Address" />,
  },
  {
    accessorKey: "label",
    header: (info: any) => <SortedHeader header={info.header} label="Label" />,
  },
  {
    accessorKey: "listGroup",
    header: (info: any) => <SortedHeader header={info.header} label="List / Group" />,
  },
  {
    accessorKey: "type",
    header: (info: any) => <SortedHeader header={info.header} label="Type" />,
  },
  {
    accessorKey: "date",
    header: (info: any) => <SortedHeader header={info.header} label="Date" />,
  },
];

const EmailStatus = () => {
  return (
    <Box className="mt-3 w-full h-full">
      <main>
        {/* Step 4: TableProvider aur TableComponent ko data aur columns ke saath render karein */}
        <TableProvider data={emailStatusData} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </main>
    </Box>
  );
};

export default EmailStatus;