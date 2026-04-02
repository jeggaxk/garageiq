import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const PLANS = {
  solo: {
    name: 'Solo',
    price: 4900, // pence
    priceId: process.env.STRIPE_SOLO_PRICE_ID || '',
    description: 'Perfect for single-bay garages',
    features: ['Up to 500 customers', 'SMS + email reminders', 'All 4 automations', 'Google review requests'],
  },
  pro: {
    name: 'Pro',
    price: 9900,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    description: 'For established independent garages',
    features: ['Up to 2,000 customers', 'SMS + email reminders', 'All 4 automations', 'Custom message templates', 'Priority support'],
  },
  multi: {
    name: 'Multi-site',
    price: 19900,
    priceId: process.env.STRIPE_MULTI_PRICE_ID || '',
    description: 'For garage groups and franchises',
    features: ['Unlimited customers', 'Multiple garage locations', 'All Pro features', 'Dedicated account manager'],
  },
} as const
