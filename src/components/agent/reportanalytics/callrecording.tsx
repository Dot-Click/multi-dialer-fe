import { SortedHeader, TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import { FaPlay } from "react-icons/fa";


const AudioPlayer = () => {
    return (
        <div className="flex items-center space-x-3">
            {/* Play Button */}
            <div
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-300 transition"
            >
                <FaPlay className="text-gray-700 text-base" />
            </div>

            {/* Progress Bar */}
            <div className="w-36 h-3 bg-gray-100 rounded-sm overflow-hidden">
                <div className="h-3 bg-gray-300 rounded-sm" style={{ width: "10%" }}></div>
            </div>
        </div>
    );
};


// Step 1: Data ka structure define karein
interface CallRecord {
    id: number;
    agent: string;
    name: string;
    duration: string;
    callResult: string;
}

// Step 2: Sample data banayein
const callRecordingData: CallRecord[] = [
    { id: 1, agent: "Bertha Wiza", name: "Kathryn Murphy", duration: "00:00:00", callResult: "Positive" },
    { id: 2, agent: "Bertha Wiza", name: "Robert Fox", duration: "00:00:00", callResult: "Positive" },
    { id: 3, agent: "Bertha Wiza", name: "Annette Black", duration: "00:00:00", callResult: "Positive" },
    { id: 4, agent: "Bertha Wiza", name: "Marvin McKinney", duration: "00:00:00", callResult: "Positive" },
    { id: 5, agent: "Bertha Wiza", name: "Ralph Edwards", duration: "00:00:00", callResult: "Positive" },
    { id: 6, agent: "Bertha Wiza", name: "Dianne Russell", duration: "00:00:00", callResult: "Positive" },
    { id: 7, agent: "Bertha Wiza", name: "Annette Black", duration: "00:00:00", callResult: "Positive" },
    { id: 8, agent: "Bertha Wiza", name: "Marvin McKinney", duration: "00:00:00", callResult: "Positive" },
];

// Step 3: Table ke columns define karein
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
        id: "play",
        header: "Play",
        cell: () => <AudioPlayer />,
    },
    {
        accessorKey: "agent",
        header: (info: any) => <SortedHeader header={info.header} label="Agent" />,
    },
    {
        accessorKey: "name",
        header: (info: any) => <SortedHeader header={info.header} label="Name" />,
        cell: (info: any) => <a href="#" className="text-blue-600 hover:underline">{info.getValue()}</a>,
    },
    {
        accessorKey: "duration",
        header: (info: any) => <SortedHeader header={info.header} label="Duration" />,
    },
    {
        accessorKey: "callResult",
        header: (info: any) => <SortedHeader header={info.header} label="Call Result" />,
    },
];

const CallRecording = () => {
    return (
        <Box className="mt-3 w-full h-full">
            <style>
                {`
          table thead tr th,
          table thead {
            background: #F7F7F7 !important;
            box-shadow: none !important;
          }
          table thead tr th > div {
            background: transparent !important;
          }

          table thead tr th {
            padding: 10px !important;
            font-size: 14px;
            border-bottom: 1px solid #EBEDF0 !important;
            color: #0E1011;
          }

          table tbody tr td {
            padding: 10px !important;
            font-size: 14px;
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
                {/* Step 4: TableProvider aur TableComponent ko data aur columns ke saath render karein */}
                <TableProvider data={callRecordingData} columns={columns}>
                    {() => <TableComponent />}
                </TableProvider>
            </main>
        </Box>
    );
};

export default CallRecording;