
import { SortedHeader, TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";


interface Contact {
  id: number;
  name: string;
  lastDialedDate: string;
  phone: string;
  email: string;
  list: string;
  tags: string;
}

// Static data (same as screenshot)
const contacts: Contact[] = [
  {
    id: 1,
    name: "Kathryn Murphy",
    lastDialedDate: "09/09/2025",
    phone: "(252) 555-0126",
    email: "michael.mitc@example.com",
    list: "High-Value Leads",
    tags: "Interested",
  },
  {
    id: 2,
    name: "Robert Fox",
    lastDialedDate: "09/09/2025",
    phone: "(405) 555-0128",
    email: "bill.sanders@example.com",
    list: "-",
    tags: "Follow-Up",
  },
  {
    id: 3,
    name: "Annette Black",
    lastDialedDate: "09/09/2025",
    phone: "(864) 555-0102",
    email: "willie.jennings@example.com",
    list: "Renewals Q3",
    tags: "-",
  },
  {
    id: 4,
    name: "Marvin McKinney",
    lastDialedDate: "09/09/2025",
    phone: "(702) 555-0122",
    email: "alma.lawson@example.com",
    list: "Dormant Accounts",
    tags: "Follow-Up, Interested",
  },
  {
    id: 5,
    name: "Ralph Edwards",
    lastDialedDate: "09/09/2025",
    phone: "(808) 555-0111",
    email: "tanya.hill@example.com",
    list: "-",
    tags: "-",
  },
  {
    id: 6,
    name: "Dianne Russell",
    lastDialedDate: "09/09/2025",
    phone: "(603) 555-0123",
    email: "debra.holt@example.com",
    list: "Renewals Q3",
    tags: "-",
  },
  {
    id: 7,
    name: "Guy Hawkins",
    lastDialedDate: "09/09/2025",
    phone: "(219) 555-0114",
    email: "felicia.reid@example.com",
    list: "-",
    tags: "Not Interested",
  },
  {
    id: 8,
    name: "Devon Lane",
    lastDialedDate: "09/09/2025",
    phone: "(229) 555-0109",
    email: "sara.cruz@example.com",
    list: "High-Value Leads",
    tags: "DNC",
  },
  {
    id: 9,
    name: "Bessie Cooper",
    lastDialedDate: "09/09/2025",
    phone: "(205) 555-0100",
    email: "nathan.roberts@example.com",
    list: "Renewals Q3",
    tags: "Follow-Up",
  },
  {
    id: 10,
    name: "Jerome Bell",
    lastDialedDate: "09/09/2025",
    phone: "(319) 555-0115",
    email: "kenzi.lawson@example.com",
    list: "Dormant Accounts",
    tags: "-",
  },
];

// Table columns
// const columns = [
//   {
//     id: "select",
//     header: (info) => <Checkbox {...checkBoxProps(info)} />,
//     cell: (info) => <Checkbox {...checkBoxProps(info)} />,
//     enableSorting: false,
//   },
//   {
//     accessorKey: "name",
//     header: (info) => <SortedHeader header={info.header} label="Name" />,
//   },
//   {
//     accessorKey: "lastDialedDate",
//     header: (info) => <SortedHeader header={info.header} label="Last Dialed Date" />,
//   },
//   {
//     accessorKey: "phone",
//     header: (info) => <SortedHeader header={info.header} label="Phone Number" />,
//   },
//   {
//     accessorKey: "email",
//     header: (info) => <SortedHeader header={info.header} label="Email" />,
//   },
//   {
//     accessorKey: "list",
//     header: (info) => <SortedHeader header={info.header} label="List" />,
//   },
//   {
//     accessorKey: "tags",
//     header: (info) => <SortedHeader header={info.header} label="Tags" />,
//   },
// ];

const columns = [
  {
    id: "select",
    header: () => <Checkbox />, // removed "info"
    cell: () => <Checkbox />,   // removed "info"
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
  },
  {
    accessorKey: "email",
    header: (info: any) => <SortedHeader header={info.header} label="Email" />,
  },
  {
    accessorKey: "list",
    header: (info: any) => <SortedHeader header={info.header} label="List" />,
  },
  {
    accessorKey: "tags",
    header: (info: any) => <SortedHeader header={info.header} label="Tags" />,
  },
];





const AllContact = () => {
  return (
    <Box className="mt-3 w-full h-full">
    

      {/* Table Section */}
      <main>
        <TableProvider data={contacts} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </main>
    </Box>
  );
};

export default AllContact;
