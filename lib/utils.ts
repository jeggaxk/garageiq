import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, addYears, addMonths, format, parseISO } from 'date-fns'
import type { Customer, CustomerStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCustomerStatus(customer: Customer): CustomerStatus {
  const today = new Date()

  // Check MOT status
  if (customer.last_mot_date) {
    const nextMotDate = addYears(parseISO(customer.last_mot_date), 1)
    const daysUntilMot = differenceInDays(nextMotDate, today)

    if (daysUntilMot < 0) {
      return { label: 'MOT Overdue', color: 'red' }
    }
    if (daysUntilMot <= 28) {
      return { label: 'MOT Due Soon', color: 'amber' }
    }
  }

  // Check service status
  if (customer.last_service_date) {
    const nextServiceDate = addMonths(parseISO(customer.last_service_date), 11)
    const daysUntilService = differenceInDays(nextServiceDate, today)

    if (daysUntilService < 0) {
      return { label: 'Service Due', color: 'red' }
    }
    if (daysUntilService <= 30) {
      return { label: 'Service Due Soon', color: 'amber' }
    }
  }

  // Check if lapsed (12+ months no visit)
  if (customer.last_service_date) {
    const lastVisit = parseISO(customer.last_service_date)
    const monthsSinceVisit = differenceInDays(today, lastVisit) / 30

    if (monthsSinceVisit >= 12) {
      return { label: 'Lapsed', color: 'gray' }
    }
  }

  return { label: 'Up to date', color: 'green' }
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy')
  } catch {
    return '—'
  }
}

export function getMotDueDate(lastMotDate: string): Date {
  return addYears(parseISO(lastMotDate), 1)
}

export function interpolateTemplate(
  template: string,
  vars: {
    firstName: string
    vehicleReg?: string
    vehicleMake?: string
    garageName: string
    garagePhone?: string
    googleReviewLink?: string
    motDueDate?: string
  }
): string {
  return template
    .replace(/\[FirstName\]/g, vars.firstName)
    .replace(/\[VehicleReg\]/g, vars.vehicleReg || 'your vehicle')
    .replace(/\[VehicleMake\]/g, vars.vehicleMake || 'your vehicle')
    .replace(/\[GarageName\]/g, vars.garageName)
    .replace(/\[GaragePhone\]/g, vars.garagePhone || '')
    .replace(/\[GoogleReviewLink\]/g, vars.googleReviewLink || '')
    .replace(/\[MotDueDate\]/g, vars.motDueDate || 'soon')
}

export function formatCurrency(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(pence / 100)
}

export function formatPhoneForTwilio(phone: string): string {
  // Normalise UK numbers to E.164
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '')
  if (cleaned.startsWith('07')) {
    return '+44' + cleaned.slice(1)
  }
  if (cleaned.startsWith('+44')) {
    return cleaned
  }
  return cleaned
}
