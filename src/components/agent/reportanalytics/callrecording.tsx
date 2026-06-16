import { TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { TableProvider } from "@/providers/table.provider";
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useCallRecordingsReport } from "@/hooks/useCallRecordingsReport";

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
  {
    id: "play",
    header: () => "Play",
    cell: ({ row }: any) => (
      <AudioPlayer url={row.original?.recordingUrl || null} />
    ),
  },
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
];

interface CallRecordingProps {
  userId?: string;
  selectedResult?: string;
}

const AudioPlayer = ({ url }: { url: string | null }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // react-table reuses this cell component across rows/pages, so `url` can
  // change on an existing <audio>. Changing the `src` attribute alone does NOT
  // reload the element — without this, play() runs against a stale source and
  // throws "no supported sources". Force a reload whenever the URL changes.
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) audioRef.current.load();
  }, [url]);

  const togglePlay = () => {
    if (!url || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Failed to play recording:", err);
          setIsPlaying(false);
        });
    }
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
        className={`w-9 h-9 flex items-center justify-center rounded-[4px] cursor-pointer transition ${url ? "bg-[#F3F4F7] dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600" : "bg-gray-100 dark:bg-slate-800 opacity-50 cursor-not-allowed"}`}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <FaPause className="text-[#495057] dark:text-gray-300 text-[14px]" />
        ) : (
          <FaPlay className="text-[#495057] dark:text-gray-300 text-[14px]" />
        )}
      </div>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => {
            console.error("Recording source failed to load:", url);
            setIsPlaying(false);
          }}
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
            className="w-full h-1.5 bg-[#D8DCE1] dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-[#495057]"
            aria-label="Audio progress"
          />
        ) : (
          <div className="w-[160px] h-2 bg-[#D8DCE1] dark:bg-slate-700 rounded-full overflow-hidden opacity-50"></div>
        )}
      </div>
    </div>
  );
};

const CallRecording: React.FC<CallRecordingProps> = ({
  userId,
  selectedResult,
}) => {
  const { data, loading, pagination, getCallRecordings } =
    useCallRecordingsReport();

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const filteredData = (data || []).filter((item) => {
    if (!selectedResult || selectedResult === "All Result") return true;
    return item.callResult.toLowerCase() === selectedResult.toLowerCase();
  });

  // Reset to the first page whenever the selected agent changes.
  useEffect(() => {
    setPage(1);
  }, [userId]);

  useEffect(() => {
    getCallRecordings({ userId, page, limit: PAGE_SIZE });
  }, [userId, page, getCallRecordings]);

  const total = pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasRealData = !!data && data.length > 0;




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
    

      <main>
        {/* One state at a time: loading → data → empty (never overlap) */}
        {loading ? (
          <div className="text-center py-6 dark:text-gray-300">
            Loading recordings...
          </div>
        ) : filteredData.length > 0 ? (
          <TableProvider data={filteredData} columns={columns}>
            {() => <TableComponent />}
          </TableProvider>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No recordings found.
          </div>
        )}

        {/* Pagination (server-side) */}
        {!loading && hasRealData && total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <span className="text-[13px] text-[#495057] dark:text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}
              –{Math.min(page * PAGE_SIZE, total)} of {total}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[13px] bg-[#F3F4F7] dark:bg-slate-700 text-[#495057] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft className="text-[11px]" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <span className="text-[13px] text-[#495057] dark:text-gray-300 px-1 whitespace-nowrap">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[13px] bg-[#F3F4F7] dark:bg-slate-700 text-[#495057] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="hidden sm:inline">Next</span>
                <FaChevronRight className="text-[11px]" />
              </button>
            </div>
          </div>
        )}
      </main>
    </Box>
  );
};

export default CallRecording;
