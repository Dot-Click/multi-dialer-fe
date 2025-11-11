import { 
  ArrowUp, 
  Users, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Camera
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Box } from '@/components/ui/box'
import { useNavigate } from 'react-router-dom'

const Billing = () => {
  const navigate = useNavigate()
  // Sample billing history data
  const billingHistory = [
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
    { invoice: '#526525', plan: 'Starter', amount: '$225', date: '09/09/2025', status: 'Paid' },
  ]

  return (
    <Box className="p-4 sm:p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">Billing</h1>
        <p className="text-sm text-gray-500">Payment proceed automatically every month.</p>
      </div>

      {/* Current Plan Details Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <Badge className="bg-yellow-100 text-yellow-800 border-0 hover:bg-yellow-100 px-3 py-1 text-xs font-medium">
            Starter Plan
          </Badge>
          <Button 
            onClick={() => navigate('/admin/upgrade')}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg px-4 py-2 font-medium w-full sm:w-auto"
          >
            <ArrowUp className="size-4" />
            Upgrade
          </Button>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold text-gray-900">$45</span>
            <span className="text-sm sm:text-base text-gray-600">/user/month</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 rounded-lg flex-shrink-0">
              <Users className="size-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Users</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900">5</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 rounded-lg flex-shrink-0">
              <Camera className="size-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total cost</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900">$225</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 rounded-lg flex-shrink-0">
              <Calendar className="size-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Next Payment Date</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900">09/10/2025</div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Billing History</h2>
            <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 bg-white w-full sm:w-auto justify-center">
              <ChevronLeft className="size-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-700">&lt; All Dates &gt;</span>
              <ChevronRight className="size-4 text-gray-500" />
            </div>
          </div>
          <Button variant="outline" className="rounded-md border-gray-200 hover:bg-gray-50 w-full sm:w-auto">
            <Download className="size-4" />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                <TableHead className="w-12 px-2 sm:px-4 py-3">
                  <Checkbox />
                </TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Invoice</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Plan</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Amount</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Date</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Status</TableHead>
                <TableHead className="w-12 px-2 sm:px-4 py-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((item, index) => (
                <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="px-2 sm:px-4 py-4">
                    <Checkbox />
                  </TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base">{item.invoice}</TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base">{item.plan}</TableCell>
                  <TableCell className="text-gray-700 font-medium px-2 sm:px-4 py-4 text-sm sm:text-base">{item.amount}</TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base whitespace-nowrap">{item.date}</TableCell>
                  <TableCell className="px-2 sm:px-4 py-4">
                    <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100 rounded-full px-3 py-1 text-xs font-medium">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-4">
                    <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                      <Download className="size-4 text-gray-600" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Box>
  )
}

export default Billing
