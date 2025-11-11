import { useState } from 'react'
import { 
  Search, 
  Download, 
  Upload, 
  Phone, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Box } from '@/components/ui/box'
import { Label } from '@/components/ui/label'

const Compliance = () => {
  const [autodialing, setAutodialing] = useState(false)
  // Purchased Numbers Data
  const purchasedNumbers = [
    { number: 'Number 1', status: 'Healthy', country: 'United States/Canada', addedOn: '09/09/2025' },
    { number: 'Number 2', status: 'Healthy', country: 'United States/Canada', addedOn: '09/09/2025' },
    { number: 'Number 3', status: 'Unhealthy', country: 'United States/Canada', addedOn: '09/09/2025' },
    { number: 'Number 4', status: 'Healthy', country: 'United States/Canada', addedOn: '09/09/2025' },
  ]

  // DNC List Data
  const dncList = [
    { name: 'Kathlyn Murphy', lastCalled: '09/09/2025', phone: '+1 234 567 8900', email: 'kathlyn@example.com', list: 'List 1', tags: ['Intere', 'Follow'] },
    { name: 'Robert Fox', lastCalled: '09/09/2025', phone: '+1 234 567 8901', email: 'robert@example.com', list: 'List 2', tags: ['Past'] },
    { name: 'Annette Black', lastCalled: '09/09/2025', phone: '+1 234 567 8902', email: 'annette@example.com', list: 'List 1', tags: ['Intere'] },
  ]

  // Audit Logs Data
  const auditLogs = [
    { date: '09/09/2025', user: 'Celia McCullough', role: 'Agent', action: 'Added [number] to DNC' },
    { date: '08/09/2025', user: 'Johnathan Schultz', role: 'Admin', action: 'Changed TCPA call hours' },
    { date: '07/09/2025', user: 'Shelley Cremin', role: 'Agent', action: 'Deleted [contact name] with GDPR removal' },
    { date: '09/09/2025', user: 'Celia McCullough', role: 'Agent', action: 'Added [number] to DNC' },
    { date: '08/09/2025', user: 'Johnathan Schultz', role: 'Admin', action: 'Changed TCPA call hours' },
    { date: '07/09/2025', user: 'Shelley Cremin', role: 'Agent', action: 'Deleted [contact name] with GDPR removal' },
    { date: '09/09/2025', user: 'Celia McCullough', role: 'Agent', action: 'Added [number] to DNC' },
    { date: '08/09/2025', user: 'Johnathan Schultz', role: 'Admin', action: 'Changed TCPA call hours' },
  ]

  return (
    <Box className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">Compliance & DNC</h1>

      {/* Purchased Numbers Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Purchased Numbers</h2>
          <Button variant="outline" className="rounded-md border-gray-200 hover:bg-gray-50 w-full sm:w-auto">
            Go to Call Settings
          </Button>
        </div>

        <div className="space-y-4">
          {purchasedNumbers.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pb-4 border-b border-gray-100 last:border-b-0">
              {/* Left Column - Number Details */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-base font-medium text-gray-900">{item.number}</span>
                  <Badge 
                    className={`${
                      item.status === 'Healthy' 
                        ? 'bg-green-100 text-green-700 border-0' 
                        : 'bg-gray-900 text-white border-0'
                    } rounded-full px-3 py-1 text-xs font-medium`}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 font-normal">CallScout ID</div>
              </div>

              {/* Middle Column - Country */}
              <div>
                <div className="text-sm text-gray-600 font-normal mb-1">Country</div>
                <div className="text-base font-medium text-gray-900">{item.country}</div>
              </div>

              {/* Right Column - Added On */}
              <div>
                <div className="text-sm text-gray-600 font-normal mb-1">Added on</div>
                <div className="text-base font-medium text-gray-900">{item.addedOn}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DNC List Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">DNC List</h2>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="outline" className="rounded-md border-gray-200 hover:bg-gray-50 flex-1 sm:flex-initial">
              <Upload className="size-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button variant="outline" className="rounded-md border-gray-200 hover:bg-gray-50 flex-1 sm:flex-initial">
              <Download className="size-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search by name, email, phone number..."
            rightIcon={<Search className="size-4 text-gray-500" />}
            className="w-full"
          />
        </div>

        {/* DNC Table */}
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                <TableHead className="w-12 px-2 sm:px-4 py-3">
                  <Checkbox />
                </TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Name</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Last Called Date</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Phone Number</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Email</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">List</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dncList.map((item, index) => (
                <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="px-2 sm:px-4 py-4">
                    <Checkbox />
                  </TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base">{item.name}</TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base whitespace-nowrap">{item.lastCalled}</TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base whitespace-nowrap">{item.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base break-all">{item.email}</TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base">{item.list}</TableCell>
                  <TableCell className="px-2 sm:px-4 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex}
                          className="bg-gray-100 text-gray-700 border-0 hover:bg-gray-100 rounded-full px-2 py-1 text-xs font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Regulatory Settings Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Regulatory Settings</h2>

        {/* TCPA Settings */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">TCPA Settings (US)</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Label className="text-sm text-gray-700 whitespace-nowrap">From</Label>
              <Select defaultValue="8:00">
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8:00">8:00</SelectItem>
                  <SelectItem value="9:00">9:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Label className="text-sm text-gray-700 whitespace-nowrap">To</Label>
              <Select defaultValue="18:00">
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="19:00">19:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Label className="text-sm text-gray-700 whitespace-nowrap">Autodialing</Label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={autodialing}
                onChange={(e) => setAutodialing(e.target.checked)}
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                autodialing ? 'bg-gray-400' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform ${
                  autodialing ? 'translate-x-5' : 'translate-x-0'
                }`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* GDPR Settings */}
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">GDPR Settings (EU)</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
            <Label className="text-sm text-gray-700 whitespace-nowrap">Keep contact data for:</Label>
            <Select defaultValue="30">
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start sm:items-center gap-3">
            <Checkbox id="gdpr-delete" defaultChecked className="mt-1 sm:mt-0" />
            <Label htmlFor="gdpr-delete" className="text-sm text-gray-700 cursor-pointer">
              Delete related call records and notes along with a contact.
            </Label>
          </div>
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Audit Logs</h2>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 bg-white flex-1 sm:flex-initial justify-center">
              <ChevronLeft className="size-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-700">All Dates</span>
              <ChevronRight className="size-4 text-gray-500" />
            </div>
            <Button variant="outline" className="rounded-md border-gray-200 hover:bg-gray-50 flex-1 sm:flex-initial">
              <Download className="size-4" />
              <span className="hidden sm:inline ml-2">Export Audit Log</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Date</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">User</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Role</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3">Action</TableHead>
                <TableHead className="text-gray-700 font-medium px-2 sm:px-4 py-3 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((item, index) => (
                <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base whitespace-nowrap">{item.date}</TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base">{item.user}</TableCell>
                  <TableCell className="px-2 sm:px-4 py-4">
                    <Badge 
                      className={`${
                        item.role === 'Agent' 
                          ? 'bg-blue-100 text-blue-700 border-0' 
                          : 'bg-orange-100 text-orange-700 border-0'
                      } rounded-full px-3 py-1 text-xs font-medium`}
                    >
                      {item.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base">{item.action}</TableCell>
                  <TableCell className="px-2 sm:px-4 py-4">
                    <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                      <MoreVertical className="size-4 text-gray-600" />
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

export default Compliance

