


// import { useState } from "react";
// import { Calendar, ConfigProvider, Modal } from "antd";
// import enGB from "antd/locale/en_GB";
// import { IoFilterOutline } from "react-icons/io5";
// import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
// import dayjs from "dayjs";
// import "dayjs/locale/en-gb";
// import AddEventForm from "@/components/modal/addeventmodal"; // Import the new form component

// // Event data
// const events = {
//     "2025-11-01": [
//       { color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" },
//       { color: "#A78BFA", title: "Birthday", time: "11:00 - 11:45" },
//     ],
//     "2025-11-03": [{ color: "#60A5FA", title: "Task", time: "10:10 - 10:25" }],
//     "2025-11-05": [
//       { color: "#60A5FA", title: "Task", time: "10:10 - 10:25" },
//       { color: "#60A5FA", title: "Task", time: "11:00 - 11:45" },
//     ],
//     "2025-11-07": [
//       { color: "#34D399", title: "Follow-Up Call", time: "10:10 - 10:25" },
//     ],
//     "2025-11-08": [
//       { color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" },
//       { color: "#34D399", title: "Follow-Up Call", time: "11:00 - 11:45" },
//     ],
//     "2025-11-11": [
//       { color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" },
//     ],
// };

// const getEventData = (date) => {
//   const key = date.format("YYYY-MM-DD");
//   return events[key] || [];
// };

// const CustomCalendar = () => {
//   const [currentDate, setCurrentDate] = useState(dayjs("2025-11-01"));
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [optionsModalOpen, setOptionsModalOpen] = useState(false);
//   const [addEventModalOpen, setAddEventModalOpen] = useState(false); // State for the new modal

//   const dateCellRender = (value) => {
//     const listData = getEventData(value);
//     const maxEventsToShow = 2;
//     const remaining = listData.length - maxEventsToShow;

//     return (
//       <div className="flex flex-col gap-1">
//         {listData.slice(0, maxEventsToShow).map((item, index) => (
//           <div key={index} className="flex items-start gap-1 text-[11px] leading-tight">
//             <div className="w-1 rounded-full self-stretch" style={{ backgroundColor: item.color }} />
//             <div>
//               <p className="font-medium text-gray-700">{item.title}</p>
//               <p className="text-gray-500">{item.time}</p>
//             </div>
//           </div>
//         ))}
//         {remaining > 0 && (
//           <div className="mt-1 text-center bg-gray-100 rounded-md py-1 text-xs text-gray-600">
//             +{remaining}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const onDateClick = (value) => {
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
//     <div className="mr-10">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <h2 className="text-lg font-semibold text-gray-800">
//             {currentDate.format("MMMM YYYY")}
//           </h2>
//           <div className="flex gap-2">
//             <button className="p-2 border rounded-md hover:bg-gray-100" onClick={prevMonth}>
//               <IoIosArrowBack />
//             </button>
//             <button className="p-2 border rounded-md hover:bg-gray-100" onClick={nextMonth}>
//               <IoIosArrowForward />
//             </button>
//           </div>
//         </div>
//         <button className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 border rounded-md hover:bg-gray-100">
//           <IoFilterOutline />
//           Filter
//         </button>
//       </div>

//       {/* Calendar Box */}
//       <ConfigProvider locale={enGB}>
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 overflow-x-auto">
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
//       >
//         <div className="flex flex-col gap-3">
//           <button className="py-2 rounded-md bg-gray-100 hover:bg-gray-200">Show All Events</button>
//           <button className="py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={handleShowAddEventForm}>Add Event</button>
//           <button className="py-2 rounded-md bg-red-100 hover:bg-red-200" onClick={() => setOptionsModalOpen(false)}>Close</button>
//         </div>
//       </Modal>

//       {/* Add Event Form Modal */}
//       <AddEventForm 
//         open={addEventModalOpen}
//         onClose={() => setAddEventModalOpen(false)}
//       />

