// Your existing table components
import { TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
// Icons from react-icons
import { FiPlus } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";


// --- Interface and Data for the Action Plan Table ---
interface ActionPlanData {
  id: number;
  name: string;
  steps: number;
  contact: number;
  editDate: string;
}

const actionPlansData: ActionPlanData[] = [
  { id: 1, name: 'Plan Name', steps: 5, contact: 0, editDate: '09/09/2025' },
  { id: 2, name: 'Plan Name', steps: 5, contact: 0, editDate: '09/09/2025' },
  { id: 3, name: 'Plan Name', steps: 5, contact: 0, editDate: '09/09/2025' },
  { id: 4, name: 'Plan Name', steps: 5, contact: 0, editDate: '09/09/2025' },
  { id: 5, name: 'Plan Name', steps: 5, contact: 0, editDate: '09/09/2025' },
];

// --- Column Definitions for the Table ---
const columns = [
  {
    accessorKey: "name",
    header: () => <div className="font-semibold">Name</div>,
    cell: (info: any) => <div className="font-medium text-gray-800">{info.getValue()}</div>,
  },
  {
    accessorKey: "steps",
    header: () => <div className="font-semibold">Steps</div>,
  },
  {
    accessorKey: "contact",
    header: () => <div className="font-semibold">Contact</div>,
  },
  {
    accessorKey: "editDate",
    header: () => <div className="font-semibold">Edit Date</div>,
  },
  {
    id: "actions",
    cell: () => (
      <button className="text-gray-500 p-2 rounded-full hover:bg-gray-200">
        <BsThreeDots size={18} />
      </button>
    ),
  },
];


// --- Main ActionPlan Component ---
const ActionPlan = () => {

  const navigate = useNavigate()

  return (
    <div className="px-4 py-5 bg-white rounded-lg min-h-screen">
      <Box className="  w-full h-full ">

        {/* Custom Styles for the table */}
        <style>
          {`
            /* Custom Scrollbar for the table container */
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }

            /* Table Header Styling */
            table thead tr th {
              background-color: #F9FAFB !important; /* Light grey background */
              padding: 12px 16px !important;
              font-size: 13px;
              color: #4B5563; /* Grey text color */
              text-align: left;
              border-bottom: 1px solid #E5E7EB !important;
            }

            /* Table Body Styling */
            table tbody tr td {
              padding: 16px 16px !important;
              font-size: 14px;
              color: #374151;
              border-bottom: 1px solid #F3F4F6 !important;
            }
            
            /* Remove border from the last row */
            table tbody tr:last-child {
              border-bottom: none !important;
            }
          `}
        </style>

        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Action Plan</h1>
          <button onClick={()=>navigate("/admin/action-plan")} className="w-full sm:w-auto bg-yellow-400 text-black font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors text-sm">
            <FiPlus size={18} />
            Create Action Plan
          </button>
        </header>

        {/* Table Section */}
        <main>
          {/* Wrapper for responsiveness and custom scrollbar */}
          <div className="overflow-x-auto custom-scrollbar">
            <TableProvider data={actionPlansData} columns={columns}>
              {() => <TableComponent />}
            </TableProvider>
          </div>
        </main>
      </Box>
    </div>
  );
};

export default ActionPlan;