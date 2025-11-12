import { SortedHeader, TableComponent } from "@/components/common/tablecomponent";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
// --- Your local icon asset ---
import callsicon from "../../../assets/callsicon.png";
// --- Icons imported from react-icons library ---
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FiSmartphone } from "react-icons/fi";


// --- Updated Interface and Data ---

interface Contact {
  id: number;
  name: string;
  lastDialedDate: string;
  phoneNumbers: {
    type: 'landline' | 'mobile' | 'dialpad';
    number: string;
  }[];
  emails: string[];
  list: string;
  tags: string;
}

const contacts: Contact[] = [
  {
    id: 1,
    name: "Kathryn Murphy",
    lastDialedDate: "09/09/2025",
    phoneNumbers: [
      { type: 'landline', number: "(252) 555-0126" },
      { type: 'mobile', number: "(252) 555-0126" },
      { type: 'dialpad', number: "(252) 555-0126" }
    ],
    emails: ["michael.mitc@example.com", "michael.mitc0206@exampl..."],
    list: "High-Value Leads",
    tags: "Interested",
  },
  {
    id: 2,
    name: "Kathryn Murphy",
    lastDialedDate: "09/09/2025",
    phoneNumbers: [
      { type: 'landline', number: "(252) 555-0126" }
    ],
    emails: ["michael.mitc@example.com", "michael.mitc0206@exampl..."],
    list: "High-Value Leads",
    tags: "Interested",
  },
  {
    id: 3,
    name: "Kathryn Murphy",
    lastDialedDate: "09/09/2025",
    phoneNumbers: [
        { type: 'landline', number: "(252) 555-0126" },
        { type: 'mobile', number: "(252) 555-0126" }
    ],
    emails: ["michael.mitc@example.com"],
    list: "High-Value Leads",
    tags: "Interested",
  }
];

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
    accessorKey: "phoneNumbers",
    header: (info: any) => <SortedHeader header={info.header} label="Phone Number" />,
    cell: ({ getValue }: any) => (
      <div className="flex flex-col gap-2">
        {getValue().map((phone: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            {/* Conditional Icon Rendering */}
            {phone.type === 'landline' && (
              <img 
                src={callsicon} 
                alt="Call icon" 
                style={{ width: '16px', height: '16px' }}
              />
            )}
            {phone.type === 'mobile' && <FiSmartphone size={15} color="#495057" strokeWidth={2.5} />}
            {phone.type === 'dialpad' && <BsFillGrid3X3GapFill size={16} color="#495057" />}
            
            <span style={{ color: "#495057" }}>{phone.number}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "emails",
    header: (info: any) => <SortedHeader header={info.header} label="Email" />,
    cell: ({ getValue }: any) => (
      <div className="flex flex-col gap-1">
        {getValue().map((email: string, index: number) => (
          <div key={index} style={{ color: "#495057" }}>
            {email}
          </div>
        ))}
      </div>
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
      const tags = getValue()?.split(",") || [];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: string, index: number) =>
            tag && tag !== "-" ? (
              <Badge
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md w-fit text-xs font-medium border border-gray-200"
              >
                {tag.trim()}
              </Badge>
            ) : null
          )}
        </div>
      );
    },
  },
];

// --- Final Component ---

const FindDuplicates = () => {
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
          /* Reduce padding & tighten rows */
          table tbody tr td {
            padding-top: 16px !important;
            padding-bottom: 16px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
            font-size: 13px; /* Text size reduced */
            vertical-align: top;
          }

          /* Add darker border to rows */
          table tbody tr {
            border-bottom: 1px solid #EBEDF0 !important;
          }

          table tbody tr:last-child {
            border-bottom: none !important;
          }
        `}
      </style>

      <main>
        <TableProvider data={contacts} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </main>
    </Box>
  );
};

export default FindDuplicates;