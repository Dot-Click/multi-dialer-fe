import { TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
import tableCellIcon from '../../../assets/tablecellicon.png';

interface ReportItem {
    id: number;
    number: string;
    date: string;
    vendorName: string;
    vendorLogo: string;
    received: number;
    duplicates: number;
}

const reportData: ReportItem[] = [
    { id: 1, number: "123456789", date: "18/06/2021 09:13", vendorName: "Logoipsum", vendorLogo: "/path/to/your/logo.svg", received: 1, duplicates: 0 },
    { id: 2, number: "123456789", date: "29/10/2024 15:36", vendorName: "Logoipsum", vendorLogo: "/path/to/your/logo.svg", received: 1, duplicates: 0 },
    { id: 3, number: "123456789", date: "2021/11/2013 20:01", vendorName: "Logoipsum", vendorLogo: "/path/to/your/logo.svg", received: 1, duplicates: 0 },
    { id: 4, number: "123456789", date: "10/06/2021 19:30", vendorName: "Logoipsum", vendorLogo: "/path/to/your/logo.svg", received: 1, duplicates: 0 },
    { id: 5, number: "123456789", date: "18/06/2021 09:13", vendorName: "Logoipsum", vendorLogo: "/path/to/your/logo.svg", received: 1, duplicates: 0 },
    { id: 6, number: "123456789", date: "29/10/2024 15:36", vendorName: "Logoipsum", vendorLogo: "/path/to/your/logo.svg", received: 1, duplicates: 0 },
    { id: 7, number: "123456789", date: "2021/11/2013 20:01", vendorName: "Logoipsum", vendorLogo: "/path/to/your/logo.svg", received: 1, duplicates: 0 },
];

const columns = [
    {
        accessorKey: "number",
        header: () => <span>Number</span>,
        cell: (info: any) => <span className="text-[#1D85F0] font-[400] text-[14px]">{info.getValue()}</span>,
    },
    { accessorKey: "date", header: () => <span>Date</span> },
    {
        accessorKey: "vendorName",
        header: () => <span>Vendor</span>,
        cell: ({ row }: any) => (
            <div className="flex items-center">
                <img
                    src={tableCellIcon}
                    alt={row.original.vendorName}
                    className="h-[37px] w-auto max-w-[220px] object-contain"
                />
            </div>
        ),
    },
    
    { accessorKey: "received", header: () => <span>Received</span> },
    { accessorKey: "duplicates", header: () => <span>Duplicates</span> },
];

const PostingReport = () => {
    return (
        <Box className="mt-3 w-full h-full">
            <style>
                {`
                    /* Base table styling - desktop remains the same */
                    table thead tr th,
                    table thead {
                        background: #F7F7F7 !important;
                        box-shadow: none !important;
                    }
                    table thead tr th {
                        padding: 8px !important;
                        font-size: 14px;
                        border-bottom: 1px solid #EBEDF0 !important;
                        color:#0E1011;
                        font-weight: 500;
                    }
                    table tbody tr td {
                        padding: 8px !important;
                        font-size: 14px;
                        color:#495057 !important;
                        font-weight: 400;
                    }
                    table tbody tr {
                        border-bottom: 1px solid #EBEDF0 !important;
                    }
                    table tbody tr:last-child {
                        border-bottom: none !important;
                    }

                    /* Mobile adjustments */
                    @media (max-width: 768px) {
                        table thead tr th {
                            padding: 12px 8px !important;
                        }
                        table tbody tr td {
                            padding: 14px 8px !important;
                        }
                    }
                `}
            </style>

            <main>
                <TableProvider data={reportData} columns={columns}>
                    {() => <TableComponent />}
                </TableProvider>
            </main>
        </Box>
    );
};

export default PostingReport;
