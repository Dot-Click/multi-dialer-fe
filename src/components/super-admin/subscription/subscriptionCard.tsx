// // import React from 'react';
// // import { Check, RefreshCw } from 'lucide-react';

// // const plans = [
// //   {
// //     name: 'Basic',
// //     type: 'Basic',
// //     price: '$29',
// //     period: '/mo',
// //     billing: 'Monthly',
// //     color: 'border-t-gray-400',
// //     features: [
// //       { text: 'Up to 5 users', enabled: true },
// //       { text: '10 GB storage', enabled: true },
// //       { text: 'Email support', enabled: true },
// //       { text: 'Basic analytics', enabled: true },
// //       { text: 'API access', enabled: false },
// //       { text: 'Custom integrations', enabled: false },
// //     ],
// //   },
// //   {
// //     name: 'Standard',
// //     type: 'Standard',
// //     price: '$790',
// //     period: '/yr',
// //     billing: 'Yearly',
// //     discount: '-17%',
// //     popular: true,
// //     color: 'border-blue-600',
// //     features: [
// //       { text: 'Up to 25 users', enabled: true },
// //       { text: '50 GB storage', enabled: true },
// //       { text: 'Priority email support', enabled: true },
// //       { text: 'Advanced analytics', enabled: true },
// //       { text: 'API access', enabled: true },
// //       { text: 'Custom integrations', enabled: false },
// //     ],
// //   },
// //   {
// //     name: 'Premium',
// //     type: 'Premium',
// //     price: '$199',
// //     period: '/mo',
// //     billing: 'Monthly',
// //     color: 'border-t-purple-500',
// //     features: [
// //       { text: 'Unlimited users', enabled: true },
// //       { text: '500 GB storage', enabled: true },
// //       { text: '24/7 phone & email support', enabled: true },
// //       { text: 'Enterprise analytics', enabled: true },
// //       { text: 'Full API access', enabled: true },
// //       { text: 'Custom integrations', enabled: true },
// //     ],
// //   },
// // ];

// // const SubscriptionCard = () => {
// //   return (

// //     <div className="w-full mx-auto grid work-sans grid-cols-1 md:grid-cols-3 gap-6">
// //       {plans.map((plan, index) => (
// //         <div
// //           key={index}
// //           className={`relative bg-white h-[477px] w-[340px] rounded-[22px] shadow-sm  border-t-4 ${plan.popular ? 'border-blue-600' : 'border-transparent  ' + plan.color
// //             } px-4 py-5 flex flex-col`}
// //         >
// //           {/* Most Popular Badge */}
// //           {plan.popular && (
// //             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2463EB] text-white px-[11px] py-[5px] rounded-[75px] text-[15.41px] font-[500] shadow-md">
// //               Most Popular
// //             </div>
// //           )}

// //           {/* Header */}
// //           <div className="flex justify-between work-sans items-center mb-3.5">
// //             <h3 className="text-[22px] font-[600] work-sans text-[#2C2C2C]">{plan.name}</h3>
// //             <span className={`px-[10px] py-[2px] rounded-[75.17px] text-[13.53px] font-[400] ${plan.name === 'Basic' ? 'bg-gray-100 text-gray-400' :
// //                 plan.name === 'Standard' ? 'bg-[#C7DDFF] text-[#2463EB]' : 'bg-[#F1EBFD] text-[#8B52EF]'
// //               }`}>
// //               {plan.type}
// //             </span>
// //           </div>

// //           {/* Monthly/Yearly Toggle UI */}
// //           <div className="bg-[#F1F5F9] work-sans  p-1 rounded-[12px] flex mb-2">
// //             <button className={`flex-1 py-[8px] text-[15.41px] font-[500] rounded-[12px] transition-all ${plan.billing === 'Monthly' ? 'bg-white shadow-sm text-[#030213]' : 'text-[#6575A7]'}`}>
// //               Monthly
// //             </button>
// //             <button className={`flex-1 py-[8px] text-[15.41px] font-[500] rounded-[12px] transition-all flex items-center justify-center gap-1 ${plan.billing === 'Yearly' ? 'bg-white shadow-sm text-[#030213]' : 'text-[#6575A7]'}`}>
// //               Yearly {plan.discount && <span className="text-[12px] text-[#2DC300] font-[500]">{plan.discount}</span>}
// //             </button>
// //           </div>

// //           {/* Price */}
// //           <div className="text-center mb-2">
// //             <span className="text-[22px] font-[600] text-[#2C2C2C]">{plan.price}</span>
// //             <span className="text-[#54585C] text-[18px] font-[500]">{plan.period}</span>
// //           </div>

// //           {/* Features List */}
// //           <ul className="space-y-2 mb-4 flex-grow">
// //             {plan.features.map((feature, idx) => (
// //               <li key={idx} className="flex items-center gap-3">
// //                 <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feature.enabled ? 'bg-[#FFCA06]' : 'bg-gray-200'}`}>
// //                   <Check size={14} className="text-white stroke-[2px]" />
// //                 </div>
// //                 <span className={`text-[16px] font-[400] ${feature.enabled ? 'text-[#1D2C45]' : 'text-[#1D2C456B] line-through'}`}>
// //                   {feature.text}
// //                 </span>
// //               </li>
// //             ))}
// //           </ul>

// //           {/* Status Toggle */}
// //           <div className="border-t work-sans border-gray-100 pt-3 mb-3">
// //             <div className="flex justify-between items-center">
// //               <div className="leading-none flex flex-col gap-1">
// //                 <p className="text-[16px] font-[600] text-[#1D2C45]">Status</p>
// //                 <p className="text-[14px] font-[500] text-[#2DAC2F]">Active</p>
// //               </div>
// //               <div className="w-12 h-6 bg-[#22C55E] rounded-full relative flex justify-center items-center cursor-pointer">
// //                 <div className="absolute right-0.5 top-0.5  w-5 h-5 bg-white rounded-[75px] shadow-sm"></div>
// //               </div>

// //             </div>
// //           </div>

// //           {/* Zoho Sync Footer */}
// //           <div className="bg-[#F1F5F9] rounded-[12px] py-[11px] px-[19px] flex items-center justify-center gap-2 text-[#9BA4AD]">
// //             <RefreshCw size={14} />
// //             <span className="text-[12px] font-[400]">Synced with Zoho Subscriptions</span>
// //           </div>
// //         </div>
// //       ))}
// //     </div>

// //   );
// // };

// // export default SubscriptionCard;


// import { useState } from 'react';
// import { Check, RefreshCw } from 'lucide-react';

// const plansData = [
//   {
//     name: 'Basic',
//     type: 'Basic',
//     color: 'border-t-gray-400',
//     pricing: {
//       Monthly: { price: '$29', period: '/mo' },
//       Yearly: { price: '$290', period: '/yr', discount: '-17%' },
//     },
//     features: [
//       { text: 'Up to 5 users', enabled: true },
//       { text: '10 GB storage', enabled: true },
//       { text: 'Email support', enabled: true },
//       { text: 'Basic analytics', enabled: true },
//       { text: 'API access', enabled: false },
//       { text: 'Custom integrations', enabled: false },
//     ],
//   },
//   {
//     name: 'Standard',
//     type: 'Standard',
//     popular: true,
//     color: 'border-blue-600',
//     pricing: {
//       Monthly: { price: '$79', period: '/mo' },
//       Yearly: { price: '$790', period: '/yr', discount: '-17%' },
//     },
//     features: [
//       { text: 'Up to 25 users', enabled: true },
//       { text: '50 GB storage', enabled: true },
//       { text: 'Priority email support', enabled: true },
//       { text: 'Advanced analytics', enabled: true },
//       { text: 'API access', enabled: true },
//       { text: 'Custom integrations', enabled: false },
//     ],
//   },
//   {
//     name: 'Premium',
//     type: 'Premium',
//     color: 'border-t-purple-500',
//     pricing: {
//       Monthly: { price: '$199', period: '/mo' },
//       Yearly: { price: '$1990', period: '/yr' },
//     },
//     features: [
//       { text: 'Unlimited users', enabled: true },
//       { text: '500 GB storage', enabled: true },
//       { text: '24/7 phone & email support', enabled: true },
//       { text: 'Enterprise analytics', enabled: true },
//       { text: 'Full API access', enabled: true },
//       { text: 'Custom integrations', enabled: true },
//     ],
//   },
// ];

// const SubscriptionCard = () => {
//   return (
//     <div className="w-full  flex justify-start items-center flex-wrap work-sans  gap-3">
//       {plansData.map((plan, index) => (
//         <PlanCard key={index} plan={plan} />
//       ))}
//     </div>
//   );
// };

// const PlanCard = ({ plan }) => {
//   const [billing, setBilling] = useState('Monthly');
//   const [active, setActive] = useState(true);

//   const currentPrice = plan.pricing[billing];

