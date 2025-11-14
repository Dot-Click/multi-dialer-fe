import { useState } from 'react'
import { 
  Search, 
  Download, 
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
    { name: 'Cody Fisher', lastCalled: '09/10/2025', phone: '+1 234 567 8903', email: 'cody@example.com', list: 'List 3', tags: ['New', 'Interested'] },
    { name: 'Devon Lane', lastCalled: '09/11/2025', phone: '+1 234 567 8904', email: 'devon@example.com', list: 'List 2', tags: ['Follow'] },
    { name: 'Courtney Henry', lastCalled: '09/12/2025', phone: '+1 234 567 8905', email: 'courtney@example.com', list: 'List 4', tags: ['Pending'] },
    { name: 'Theresa Webb', lastCalled: '09/13/2025', phone: '+1 234 567 8906', email: 'theresa@example.com', list: 'List 1', tags: ['Follow', 'Intere'] },
    { name: 'Guy Hawkins', lastCalled: '09/14/2025', phone: '+1 234 567 8907', email: 'guy@example.com', list: 'List 2', tags: ['Past'] },
    { name: 'Jenny Wilson', lastCalled: '09/15/2025', phone: '+1 234 567 8908', email: 'jenny@example.com', list: 'List 3', tags: ['Follow'] },
    { name: 'Jacob Jones', lastCalled: '09/16/2025', phone: '+1 234 567 8909', email: 'jacob@example.com', list: 'List 4', tags: ['New', 'Interested'] },
  ];
  

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
    <Box className="min-h-screen pr-3 lg:pr-6">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">Compliance & DNC</h1>

      {/* Purchased Numbers Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Purchased Numbers</h2>
          <Button variant="outline" className="rounded-md bg-gray-100 hover:bg-gray-50 w-full sm:w-auto">
            Go to Call Settings
          </Button>
        </div>

        <div className="space-y-4">
          {purchasedNumbers.map((item, index) => (
            <div key={index} className="grid px-4 py-3   rounded-xl grid-cols-1 sm:grid-cols-3 gap-4 border border-xl sm:gap-6  ">
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
    <Button
      variant="outline"
      className="rounded-md hover:bg-gray-50 flex-1 sm:flex-initial border-0"
    >
      {/* Upload Icon */}
      <svg
        width="15"
        height="20"
        viewBox="0 0 15 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.75 1.504C13.9489 1.504 14.1397 1.42498 14.2803 1.28433C14.421 1.14368 14.5 0.952912 14.5 0.754C14.5 0.555088 14.421 0.364322 14.2803 0.22367C14.1397 0.0830175 13.9489 0.00399995 13.75 0.00399995L0.75 0C0.551088 0 0.360322 0.0790175 0.21967 0.21967C0.0790175 0.360322 0 0.551088 0 0.75C0 0.948912 0.0790175 1.13968 0.21967 1.28033C0.360322 1.42098 0.551088 1.5 0.75 1.5L13.75 1.504ZM7.148 19.992L7.25 19.999C7.43139 19.999 7.60662 19.9332 7.74323 19.8139C7.87984 19.6945 7.96857 19.5297 7.993 19.35L8 19.249L7.999 5.564L11.721 9.284C11.848 9.41102 12.0163 9.48825 12.1955 9.50164C12.3746 9.51504 12.5525 9.46371 12.697 9.357L12.782 9.284C12.9091 9.15683 12.9863 8.98821 12.9996 8.80888C13.0128 8.62955 12.9611 8.45143 12.854 8.307L12.781 8.223L7.784 3.227C7.65701 3.09998 7.48866 3.02275 7.30955 3.00936C7.13044 2.99596 6.95247 3.04729 6.808 3.154L6.723 3.226L1.72 8.224C1.58546 8.35766 1.50655 8.53732 1.49915 8.72682C1.49176 8.91632 1.55642 9.10158 1.68013 9.24532C1.80384 9.38906 1.97741 9.48059 2.1659 9.5015C2.35439 9.52241 2.5438 9.47113 2.696 9.358L2.78 9.285L6.499 5.572L6.5 19.249C6.5 19.629 6.782 19.942 7.148 19.992Z"
          fill="#495057"
        />
      </svg>

      <span className="hidden sm:inline">Import</span>
    </Button>

    <Button
      variant="outline"
      className="rounded-md hover:bg-gray-50 flex-1 sm:flex-initial border-0"
    >
      {/* Download Icon */}
      <svg
        width="15"
        height="20"
        viewBox="0 0 15 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.75 18.493C13.9489 18.493 14.1397 18.572 14.2803 18.7127C14.421 18.8533 14.5 19.0441 14.5 19.243C14.5 19.4419 14.421 19.6327 14.2803 19.7734C14.1397 19.914 13.9489 19.993 13.75 19.993L0.75 19.998C0.551088 19.998 0.360322 19.919 0.21967 19.7784C0.0790175 19.6377 0 19.4469 0 19.248C0 19.0491 0.0790175 18.8583 0.21967 18.7177C0.360322 18.577 0.551088 18.498 0.75 18.498L13.75 18.493ZM7.148 0.00702333L7.25 2.3365e-05C7.43124 3.10079e-05 7.60634 0.065666 7.74293 0.18479C7.87952 0.303915 7.96835 0.46847 7.993 0.648023L8 0.750023L7.999 14.435L11.721 10.715C11.848 10.588 12.0163 10.5108 12.1955 10.4974C12.3746 10.484 12.5525 10.5353 12.697 10.642L12.782 10.715C12.9089 10.8421 12.9859 11.0106 12.9991 11.1897C13.0123 11.3688 12.9608 11.5467 12.854 11.691L12.781 11.775L7.784 16.772C7.65701 16.899 7.48866 16.9763 7.30955 16.9897C7.13044 17.0031 6.95247 16.9517 6.808 16.845L6.723 16.772L1.72 11.776C1.58546 11.6424 1.50655 11.4627 1.49915 11.2732C1.49176 11.0837 1.55642 10.8984 1.68013 10.7547C1.80384 10.611 1.97741 10.5194 2.1659 10.4985C2.35439 10.4776 2.5438 10.5289 2.696 10.642L2.78 10.714L6.499 14.428L6.5 0.749023C6.50001 0.567786 6.56564 0.392681 6.68477 0.256093C6.80389 0.119504 6.96845 0.0316716 7.148 0.00702333Z"
          fill="#495057"
        />
      </svg>

      <span className="hidden sm:inline">Export</span>
    </Button>
  </div>