//       <style jsx global>{`
//         .custom-calendar .ant-picker-cell {
//           height: 120px;
//           border: 1px solid #f3f4f6;
//         }
//         .custom-calendar .ant-picker-cell-today .ant-picker-cell-inner {
//           background-color: #fef3c7 !important;
//           border-radius: 8px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CustomCalendar;
// // import { useState } from "react";
// // import { Calendar, ConfigProvider, Modal } from "antd";
// // import enGB from "antd/locale/en_GB";
// // import { IoFilterOutline } from "react-icons/io5";
// // import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
// // import dayjs, { Dayjs } from "dayjs";
// // import "dayjs/locale/en-gb";
// // import AddEventForm from "@/components/modal/addeventmodal"; // Import the new form component

// // // Event data
// // const events: Record<string, { color: string; title: string; time: string }[]> = {
// //   "2025-11-01": [
// //     { color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" },
// //     { color: "#A78BFA", title: "Birthday", time: "11:00 - 11:45" },
// //   ],
// //   "2025-11-03": [{ color: "#60A5FA", title: "Task", time: "10:10 - 10:25" }],
// //   "2025-11-05": [
// //     { color: "#60A5FA", title: "Task", time: "10:10 - 10:25" },
// //     { color: "#60A5FA", title: "Task", time: "11:00 - 11:45" },
// //   ],
// //   "2025-11-07": [{ color: "#34D399", title: "Follow-Up Call", time: "10:10 - 10:25" }],
// //   "2025-11-08": [
// //     { color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" },
// //     { color: "#34D399", title: "Follow-Up Call", time: "11:00 - 11:45" },
// //   ],
// //   "2025-11-11": [{ color: "#FCA5A5", title: "Home Close Date", time: "10:10 - 10:25" }],
// // };

// // // Get events for a specific date
// // const getEventData = (date: Dayjs) => {
// //   const key = date.format("YYYY-MM-DD");
// //   return events[key as keyof typeof events] || [];
// // };

// // const CustomCalendar = () => {
// //   const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs("2025-11-01"));
// //   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
// //   const [optionsModalOpen, setOptionsModalOpen] = useState(false);
// //   const [addEventModalOpen, setAddEventModalOpen] = useState(false);

// //   const dateCellRender = (value: Dayjs) => {
// //     const listData = getEventData(value);
// //     const maxEventsToShow = 2;
// //     const remaining = listData.length - maxEventsToShow;

// //     return (
// //       <div className="flex flex-col gap-1">
// //         {listData.slice(0, maxEventsToShow).map((item, index) => (
// //           <div key={index} className="flex items-start gap-1 text-[10px] sm:text-[11px] leading-tight">
// //             <div className="w-1 rounded-full self-stretch flex-shrink-0" style={{ backgroundColor: item.color }} />
// //             <div className="min-w-0 flex-1">
// //               <p className="font-medium text-gray-700 truncate">{item.title}</p>
// //               <p className="text-gray-500 truncate">{item.time}</p>
// //             </div>
// //           </div>
// //         ))}
// //         {remaining > 0 && (
// //           <div className="mt-1 text-center bg-gray-100 rounded-md py-0.5 sm:py-1 text-[10px] sm:text-xs text-gray-600">
// //             +{remaining}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   const onDateClick = (value: Dayjs) => {
// //     setSelectedDate(value);
// //     setOptionsModalOpen(true);
// //   };

// //   const handleShowAddEventForm = () => {
// //     setOptionsModalOpen(false);
// //     setAddEventModalOpen(true);
// //   };

// //   const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
// //   const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

