// import { useState } from "react";
// import { Calendar, ConfigProvider, Modal } from "antd";
// import enGB from "antd/locale/en_GB";
// import { IoFilterOutline } from "react-icons/io5";
// import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
// import dayjs, { Dayjs } from "dayjs";
// import "dayjs/locale/en-gb";
// import AddEventForm from "@/components/modal/addeventmodal"; // Import the new form component

// // Event data
// const events: Record<string, { color: string; title: string; time: string }[]> = {
//   "2025-11-01": [
//     { color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" },
//     { color: "#A78BFA", title: "Birthday", time: "11:00 - 11:45" },
//   ],
//   "2025-11-03": [{ color: "#60A5FA", title: "Task", time: "10:10 - 10:25" }],
//   "2025-11-05": [
//     { color: "#60A5FA", title: "Task", time: "10:10 - 10:25" },
//     { color: "#60A5FA", title: "Task", time: "11:00 - 11:45" },
//   ],
//   "2025-11-07": [{ color: "#34D399", title: "Follow-Up Call", time: "10:10 - 10:25" }],
//   "2025-11-08": [
//     { color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" },
//     { color: "#34D399", title: "Follow-Up Call", time: "11:00 - 11:45" },
//   ],
//   "2025-11-11": [{ color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" }],
// };

// // Get events for a specific date
// const getEventData = (date: Dayjs) => {
//   const key = date.format("YYYY-MM-DD");
//   return events[key as keyof typeof events] || [];
// };

// const CustomCalendar = () => {
//   const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs("2025-11-01"));
//   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
//   const [optionsModalOpen, setOptionsModalOpen] = useState(false);
//   const [addEventModalOpen, setAddEventModalOpen] = useState(false);

//   const dateCellRender = (value: Dayjs) => {
//     const listData = getEventData(value);
//     const maxEventsToShow = 2;
//     const remaining = listData.length - maxEventsToShow;

//     return (
//       <div className="flex flex-col gap-1">
//         {listData.slice(0, maxEventsToShow).map((item, index) => (
//           <div key={index} className="flex items-start gap-1 text-[10px] sm:text-[11px] leading-tight">
//             <div className="w-1 rounded-full self-stretch flex-shrink-0" style={{ backgroundColor: item.color }} />
//             <div className="min-w-0 flex-1">
//               <p className="font-medium text-gray-700 truncate">{item.title}</p>
//               <p className="text-gray-500 truncate">{item.time}</p>
//             </div>
//           </div>
//         ))}
//         {remaining > 0 && (
//           <div className="mt-1 text-center bg-gray-100 rounded-md py-0.5 sm:py-1 text-[10px] sm:text-xs text-gray-600">
//             +{remaining}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const onDateClick = (value: Dayjs) => {
//     setSelectedDate(value);
//     setOptionsModalOpen(true);
//   };

//   const handleShowAddEventForm = () => {
//     setOptionsModalOpen(false);
//     setAddEventModalOpen(true);
//   };

//   const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
//   const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

//   return (
//     <div className="mr-0 sm:mr-10 p-4 sm:p-0">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
//         <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
//           <h2 className="text-base sm:text-[28px] font-[500] text-[#0E1011]">{currentDate.format("MMMM YYYY")}</h2>
//           <div className="flex gap-2">
//             <button className="p-1 border text-[#71717A] border-[#D8DCE1] rounded-[8px] bg-[#FFFFFF]" onClick={prevMonth}>
//               <IoIosArrowBack />
//             </button>
//             <button className="p-1 border text-[#71717A] border-[#D8DCE1] rounded-[8px] bg-[#FFFFFF]" onClick={nextMonth}>
//               <IoIosArrowForward />
//             </button>
//           </div>
//         </div>
//         <button className="flex items-center gap-2 pr-[16px] pl-[10px] py-[4px] text-sm sm:text-base font-medium text-[#FFFFFF] border border-[#D8DCE1] rounded-[12px] bg-[#FFFFFF] w-full sm:w-auto justify-center">
//          <span className="text-[#2B3034]"><IoFilterOutline /></span>
//          <span className="text-[#27272A] font-[500] text-[16px]">Filter</span>
          
//         </button>
//       </div>

