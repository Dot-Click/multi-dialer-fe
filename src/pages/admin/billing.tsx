import { 
  ArrowUp, 
  Users, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  CreditCard,
  Loader2
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
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchSubscriptions } from '@/store/slices/subscriptionSlice'
import { format, addMonths, addYears } from 'date-fns'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

const Billing = () => {
  const dispatch = useAppDispatch()
  const { subscriptions, loading, error } = useAppSelector((state) => state.subscriptions)

  useEffect(() => {
    dispatch(fetchSubscriptions())
  }, [dispatch])

  const formatCurrency = (amount: string | undefined) => {
    if (!amount) return '$0'
    return amount.startsWith('$') ? amount : `$${amount}`
  }

  const formatPlan = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase()
  }

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase()
    if (s === 'PAID' || s === 'ACTIVE') {
      return (
        <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100 rounded-full px-3 py-1 text-xs font-medium">
          {status}
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-0 hover:bg-yellow-100 rounded-full px-3 py-1 text-xs font-medium">
        {status}
      </Badge>
    )
  }

  const sortedSubscriptions = [...subscriptions].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const activeSubscription = sortedSubscriptions.find(s => s.status.toLowerCase() === 'active') || sortedSubscriptions[0];

  const calculateUnitPrice = (amount: string | undefined, count: number) => {
    if (!amount || count === 0) return '0';
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    return (numAmount / count).toFixed(0);
  }

  const calculateNextPaymentDate = (subscription: any) => {
    if (!subscription?.startDate) return 'N/A';
    try {
      const date = new Date(subscription.startDate);
      if (subscription.billingCycle?.toLowerCase() === 'yearly') {
        return format(addYears(date, 1), 'MM/dd/yyyy');
      }
      return format(addMonths(date, 1), 'MM/dd/yyyy');
    } catch (e) {
      return 'N/A';
    }
  }

  const handleZohoOAuthFlow = () => {
    try{
      const redirect = api.defaults.baseURL+'/subscriptions/auth';
      window.location.href = redirect;
    }catch {
      toast.error('Failed to fetch token');
    }
  };

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
            {activeSubscription ? formatPlan(activeSubscription.plan) + ' Plan' : 'No Plan'}
          </Badge>
          <Button 
            onClick={handleZohoOAuthFlow}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg px-4 py-2 font-medium w-full sm:w-auto"
          >
            <ArrowUp className="size-4" />
            Upgrade
          </Button>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold text-gray-900">
              ${activeSubscription ? calculateUnitPrice(activeSubscription.amount, activeSubscription.usersCount) : '0'}
            </span>
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
              <div className="text-lg sm:text-xl font-semibold text-gray-900">
                {activeSubscription?.usersCount || 0}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 rounded-lg flex-shrink-0">
              <CreditCard className="size-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total cost</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900">
                {formatCurrency(activeSubscription?.amount)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 rounded-lg flex-shrink-0">
              <Calendar className="size-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Next Payment Date</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900">
                {activeSubscription ? calculateNextPaymentDate(activeSubscription) : 'N/A'}
              </div>
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
          {loading ? (
             <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin size-8 text-gray-400" />
             </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              {error}
            </div>
          ) : (
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
                {subscriptions.length > 0 ? (
                  subscriptions.map((item) => (
                    <TableRow key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="px-2 sm:px-4 py-4">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base">#{item.billingId || item.id.slice(0, 8)}</TableCell>
                      <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base">{formatPlan(item.plan)}</TableCell>
                      <TableCell className="text-gray-700 font-medium px-2 sm:px-4 py-4 text-sm sm:text-base">{formatCurrency(item.amount)}</TableCell>
                      <TableCell className="text-gray-700 px-2 sm:px-4 py-4 text-sm sm:text-base whitespace-nowrap">{format(new Date(item.startDate), 'MM/dd/yyyy')}</TableCell>
                      <TableCell className="px-2 sm:px-4 py-4">
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4 py-4">
                        <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                          <Download className="size-4 text-gray-600" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                     <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        No billing history found.
                     </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Box>
  )
}

export default Billing