// //   return (
// //     <div className="mr-0 sm:mr-10 p-4 sm:p-0">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
// //         <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
// //           <h2 className="text-base sm:text-[28px] font-[500] text-[#0E1011]">{currentDate.format("MMMM YYYY")}</h2>
// //           <div className="flex gap-2">
// //             <button className="p-1 border text-[#71717A] border-[#D8DCE1] rounded-[8px] bg-[#FFFFFF]" onClick={prevMonth}>
// //               <IoIosArrowBack />
// //             </button>
// //             <button className="p-1 border text-[#71717A] border-[#D8DCE1] rounded-[8px] bg-[#FFFFFF]" onClick={nextMonth}>
// //               <IoIosArrowForward />
// //             </button>
// //           </div>
// //         </div>
// //         <button className="flex items-center gap-2 pr-[16px] pl-[10px] py-[4px] text-sm sm:text-base font-medium text-[#FFFFFF] border border-[#D8DCE1] rounded-[12px] bg-[#FFFFFF] w-full sm:w-auto justify-center">
// //          <span className="text-[#2B3034]"><IoFilterOutline /></span>
// //          <span className="text-[#27272A] font-[500] text-[16px]">Filter</span>

// //         </button>
// //       </div>

// //       {/* Calendar Box */}
// //       <ConfigProvider locale={enGB}>
// //         <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm border border-gray-200 overflow-x-auto">
// //           <Calendar
// //             value={currentDate}
// //             onPanelChange={setCurrentDate}
// //             dateCellRender={dateCellRender}
// //             onSelect={onDateClick}
// //             headerRender={() => null}
// //             className="custom-calendar"
// //           />
// //         </div>
// //       </ConfigProvider>

// //       {/* Options Modal */}
// //       <Modal
// //         open={optionsModalOpen}
// //         footer={null}
// //         onCancel={() => setOptionsModalOpen(false)}
// //         title={selectedDate ? selectedDate.format("DD MMM, YYYY") : ""}
// //         className="responsive-modal"
// //         width="90%"
// //         style={{ maxWidth: '400px' }}
// //       >
// //         <div className="flex flex-col gap-3">
// //           <button className="py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-sm sm:text-base">Show All Events</button>
// //           <button
// //             className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
// //             onClick={handleShowAddEventForm}
// //           >
// //             Add Event
// //           </button>
// //           <button className="py-2 px-4 rounded-md bg-red-100 hover:bg-red-200 text-sm sm:text-base" onClick={() => setOptionsModalOpen(false)}>
// //             Close
// //           </button>
// //         </div>
// //       </Modal>

// //       {/* Add Event Form Modal */}
// //       <AddEventForm open={addEventModalOpen} onClose={() => setAddEventModalOpen(false)} />

// //       {/* Calendar custom styles */}
// //       {/* @ts-ignore */}
// //       <style jsx global>{`
// //         .custom-calendar .ant-picker-cell {
// //           height: 80px;
// //           border: 1px solid #f3f4f6;
// //         }
// //         @media (min-width: 640px) {
// //           .custom-calendar .ant-picker-cell {
// //             height: 120px;
// //           }
// //         }
// //         .custom-calendar .ant-picker-cell-today .ant-picker-cell-inner {
// //           background-color: #fef3c7 !important;
// //           border-radius: 8px;
// //         }
// //         .custom-calendar .ant-picker-body {
// //           font-size: 12px;
// //         }
// //         @media (min-width: 640px) {
// //           .custom-calendar .ant-picker-body {
// //             font-size: 14px;
// //           }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default CustomCalendar;



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
//     { color: "#A78BFA", title: "Birthday", time: "11:00 - 11:45" },
//     { color: "#A78BFA", title: "Birthday", time: "11:00 - 11:45" },
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

// const getEventData = (date: Dayjs) => {
//   const key = date.format("YYYY-MM-DD");
//   return events[key as keyof typeof events] || [];
// };

// const CustomCalendar = () => {
//   const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs("2025-11-01"));
//   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
//   const [optionsModalOpen, setOptionsModalOpen] = useState(false);
//   const [addEventModalOpen, setAddEventModalOpen] = useState(false);