</div>


        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search by name, email, phone number..."
            rightIcon={<Search className="mr-4" size={18}/> }
            className=" xl:w-[50%] text-black w-full bg-white px-5 py-5 rounded-full"
          />
        </div>

        {/* DNC Table */}
        <div className="overflow-x-auto  max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="border-b border-gray-200 bg-gray-200 ">
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
                  <TableCell className="text-blue-700 px-2 sm:px-4 py-4 text-sm sm:text-base">{item.name}</TableCell>
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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
    Regulatory Settings
  </h2>

  {/* TCPA Settings */}
  <div className="mb-8">
    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
      TCPA Settings (US)
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {/* From */}
      <div className="bg-gray-200 p-2 rounded-xl">
        <Label className="text-sm text-gray-700 block">From</Label>
        <Select defaultValue="8:00">
          <SelectTrigger className="w-full rounded-lg border border-gray-200 bg-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8:00">8:00</SelectItem>
            <SelectItem value="9:00">9:00</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* To */}
      <div className="bg-gray-200 p-2 rounded-xl">
        <Label className="text-sm text-gray-700 mb-2 block">To</Label>
        <Select defaultValue="18:00">
          <SelectTrigger className="w-full rounded-lg bg-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="18:00">18:00</SelectItem>
            <SelectItem value="19:00">19:00</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Autodialing toggle */}
    <div className="flex items-center gap-3">
      <Label className="text-sm text-gray-700 whitespace-nowrap">Autodialing</Label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={autodialing}
          onChange={(e) => setAutodialing(e.target.checked)}
        />
        <div className={`w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-blue-500 transition-all`}>
          <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform ${
            autodialing ? 'translate-x-5' : 'translate-x-0'
          }`}></div>
        </div>
      </label>
    </div>
  </div>

  {/* GDPR Settings */}
  <div>
    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
      GDPR Settings (EU)
    </h3>
    <div className="grid xl:w-[50%] w-full grid-cols-1 sm:grid-cols-2 gap-4 mb-4 bg-gray-200 p-2 rounded-xl">
      <div>
        <Label className="text-sm text-gray-700 mb-2 block">Keep contact data for:</Label>
        <Select defaultValue="30">
          <SelectTrigger className="w-full rounded-lg bg-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="60">60 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
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

    {/* Left Side: Heading + All Dates beside it */}
    <div className="flex items-center gap-3">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Audit Logs</h2>

      {/* All Dates Badge — right beside heading */}
      <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 bg-white">
        <ChevronLeft className="size-4 text-gray-500" />
        <span className="text-xs sm:text-sm text-gray-700">All Dates</span>
        <ChevronRight className="size-4 text-gray-500" />
      </div>
    </div>

    {/* Right Side: Export Button */}
    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
      <Button
        variant="outline"
        className="rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
      >
        <Download className="size-4" />
        <span className="hidden sm:inline">Export Audit Log</span>
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

