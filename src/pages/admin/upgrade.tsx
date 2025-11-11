import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Box } from '@/components/ui/box'
import { useNavigate } from 'react-router-dom'

const Upgrade = () => {
  const navigate = useNavigate()

  const plans = [
    {
      name: 'Starter',
      isCurrent: true,
      description: 'Perfect for small teams getting started',
      price: '$49',
      period: '/ user / month',
      annualPrice: 'Billed annually: $39/month',
      features: [
        'Advanced spam protection technology',
        '500 AI-powered dialer minutes',
        'Essential call analytics dashboard',
        'Email & chat support (business hours)',
        'Basic CRM integrations',
      ],
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
    },
    {
      name: 'Professional',
      isPopular: true,
      description: 'Ideal for growing sales teams',
      price: '$99',
      period: '/ user / month',
      annualPrice: 'Billed annually: $79/month',
      features: [
        'Everything in Starter plan',
        'Unlimited AI-dialer minutes',
        'AI Sidekick real-time assistance',
        'Priority phone & email support',
        'Premium CRM integrations',
      ],
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
    },
    {
      name: 'Enterprise',
      description: 'Ideal for growing sales teams',
      price: '$199',
      period: '/ user / month',
      annualPrice: 'Custom pricing available',
      features: [
        'Everything in Professional plan',
        'Custom API integrations',
        'Dedicated customer success manager',
        'White-label & branding options',
        '24/7 premium support & SLA',
        'Advanced security & compliance',
      ],
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
    },
  ]

  return (
    <div className="div">
     
     <div className="flex items-center gap-3 mb-8">
  {/* Back Button */}
  <button
    onClick={() => navigate('/admin/billing')}
    className="p-2 hover:bg-gray-200 rounded-md transition-colors"
  >
    <ArrowLeft className="size-5 text-gray-700" />
  </button>

  {/* Page Title */}
  <h1 className="text-2xl font-bold text-gray-900">Upgrade</h1>
</div>

        <Box className="p-6 min-h-screen bg-gray-50 rounded-2xl">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 mb-8">
       
      </div>

      {/* Explore Other Plans Section */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Explore Other Plans</h2>
            <p className="text-base text-gray-600">
              To upgrade your current plan, please contact the sales team.
            </p>
          </div>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg px-6 py-3 font-medium">
            Contact Sales
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Pricing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`${plan.bgColor} ${plan.textColor} rounded-xl p-6 shadow-sm relative`}
          >
            {/* Badge */}
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              {plan.isCurrent && (
                <Badge className="bg-white text-gray-900 border-0 hover:bg-white rounded-full px-3 py-1 text-xs font-medium">
                  Current
                </Badge>
              )}
              {plan.isPopular && (
                <Badge className="bg-yellow-100 text-gray-900 border-0 hover:bg-yellow-100 rounded-full px-3 py-1 text-xs font-medium">
                  Most Popular
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className={`${plan.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'} text-sm mb-6`}>
              {plan.description}
            </p>

            {/* Price */}
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold ${plan.name === 'Starter' ? 'text-yellow-400' : plan.textColor}`}>
                  {plan.price}
                </span>
                <span className={`text-base ${plan.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plan.period}
                </span>
              </div>
            </div>

            {/* Annual Price */}
            <p className={`${plan.textColor === 'text-white' ? 'text-gray-400' : 'text-gray-500'} text-sm mb-8`}>
              {plan.annualPrice}
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Check className={`size-5 ${plan.name === 'Starter' ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                  <p className={`${plan.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-700'} text-sm`}>
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
    </div>
  )
}

export default Upgrade

