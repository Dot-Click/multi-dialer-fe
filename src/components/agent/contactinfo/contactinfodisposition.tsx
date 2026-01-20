// import { useState } from 'react';

// // Step 1: Buttons aur Checkboxes ke liye dynamic data banayein
// const dispositionOptions = [
//   "Wrong Number", "Not Interested", "Answering Machine", 
//   "Got Sale", "DNC", "Call Back"
// ];

// const groupOptions = ["Hot", "Warm", "Nurture", "Working"];

// const checkboxOptions = ["Permission", "Want", "Why", "Status Quo", "Timeline", "Agent"];

// const ContactInfoDisposition = () => {
//   // Step 2: Selected buttons ko track karne ke liye state banayein
//   const [selectedDisposition, setSelectedDisposition] = useState<string | null>(null);
//   const [selectedGroup, setSelectedGroup] = useState<string>("Working"); // Default selected value

//   return (
//     // Main Container
//     <div className="bg-white rounded-2xl shadow-md px-3 py-5 w-full">
//       <div className="space-y-6">
        
//         {/* Dispositions Section */}
//         <div className="flex flex-col gap-2 sm:gap-4">
//           <h3 className="text-sm font-semibold text-gray-900 min-w-[90px]">Dispositions:</h3>
//           <div className="flex flex-wrap gap-2">
//             {dispositionOptions.map((option) => (
//               <button
//                 key={option}
//                 onClick={() => setSelectedDisposition(option)}
//                 className={`
//                   px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
//                   ${selectedDisposition === option 
//                     ? 'bg-gray-800 text-white' 
//                     : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
//                 `}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Group Section */}
//         <div className="flex flex-col gap-2 sm:gap-4">
//           <h3 className="text-sm font-semibold text-gray-900 min-w-[90px]">Group:</h3>
//           <div className="flex flex-wrap gap-2">
//             {groupOptions.map((option) => (
//               <button
//                 key={option}
//                 onClick={() => setSelectedGroup(option)}
//                 className={`
//                   px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
//                   ${selectedGroup === option 
//                     ? 'bg-black text-white' 
//                     : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
//                 `}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Divider (Optional, for better separation) */}
//         <div className="border-t border-gray-100 my-2"></div>

//         {/* Checkboxes Section */}
//         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-4">
//           {checkboxOptions.map((option) => (
//             <div key={option} className="flex flex-col items-center justify-center gap-2">
//               <input
//                 type="checkbox"
//                 id={`checkbox-${option}`}
//                 className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
//               />
//               <label 
//                 htmlFor={`checkbox-${option}`} 
//                 className="text-sm text-gray-600"
//               >
//                 {option}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactInfoDisposition;
import { 
  Phone, 
  Mail, 
  MapPin, 
  Mic, 
  Volume2, 
  PhoneOff 
} from 'lucide-react';

const CurrentCallDetails = () => {
  return (
    <div className="mx-4 md:mx-auto max-w-4xl bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 font-inter">
      {/* Top Section: Stacked on mobile, side-by-side on sm screens */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 sm:gap-4">
        
        {/* Contact Info: Centered on mobile, left-aligned on sm screens */}
        <div className="flex flex-col items-center sm:items-start space-y-4 w-full sm:w-auto">
          <h2 className="text-xl sm:text-[22px] font-semibold text-[#343a40]">John Smith</h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-3 text-[#495057]">
              <Phone size={18} className="text-[#495057] shrink-0" />
              <span className="text-sm sm:text-[15px] font-medium">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-[#495057]">
              <Mail size={18} className="text-[#495057] shrink-0" />
              <span className="text-sm sm:text-[15px] font-medium break-all">john.smith@email.com</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-[#495057]">
              <MapPin size={18} className="text-[#495057] shrink-0" />
              <span className="text-sm sm:text-[15px] font-medium">New York, NY</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Prominent on all devices */}
        <div className="flex gap-3 shrink-0">
          {/* Mute Button */}
          <button className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <Mic size={20} className="text-black" />
          </button>
          
          {/* Speaker Button */}
          <button className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-[#0f1111] hover:bg-gray-800 transition-colors shadow-sm">
            <Volume2 size={20} className="text-white" />
          </button>
          
          {/* End Call Button */}
          <button className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-[#d90404] hover:bg-red-700 transition-colors shadow-sm">
            <PhoneOff size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="h-[1px] bg-gray-100 w-full my-6 sm:my-8"></div>

      {/* Stats Section: Responsive grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-[22px] font-semibold text-[#00c851] leading-none mb-2">05:42</span>
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight">Call Duration</span>
        </div>
        
        <div className="flex flex-col items-center border-x border-gray-100 px-2">
          <span className="text-lg sm:text-[22px] font-semibold text-[#343a40] leading-none mb-2">12</span>
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight">Calls Today</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-[22px] font-semibold text-[#343a40] leading-none mb-2">8</span>
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-tight">Connected</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentCallDetails;