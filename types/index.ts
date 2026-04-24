export type Plan = 'pilot' | 'trial' | 'solo' | 'pro' | 'multi' | 'suspended'
export type AutomationType = 'mot_reminder' | 'service_reminder' | 'review_request' | 'win_back'
export type MessageChannel = 'sms' | 'email'
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'opened' | 'clicked'
export type MessageType = AutomationType | 'manual'

export interface Garage {
  id: string
  owner_id: string
  name: string
  owner_name: string | null
  email: string
  phone: string | null
  address: string | null
  google_review_url: string | null
  stripe_customer_id: string | null
  plan: Plan
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  garage_id: string
  name: string
  phone: string | null
  email: string | null
  vehicle_reg: string | null
  vehicle_make: string | null
  last_service_date: string | null
  last_mot_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  garage_id: string
  customer_id: string
  type: MessageType
  channel: MessageChannel
  status: MessageStatus
  content: string | null
  sent_at: string
  created_at: string
  customer?: Customer
}

export interface Automation {
  id: string
  garage_id: string
  type: AutomationType
  enabled: boolean
  last_run_at: string | null
  total_sent: number
  created_at: string
  updated_at: string
}

export interface MessageTemplate {
  id: string
  garage_id: string
  type: AutomationType
  channel: MessageChannel
  subject: string | null
  body: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalCustomers: number
  messagesSentThisMonth: number
  motsDueNext30Days: number
  estimatedRevenueProtected: number
}

export interface CustomerStatus {
  label: string
  color: 'green' | 'amber' | 'red' | 'gray'
}