//       {/* Calendar Box */}
//       <ConfigProvider locale={enGB}>
//         <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm border border-gray-200 overflow-x-auto">
//           <Calendar
//             value={currentDate}
//             onPanelChange={setCurrentDate}
//             dateCellRender={dateCellRender}
//             onSelect={onDateClick}
//             headerRender={() => null}
//             className="custom-calendar"
//           />
//         </div>
//       </ConfigProvider>

//       {/* Options Modal */}
//       <Modal
//         open={optionsModalOpen}
//         footer={null}
//         onCancel={() => setOptionsModalOpen(false)}
//         title={selectedDate ? selectedDate.format("DD MMM, YYYY") : ""}
//         className="responsive-modal"
//         width="90%"
//         style={{ maxWidth: '400px' }}
//       >
//         <div className="flex flex-col gap-3">
//           <button className="py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-sm sm:text-base">Show All Events</button>
//           <button
//             className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
//             onClick={handleShowAddEventForm}
//           >
//             Add Event
//           </button>
//           <button className="py-2 px-4 rounded-md bg-red-100 hover:bg-red-200 text-sm sm:text-base" onClick={() => setOptionsModalOpen(false)}>
//             Close
//           </button>
//         </div>
//       </Modal>

//       {/* Add Event Form Modal */}
//       <AddEventForm open={addEventModalOpen} onClose={() => setAddEventModalOpen(false)} />

//       {/* Calendar custom styles */}
//       {/* @ts-ignore */}
//       <style jsx global>{`
//         .custom-calendar .ant-picker-cell {
//           height: 80px;
//           border: 1px solid #f3f4f6;
//         }
//         @media (min-width: 640px) {
//           .custom-calendar .ant-picker-cell {
//             height: 120px;
//           }
//         }
//         .custom-calendar .ant-picker-cell-today .ant-picker-cell-inner {
//           background-color: #fef3c7 !important;
//           border-radius: 8px;
//         }
//         .custom-calendar .ant-picker-body {
//           font-size: 12px;
//         }
//         @media (min-width: 640px) {
//           .custom-calendar .ant-picker-body {
//             font-size: 14px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CustomCalendar;