//  const dateCellRender = (value: Dayjs) => {
//   const listData = getEventData(value);
//   const maxEventsToShow = 2;
//   const remaining = listData.length - maxEventsToShow;

//   return (
//     <div className="flex flex-col gap-1 py-3 h-fit  text-left">
//       {/* Show only first 2 events */}
//       {listData.slice(0, maxEventsToShow).map((item, index) => (
//         <div key={index} className="flex items-start gap-1 text-[10px] sm:text-[11px] leading-tight">
//           <div
//             className="w-1 rounded-full self-stretch flex-shrink-0"
//             style={{ backgroundColor: item.color }}
//           />
//           <div className="min-w-0 flex-1">
//             <p className="font-medium text-gray-700 truncate text-left">{item.title}</p>
//             <p className="text-gray-500 truncate text-left">{item.time}</p>
//           </div>
//         </div>
//       ))}

//       {/* Remaining events indicator */}
//       {remaining > 0 && (
//         <div className="mt-1 px-1 py-0.5 sm:py-1 bg-[#F3F4F7] rounded-md text-[#495057] text-[10px] sm:text-[12px] font-[400] text-center">
//           +{remaining}
//         </div>
//       )}
//     </div>
//   );
// };


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
//           <span className="text-[#2B3034]"><IoFilterOutline /></span>
//           <span className="text-[#27272A] font-[500] text-[16px]">Filter</span>
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
//  <style global jsx>{`
//   /* Calendar cell heights */
//   .custom-calendar .ant-picker-cell {
//     height: 80px !important;
//     border: 1px solid #f3f4f6;
//   }
//   @media (min-width: 640px) {
//     .custom-calendar .ant-picker-cell {
//       height: 150px !important;
//       overflow: hidden !important;
//     }
//   }

//   /* Today highlight */
//   .custom-calendar .ant-picker-cell-today .ant-picker-cell-inner {
//     background-color: #fef3c7 !important;
//     border-radius: 8px;
//   }

//   /* Date cell text */
//   .custom-calendar .ant-picker-cell-inner {
//     text-align: left !important;
//     padding-left: 4px;
//   }

//   /* Weekday headers (Mon, Tue...) */
//   .custom-calendar .ant-picker-thead > tr > th {
//     text-align: left !important;
//     padding-left: 8px;
//     font-weight: 500;
//     font-size: 12px;
//   }

//   /* Event text inside cells */
//   .custom-calendar .ant-picker-cell .flex {
//     justify-content: flex-start !important;
//   }
// `}</style>



//     </div>
//   );
// };

// export default CustomCalendar;


import { useState, useEffect, useMemo } from "react";
import { Calendar, ConfigProvider, Modal } from "antd";
import enGB from "antd/locale/en_GB";
import { IoFilterOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FiEdit, FiClipboard, FiCalendar, FiPhone } from "react-icons/fi";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en-gb";
import AddEventForm from "@/components/modal/addeventmodal";
import { useCalendar, type CalendarEvent } from "@/hooks/useCalendar";
import Loader from "@/components/common/Loader";

// Helper to group events by date
const groupEventsByDate = (eventList: CalendarEvent[]) => {
  const grouped: Record<string, CalendarEvent[]> = {};
  eventList.forEach((event) => {
    const dateKey = dayjs(event.startDate).format("YYYY-MM-DD");
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });
  return grouped;
};

const formatEventTime = (event: CalendarEvent) => {
  if (event.eventType === 'ALL_DAY') return 'All Day';
  const start = dayjs(event.startDate).format('HH:mm');
  if (event.endDate) {
    const end = dayjs(event.endDate).format('HH:mm');
    return `${start} - ${end}`;
  }
  return start;
};

/* --------------------------------------------------
 *  MAIN COMPONENT
 * -------------------------------------------------- */
