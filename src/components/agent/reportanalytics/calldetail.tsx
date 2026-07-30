import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
import { FaChevronDown } from "react-icons/fa";
import callsicon from "../../../assets/callsicon.png";
import { TableComponent } from "@/components/common/tablecomponent";
import { useCallerIds } from "@/hooks/useSystemSettings";

const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

// ----------------------
// Caller ID Filter
// ----------------------
const CallerIdFilter: React.FC<{
  value: string;
  onChange: (callerId: string) => void;
}> = ({ value, onChange }) => {
  const { data: callerIdsData } = useCallerIds();
  const callerIds = callerIdsData || [];

  return (
    <div className="relative border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-800 rounded-[12px] px-[16px] h-[40px] flex justify-between w-[210px] items-center gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-[16px] dark:text-gray-200 outline-none cursor-pointer appearance-none [&>option]:dark:bg-slate-800"
      >
        <option value="">Caller ID: All</option>
        {callerIds.map((c) => (
          <option key={c.id} value={c.id}>
            Caller ID: {c.label || c.twillioNumber}
          </option>
        ))}
      </select>
      <FaChevronDown className="text-[13px] text-[#71717A] dark:text-gray-400 pointer-events-none shrink-0" />
    </div>
  );
};

// ----------------------
// Date Range Filter
// ----------------------
const CallDetailDateRangeFilter: React.FC<{
  onChange: (range: { startDate?: string; endDate?: string }) => void;
}> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedLabel, setAppliedLabel] = useState("All Dates");

  const handleApply = () => {
    onChange({ startDate: startDate || undefined, endDate: endDate || undefined });
    setAppliedLabel(startDate && endDate ? `${startDate} - ${endDate}` : "All Dates");
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setAppliedLabel("All Dates");
    onChange({ startDate: undefined, endDate: undefined });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-[16px] border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-800 rounded-[12px] px-[16px] h-[40px] cursor-pointer"
      >
        <span className="text-[16px] dark:text-gray-200 whitespace-nowrap">{appliedLabel}</span>
        <FaChevronDown className="text-[11px] text-[#71717A] dark:text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] shadow-lg p-4 z-20">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[12px] font-[500] text-[#495057] dark:text-gray-400 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-[8px] px-2 py-1.5 text-[13px]"
              />
            </div>
            <div>
              <label className="text-[12px] font-[500] text-[#495057] dark:text-gray-400 block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-[8px] px-2 py-1.5 text-[13px]"
              />
            </div>
            <div className="flex justify-between gap-2 mt-1">
              <button type="button" onClick={handleClear} className="text-[13px] font-[500] text-[#495057] dark:text-gray-400 hover:underline">
                All Dates
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!startDate || !endDate}
                className="px-3 py-1.5 rounded-[8px] text-[13px] font-[500] bg-[#FFCA06] text-black disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------
// Time Frame Filter
// ----------------------
const TimeFrameFilter: React.FC<{
  onChange: (range: { start?: string; end?: string }) => void;
}> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [appliedLabel, setAppliedLabel] = useState("Select Time Frame");

  const handleApply = () => {
    onChange({ start: start || undefined, end: end || undefined });
    setAppliedLabel(start && end ? `${start} - ${end}` : "Select Time Frame");
    setIsOpen(false);
  };

  const handleClear = () => {
    setStart("");
    setEnd("");
    setAppliedLabel("Select Time Frame");
    onChange({ start: undefined, end: undefined });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-[16px] border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-800 rounded-[12px] px-[16px] h-[40px] cursor-pointer"
      >
        <span className="text-[16px] dark:text-gray-200 whitespace-nowrap">{appliedLabel}</span>
        <FaChevronDown className="text-[11px] text-[#71717A] dark:text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] shadow-lg p-4 z-20">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[12px] font-[500] text-[#495057] dark:text-gray-400 block mb-1">Start Time</label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-[8px] px-2 py-1.5 text-[13px]"
              />
            </div>
            <div>
              <label className="text-[12px] font-[500] text-[#495057] dark:text-gray-400 block mb-1">End Time</label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-[8px] px-2 py-1.5 text-[13px]"
              />
            </div>
            <div className="flex justify-between gap-2 mt-1">
              <button type="button" onClick={handleClear} className="text-[13px] font-[500] text-[#495057] dark:text-gray-400 hover:underline">
                Clear
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!start || !end}
                className="px-3 py-1.5 rounded-[8px] text-[13px] font-[500] bg-[#FFCA06] text-black disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------
// Days Of The Week Filter
// ----------------------
const DaysOfWeekFilter: React.FC<{
  onChange: (days: number[]) => void;
}> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [applied, setApplied] = useState<number[]>([]);

  const toggleDay = (value: number) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    setApplied(selected);
    onChange(selected);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelected([]);
    setApplied([]);
    onChange([]);
    setIsOpen(false);
  };

  const label = applied.length > 0
    ? `Days Of The Week: ${applied.map((d) => WEEKDAYS[d].label).join(", ")}`
    : "Days Of The Week: All";

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-800 rounded-[12px] px-[16px] h-[40px] flex justify-between w-[240px] items-center gap-2 cursor-pointer"
      >
        <span className="text-[16px] dark:text-gray-200 truncate">{label}</span>
        <FaChevronDown className="text-[13px] text-[#71717A] dark:text-gray-400 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] shadow-lg p-4 z-20">
          <div className="flex flex-col gap-2">
            {WEEKDAYS.map((day) => (
              <label key={day.value} className="flex items-center gap-2 text-[13px] dark:text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(day.value)}
                  onChange={() => toggleDay(day.value)}
                />
                {day.label}
              </label>
            ))}
            <div className="flex justify-between gap-2 mt-2">
              <button type="button" onClick={handleClear} className="text-[13px] font-[500] text-[#495057] dark:text-gray-400 hover:underline">
                All
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-3 py-1.5 rounded-[8px] text-[13px] font-[500] bg-[#FFCA06] text-black"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------
// SortedHeader Component
// ----------------------
interface SortedHeaderProps {
  header: any;
  label: string;
}

const SortedHeader: React.FC<SortedHeaderProps> = ({ header, label }) => {
  const isSorted = header.column.getIsSorted();
  return (
    <div className="flex items-center gap-1 cursor-pointer">
      <span>{label}</span>
      {isSorted === "asc" && <span>↑</span>}
      {isSorted === "desc" && <span>↓</span>}
    </div>
  );
};

// ----------------------
// Table Data & Columns
// ----------------------
import { useCallDetailsReport } from "@/hooks/useCallDetailsReport";
import { useEffect } from "react";

// ----------------------
// Table Data & Columns
// ----------------------
interface CallRow {
  id: string;
  name: string;
  address: string;
  list: string;
  folder: string;
  phone: string;
  result: string;
}

const columns = [
  {
    accessorKey: "name",
    header: (info: any) => <SortedHeader header={info.header} label="Name" />,
    cell: (info: any) => (
      <span className="text-[#1D85F0] dark:text-blue-400 font-normal text-[14px]">
        {info.getValue() || "-"}
      </span>
    ),
  },
  {
    accessorKey: "address",
    header: (info: any) => (
      <SortedHeader header={info.header} label="Address" />
    ),
    cell: (info: any) => (
      <span className="text-[#495057] dark:text-gray-300 font-normal">
        {info.getValue() || "-"}
      </span>
    ),
  },
  {
    accessorKey: "list",
    header: (info: any) => <SortedHeader header={info.header} label="List" />,
    cell: (info: any) => (
      <span className="text-[#495057] dark:text-gray-300 font-normal">
        {info.getValue() || "-"}
      </span>
    ),
  },
  {
    accessorKey: "folder",
    header: (info: any) => <SortedHeader header={info.header} label="Folder" />,
    cell: (info: any) => (
      <span className="text-[#495057] dark:text-gray-300 font-normal">
        {info.getValue() || "-"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: (info: any) => (
      <SortedHeader header={info.header} label="Phone Number" />
    ),
    cell: (info: any) => (
      <div className="flex items-center gap-2">
        <img
          src={callsicon}
          alt="call"
          className="w-4 h-4 object-contain dark:invert"
        />
        <span className="text-[#495057] dark:text-gray-300 font-normal">
          {info.getValue() || "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "result",
    header: (info: any) => <SortedHeader header={info.header} label="Result" />,
    cell: (info: any) => (
      <span className="text-[#495057] dark:text-gray-300 font-normal">
        {info.getValue() || "-"}
      </span>
    ),
  },
];

interface CallDetailProps {
  userId?: string;
  selectedResult?: string;
}

// ----------------------
// Main Component
// ----------------------
const CallDetail: React.FC<CallDetailProps> = ({ userId, selectedResult }) => {
  const { data, loading, getCallDetails, pagination } = useCallDetailsReport();

  const [callerId, setCallerId] = useState("");
  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});
  const [timeFrame, setTimeFrame] = useState<{ start?: string; end?: string }>({});
  const [days, setDays] = useState<number[]>([]);

  useEffect(() => {
    getCallDetails({
      userId,
      callerId: callerId || undefined,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      timeFrameStart: timeFrame.start,
      timeFrameEnd: timeFrame.end,
      dayOfWeek: days.length > 0 ? days.join(",") : undefined,
    });
  }, [userId, callerId, dateRange, timeFrame, days, getCallDetails]);

  const tableData: CallRow[] = data
    .filter((item) => {
      if (!selectedResult || selectedResult === "All Result") return true;
      return item.result.toLowerCase() === selectedResult.toLowerCase();
    })
    .map((item) => ({
      id: item.id,
      name: item.name,
      address: item.address,
      list: item.list,
      folder: item.folder,
      phone: item.phoneNumber,
      result: item.result,
    }));
  return (
    <Box className="mt-3 flex flex-col gap-2 w-full h-full">
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
      padding: 8px !important;
      font-size: 14px;
      border-bottom: 1px solid #EBEDF0 !important;
      color: #0E1011;
      font-weight:500;
      text-align: left;
    }
    table tbody tr td {
      padding: 16px 6px !important; /* desktop padding */
      font-size: 14px;
    }
    table tbody tr {
      border-bottom: 1px solid #EBEDF0 !important;
    }
    table tbody tr:last-child {
      border-bottom: none !important;
    }

    /* DARK MODE ADJUSTMENTS */
    :is(.dark) table thead tr th, :is(.dark) table thead { background: #334155 !important; } /* bg-slate-700 */
    :is(.dark) table thead tr th { 
        color: white !important; 
        border-bottom: 1px solid #475569 !important; 
    }
    :is(.dark) table tbody tr { border-bottom: 1px solid #475569 !important; }

    /* Mobile spacing adjustments */
    @media (max-width: 768px) {
      .responsive-table-wrapper {
        overflow-x: auto;
      }
      table {
        width: 100% !important;
        min-width: 600px;
      }
      table tbody tr td {
        padding: 20px 12px !important; /* mobile spacing */
      }
      table thead tr th {
        padding: 12px 12px !important; /* mobile spacing */
      }
      .filters-wrapper {
        flex-wrap: wrap !important;
      }
    }
  `}
      </style>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-2 w-full filters-wrapper">
        <CallerIdFilter value={callerId} onChange={setCallerId} />
        <CallDetailDateRangeFilter onChange={setDateRange} />
        <TimeFrameFilter onChange={setTimeFrame} />
        <DaysOfWeekFilter onChange={setDays} />
      </div>

      {/* Table — one state at a time: loading → data → empty (never overlap) */}
      <div className="responsive-table-wrapper">
        {loading ? (
          <div className="text-center py-6 dark:text-gray-300">Loading report...</div>
        ) : tableData.length > 0 ? (
          <TableProvider data={tableData} columns={columns}>
            {() => <TableComponent />}
          </TableProvider>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No call details found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-[14px] text-[#495057] dark:text-gray-300">
          <span>
            {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#495057] dark:text-gray-300">
              Page
            </span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 bg-[#17181B] dark:bg-yellow-400 dark:text-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                1
              </button>
              <button className="px-3 py-1.5 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600 text-[#495057] text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600 text-[#495057] text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                3
              </button>
            </div>
          </div>

          <div className="border border-[#D8DCE1] dark:border-slate-600 dark:bg-slate-700 rounded-[12px] px-[12px] h-[36px] flex justify-between items-center gap-2 cursor-pointer bg-white min-w-[80px]">
            <span className="text-[14px] text-[#495057] dark:text-gray-200">
              50
            </span>
            <FaChevronDown className="text-[12px] text-[#71717A] dark:text-gray-400" />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default CallDetail;
