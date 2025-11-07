import { SortedHeader, TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
import tableCellIcon from '../../../assets/tablecellicon.png';

interface ReportItem {
    id: number;
    number: string;
    date: string;
    vendorName: string;
    vendorLogo: string; // Logo ka path yahan aayega
    received: number;
    duplicates: number;
}

// Step 2: Mock data banayein jo table mein dikhega
const reportData: ReportItem[] = [
    {
        id: 1,
        number: "123456789",
        date: "18/06/2021 09:13",
        vendorName: "Logoipsum",
        vendorLogo: "/path/to/your/logo.svg", // Logo ka aasal path yahan daalein
        received: 1,
        duplicates: 0,
    },
    {
        id: 2,
        number: "123456789",
        date: "29/10/2024 15:36",
        vendorName: "Logoipsum",
        vendorLogo: "/path/to/your/logo.svg",
        received: 1,
        duplicates: 0,
    },
    {
        id: 3,
        number: "123456789",
        date: "2021/11/2013 20:01", // Aapke image mein ek ajeeb format hai, maine waisa hi rakha hai
        vendorName: "Logoipsum",
        vendorLogo: "/path/to/your/logo.svg",
        received: 1,
        duplicates: 0,
    },
    {
        id: 4,
        number: "123456789",
        date: "10/06/2021 19:30",
        vendorName: "Logoipsum",
        vendorLogo: "/path/to/your/logo.svg",
        received: 1,
        duplicates: 0,
    },
    {
        id: 5,
        number: "123456789",
        date: "18/06/2021 09:13",
        vendorName: "Logoipsum",
        vendorLogo: "/path/to/your/logo.svg",
        received: 1,
        duplicates: 0,
    },
    {
        id: 6,
        number: "123456789",
        date: "29/10/2024 15:36",
        vendorName: "Logoipsum",
        vendorLogo: "/path/to/your/logo.svg",
        received: 1,
        duplicates: 0,
    },
    {
        id: 7,
        number: "123456789",
        date: "2021/11/2013 20:01",
        vendorName: "Logoipsum",
        vendorLogo: "/path/to/your/logo.svg",
        received: 1,
        duplicates: 0,
    },
];

// Step 3: Table ke columns define karein
const columns = [
    {
        accessorKey: "number",
        header: (info: any) => <SortedHeader header={info.header} label="Number" />,
        cell: (info: any) => <span className="text-blue-600">{info.getValue()}</span>, // Number ko neela rang diya hai
    },
    {
        accessorKey: "date",
        header: (info: any) => <SortedHeader header={info.header} label="Date" />,
    },
    {
        accessorKey: "vendorName", // Iska naam `vendor` rakhte hain
        header: (info: any) => <SortedHeader header={info.header} label="Vendor" />,
        cell: ({ row }: any) => (
            <div className="flex items-center">
                <img
                    src={tableCellIcon} 
                    alt={row.original.vendorName}
                    
                    className="w-60"
                />
            </div>
        ),
    },
    {
        accessorKey: "received",
        header: (info: any) => <SortedHeader header={info.header} label="Received" />,
    },
    {
        accessorKey: "duplicates",
        header: (info: any) => <SortedHeader header={info.header} label="Duplicates" />,
    },
];

const PostingReport = () => {
    return (
        <Box className="mt-3 w-full h-full">
            <main>
                {/* Step 4: TableProvider aur TableComponent ko data aur columns ke saath render karein */}
                <TableProvider data={reportData} columns={columns}>
                    {() => <TableComponent />}
                </TableProvider>
            </main>
        </Box>
    );
};

export default PostingReport;