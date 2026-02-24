import { useEffect, useState } from "react";
import { TableComponent } from "@/components/common/tablecomponent";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import { checkBoxProps } from "@/components/common/tablecomponent";
import callsicon from "../../../assets/callsicon.png";
import { Link, useLocation } from "react-router-dom";
import { useContact, type ContactBackend } from "@/hooks/useContact";
import dayjs from "dayjs";

export interface Contact {
  id: string;
  name: string;
  lastDialedDate: string;
  phone: string;
  email: string;
  list: string;
  tags: string;
}

interface AllContactProps {
  onSelectionChange?: (selectedContacts: Contact[]) => void;
}

const AllContact = ({ onSelectionChange }: AllContactProps) => {
  const location = useLocation();
  const { getContacts, loading } = useContact();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const data: ContactBackend[] = await getContacts();
      const mappedContacts: Contact[] = data.map((c) => ({
        id: c.id,
        name: c.fullName,
        lastDialedDate: dayjs(c.updatedAt).format("MM/DD/YYYY"),
        phone: c.phones.find(p => p.type === 'MOBILE')?.number || c.phones[0]?.number || "-",
        email: c.emails.find(e => e.isPrimary)?.email || c.emails[0]?.email || "-",
        list: "-", // We might need to fetch list name separately or populate it in backend
        tags: c.tags.length > 0 ? c.tags.join(", ") : "-",
      }));
      setContacts(mappedContacts);
    };

    fetchContacts();
  }, []);

  const isAdmin = location.pathname.startsWith("/admin");
  const linkPath = isAdmin ? "/admin/contact-detail" : "/contact-detail";

  const columns = [
    {
      id: "select",
      header: (context: any) => {
        const props = checkBoxProps(context);
        return <Checkbox {...props} />;
      },
      cell: (context: any) => {
        const props = checkBoxProps(context);
        return <Checkbox {...props} />;
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
      cell: (info: any) => (
        <Link to={linkPath} className="text-[#1D85F0] cursor-pointer">
          {info.getValue()}
        </Link>
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
                <span key={index}>-</span>
              )
            )}
          </div>
        );
      },
    },
  ];

  // Component to handle selection changes
  const SelectionHandler = ({ selectedRows }: { selectedRows: Contact[] | undefined }) => {
    useEffect(() => {
      if (onSelectionChange) {
        onSelectionChange(selectedRows || []);
      }
    }, [selectedRows, onSelectionChange]);
    return null;
  };

  if (loading && contacts.length === 0) {
    return (
      <Box className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFCA06]"></div>
      </Box>
    );
  }

  return (
    <Box className="mt-3 m-2 w-full h-full">
      <main>
        <TableProvider data={contacts} columns={columns}>
          {({ selectedRows }) => (
            <>
              <SelectionHandler selectedRows={selectedRows} />
              <TableComponent />
            </>
          )}
        </TableProvider>
      </main>
    </Box>
  );
};

export default AllContact;
