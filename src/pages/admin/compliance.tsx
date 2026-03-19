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

import { useCallerIds, useDncList, useRegulatorySettings, useAuditLogs } from '@/hooks/useSystemSettings'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { downloadCSV } from '@/utils/csvDownload'
import { useEffect, useState } from 'react'

const Compliance = () => {
  const { data: callerIds } = useCallerIds();
  const { data: realDncList } = useDncList();
  const { data: regulatory, updateRegulatorySettings } = useRegulatorySettings();
  const { data: realAuditLogs } = useAuditLogs();
  const navigate = useNavigate()

  const [tcpaFrom, setTcpaFrom] = useState(regulatory?.tcpaFrom || "08:00");
  const [tcpaTo, setTcpaTo] = useState(regulatory?.tcpaTo || "18:00");

  // Sync with API data when it loads:
  useEffect(() => {
    if (regulatory?.tcpaFrom) setTcpaFrom(regulatory.tcpaFrom);
    if (regulatory?.tcpaTo) setTcpaTo(regulatory.tcpaTo);
  }, [regulatory?.tcpaFrom, regulatory?.tcpaTo]);

  // Purchased Numbers Data from API
  const purchasedNumbers = callerIds?.map((item) => ({
    number: item.twillioNumber || 'Unknown Number',
    status: item.status || 'Healthy',
    country: item.countryCode === 'US' ? 'United States/Canada' : (item.countryCode || 'United States/Canada'),

    addedOn: new Date(item.createdAt).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }),
    label: item.label || 'Unnamed Number'
  })) || []

  // DNC List Data from API
  const dncList = realDncList?.map((item) => ({
    name: item.fullName || 'Unknown',
    lastCalled: new Date(item.createdAt).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }),
    phone: item.phones || [],
    email: item.emails || [],
    list: item.source || '-',
    tags: [], // Tags not stored in DNC table currently
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    source: item.source,

  })) || [];

  const handleExportDNC = () => {
    if (!dncList || dncList.length === 0) {
      toast.error("No DNC records to export");
      return;
    }

    const fieldMapping = {
      "Name": "name",
      "Last Called Date": "lastCalled",
      "Phone Number": "phone",
      "Email": "email",
      "List": "list",
      "Tags": "tags"
    };

    downloadCSV(
      dncList,
      Object.keys(fieldMapping),
      fieldMapping,
      `DNC_List_${new Date().toISOString().split('T')[0]}.csv`
    );
    toast.success("DNC list exported successfully");
  };

  const handleExportAuditLogs = () => {
    if (!auditLogs || auditLogs.length === 0) {
      toast.error("No audit logs to export");
      return;
    }

    const fieldMapping = {
      "Date": "date",
      "User": "user",
      "Role": "role",
      "Action": "action"
    };

    downloadCSV(
      auditLogs,
      Object.keys(fieldMapping),
      fieldMapping,
      `Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`
    );
    toast.success("Audit logs exported successfully");
  };

  // Audit Logs Data from API
  const auditLogs = realAuditLogs?.map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }),
    user: item.user?.fullName || 'Unknown',
    role: item.user?.role === 'AGENT' ? 'Agent' : 'Admin',
    action: item.action + (item.details ? ` (${item.details})` : '')
  })) || [];

  console.log("tcpaFrom:", regulatory, "tcpaTo:", regulatory?.tcpaTo)

  return (
    <Box className="min-h-screen pr-3 lg:pr-6 bg-white dark:bg-slate-900 transition-colors">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Compliance & DNC</h1>

      {/* Purchased Numbers Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-transparent dark:border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Purchased Numbers</h2>
          <Button onClick={() => navigate("/admin/system-settings")} variant="outline" className="rounded-md bg-gray-100 hover:bg-gray-50 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:border-slate-600 w-full sm:w-auto transition-colors">
            Go to Call Settings
          </Button>
        </div>

        <div className="space-y-4">
          {purchasedNumbers.map((item, index) => (
            <div key={index} className="grid px-4 py-3 rounded-xl grid-cols-1 sm:grid-cols-3 gap-4 border border-xl sm:gap-6 border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 transition-colors">
              {/* Left Column - Number Details */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-base font-medium text-gray-900 dark:text-white">{item.number}</span>
                  <Badge
                    className={`${item.status === 'Healthy'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0'
                      : 'bg-gray-900 text-white dark:bg-gray-700 border-0'
                      } rounded-full px-3 py-1 text-xs font-medium`}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">{item.label}</div>
              </div>


              {/* Middle Column - Country */}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-normal mb-1">Country</div>
                <div className="text-base font-medium text-gray-900 dark:text-white">{item.country}</div>
              </div>

              {/* Right Column - Added On */}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-normal mb-1">Added on</div>
                <div className="text-base font-medium text-gray-900 dark:text-white">{item.addedOn}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DNC List Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-transparent dark:border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">DNC List</h2>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">

            <Button
              variant="outline"
              onClick={handleExportDNC}
              className="rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white flex-1 sm:flex-initial border-0 bg-gray-100 dark:bg-slate-700 transition-colors"
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
                  fill="currentColor"
                  className="text-gray-500 dark:text-gray-400"
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
            rightIcon={<Search className="mr-4 text-gray-500" size={18} />}
            className=" xl:w-[50%] text-black dark:text-white w-full bg-white dark:bg-slate-900 px-5 py-5 rounded-full border-gray-200 dark:border-slate-700 transition-all"
          />
        </div>

        {/* DNC Table */}
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-slate-800 z-10">
              <TableRow className="border-b border-gray-200 dark:border-slate-700 bg-gray-200 dark:bg-slate-700">
                <TableHead className="w-12 px-2 sm:px-4 py-3">
                  <Checkbox className="dark:border-gray-500" />
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Last Called Date</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Phone Number</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Email</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">List</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dncList.map((contact, index) => {
                const primaryEmail = contact.email.find((e: any) => e.isPrimary)?.email || contact.email[0]?.email || "N/A";
                const primaryPhone = contact.phone[0]?.number || "N/A";

                return (
                  <TableRow key={index} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <TableCell className="px-2 sm:px-4 py-4">
                      <Checkbox className="dark:border-gray-500" />
                    </TableCell>
                    <TableCell className="text-blue-700 dark:text-blue-400 px-2 sm:px-4 py-4 text-sm sm:text-base font-medium">{contact.name}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4 text-sm sm:text-base whitespace-nowrap">
                      {/* Last called date could be derived from callRecords if available */}
                      {contact.updatedAt ? new Date(contact.updatedAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="size-4 text-gray-500 dark:text-gray-400 shrink-0" />
                        <span className="text-sm sm:text-base whitespace-nowrap">{primaryPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4 text-sm sm:text-base break-all">{primaryEmail}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4 text-sm sm:text-base">{contact.source || "N/A"}</TableCell>
                    <TableCell className="px-2 sm:px-4 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {contact.tags?.map((tag: any, tagIndex: number) => (
                          <Badge
                            key={tagIndex}
                            className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-0 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full px-2 py-1 text-xs font-medium"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Regulatory Settings Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 transition-colors">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Regulatory Settings
        </h2>

        {/* TCPA Settings */}
        <div className="mb-8">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">
            TCPA Settings (US)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* From */}
            <div>
              <Label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">From</Label>
              <Select
                value={tcpaFrom}
                onValueChange={(val) => {
                  setTcpaFrom(val);  // ← updates UI instantly
                  updateRegulatorySettings.mutate({ tcpaFrom: val });
                }}
              >
                <SelectTrigger className="w-full h-10 rounded-lg border-0 bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-slate-600 focus:ring-offset-0 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hour = i.toString().padStart(2, '0') + ":00";
                    return (
                      <SelectItem key={hour} value={hour} className="dark:text-white hover:dark:bg-slate-700">
                        {hour}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* To */}
            <div>
              <Label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">To</Label>
              <Select
                value={tcpaTo}
                onValueChange={(val) => {
                  setTcpaTo(val);  // ← updates UI instantly
                  updateRegulatorySettings.mutate({ tcpaTo: val });
                }}
              >
                <SelectTrigger className="w-full h-10 rounded-lg border-0 bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-slate-600 focus:ring-offset-0 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hour = i.toString().padStart(2, '0') + ":00";
                    return (
                      <SelectItem key={hour} value={hour} className="dark:text-white hover:dark:bg-slate-700">
                        {hour}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Autodialing toggle */}
          <div className="flex items-center gap-3">
            <Label className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Autodialing</Label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={regulatory?.tcpaAutodialing || false}
                onChange={(e) => updateRegulatorySettings.mutate({ tcpaAutodialing: e.target.checked })}
              />
              <div className={`w-11 h-6 rounded-full bg-gray-300 dark:bg-slate-700 peer-checked:bg-gray-500 dark:peer-checked:bg-yellow-400 transition-all`}>
                <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white dark:bg-slate-900 rounded-full transition-transform ${regulatory?.tcpaAutodialing ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* GDPR Settings */}
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">
            GDPR Settings (EU)
          </h3>
          <div className="mb-4">
            <Label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">Keep contact data for:</Label>
            <Select
              value={String(regulatory?.gdprRetentionDays || 30)}
              onValueChange={(val) => updateRegulatorySettings.mutate({ gdprRetentionDays: Number(val) })}
            >
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[200px] h-10 rounded-lg border-0 bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-slate-600 focus:ring-offset-0 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                <SelectItem value="30" className="dark:text-white hover:dark:bg-slate-700">30 days</SelectItem>
                <SelectItem value="60" className="dark:text-white hover:dark:bg-slate-700">60 days</SelectItem>
                <SelectItem value="90" className="dark:text-white hover:dark:bg-slate-700">90 days</SelectItem>
                <SelectItem value="365" className="dark:text-white hover:dark:bg-slate-700">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start sm:items-center gap-3">
            <input
              type="checkbox"
              id="gdpr-delete"
              checked={regulatory?.gdprDeleteRelated || false}
              onChange={(e) => updateRegulatorySettings.mutate({ gdprDeleteRelated: e.target.checked })}
              className="h-4 w-4 accent-black dark:accent-yellow-400 focus:ring-black dark:focus:ring-white border-gray-400 dark:border-slate-600 rounded cursor-pointer mt-1 sm:mt-0"
            />
            <Label htmlFor="gdpr-delete" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Delete related call records and notes along with a contact.
            </Label>
          </div>
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="bg-white dark:bg-slate-800 mt-6 rounded-xl shadow-sm p-4 sm:p-6 border border-transparent dark:border-slate-700 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">

          {/* Left Side: Heading + All Dates beside it */}
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Audit Logs</h2>

            {/* All Dates Badge — right beside heading */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-900 transition-colors">
              <ChevronLeft className="size-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">All Dates</span>
              <ChevronRight className="size-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          {/* Right Side: Export Button */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              className="rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white dark:border-slate-600 bg-gray-100 dark:bg-slate-700 flex items-center justify-center gap-2 transition-colors border-0"
              onClick={handleExportAuditLogs}
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">Export Audit Log</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-slate-800 z-10">
              <TableRow className="border-b border-gray-200 dark:border-slate-700 hover:bg-transparent">
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Date</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">User</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">Role</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3">Action</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-200 font-medium px-2 sm:px-4 py-3 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((item, index) => (
                <TableRow key={index} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4 text-sm sm:text-base whitespace-nowrap">{item.date}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4 text-sm sm:text-base">{item.user}</TableCell>
                  <TableCell className="px-2 sm:px-4 py-4">
                    <Badge
                      className={`${item.role === 'Agent'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-0'
                        } rounded-full px-3 py-1 text-xs font-medium`}
                    >
                      {item.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4 text-sm sm:text-base">{item.action}</TableCell>
                  <TableCell className="px-2 sm:px-4 py-4">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                      <MoreVertical className="size-4 text-gray-600 dark:text-gray-400" />
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
