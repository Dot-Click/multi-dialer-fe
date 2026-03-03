import { useEffect, useMemo } from "react";
import { TableComponent } from "@/components/common/tablecomponent";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import { checkBoxProps } from "@/components/common/tablecomponent";
import callsicon from "../../../assets/callsicon.png";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContacts, fetchContactsByList, type Contact } from "@/store/slices/contactSlice";
import Loader from "@/components/common/Loader";

interface AllContactProps {
  onSelectionChange?: (selectedContacts: Contact[]) => void;
  listId?: string;
  visibleColumns?: string[];
}

const AllContact = ({ onSelectionChange, listId, visibleColumns }: AllContactProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { contacts, isLoading, error } = useAppSelector((state) => state.contacts);

  const isAdmin = location.pathname.startsWith("/admin");
  const linkPath = isAdmin ? "/admin/contact-detail" : "/contact-detail";

  useEffect(() => {
    if (listId) {
      dispatch(fetchContactsByList(listId));
    } else {
      dispatch(fetchContacts());
    }
  }, [dispatch, listId]);

  const allColumns = [
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
        <Link to={`${linkPath}/${info.row.original.id}`} className="text-[#1D85F0] cursor-pointer">
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

  const columns = useMemo(() => {
    if (!visibleColumns || visibleColumns.length === 0) return allColumns;

    // Always include select column
    const filtered = allColumns.filter(col => {
      if (col.id === "select") return true;

      return visibleColumns.some(vc => {
        if (vc === "Name" && col.accessorKey === "name") return true;
        if (vc === "Email" && col.accessorKey === "email") return true;
        if (vc === "Phone" && col.accessorKey === "phone") return true;
        if (vc === "Last Dialed" && col.accessorKey === "lastDialedDate") return true;
        if (vc === "List" && col.accessorKey === "list") return true;
        if (vc === "Tags" && col.accessorKey === "tags") return true;
        return false;
      });
    });

    return filtered;
  }, [visibleColumns, linkPath]);

  // Component to handle selection changes
  const SelectionHandler = ({ selectedRows }: { selectedRows: Contact[] | undefined }) => {
    useEffect(() => {
      if (onSelectionChange) {
        onSelectionChange(selectedRows || []);
      }
    }, [selectedRows, onSelectionChange]);
    return null;
  };

  // if (isLoading && contacts.length === 0) return <Loader/>

  return (
    <Box className="mt-3 m-2 w-full h-full">
      <main>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <span className="text-red-500">{error}</span>
          </div>
        ) : (
          <TableProvider data={contacts} columns={columns}>
            {({ selectedRows }) => (
              <>
                <SelectionHandler selectedRows={selectedRows} />
                <TableComponent />
              </>
            )}
          </TableProvider>
        )}
      </main>
    </Box>
  );
};

export default AllContact;