//   return (
//     <div
//       className={`relative bg-white  gap-5 md:w-[310px] w-full rounded-[22px] shadow-md border-t-4 
//       ${plan.popular ? 'border-[#2463EB]' : plan.color} px-6 py-7 flex flex-col`}
//     >
//       {plan.popular && (
//         <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2463EB] text-white px-[11px] py-[5px] rounded-[75px] text-[15.41px] font-[500] shadow-md">
//           Most Popular
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-3.5">
//         <h3 className="text-[22px] font-[600] text-[#2C2C2C]">{plan.name}</h3>
//         <span
//           className={`px-[10px] py-[2px] rounded-[75px] text-[13.53px]
//           ${
//             plan.name === 'Basic'
//               ? 'bg-gray-100 text-gray-400'
//               : plan.name === 'Standard'
//               ? 'bg-[#C7DDFF] text-[#2463EB]'
//               : 'bg-[#F1EBFD] text-[#8B52EF]'
//           }`}
//         >
//           {plan.type}
//         </span>
//       </div>

//       {/* Monthly / Yearly Toggle */}
//       <div className="bg-[#F1F5F9] p-1 rounded-[12px] flex mb-2">
//         {['Monthly', 'Yearly'].map((type) => (
//           <button
//             key={type}
//             onClick={() => setBilling(type)}
//             className={`flex-1 py-[8px] text-[15.41px] font-[500] rounded-[12px] transition-all
//             ${
//               billing === type
//                 ? 'bg-white shadow-sm text-[#030213]'
//                 : 'text-[#6575A7]'
//             }`}
//           >
//             {type}
//             {type === 'Yearly' && currentPrice?.discount && (
//               <span className="ml-1 text-[12px] text-[#2DC300]">
//                 {currentPrice.discount}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Price */}
//       <div className="text-center mb-2">
//         <span className="text-[22px] font-[600] text-[#2C2C2C]">
//           {currentPrice.price}
//         </span>
//         <span className="text-[#54585C] text-[18px] font-[500]">
//           {currentPrice.period}
//         </span>
//       </div>

//       {/* Features */}
//       <ul className="space-y-2 mb-4 flex-grow">
//         {plan.features.map((feature, idx) => (
//           <li key={idx} className="flex items-center gap-3">
//             <div
//               className={`w-5 h-5 rounded-full flex items-center justify-center
//               ${feature.enabled ? 'bg-[#FFCA06]' : 'bg-gray-200'}`}
//             >
//               <Check size={14} className="text-white stroke-[2px]" />
//             </div>
//             <span
//               className={`text-[16px]
//               ${
//                 feature.enabled
//                   ? 'text-[#1D2C45]'
//                   : 'text-[#1D2C456B] line-through'
//               }`}
//             >
//               {feature.text}
//             </span>
//           </li>
//         ))}
//       </ul>

//       {/* Status Toggle */}
//       <div className="border-t border-gray-100 pt-3 mb-3">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-[16px] font-[600] text-[#1D2C45]">Status</p>
//             <p
//               className={`text-[14px] font-[500] ${
//                 active ? 'text-[#2DAC2F]' : 'text-gray-400'
//               }`}
//             >
//               {active ? 'Active' : 'Inactive'}
//             </p>
//           </div>

//           <div
//             onClick={() => setActive(!active)}
//             className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors
//             ${active ? 'bg-[#22C55E]' : 'bg-gray-300'}`}
//           >
//             <div
//               className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all
//               ${active ? 'right-0.5' : 'left-0.5'}`}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="bg-[#F1F5F9] rounded-[12px] py-[11px] px-[19px] flex items-center justify-center gap-2 text-[#9BA4AD]">
//         <RefreshCw size={14} />
//         <span className="text-[12px]">Synced with Zoho Subscriptions</span>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionCard;




import { useState } from 'react';
import { Check, RefreshCw } from 'lucide-react';

/* ================= TYPES ================= */

type PlanFeature = {
  text: string;
  enabled: boolean;
};

type PricingOption = {
  price: string;
  period: string;
  discount?: string;
};

type PlanPricing = {
  Monthly: PricingOption;
  Yearly: PricingOption;
};

type Plan = {
  name: string;
  type: string;
  color: string;
  popular?: boolean;
  pricing: PlanPricing;
  features: PlanFeature[];
};

/* ================= DATA ================= */

