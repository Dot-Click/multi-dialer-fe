// const Calender = () => {
//     // Google Calendar ka embed URL jismein header hide karne ke parameters add kiye gaye hain.
//     // &showTitle=0 -> Google ka title hide karega
//     // &showNav=0 -> Google ke navigation buttons hide karega
//     // &showPrint=0 -> Print icon hide karega
//     // &showTz=0 -> Timezone hide karega
//     const calendarSrc = "https://calendar.google.com/calendar/embed?src=8566360054522a35136b68f916cd27e6fe5c20d36379b9628ce322579ad6b7e1%40group.calendar.google.com&ctz=Asia%2FKarachi&showTitle=0&showNav=0&showPrint=0&showTz=0";

//     return (
//         // Main container bilkul image jaisa
//         <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">

//             {/* Step 1: Custom Header banayein */}
//             <div className="flex items-center justify-between mb-4">
                
//                 {/* Left Side: Title aur Navigation */}
//                 <div className="flex items-center gap-4">
//                     <h2 className="text-xl font-semibold text-gray-800">
//                         September 2025
//                     </h2>
//                     <div className="flex items-center gap-2">
//                         <button 
//                           type="button" 
//                           className="p-2 border rounded-md hover:bg-gray-100 text-gray-600"
//                           aria-label="Previous month"
//                         >
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M15 18l-6-6 6-6"/>
//                             </svg>
//                         </button>
//                         <button 
//                           type="button" 
//                           className="p-2 border rounded-md hover:bg-gray-100 text-gray-600"
//                           aria-label="Next month"
//                         >
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M9 18l6-6-6-6"/>
//                             </svg>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Right Side: Filter Button */}
//                 <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-100">
//                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                     Filter
//                 </button>
//             </div>

//             {/* Step 2: Google Calendar ka Iframe Container */}
//             <div className="w-full h-[85vh] overflow-hidden rounded-md">
//                 <iframe 
//                     src={calendarSrc} 
//                     style={{ border: 0 }}
//                     width="100%"
//                     height="100%"
//                     frameBorder="0" 
//                     scrolling="no"
//                 ></iframe>
//             </div>

//         </div>
//     );
// }

// export default Calender;


import { useState } from "react";

const Calendar = () => {
  const [month, setMonth] = useState("September 2025");

  // Google Calendar Embed URL
  const calendarSrc = "https://calendar.google.com/calendar/embed?src=8566360054522a35136b68f916cd27e6fe5c20d36379b9628ce322579ad6b7e1%40group.calendar.google.com&ctz=Asia%2FKarachi&showTitle=0&showNav=0&showPrint=0&showTz=0";

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-md">

      {/* Header with Month and Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">{month}</h2>
          <div className="flex gap-2">
            <button
              className="p-2 border rounded-md hover:bg-gray-100 text-gray-600"
              onClick={() => console.log("Previous month clicked")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="p-2 border rounded-md hover:bg-gray-100 text-gray-600"
              onClick={() => console.log("Next month clicked")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-100">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filter
        </button>
      </div>

      {/* Calendar iframe */}
      <div className="w-full h-[80vh] overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <iframe
          src={calendarSrc}
          width="100%"
          height="100%"
          style={{ border: "0" }}
          frameBorder="0"
          scrolling="no"
          className="rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default Calendar;