export default function CustomCalendar() {
  const { getEvents, loading } = useCalendar();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  /* modals */
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [showAllOpen, setShowAllOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  /* filter options */
  const [filters, setFilters] = useState({
    task: true,
    appointments: true,
    followUpCalls: true,
  });

  /* selected event for detail */
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  /* selected date for detail modal */
  const [selectedEventDate, setSelectedEventDate] = useState<Dayjs | null>(null);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const groupedEvents = useMemo(() => groupEventsByDate(events), [events]);

  const getEventData = (date: Dayjs) => {
    const key = date.format("YYYY-MM-DD");
    return groupedEvents[key] || [];
  };

  /* handlers */
  const onDateClick = (d: Dayjs) => {
    setSelectedDate(d);
    setOptionsOpen(true);
  };

  const showAdd = () => {
    setOptionsOpen(false);
    setAddOpen(true);
  };

  const showAll = () => {
    setOptionsOpen(false);
    setShowAllOpen(true);
  };

  const openDetail = (ev: CalendarEvent, date: Dayjs) => {
    setSelectedEvent(ev);
    setSelectedEventDate(date);
    setDetailOpen(true);
  };

  const prev = () => setCurrentDate((d) => d.subtract(1, "month"));
  const next = () => setCurrentDate((d) => d.add(1, "month"));

  /* calendar cell render */
  const dateCellRender = (value: Dayjs) => {
    const list = getEventData(value);
    const max = 2;
    const more = list.length - max;

    return (
      <div className="flex flex-col gap-1 py-2 h-full text-left">
        {list.slice(0, max).map((it, i) => (
          <div key={i} className="flex items-start gap-1 text-[10px] sm:text-[11px] leading-tight cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            openDetail(it, value);
          }}>
            <div
              className="w-1 rounded-full self-stretch flex-shrink-0"
              style={{ backgroundColor: it.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-700 truncate">{it.title}</p>
              <p className="text-gray-500 truncate">{formatEventTime(it)}</p>
            </div>
          </div>
        ))}
        {more > 0 && (
          <div
            className="mt-1 px-1 py-0.5 sm:py-1 bg-[#F3F4F7] rounded-md text-[#495057] text-[10px] sm:text-[12px] font-[400] text-center cursor-pointer hover:bg-[#E9ECEF]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDate(value);
              setShowAllOpen(true);
            }}
          >
            +{more}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mr-0 sm:mr-10 p-4 sm:p-0">
      {/* ------- header ------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <h2 className="text-base sm:text-[28px] dark:text-white font-[500] text-[#0E1011]">
            {currentDate.format("MMMM YYYY")}
          </h2>
          <div className="flex gap-2">
            <button
              className="p-1 border text-[#71717A] border-[#D8DCE1] rounded-[8px] bg-[#FFFFFF]"
              onClick={prev}
            >
              <IoIosArrowBack />
            </button>
            <button
              className="p-1 border text-[#71717A] border-[#D8DCE1] rounded-[8px] bg-[#FFFFFF]"
              onClick={next}
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>
        <button 
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 pr-[16px] pl-[10px] py-[4px] text-sm sm:text-base font-medium text-[#FFFFFF] border border-[#D8DCE1] rounded-[12px] bg-[#FFFFFF] w-full sm:w-auto justify-center"
        >
          <span className="text-[#2B3034]">
            <IoFilterOutline />
          </span>
          <span className="text-[#27272A] font-[500] text-[16px]">Filter</span>
        </button>
      </div>

      {/* ------- calendar ------- */}
      <ConfigProvider locale={enGB}>
        <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm border border-gray-200 overflow-x-auto relative">
          {loading && <Loader />}
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

      {/* ------- options modal ------- */}
      <Modal
        open={optionsOpen}
        footer={null}
        onCancel={() => setOptionsOpen(false)}
        title={selectedDate?.format("DD MMM, YYYY")}
        className="rounded-modal"
        width="90%"
        style={{ maxWidth: 400 }}
      >
        <div className="flex flex-col gap-3">
          <button
            className="py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-sm sm:text-base"
            onClick={showAll}
          >
            Show All Events
          </button>
          <button
            className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
            onClick={showAdd}
          >
            Add Event
          </button>
          <button
            className="py-2 px-4 rounded-md bg-red-100 hover:bg-red-200 text-sm sm:text-base"
            onClick={() => setOptionsOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>

      {/* ------- add-event modal ------- */}
      <AddEventForm
        open={addOpen}
        onClose={(success) => {
          setAddOpen(false);
          if (success) fetchEvents();
        }}
      />

      {/* ------- show-all modal ------- */}
      <Modal
        open={showAllOpen}
        footer={null}
        onCancel={() => setShowAllOpen(false)}
        className="rounded-modal"
        width="90%"
        style={{ maxWidth: 900 }}
        closeIcon={<span className="text-gray-500 text-xl">✕</span>}
        title={null}
      >
        <div className="px-8 pt-6">
          <p className="text-gray-500 text-sm">{selectedDate?.format("dddd")}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-0">
            {selectedDate?.format("MMMM DD")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 px-8 pb-10 pt-6">
          {getEventData(selectedDate || dayjs()).map((evt, i) => (
            <div
              key={i}
              className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
              onClick={() => openDetail(evt, selectedDate || dayjs())}
            >
              <div
                className="w-1 rounded-full h-full"
                style={{ backgroundColor: evt.color }}
              />
              <div className="flex flex-col leading-tight">
                <p className="text-gray-800 font-medium text-[15px]">{evt.title}</p>
                <p className="text-gray-500 text-[13px] mt-0.5">{formatEventTime(evt)}</p>
              </div>
            </div>
          ))}
          {!getEventData(selectedDate || dayjs()).length && (
            <p className="text-gray-500 col-span-3 text-center py-10 text-lg">
              No events for this date
            </p>
          )}
        </div>
      </Modal>
      
      {/* ------- event-detail modal (SAME AS IMAGE) ------- */}
      <Modal
        open={detailOpen}
        footer={null}
        onCancel={() => setDetailOpen(false)}
        className="event-detail-modal"
        width="90%"
        style={{ maxWidth: 400 }}
        closeIcon={null}
        title={null}
        maskClosable={true}
      >
        <div className="bg-white">
          {/* Header with title, date/time, and action icons */}
          <div className="relative px-5 pt-5 pb-4">
            {/* Edit and Close icons in top right */}
            <div className="absolute top-5 right-5 flex items-center gap-3 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit action - you can add edit functionality here
                  setDetailOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Edit event"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close"
              >
                <span className="text-lg leading-none">✕</span>
              </button>
            </div>

            {/* Title with green bar */}
            <div className="flex items-start gap-3 pr-20">
              <div className="w-[2px] h-5 bg-emerald-500 flex-shrink-0" style={{ marginTop: '2px' }} />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {selectedEvent?.title}
                </h3>
                {/* Date and time on same line */}
                <div className="flex items-center gap-2 mt-1 text-sm font-normal text-gray-600">
                  <span>
                    {selectedEventDate?.format("dddd, MMMM DD")}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span>{selectedEvent && formatEventTime(selectedEvent)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="px-5 pb-5">
            {/* Assignee section */}
            <div className="mt-4">
              <p className="text-xs font-normal text-gray-500 mb-1">
                Assignee
              </p>
              <p className="text-sm font-normal text-gray-900 mt-0.5">
                {selectedEvent?.assignTo?.fullName || selectedEvent?.assignTo?.email || "Unassigned"}
              </p>
            </div>

            {/* Description section */}
            <div className="mt-4">
              <p className="text-xs font-normal text-gray-500 mb-1">
                Description
              </p>
              <p className="text-sm font-normal text-gray-900 mt-0.5 leading-relaxed">
                {selectedEvent?.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* ------- filter modal ------- */}
      <Modal
        open={filterOpen}
        footer={null}
        onCancel={() => setFilterOpen(false)}
        className="filter-modal"
        width="90%"
        style={{ maxWidth: 500 }}
        closeIcon={
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setFilterOpen(false)}
          >
            ✕
          </button>
        }
        title={null}
        maskClosable={true}
      >
        <div className="bg-white rounded-xl">
          {/* Header */}
          <div className="relative px-5 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Filter by Type</h3>
            <button
              onClick={() => setFilterOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Filter Options */}
          <div className="px-5 py-4 flex flex-col gap-4">
            {/* Task */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.task}
                onChange={(e) => setFilters({ ...filters, task: e.target.checked })}
                className="filter-checkbox w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-gray-500 cursor-pointer"
              />
              <FiClipboard className="w-5 h-5 text-gray-700" />
              <span className="text-base font-medium text-gray-900">Task</span>
            </label>

            {/* Appointments */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.appointments}
                onChange={(e) => setFilters({ ...filters, appointments: e.target.checked })}
                className="filter-checkbox w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-gray-500 cursor-pointer"
              />
              <FiCalendar className="w-5 h-5 text-gray-700" />
              <span className="text-base font-medium text-gray-900">Appointments</span>
            </label>

            {/* Follow-up Calls */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.followUpCalls}
                onChange={(e) => setFilters({ ...filters, followUpCalls: e.target.checked })}
                className="filter-checkbox w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-gray-500 cursor-pointer"
              />
              <FiPhone className="w-5 h-5 text-gray-700" />
              <span className="text-base font-medium text-gray-900">Follow-up Calls</span>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="px-5 pb-5 flex gap-3">
            <button
              onClick={() => {
                setFilters({ task: true, appointments: true, followUpCalls: true });
              }}
              className="flex-1 py-2.5 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-base font-medium text-gray-900 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => {
                // Apply filter logic here if needed
                setFilterOpen(false);
              }}
              className="flex-1 py-2.5 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-base font-medium text-gray-900 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </Modal>
      {/* ---- */}

      <style>{`
        .custom-calendar .ant-picker-cell {
          height: 150px !important;
          border: 1px solid #f3f4f6;
          overflow: hidden !important;
        }
        .custom-calendar .ant-picker-cell-inner {
          text-align: left !important;
          padding-left: 4px;
        }
        .rounded-modal .ant-modal-content {
          border-radius: 24px !important;
          overflow: hidden;
        }
        .rounded-modal .ant-modal-header {
          border-radius: 24px 24px 0 0 !important;
        }
        .rounded-modal .ant-modal-body {
          border-radius: 0 0 24px 24px !important;
          padding: 0 !important;
        }
        .rounded-2xl .ant-modal-content {
          border-radius: 16px !important;
          overflow: hidden;
        }
        .rounded-2xl .ant-modal-body {
          padding: 0 !important;
        }
        .event-detail-modal .ant-modal-content {
          border-radius: 16px !important;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 0 !important;
        }
        .event-detail-modal .ant-modal-body {
          padding: 0 !important;
          border-radius: 16px !important;
        }
        .event-detail-modal .ant-modal-close {
          display: none !important;
        }
        .event-detail-modal .ant-modal-header {
          display: none !important;
        }
        .filter-modal .ant-modal-content {
          border-radius: 16px !important;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 0 !important;
        }
        .filter-modal .ant-modal-body {
          padding: 0 !important;
          border-radius: 16px !important;
        }
        .filter-modal .ant-modal-close {
          display: none !important;
        }
        .filter-modal .ant-modal-header {
          display: none !important;
        }
        .filter-checkbox {
          accent-color: #000000;
          border-color: #d1d5db !important;
        }
        .filter-checkbox:checked {
          background-color: #000000 !important;
          border-color: #000000 !important;
        }
      `}</style>
    </div>
  );
}