import { useState } from "react";
import { Calendar, ConfigProvider, Modal } from "antd";
import enGB from "antd/locale/en_GB";
import { IoFilterOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en-gb";
import AddEventForm from "@/components/modal/addeventmodal"; // Import the new form component

// Event data
const events: Record<string, { color: string; title: string; time: string }[]> = {
  "2025-11-01": [
    { color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" },
    { color: "#A78BFA", title: "Birthday", time: "11:00 - 11:45" },
    { color: "#A78BFA", title: "Birthday", time: "11:00 - 11:45" },
    { color: "#A78BFA", title: "Birthday", time: "11:00 - 11:45" },
    { color: "#A78BFA", title: "Birthday", time: "11:00 - 11:45" },
  ],
  "2025-11-03": [{ color: "#60A5FA", title: "Task", time: "10:10 - 10:25" }],
  "2025-11-05": [
    { color: "#60A5FA", title: "Task", time: "10:10 - 10:25" },
    { color: "#60A5FA", title: "Task", time: "11:00 - 11:45" },
  ],
  "2025-11-07": [{ color: "#34D399", title: "Follow-Up Call", time: "10:10 - 10:25" }],
  "2025-11-08": [
    { color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" },
    { color: "#34D399", title: "Follow-Up Call", time: "11:00 - 11:45" },
  ],
  "2025-11-11": [{ color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" }],
};

const getEventData = (date: Dayjs) => {
  const key = date.format("YYYY-MM-DD");
  return events[key as keyof typeof events] || [];
};

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs("2025-11-01"));
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);

 const dateCellRender = (value: Dayjs) => {
  const listData = getEventData(value);
  const maxEventsToShow = 2;
  const remaining = listData.length - maxEventsToShow;

  return (
    <div className="flex flex-col gap-1 py-3 h-fit  text-left">
      {/* Show only first 2 events */}
      {listData.slice(0, maxEventsToShow).map((item, index) => (
        <div key={index} className="flex items-start gap-1 text-[10px] sm:text-[11px] leading-tight">
          <div
            className="w-1 rounded-full self-stretch flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-700 truncate text-left">{item.title}</p>
            <p className="text-gray-500 truncate text-left">{item.time}</p>
          </div>
        </div>
      ))}

      {/* Remaining events indicator */}
      {remaining > 0 && (
        <div className="mt-1 px-1 py-0.5 sm:py-1 bg-[#F3F4F7] rounded-md text-[#495057] text-[10px] sm:text-[12px] font-[400] text-center">
          +{remaining}
        </div>
      )}
    </div>
  );
};


  const onDateClick = (value: Dayjs) => {
    setSelectedDate(value);
    setOptionsModalOpen(true);
  };

  const handleShowAddEventForm = () => {
    setOptionsModalOpen(false);
    setAddEventModalOpen(true);
  };

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  return (
    <div className="mr-0 sm:mr-10 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <h2 className="text-base sm:text-[28px] font-[500] text-[#0E1011]">{currentDate.format("MMMM YYYY")}</h2>
          <div className="flex gap-2">
            <button className="p-1 border text-[#71717A] border-[#D8DCE1] rounded-[8px] bg-[#FFFFFF]" onClick={prevMonth}>
              <IoIosArrowBack />
            </button>
            <button className="p-1 border text-[#71717A] border-[#D8DCE1] rounded-[8px] bg-[#FFFFFF]" onClick={nextMonth}>
              <IoIosArrowForward />
            </button>
          </div>
        </div>
        <button className="flex items-center gap-2 pr-[16px] pl-[10px] py-[4px] text-sm sm:text-base font-medium text-[#FFFFFF] border border-[#D8DCE1] rounded-[12px] bg-[#FFFFFF] w-full sm:w-auto justify-center">
          <span className="text-[#2B3034]"><IoFilterOutline /></span>
          <span className="text-[#27272A] font-[500] text-[16px]">Filter</span>
        </button>
      </div>

      {/* Calendar Box */}
      <ConfigProvider locale={enGB}>
        <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm border border-gray-200 overflow-x-auto">
          <Calendar
            value={currentDate}
            onPanelChange={setCurrentDate}
            dateCellRender={dateCellRender}
            onSelect={onDateClick}
            headerRender={() => null}
            className="custom-calendar"
          />
        </div>
      </ConfigProvider>

      {/* Options Modal */}
      <Modal
        open={optionsModalOpen}
        footer={null}
        onCancel={() => setOptionsModalOpen(false)}
        title={selectedDate ? selectedDate.format("DD MMM, YYYY") : ""}
        className="responsive-modal"
        width="90%"
        style={{ maxWidth: '400px' }}
      >
        <div className="flex flex-col gap-3">
          <button className="py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-sm sm:text-base">Show All Events</button>
          <button
            className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
            onClick={handleShowAddEventForm}
          >
            Add Event
          </button>
          <button className="py-2 px-4 rounded-md bg-red-100 hover:bg-red-200 text-sm sm:text-base" onClick={() => setOptionsModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

      {/* Add Event Form Modal */}
      <AddEventForm open={addEventModalOpen} onClose={() => setAddEventModalOpen(false)} />

      {/* Calendar custom styles */}
 <style jsx global>{`
  /* Calendar cell heights */
  .custom-calendar .ant-picker-cell {
    height: 80px !important;
    border: 1px solid #f3f4f6;
    
  }
  @media (min-width: 640px) {
    .custom-calendar .ant-picker-cell {
      height: 150px;
      overflow:hidden !important;
    }
  }

  /* Today highlight */
  .custom-calendar .ant-picker-cell-today .ant-picker-cell-inner {
    background-color: #fef3c7 !important;
    border-radius: 8px;
  }

  /* Date cell text */
  .custom-calendar .ant-picker-cell-inner {
    text-align: left !important;
    padding-left: 4px;
  }

  /* Weekday headers (Mon, Tue...) */
  .custom-calendar .ant-picker-thead > tr > th {
    text-align: left !important;
    padding-left: 8px;
    font-weight: 500;
    font-size: 12px;
  }

  /* Event text inside cells */
  .custom-calendar .ant-picker-cell .flex {
    justify-content: flex-start !important;
  }
`}</style>


    </div>
  );
};

export default CustomCalendar;
