import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Box } from '@/components/ui/box'

const LeadStore = () => {
  const services = [
    {
      name: 'Expired Data',
      description: 'Great for listing motivated sellers.',
      price: '$50',
      period: '/per month',
    },
    {
      name: 'Neighborhood Search',
      description: 'Great for circle prospecting.',
      price: '$49',
      period: '/per month',
    },
    {
      name: 'FSBO',
      description: 'Great for listing motivated sellers.',
      price: '$36',
      period: '/per month',
    },
    {
      name: 'FRBO',
      description: 'Great for finding tired landlords.',
      price: '$25',
      period: '/per month',
    },
    {
      name: 'Skip Tracer',
      description: 'Great for appending your address files.',
      price: '$32',
      period: '/per month',
    },
  ]

  return (
   <div>
     <Box className="p-6 min-h-screen ">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Lead Store</h1>

      {/* Service Cards */}
      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            {/* Header with Service Name and Chevron */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">{service.name}</h2>
              <ChevronDown className="size-5 text-gray-500" />
            </div>

            {/* Description */}
            <p className="text-base text-gray-600 font-normal mb-4">
              {service.description}
            </p>

            {/* Price and Subscribe Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{service.price}</span>
                <span className="text-base text-gray-600 font-normal">{service.period}</span>
              </div>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg px-6 py-2 font-medium text-base">
                Subscribe
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Box>
   </div>
  )
}

export default LeadStore
