import {  TableComponent } from "@/components/common/tablecomponent";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import callsicon from "../../../assets/callsicon.png";

interface Contact {
  id: number;
  name: string;
  lastDialedDate: string;
  phone: string;
  email: string;
  list: string;
  tags: string;
}

const contacts: Contact[] = [
    { id: 1, name: "Kathryn Murphy", lastDialedDate: "09/09/2025", phone: "(252) 555-0126", email: "michael.mitc@example.com", list: "High-Value Leads", tags: "Interested" },
    { id: 2, name: "Robert Fox", lastDialedDate: "09/09/2025", phone: "(405) 555-0128", email: "bill.sanders@example.com", list: "-", tags: "Follow-Up" },
    { id: 3, name: "Annette Black", lastDialedDate: "09/09/2025", phone: "(864) 555-0102", email: "willie.jennings@example.com", list: "Renewals Q3", tags: "-" },
    { id: 4, name: "Marvin McKinney", lastDialedDate: "09/09/2025", phone: "(702) 555-0122", email: "alma.lawson@example.com", list: "Dormant Accounts", tags: "Follow-Up, Interested" },
    { id: 5, name: "Ralph Edwards", lastDialedDate: "09/09/2025", phone: "(808) 555-0111", email: "tanya.hill@example.com", list: "-", tags: "-" },
    { id: 6, name: "Dianne Russell", lastDialedDate: "09/09/2025", phone: "(603) 555-0123", email: "debra.holt@example.com", list: "Renewals Q3", tags: "-" },
    { id: 7, name: "Guy Hawkins", lastDialedDate: "09/09/2025", phone: "(219) 555-0114", email: "felicia.reid@example.com", list: "-", tags: "Not Interested" },
    { id: 8, name: "Devon Lane", lastDialedDate: "09/09/2025", phone: "(229) 555-0109", email: "sara.cruz@example.com", list: "High-Value Leads", tags: "DNC" },
    { id: 9, name: "Bessie Cooper", lastDialedDate: "09/09/2025", phone: "(205) 555-0100", email: "nathan.roberts@example.com", list: "Renewals Q3", tags: "Follow-Up" },
    { id: 10, name: "Jerome Bell", lastDialedDate: "09/09/2025", phone: "(319) 555-0115", email: "kenzi.lawson@example.com", list: "Dormant Accounts", tags: "-" },
];
const columns = [
  {
    id: "select",
    header: () => <Checkbox />,
    cell: () => <Checkbox />,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: false,
    cell: (info: any) => (
      <span className="text-[#1D85F0]">
        {info.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "lastDialedDate",
    header: "Last Dialed Date",
    enableSorting: false,
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    enableSorting: false,
    cell: (info: any) => (
      <div className="flex items-center gap-2">
        <img
          src={callsicon}
          alt="call"
          style={{ width: "16px", height: "16px", objectFit: "contain" }}
        />
        <span style={{ color: "#495057" }}>{info.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: false,
  },
  {
    accessorKey: "list",
    header: "List",
    enableSorting: false,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    enableSorting: false,
    cell: (info: any) => {
      const tags = info.getValue()?.split(",") || [];
      return (
        <div className="flex flex-col items-start gap-1">
          {tags.map((tag: string, index: number) =>
            tag.trim() !== "-" ? (
              <Badge
                key={index}
                className="bg-[#EBEDF0] text-[#0E1011] py-[4px] px-[8px] rounded-[100px] w-fit text-xs font-medium"
              >
                {tag.trim()}
              </Badge>
            ) : (
              <span>-</span>
            )
          )}
        </div>
      );
    },
  },
];


const AllContact = () => {
  return (
    <Box className="mt-3 m-2 w-full h-full">

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

          /* Header styles */
          table thead tr th {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
            font-size: 14px;
            border-bottom: 1px solid #EBEDF0 !important;
            color: #0E1011 !important;
            font-weight: 500 !important;
          }
          
          /* Body row styles */
          table tbody tr td {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
            font-size: 14px;
            vertical-align: middle; /* Aligns content vertically */
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
        <TableProvider data={contacts} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </main>
    </Box>
  );
};

export default AllContact;