const plansData: Plan[] = [
  {
    name: 'Basic',
    type: 'Basic',
    color: 'border-t-gray-400',
    pricing: {
      Monthly: { price: '$29', period: '/mo' },
      Yearly: { price: '$290', period: '/yr', discount: '-17%' },
    },
    features: [
      { text: 'Up to 5 users', enabled: true },
      { text: '10 GB storage', enabled: true },
      { text: 'Email support', enabled: true },
      { text: 'Basic analytics', enabled: true },
      { text: 'API access', enabled: false },
      { text: 'Custom integrations', enabled: false },
    ],
  },
  {
    name: 'Standard',
    type: 'Standard',
    popular: true,
    color: 'border-blue-600',
    pricing: {
      Monthly: { price: '$79', period: '/mo' },
      Yearly: { price: '$790', period: '/yr', discount: '-17%' },
    },
    features: [
      { text: 'Up to 25 users', enabled: true },
      { text: '50 GB storage', enabled: true },
      { text: 'Priority email support', enabled: true },
      { text: 'Advanced analytics', enabled: true },
      { text: 'API access', enabled: true },
      { text: 'Custom integrations', enabled: false },
    ],
  },
  {
    name: 'Premium',
    type: 'Premium',
    color: 'border-t-purple-500',
    pricing: {
      Monthly: { price: '$199', period: '/mo' },
      Yearly: { price: '$1990', period: '/yr' },
    },
    features: [
      { text: 'Unlimited users', enabled: true },
      { text: '500 GB storage', enabled: true },
      { text: '24/7 phone & email support', enabled: true },
      { text: 'Enterprise analytics', enabled: true },
      { text: 'Full API access', enabled: true },
      { text: 'Custom integrations', enabled: true },
    ],
  },
];

/* ================= MAIN ================= */

const SubscriptionCard = () => {
  return (
    <div className="w-full flex justify-start items-center flex-wrap work-sans gap-3">
      {plansData.map((plan, index) => (
        <PlanCard key={index} plan={plan} />
      ))}
    </div>
  );
};

/* ================= CARD ================= */

const PlanCard = ({ plan }: { plan: Plan }) => {
  const [billing, setBilling] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [active, setActive] = useState(true);

  const currentPrice = plan.pricing[billing];

  return (
    <div
      className={`relative bg-white gap-5 md:w-[310px] w-full rounded-[22px] shadow-md border-t-4 
      ${plan.popular ? 'border-[#2463EB]' : plan.color} px-6 py-7 flex flex-col`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2463EB] text-white px-[11px] py-[5px] rounded-[75px] text-[15.41px] font-[500] shadow-md">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-3.5">
        <h3 className="text-[22px] font-[600] text-[#2C2C2C]">{plan.name}</h3>
        <span
          className={`px-[10px] py-[2px] rounded-[75px] text-[13.53px]
          ${
            plan.name === 'Basic'
              ? 'bg-gray-100 text-gray-400'
              : plan.name === 'Standard'
              ? 'bg-[#C7DDFF] text-[#2463EB]'
              : 'bg-[#F1EBFD] text-[#8B52EF]'
          }`}
        >
          {plan.type}
        </span>
      </div>

      {/* Billing Toggle */}
      <div className="bg-[#F1F5F9] p-1 rounded-[12px] flex mb-2">
        {(['Monthly', 'Yearly'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setBilling(type)}
            className={`flex-1 py-[8px] text-[15.41px] font-[500] rounded-[12px]
            ${
              billing === type
                ? 'bg-white shadow-sm text-[#030213]'
                : 'text-[#6575A7]'
            }`}
          >
            {type}
            {type === 'Yearly' && currentPrice.discount && (
              <span className="ml-1 text-[12px] text-[#2DC300]">
                {currentPrice.discount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="text-center mb-2">
        <span className="text-[22px] font-[600] text-[#2C2C2C]">
          {currentPrice.price}
        </span>
        <span className="text-[#54585C] text-[18px] font-[500]">
          {currentPrice.period}
        </span>
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-4 flex-grow">
        {plan.features.map((feature: PlanFeature, idx: number) => (
          <li key={idx} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center
              ${feature.enabled ? 'bg-[#FFCA06]' : 'bg-gray-200'}`}
            >
              <Check size={14} className="text-white stroke-[2px]" />
            </div>
            <span
              className={`text-[16px]
              ${
                feature.enabled
                  ? 'text-[#1D2C45]'
                  : 'text-[#1D2C456B] line-through'
              }`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Status */}
      <div className="border-t border-gray-100 pt-3 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[16px] font-[600] text-[#1D2C45]">Status</p>
            <p
              className={`text-[14px] font-[500] ${
                active ? 'text-[#2DAC2F]' : 'text-gray-400'
              }`}
            >
              {active ? 'Active' : 'Inactive'}
            </p>
          </div>

          <div
            onClick={() => setActive(!active)}
            className={`w-12 h-6 rounded-full relative cursor-pointer
            ${active ? 'bg-[#22C55E]' : 'bg-gray-300'}`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm
              ${active ? 'right-0.5' : 'left-0.5'}`}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#F1F5F9] rounded-[12px] py-[11px] px-[19px] flex items-center justify-center gap-2 text-[#9BA4AD]">
        <RefreshCw size={14} />
        <span className="text-[12px]">Synced with Zoho Subscriptions</span>
      </div>
    </div>
  );
};

export default SubscriptionCard;
