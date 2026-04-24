import Stripe from 'stripe'

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  })
}

export const PLANS = {
  // £99 one-time payment, activates 90-day pilot period
  pilot: {
    name: '90-Day Pilot',
    price: 9900,
    priceId: process.env.STRIPE_PILOT_PRICE_ID || '',
    description: '90-day concierge pilot with full refund guarantee',
    features: ['All automations', 'Up to 500 customers', 'Direct founder support', 'Full refund if not satisfied'],
  },
  // Founding member monthly rate (first 5 garages)
  founding: {
    name: 'Founding Member',
    price: 3900,
    priceId: process.env.STRIPE_FOUNDING_PRICE_ID || '',
    description: 'Locked-in founding rate for life',
    features: ['Up to 500 customers', 'SMS + email reminders', 'All 4 automations', 'Google review requests'],
  },
  solo: {
    name: 'Solo',
    price: 7900,
    priceId: process.env.STRIPE_SOLO_PRICE_ID || '',
    description: 'Perfect for single-bay garages',
    features: ['Up to 500 customers', 'SMS + email reminders', 'All 4 automations', 'Google review requests'],
  },
  pro: {
    name: 'Pro',
    price: 14900,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    description: 'For established independent garages',
    features: ['Up to 2,000 customers', 'SMS + email reminders', 'All 4 automations', 'Custom message templates', 'Priority support'],
  },
} as const
