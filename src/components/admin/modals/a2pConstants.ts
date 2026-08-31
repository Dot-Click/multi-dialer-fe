/**
 * Shared option lists + starter template values for the A2P onboarding
 * and resubmit modals. Keeping them here (rather than inlining) means the
 * onboarding wizard and the resubmit modals show the exact same choices
 * and the same fallback copy.
 *
 * The values match the strings the backend classifier + submit flow
 * expects — see A2PBusinessDetails / A2PCampaignDetails in
 * multi-dialer-be/src/services/a2pRegistrationService.ts.
 */

export interface Option {
    value: string;
    label: string;
}

export const A2P_BUSINESS_TYPE_OPTIONS: Option[] = [
    { value: 'LLC', label: 'LLC' },
    { value: 'Corporation', label: 'Corporation' },
    { value: 'Sole Proprietor', label: 'Sole Proprietor' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Non-Profit', label: 'Non-Profit' },
];

/**
 * Twilio's business_industry enum. Reproduced from the trust-hub
 * customer_profile_business_information attribute options. Order kept
 * roughly by likely selection frequency for the tenants we serve.
 */
export const A2P_INDUSTRY_OPTIONS: Option[] = [
    { value: 'REAL_ESTATE', label: 'Real Estate' },
    { value: 'PROFESSIONAL_SERVICES', label: 'Professional Services' },
    { value: 'RETAIL', label: 'Retail' },
    { value: 'FINANCIAL', label: 'Financial Services' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'NON_PROFIT', label: 'Non-Profit' },
    { value: 'TECHNOLOGY', label: 'Technology' },
    { value: 'HOSPITALITY', label: 'Hospitality' },
    { value: 'MANUFACTURING', label: 'Manufacturing' },
    { value: 'AUTOMOTIVE', label: 'Automotive' },
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'ENERGY', label: 'Energy' },
    { value: 'GOVERNMENT', label: 'Government' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'AGRICULTURE', label: 'Agriculture' },
    { value: 'COMMUNICATION', label: 'Communication' },
    { value: 'POSTAL', label: 'Postal' },
    { value: 'TRANSPORTATION', label: 'Transportation' },
];

/**
 * TCR use case options for the usAppToPersonUsecase attribute. Some
 * variants (POLITICAL, EMERGENCY, CARRIER_EXEMPT) require special
 * enrollment we don't offer — kept out of the dropdown so users don't
 * pick something we can't submit.
 */
export const A2P_USE_CASE_OPTIONS: Option[] = [
    { value: 'MIXED', label: 'Mixed (default)' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'ACCOUNT_NOTIFICATION', label: 'Account Notifications' },
    { value: 'CUSTOMER_CARE', label: 'Customer Care' },
    { value: 'DELIVERY_NOTIFICATION', label: 'Delivery Notifications' },
    { value: 'FRAUD_ALERT', label: 'Fraud Alerts' },
    { value: 'HIGHER_EDUCATION', label: 'Higher Education' },
    { value: 'LOW_VOLUME', label: 'Low Volume' },
    { value: 'POLLING_VOTING', label: 'Polling & Voting' },
    { value: 'PUBLIC_SERVICE_ANNOUNCEMENT', label: 'Public Service Announcement' },
    { value: 'SECURITY_ALERT', label: 'Security Alerts' },
    { value: 'TWO_FACTOR_AUTHENTICATION', label: 'Two-Factor Authentication' },
    { value: 'SOLE_PROPRIETOR', label: 'Sole Proprietor' },
];

/**
 * Copy shown in fresh forms so users see a working starter rather than
 * empty inputs. Same values we ship as backend defaults for legacy rows
 * — see DEFAULT_CAMPAIGN_FIELDS in a2pRegistrationService.ts.
 *
 * Keywords are comma-separated strings here because the modal edits them
 * as text; the submit flow splits them back into arrays.
 */
export const CAMPAIGN_STARTER_TEMPLATE = {
    messageSamples: [
        'Hi {name}, quick follow-up on your inquiry — reply STOP to opt out.',
        'Your appointment is confirmed for {date} at {time}. Reply STOP to opt out.',
    ],
    optInDetails:
        'Contacts opt in via lead forms on our website and verbal consent during initial contact.',
    optInKeywords: 'START, YES',
    optOutKeywords: 'STOP, UNSUBSCRIBE, END, CANCEL, QUIT',
    helpKeywords: 'HELP, INFO',
    helpMessage: 'For help contact support. Reply STOP to unsubscribe.',
};
