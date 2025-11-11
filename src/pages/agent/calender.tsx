


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

// Get events for a specific date
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
      <div className="flex flex-col gap-1">
        {listData.slice(0, maxEventsToShow).map((item, index) => (
          <div key={index} className="flex items-start gap-1 text-[11px] leading-tight">
            <div className="w-1 rounded-full self-stretch" style={{ backgroundColor: item.color }} />
            <div>
              <p className="font-medium text-gray-700">{item.title}</p>
              <p className="text-gray-500">{item.time}</p>
            </div>
          </div>
        ))}
        {remaining > 0 && (
          <div className="mt-1 text-center bg-gray-100 rounded-md py-1 text-xs text-gray-600">
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
    <div className="mr-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">{currentDate.format("MMMM YYYY")}</h2>
          <div className="flex gap-2">
            <button className="p-2 border rounded-md hover:bg-gray-100" onClick={prevMonth}>
              <IoIosArrowBack />
            </button>
            <button className="p-2 border rounded-md hover:bg-gray-100" onClick={nextMonth}>
              <IoIosArrowForward />
            </button>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 border rounded-md hover:bg-gray-100">
          <IoFilterOutline />
          Filter
        </button>
      </div>

      {/* Calendar Box */}
      <ConfigProvider locale={enGB}>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 overflow-x-auto">
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
      >
        <div className="flex flex-col gap-3">
          <button className="py-2 rounded-md bg-gray-100 hover:bg-gray-200">Show All Events</button>
          <button
            className="py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleShowAddEventForm}
          >
            Add Event
          </button>
          <button className="py-2 rounded-md bg-red-100 hover:bg-red-200" onClick={() => setOptionsModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

      {/* Add Event Form Modal */}
      <AddEventForm open={addEventModalOpen} onClose={() => setAddEventModalOpen(false)} />

      {/* Calendar custom styles */}
      {/* @ts-ignore */}
      <style jsx global>{`
        .custom-calendar .ant-picker-cell {
          height: 120px;
          border: 1px solid #f3f4f6;
        }
        .custom-calendar .ant-picker-cell-today .ant-picker-cell-inner {
          background-color: #fef3c7 !important;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default CustomCalendar;
