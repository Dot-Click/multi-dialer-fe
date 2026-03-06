import { TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { useCallRecordingsReport } from "@/hooks/useCallRecordingsReport";

// === Play Button Component ===
const AudioPlayer = () => (
  <div className="flex items-center w-fit space-x-3">
    <div className="w-9 h-9 flex items-center justify-center rounded-[4px] bg-[#F3F4F7] dark:bg-slate-700 cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-600 transition">
      <FaPlay className="text-[#495057] dark:text-gray-300 text-[14px]" />
    </div>
    <div className="w-[160px] h-2 bg-[#D8DCE1] dark:bg-slate-700 rounded-full overflow-hidden"></div>
  </div>
);

// === DATA STRUCTURE ===
interface CallRecord {
  id: number;
  agent: string;
  name: string;
  duration: string;
  callResult: string;
}

// === SAMPLE DATA ===
const callRecordingData: CallRecord[] = [
  {
    id: 1,
    agent: "Bertha Wiza",
    name: "Kathryn Murphy",
    duration: "00:00:00",
    callResult: "Positive",
  },
  {
    id: 2,
    agent: "Bertha Wiza",
    name: "Robert Fox",
    duration: "00:00:00",
    callResult: "Positive",
  },
  {
    id: 3,
    agent: "Bertha Wiza",
    name: "Annette Black",
    duration: "00:00:00",
    callResult: "Positive",
  },
  {
    id: 4,
    agent: "Bertha Wiza",
    name: "Marvin McKinney",
    duration: "00:00:00",
    callResult: "Positive",
  },
  {
    id: 5,
    agent: "Bertha Wiza",
    name: "Ralph Edwards",
    duration: "00:00:00",
    callResult: "Positive",
  },
  {
    id: 6,
    agent: "Bertha Wiza",
    name: "Dianne Russell",
    duration: "00:00:00",
    callResult: "Positive",
  },
  {
    id: 7,
    agent: "Bertha Wiza",
    name: "Annette Black",
    duration: "00:00:00",
    callResult: "Positive",
  },
  {
    id: 8,
    agent: "Bertha Wiza",
    name: "Marvin McKinney",
    duration: "00:00:00",
    callResult: "Positive",
  },
];

// === COLUMNS ===
const columns = [
  {
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        className="w-5 h-5 rounded-none border-[2px] dark:border-slate-500"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        className="w-5 h-5 rounded-none border-[2px] dark:border-slate-500"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  { id: "play", header: () => "Play", cell: () => <AudioPlayer /> },
  {
    accessorKey: "agent",
    header: () => "Agent",
    cell: (info: any) => (
      <span className="text-[#495057] dark:text-gray-300 font-[500] text-[14px]">
        {info.getValue() || "-"}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: () => "Name",
    cell: (info: any) => (
      <a
        href="#"
        className="text-[#1D85F0] dark:text-blue-400 font-[400] text-[14px]"
      >
        {info.getValue() || "-"}
      </a>
    ),
  },
  {
    accessorKey: "duration",
    header: () => "Duration",
    cell: (info: any) => (
      <span className="text-[#495057] dark:text-gray-300 font-[400] text-[14px]">
        {info.getValue() || "-"}
      </span>
    ),
  },
  {
    accessorKey: "callResult",
    header: () => "Call Result",
    cell: (info: any) => (
      <span className="text-[#495057] dark:text-gray-300 font-[400] text-[14px]">
        {info.getValue() || "-"}
      </span>
    ),
  },
const AudioPlayer = ({ url }: { url: string | null }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!url) return;

        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    return (
        <div className="flex items-center w-fit space-x-3">
            <div
                className={`w-9 h-9 flex items-center justify-center rounded-[4px] cursor-pointer transition ${url ? 'bg-[#F3F4F7] hover:bg-gray-300' : 'bg-gray-100 opacity-50 cursor-not-allowed'}`}
                onClick={togglePlay}
            >
                {isPlaying ? <FaPause className="text-[#495057] text-[14px]" /> : <FaPlay className="text-[#495057] text-[14px]" />}
            </div>
            {url && (
                <audio
                    ref={audioRef}
                    src={url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => {
                        setIsPlaying(false);
                        setCurrentTime(0);
                    }}
                    className="hidden"
                />
            )}

            <div className="flex items-center justify-center w-[160px]">
                {url ? (
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-[#D8DCE1] rounded-full appearance-none cursor-pointer accent-[#495057]"
                        aria-label="Audio progress"
                    />
                ) : (
                    <div className="w-[160px] h-2 bg-[#D8DCE1] rounded-full overflow-hidden opacity-50"></div>
                )}
            </div>
        </div>
    );
};

// === COLUMNS ===
const columns = [
    {
        id: "select",
        header: ({ table }: any) => (
            <Checkbox
                className="w-5 h-5 rounded-none border-2"
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }: any) => (
            <Checkbox
                className="w-5 h-5 rounded-none border-2"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
    },
    { id: "play", header: () => "Play", cell: (info: any) => <AudioPlayer url={info.row.original.recordingUrl} /> },
    { accessorKey: "agent", header: () => "Agent", cell: (info: any) => <span className="text-[#495057] font-medium text-[14px]">{info.getValue()}</span> },
    { accessorKey: "name", header: () => "Name", cell: (info: any) => <span className="text-[#1D85F0] font-normal text-[14px]">{info.getValue()}</span> },
    { accessorKey: "duration", header: () => "Duration", cell: (info: any) => <span className="text-[#495057] font-normal text-[14px]">{info.getValue()}</span> },
    { accessorKey: "callResult", header: () => "Call Result", cell: (info: any) => <span className="text-[#495057] font-normal text-[14px]">{info.getValue()}</span> },
];

interface CallRecordingProps {
    userId?: string;
}

// === MAIN COMPONENT ===
const CallRecording = () => {
  const [showAllDatesButton, setShowAllDatesButton] = useState(false);
const CallRecording: React.FC<CallRecordingProps> = ({ userId }) => {
    const [showAllDatesButton, setShowAllDatesButton] = useState(false);
    const { data, loading, getCallRecordings } = useCallRecordingsReport();

    useEffect(() => {
        getCallRecordings({ userId });
    }, [userId, getCallRecordings]);

  useEffect(() => {
    if (
      window.location.pathname === "/admin/reports-analytics" ||
      window.location.pathname === "/reports-analytics"
    ) {
      setShowAllDatesButton(true);
    } else {
      setShowAllDatesButton(false);
    }
  }, []);

  return (
    <Box className="mt-2 w-full h-full">
      <style>
        {`
                /* THEAD & TBODY BASE STYLE */
                table thead tr th, table thead { background: #F7F7F7 !important; }
                table thead tr th {
                    padding: 7px 3px !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    color: #0E1011 !important;
                    border-bottom: 1px solid #EBEDF0 !important;
                    text-align: left !important;
                }
                table tbody tr td {
                    padding: 7px 3px !important;
                    font-size: 14px !important;
                    color: #495057 !important;
                    font-weight: 400 !important;
                    text-align: left !important;
                }
                table tbody tr { border-bottom: 1px solid #EBEDF0 !important; }
                table tbody tr:last-child { border-bottom: none !important; }

                /* DARK MODE ADJUSTMENTS */
                :is(.dark) table thead tr th, :is(.dark) table thead { background: #334155 !important; } /* bg-slate-700 */
                :is(.dark) table thead tr th { 
                    color: white !important; 
                    border-bottom: 1px solid #475569 !important; 
                }
                :is(.dark) table tbody tr { border-bottom: 1px solid #475569 !important; }

                /* MOBILE ADJUSTMENTS */
                @media (max-width: 768px) {
                    table tbody tr td {
                        padding: 12px 6px !important; /* Extra spacing on mobile */
                        font-size: 14px !important;
                    }
                    table thead tr th {
                        padding: 10px 6px !important; /* More breathing room for headers */
                    }
                }
                `}
      </style>

      {/* Show All Dates Button */}
      {showAllDatesButton && (
        <div className="flex items-center mb-4 w-fit gap-[16px] border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] px-[16px] h-[40px] cursor-pointer">
          <IoIosArrowBack className="text-[13px] text-[#71717A] dark:text-gray-400" />
          <span className="text-[16px] dark:text-gray-200">All Dates</span>
          <IoIosArrowForward className="text-[13px] text-[#71717A] dark:text-gray-400" />
        </div>
      )}

      <main>
        <TableProvider data={callRecordingData} columns={columns}>
          {() => <TableComponent />}
        </TableProvider>
      </main>
    </Box>
  );
            <main>
                <TableProvider data={data} columns={columns}>
                    {() => <TableComponent />}
                </TableProvider>
                {loading && <div className="text-center py-4">Loading recordings...</div>}
                {!loading && data.length === 0 && (
                    <div className="text-center py-4 text-gray-500">No recordings found.</div>
                )}
            </main>
        </Box>
    );
};

export default CallRecording;
