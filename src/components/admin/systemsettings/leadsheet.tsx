// // Icons from react-icons library
// import { FiPlus } from 'react-icons/fi';
// import { BsThreeDots } from 'react-icons/bs';

// // Dummy Data for the list of lead sheets
// const leadSheetsData = [
//   { id: 1, name: 'Lead Sheet #1', status: 'Active' },
//   { id: 2, name: 'Lead Sheet #2', status: null },
//   { id: 3, name: 'Lead Sheet #3', status: null },
//   { id: 4, name: 'Lead Sheet #4', status: null },
// ];

// // Reusable component for each lead sheet item
// const LeadSheetItem = ({ name, status }) => (
//   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex justify-between items-center transition hover:shadow-md hover:border-gray-300">
//     <div className="flex items-center gap-3">
//       <h3 className="font-semibold text-gray-800 text-sm">{name}</h3>
//       {status && (
//         <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-black text-white">
//           {status}
//         </span>
//       )}
//     </div>
//     <button className="text-gray-400 p-2 rounded-full hover:bg-gray-100">
//       <BsThreeDots size={18} />
//     </button>
//   </div>
// );


// // Main LeadSheet Component
// const LeadSheet = () => {
//   return (
//     <div className="bg-white min-h-screen px-4 py-5 rounded-lg">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//           <h1 className="text-2xl font-bold text-gray-900">Lead Sheet</h1>
//           <button className="w-full sm:w-auto bg-yellow-400 text-black font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors text-sm shadow-sm">
//             <FiPlus size={18} />
//             Add Lead Sheet
//           </button>
//         </header>

//         {/* List of Lead Sheets */}
//         <main className="space-y-4">
//           {leadSheetsData.map((sheet) => (
//             <LeadSheetItem key={sheet.id} name={sheet.name} status={sheet.status} />
//           ))}
//         </main>
        
//       </div>
//     </div>
//   );
// };

// export default LeadSheet;

// Icons from react-icons library
import { FiPlus } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

// Dummy Data for the list of lead sheets
const leadSheetsData = [
  { id: 1, name: "Lead Sheet #1", status: "Active" },
  { id: 2, name: "Lead Sheet #2", status: null },
  { id: 3, name: "Lead Sheet #3", status: null },
  { id: 4, name: "Lead Sheet #4", status: null },
];

// ✅ Define types for LeadSheetItem props
interface LeadSheetItemProps {
  name: string;
  status: string | null;
}

// Reusable component for each lead sheet item
const LeadSheetItem: React.FC<LeadSheetItemProps> = ({ name, status }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex justify-between items-center transition hover:shadow-md hover:border-gray-300">
    <div className="flex items-center gap-3">
      <h3 className="font-semibold text-gray-800 text-sm">{name}</h3>
      {status && (
        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-black text-white">
          {status}
        </span>
      )}
    </div>
    <button className="text-gray-400 p-2 rounded-full hover:bg-gray-100">
      <BsThreeDots size={18} />
    </button>
  </div>
);

// Main LeadSheet Component
const LeadSheet: React.FC = () => {
  return (
    <div className="bg-white min-h-screen px-4 py-5 rounded-lg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Lead Sheet</h1>
          <Link
            to="/admin/add-lead-sheet"
            className="w-full sm:w-auto bg-yellow-400 text-black font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors text-sm shadow-sm"
          >
            <FiPlus size={18} />
            Add Lead Sheet
          </Link>
        </header>

        {/* List of Lead Sheets */}
        <main className="space-y-4">
          {leadSheetsData.map((sheet) => (
            <LeadSheetItem
              key={sheet.id}
              name={sheet.name}
              status={sheet.status}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default LeadSheet;
