import { ArrowLeft, ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Box } from '@/components/ui/box'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchPlans, createSubscription } from '@/store/slices/subscriptionSlice'
import toast from 'react-hot-toast'

const Upgrade = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { plans, loading, error, subscriptions } = useAppSelector((state) => state.subscriptions)

  useEffect(() => {
    dispatch(fetchPlans())
  }, [dispatch])

  const activeSubscription = subscriptions.find(s => s.status.toLowerCase() === 'active');

  const getPlanDetails = (plan: any) => {
    const name = plan.name.toLowerCase();
    
    // Normalize names to the three main roles
    let normalizedName = 'starter';
    if (name.includes('professional')) normalizedName = 'professional';
    else if (name.includes('enterprise')) normalizedName = 'enterprise';

    const isCurrent = activeSubscription?.plan.toLowerCase() === normalizedName;
    
    // Feature mapping for static feel but dynamic source
    const featureSets: Record<string, string[]> = {
      starter: [
        'Advanced spam protection technology',
        '500 AI-powered dialer minutes',
        'Essential call analytics dashboard',
        'Email & chat support (business hours)',
        'Basic CRM integrations',
      ],
      professional: [
        'Everything in Starter plan',
        'Unlimited AI-dialer minutes',
        'AI Sidekick real-time assistance',
        'Priority phone & email support',
        'Premium CRM integrations',
      ],
      enterprise: [
        'Everything in Professional plan',
        'Custom API integrations',
        'Dedicated customer success manager',
        'White-label & branding options',
        '24/7 premium support & SLA',
        'Advanced security & compliance',
      ]
    };

    return {
      isCurrent,
      isPopular: normalizedName === 'professional',
      features: featureSets[normalizedName] || [],
      bgColor: normalizedName === 'starter' ? 'bg-gray-900' : 'bg-white',
      textColor: normalizedName === 'starter' ? 'text-white' : 'text-gray-900',
    };
  }

  const handleSubscribe = async (plan: any) => {
    try {
      // Map plan names to the requested fixed plan_code format strictly
      const name = plan.name.toLowerCase();
      let plan_code = 'starter_123'; // Default fallback

      if (name.includes('professional')) {
        plan_code = 'professional_123';
      } else if (name.includes('enterprise')) {
        plan_code = 'enterprise_123';
      } else {
        // Any other plan (like "Standard" or "Starter") maps to starter_123
        plan_code = 'starter_123';
      }
      
      const resultAction = await dispatch(createSubscription(plan_code));
      if (createSubscription.fulfilled.match(resultAction)) {
        toast.success('Subscription created successfully!');
        navigate('/admin/billing');
      } else {
        toast.error(resultAction.payload as string || 'Failed to create subscription');
      }
    } catch (e) {
      toast.error('An unexpected error occurred');
    }
  };

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
        {loading ? (
           <div className="col-span-full flex items-center justify-center py-20">
              <Loader2 className="animate-spin size-10 text-gray-400" />
           </div>
        ) : error ? (
          <div className="col-span-full text-center py-20 text-red-500">
            {error}
          </div>
        ) : (
          (plans.length > 0 ? plans : []).map((plan, index) => {
            const details = getPlanDetails(plan);
            const plan_name = plan.name.charAt(0).toUpperCase() + plan.name.slice(1).toLowerCase();
            
            return (
              <div
                key={plan.plan_id || index}
                className={`${details.bgColor} ${details.textColor} rounded-xl p-6 shadow-sm relative`}
              >
                {/* Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold">{plan_name}</h3>
                  {details.isCurrent && (
                    <Badge className="bg-white text-gray-900 border-0 hover:bg-white rounded-full px-3 py-1 text-xs font-medium">
                      Current
                    </Badge>
                  )}
                  {details.isPopular && (
                    <Badge className="bg-yellow-100 text-gray-900 border-0 hover:bg-yellow-100 rounded-full px-3 py-1 text-xs font-medium">
                      Most Popular
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className={`${details.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'} text-sm mb-6`}>
                  {plan.description || `Ideal for ${plan_name.toLowerCase()} teams.`}
                </p>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${plan_name === 'Starter' ? 'text-yellow-400' : details.textColor}`}>
                      ${plan.recurring_price}
                    </span>
                    <span className={`text-base ${details.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'}`}>
                      / user / month
                    </span>
                  </div>
                </div>

                {/* Annual Price */}
                <p className={`${details.textColor === 'text-white' ? 'text-gray-400' : 'text-gray-500'} text-sm mb-8`}>
                  Billed monthly
                </p>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {details.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Check className={`size-5 ${details.bgColor === 'bg-gray-900' ? 'text-yellow-400' : 'text-green-500'}`} />
                      </div>
                      <p className={`${details.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-700'} text-sm`}>
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Upgrade Button */}
                <Button 
                  onClick={() => handleSubscribe(plan)}
                  disabled={details.isCurrent || loading}
                  className={`w-full rounded-lg py-3 font-medium transition-all ${
                    details.isCurrent 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : details.bgColor === 'bg-gray-900'
                        ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : details.isCurrent ? (
                    'Current Plan'
                  ) : (
                    `Upgrade to ${plan_name}`
                  )}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </Box>
    </div>
  )
}

export default Upgrade

