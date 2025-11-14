import { FaChevronRight } from 'react-icons/fa'

// Yeh aapke project ke components hain, inka path sahi se set karein
import { SortedHeader, TableComponent } from '@/components/common/tablecomponent'
import { Box } from '@/components/ui/box'
import { TableProvider } from '@/providers/table.provider'
import { useNavigate } from 'react-router-dom'

// --- Import History Table Data and Columns ---

const importHistoryData = [
  { date: '18/06/2021 06:13', list: 'High-Value Leads', group: 'High-Value Leads', type: 'C2C Session', recordCount: 29, agent: 'Velma Bogan', duplicate: 'Keep Old' },
  { date: '29/10/2024 15:35', list: '-', group: '-', type: 'PowerDial', recordCount: 29, agent: 'Rogelia Hills', duplicate: 'Keep Old' },
  { date: '2021/11/2013 20:31', list: 'Renewals Q3', group: 'Renewals Q3', type: 'PowerDial', recordCount: 29, agent: 'Hattie Price', duplicate: 'Keep Old' },
  { date: '18/06/2021 18:26', list: 'Renewals Q3', group: 'Renewals Q3', type: 'PowerDial', recordCount: 29, agent: 'Emanuel Hermann', duplicate: 'Keep Old' },
  { date: '18/06/2021 06:13', list: 'High-Value Leads', group: 'High-Value Leads', type: 'C2C Session', recordCount: 29, agent: 'Lana Rowe', duplicate: 'Keep Old' },
  { date: '18/06/2021 06:13', list: 'High-Value Leads', group: 'High-Value Leads', type: 'C2C Session', recordCount: 29, agent: 'Velma Bogan', duplicate: 'Keep Old' },
  { date: '29/10/2024 15:35', list: '-', group: '-', type: 'PowerDial', recordCount: 29, agent: 'Rogelia Hills', duplicate: 'Keep Old' },
]

const importHistoryColumns = [
  { accessorKey: 'date', header: (info: any) => <SortedHeader header={info.header} label='Date' /> },
  { accessorKey: 'list', header: (info: any) => <SortedHeader header={info.header} label='List' /> },
  { accessorKey: 'group', header: (info: any) => <SortedHeader header={info.header} label='Group' /> },
  { accessorKey: 'type', header: (info: any) => <SortedHeader header={info.header} label='Type' /> },
  { accessorKey: 'recordCount', header: (info: any) => <SortedHeader header={info.header} label='Record Count' /> },
  { accessorKey: 'agent', header: (info: any) => <SortedHeader header={info.header} label='Agent' /> },
  { accessorKey: 'duplicate', header: (info: any) => <SortedHeader header={info.header} label='Duplicate' /> },
]

// --- Export History Table Data and Columns ---

const exportHistoryData = [
  { date: '18/06/2021 06:13', listGroup: 'High-Value Leads', exportedContacts: 64, agent: 'Velma Bogan' },
  { date: '18/06/2021 06:13', listGroup: 'High-Value Leads', exportedContacts: 64, agent: 'Velma Bogan' },
  { date: '18/06/2021 06:13', listGroup: 'High-Value Leads', exportedContacts: 64, agent: 'Velma Bogan' },
  { date: '18/06/2021 06:13', listGroup: 'High-Value Leads', exportedContacts: 64, agent: 'Velma Bogan' },
  { date: '18/06/2021 06:13', listGroup: 'High-Value Leads', exportedContacts: 64, agent: 'Velma Bogan' },
  { date: '18/06/2021 06:13', listGroup: 'High-Value Leads', exportedContacts: 64, agent: 'Velma Bogan' },
  { date: '18/06/2021 06:13', listGroup: 'High-Value Leads', exportedContacts: 64, agent: 'Velma Bogan' },
]

const exportHistoryColumns = [
  { accessorKey: 'date', header: (info: any) => <SortedHeader header={info.header} label='Date' /> },
  { accessorKey: 'listGroup', header: (info: any) => <SortedHeader header={info.header} label='List/Group Selected' /> },
  { accessorKey: 'exportedContacts', header: (info: any) => <SortedHeader header={info.header} label='Number of Exported Contacts' /> },
  { accessorKey: 'agent', header: (info: any) => <SortedHeader header={info.header} label='Agent' /> },
]

// --- Main DataManagement Component ---

const DataManagement = () => {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- Import History Section --- */}
        <Box className="bg-white px-4 py-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Import history</h2>
          <p className="mt-2 text-sm text-gray-600">
            The grid below displays your imports to the Mojo system. Use the action buttons to preview the import data or remove the import entirely in the case of an error.
          </p>
          <div className="mt-6 overflow-x-auto">
            <TableProvider data={importHistoryData} columns={importHistoryColumns}>
              {() => <TableComponent />}
            </TableProvider>
          </div>
        </Box>

        {/* --- Export History Section --- */}
        <Box className="bg-white px-4 py-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Export history</h2>
          <p className="mt-2 text-sm text-gray-600">
            The Export History displays each time data was exported out of Mojo account for the last 30 days. You will see a break down of what lists/groups were exported, total amount of data and the date and time the export occurred.
          </p>
          <div className="mt-6 overflow-x-auto">
            <TableProvider data={exportHistoryData} columns={exportHistoryColumns}>
              {() => <TableComponent />}
            </TableProvider>
          </div>
        </Box>

        {/* --- Restore Deleted Data Section --- */}
        <Box className="bg-white px-4 py-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Restore deleted data</h2>
          <p className="mt-2 text-sm text-gray-600">
            Any data deleted in the last 30 days can be restored by clicking Restore next to the date it was deleted.
          </p>
          <div className="mt-6">
            <button onClick={() => navigate("/admin/restore-data")} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
              <span className="text-sm font-medium">Restore data</span>
              <FaChevronRight size={12} />
            </button>
          </div>
        </Box>
      </div>

      {/* --- Global Table Styles --- */}
      <style>
        {`
          .overflow-x-auto {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
          table thead tr th {
            background-color: #F8F9FA !important;
            color: #495057 !important;
            font-weight: 600 !important;
            font-size: 13px !important;
            padding: 12px 16px !important;
            text-align: left;
            border-bottom: 1px solid #dee2e6 !important;
            white-space: nowrap;
          }
          table tbody tr td {
            padding: 12px 16px !important;
            font-size: 14px;
            color: #343a40;
            border-bottom: 1px solid #EBEDF0 !important;
            white-space: nowrap;
          }
          table tbody tr:last-child td {
            border-bottom: none !important;
          }
        `}
      </style>
    </div>
  )
}

export default DataManagement
