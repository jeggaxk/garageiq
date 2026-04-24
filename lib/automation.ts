import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { sendSMS } from './textmagic'
import { sendEmail } from './resend'
import { interpolateTemplate, formatPhoneForTwilio, getMotDueDate } from './utils'
import { differenceInDays, subMonths, subYears, addDays, addYears, parseISO, startOfDay, format } from 'date-fns'
import type { AutomationType, Customer, Garage, MessageTemplate } from '@/types'
import { fetchDvlaVehicle } from './dvla'

function getAdminClient() {
  return createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface SendResult {
  customerId: string
  type: AutomationType
  channel: string
  success: boolean
}

export async function runDailyAutomations(): Promise<{ sent: number; errors: number }> {
  const supabase = getAdminClient()
  const today = startOfDay(new Date())
  let totalSent = 0
  let totalErrors = 0

  // Get all garages with their automations
  const { data: garages, error: garagesError } = await supabase
    .from('garages')
    .select('*, automations(*), message_templates(*)')

  if (garagesError || !garages) {
    console.error('Failed to fetch garages:', garagesError)
    return { sent: 0, errors: 1 }
  }

  for (const garage of garages) {
    // Check plan is active
    if (garage.plan === 'suspended') continue
    // Pilot and legacy trial both expire at trial_ends_at
    if ((garage.plan === 'pilot' || garage.plan === 'trial') && garage.trial_ends_at) {
      const trialEnd = new Date(garage.trial_ends_at)
      if (trialEnd < today) continue
    }

    let garageSent = 0

    const automations = garage.automations || []
    const templates: MessageTemplate[] = garage.message_templates || []

    const enabledTypes = new Set(
      automations.filter((a: { enabled: boolean; type: AutomationType }) => a.enabled).map((a: { type: AutomationType }) => a.type)
    )

    // --- MOT Reminder (4 weeks / 28 days before due) ---
    if (enabledTypes.has('mot_reminder')) {
      const targetDate = addDays(today, 28)

      // last_mot_date + 1 year = targetDate → last_mot_date = targetDate - 1 year
      const lastMotTarget = subYears(targetDate, 1)
      const lastMotTargetStr = lastMotTarget.toISOString().split('T')[0]

      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('garage_id', garage.id)
        .eq('last_mot_date', lastMotTargetStr)

      if (customers) {
        const sixtyDaysAgo = addDays(today, -60).toISOString()
        for (const customer of customers) {
          const { data: recentMessages } = await supabase
            .from('messages')
            .select('id')
            .eq('garage_id', garage.id)
            .eq('customer_id', customer.id)
            .eq('type', 'mot_reminder')
            .gte('sent_at', sixtyDaysAgo)
            .limit(1)
          if (recentMessages && recentMessages.length > 0) continue

          // DVLA verification: skip if the stored MOT date no longer matches DVLA.
          // This catches customers who renewed their MOT elsewhere since the garage last updated their record.
          if (customer.vehicle_reg) {
            const dvla = await fetchDvlaVehicle(customer.vehicle_reg)
            if (dvla?.motExpiryDate) {
              const expectedExpiry = format(addYears(parseISO(customer.last_mot_date!), 1), 'yyyy-MM-dd')
              if (dvla.motExpiryDate !== expectedExpiry) {
                // DVLA has a different expiry — update the stored date and skip this reminder.
                // Convert motExpiryDate back to last_mot_date (1 year before expiry).
                const dvlaLastMotDate = format(
                  addYears(parseISO(dvla.motExpiryDate), -1),
                  'yyyy-MM-dd'
                )
                await supabase
                  .from('customers')
                  .update({ last_mot_date: dvlaLastMotDate })
                  .eq('id', customer.id)
                console.log(
                  `MOT reminder skipped for customer ${customer.id}: ` +
                  `stored expiry ${expectedExpiry} ≠ DVLA expiry ${dvla.motExpiryDate}. ` +
                  `Updated last_mot_date to ${dvlaLastMotDate}.`
                )
                continue
              }
            }
            // If DVLA returned null (API unavailable or vehicle not found), proceed with the reminder.
          }

          const results = await sendAutomationMessages(
            customer,
            garage,
            'mot_reminder',
            templates
          )
          for (const r of results) {
            if (r.success) { totalSent++; garageSent++ }
            else totalErrors++
            await logMessage(supabase, garage.id, customer.id, 'mot_reminder', r.channel as 'sms' | 'email', r.success)
          }
        }
        // Update automation last_run_at
        await supabase
          .from('automations')
          .update({ last_run_at: new Date().toISOString(), total_sent: totalSent })
          .eq('garage_id', garage.id)
          .eq('type', 'mot_reminder')
      }
    }

    // --- Service Reminder (11 months after last service) ---
    if (enabledTypes.has('service_reminder')) {
      const targetServiceDate = subMonths(today, 11)
      const targetServiceDateStr = targetServiceDate.toISOString().split('T')[0]

      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('garage_id', garage.id)
        .eq('last_service_date', targetServiceDateStr)

      if (customers) {
        const sixtyDaysAgo = addDays(today, -60).toISOString()
        for (const customer of customers) {
          const { data: recentMessages } = await supabase
            .from('messages')
            .select('id')
            .eq('garage_id', garage.id)
            .eq('customer_id', customer.id)
            .eq('type', 'service_reminder')
            .gte('sent_at', sixtyDaysAgo)
            .limit(1)
          if (recentMessages && recentMessages.length > 0) continue

          const results = await sendAutomationMessages(
            customer,
            garage,
            'service_reminder',
            templates
          )
          for (const r of results) {
            if (r.success) { totalSent++; garageSent++ }
            else totalErrors++
            await logMessage(supabase, garage.id, customer.id, 'service_reminder', r.channel as 'sms' | 'email', r.success)
          }
        }
      }
    }

    // --- Review Request (24 hours after service or MOT = yesterday) ---
    if (enabledTypes.has('review_request')) {
      const yesterday = addDays(today, -1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      const oneDayAgo = addDays(today, -1).toISOString()

      const { data: serviceCustomers } = await supabase
        .from('customers')
        .select('*')
        .eq('garage_id', garage.id)
        .eq('last_service_date', yesterdayStr)

      const { data: motCustomers } = await supabase
        .from('customers')
        .select('*')
        .eq('garage_id', garage.id)
        .eq('last_mot_date', yesterdayStr)

      // Merge and deduplicate by customer ID
      const seen = new Set<string>()
      const customers = [...(serviceCustomers || []), ...(motCustomers || [])].filter(c => {
        if (seen.has(c.id)) return false
        seen.add(c.id)
        return true
      })

      for (const customer of customers) {
        const { data: recentMessages } = await supabase
          .from('messages')
          .select('id')
          .eq('garage_id', garage.id)
          .eq('customer_id', customer.id)
          .eq('type', 'review_request')
          .gte('sent_at', oneDayAgo)
          .limit(1)
        if (recentMessages && recentMessages.length > 0) continue

        const results = await sendAutomationMessages(
          customer,
          garage,
          'review_request',
          templates
        )
        for (const r of results) {
          if (r.success) { totalSent++; garageSent++ }
          else totalErrors++
          await logMessage(supabase, garage.id, customer.id, 'review_request', r.channel as 'sms' | 'email', r.success)
        }
      }
    }

    // --- Win-back (12 months no visit AND no message in 60 days) ---
    if (enabledTypes.has('win_back')) {
      const twelveMonthsAgo = subYears(today, 1).toISOString().split('T')[0]
      const sixtyDaysAgo = addDays(today, -60).toISOString()

      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('garage_id', garage.id)
        .lte('last_service_date', twelveMonthsAgo)

      if (customers) {
        for (const customer of customers) {
          // Check no message sent in last 60 days
          const { data: recentMessages } = await supabase
            .from('messages')
            .select('id')
            .eq('garage_id', garage.id)
            .eq('customer_id', customer.id)
            .gte('sent_at', sixtyDaysAgo)
            .limit(1)

          if (!recentMessages || recentMessages.length === 0) {
            const results = await sendAutomationMessages(
              customer,
              garage,
              'win_back',
              templates
            )
            for (const r of results) {
              if (r.success) { totalSent++; garageSent++ }
              else totalErrors++
              await logMessage(supabase, garage.id, customer.id, 'win_back', r.channel as 'sms' | 'email', r.success)
            }
          }
        }
      }
    }

    // Daily digest email — only if messages were sent for this garage
    if (garageSent > 0 && garage.email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getcorviz.com'
      await sendEmail({
        to: garage.email,
        subject: `Corviz sent ${garageSent} message${garageSent !== 1 ? 's' : ''} for you today`,
        text: `Hi ${garage.owner_name || 'there'},

Here's what Corviz did for ${garage.name} this morning:

✓ ${garageSent} message${garageSent !== 1 ? 's' : ''} sent automatically

Your customers are being kept warm without you lifting a finger. View the full log here:

${appUrl}/messages

The Corviz team`,
      }).catch(() => {})
    }
  }

  return { sent: totalSent, errors: totalErrors }
}

async function sendAutomationMessages(
  customer: Customer,
  garage: Garage & { message_templates: MessageTemplate[] },
  type: AutomationType,
  templates: MessageTemplate[]
): Promise<Array<{ channel: string; success: boolean; error?: string }>> {
  const firstName = customer.name.split(' ')[0]
  const motDueDate = customer.last_mot_date
    ? addYears(parseISO(customer.last_mot_date), 1).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : undefined
  const vars = {
    firstName,
    vehicleReg: customer.vehicle_reg || undefined,
    vehicleMake: customer.vehicle_make || undefined,
    garageName: garage.name,
    garagePhone: garage.phone || undefined,
    googleReviewLink: garage.google_review_url || undefined,
    motDueDate,
  }

  const results: Array<{ channel: string; success: boolean; error?: string }> = []

  // SMS
  if (customer.phone) {
    const smsTemplate = templates.find((t) => t.type === type && t.channel === 'sms')
    if (smsTemplate) {
      const body = interpolateTemplate(smsTemplate.body, vars)
      const phone = formatPhoneForTwilio(customer.phone)
      const result = await sendSMS(phone, body)
      results.push({ channel: 'sms', success: result.success, error: result.error })
    }
  }

  // Email
  if (customer.email) {
    const emailTemplate = templates.find((t) => t.type === type && t.channel === 'email')
    if (emailTemplate) {
      const subject = emailTemplate.subject || getDefaultSubject(type, garage.name)
      const text = interpolateTemplate(emailTemplate.body, vars)
      const result = await sendEmail({ to: customer.email, subject, text })
      results.push({ channel: 'email', success: result.success })
    }
  }

  return results
}

function getDefaultSubject(type: AutomationType, garageName: string): string {
  const subjects: Record<AutomationType, string> = {
    mot_reminder: `Your MOT is due soon — book at ${garageName}`,
    service_reminder: `Time for a service at ${garageName}`,
    review_request: `How was your visit to ${garageName}?`,
    win_back: `We miss you at ${garageName}`,
  }
  return subjects[type]
}

export async function sendCatchUpReminders(customerIds: string[], garageId: string): Promise<void> {
  const supabase = getAdminClient()
  const today = startOfDay(new Date())

  const { data: garage } = await supabase
    .from('garages')
    .select('*, automations(*), message_templates(*)')
    .eq('id', garageId)
    .single()

  if (!garage) return
  if (garage.plan === 'suspended') return
  if ((garage.plan === 'pilot' || garage.plan === 'trial') && garage.trial_ends_at) {
    if (new Date(garage.trial_ends_at) < today) return
  }

  const automations = garage.automations || []
  const templates: MessageTemplate[] = garage.message_templates || []
  const enabledTypes = new Set(
    automations
      .filter((a: { enabled: boolean; type: AutomationType }) => a.enabled)
      .map((a: { type: AutomationType }) => a.type)
  )

  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('garage_id', garageId)
    .in('id', customerIds)

  if (!customers) return

  for (const customer of customers) {
    // MOT catch-up: due within 0–28 days and no reminder sent yet
    if (enabledTypes.has('mot_reminder') && customer.last_mot_date) {
      const motDue = addYears(parseISO(customer.last_mot_date), 1)
      const daysUntil = differenceInDays(motDue, today)
      if (daysUntil >= 0 && daysUntil <= 28) {
        const { data: existing } = await supabase
          .from('messages')
          .select('id')
          .eq('garage_id', garageId)
          .eq('customer_id', customer.id)
          .eq('type', 'mot_reminder')
          .limit(1)
        if (!existing || existing.length === 0) {
          // DVLA verification before catch-up reminder
          let dvlaVerified = true
          if (customer.vehicle_reg) {
            const dvla = await fetchDvlaVehicle(customer.vehicle_reg)
            if (dvla?.motExpiryDate) {
              const expectedExpiry = format(addYears(parseISO(customer.last_mot_date), 1), 'yyyy-MM-dd')
              if (dvla.motExpiryDate !== expectedExpiry) {
                dvlaVerified = false
                const dvlaLastMotDate = format(addYears(parseISO(dvla.motExpiryDate), -1), 'yyyy-MM-dd')
                await supabase
                  .from('customers')
                  .update({ last_mot_date: dvlaLastMotDate })
                  .eq('id', customer.id)
              }
            }
          }
          if (dvlaVerified) {
            const results = await sendAutomationMessages(customer, garage, 'mot_reminder', templates)
            for (const r of results) {
              await logMessage(supabase, garageId, customer.id, 'mot_reminder', r.channel as 'sms' | 'email', r.success)
            }
          }
        }
      }
    }

    // Service catch-up: last service 11+ months ago and no reminder sent yet
    if (enabledTypes.has('service_reminder') && customer.last_service_date) {
      const daysSinceService = differenceInDays(today, parseISO(customer.last_service_date))
      if (daysSinceService >= 335) { // ~11 months
        const { data: existing } = await supabase
          .from('messages')
          .select('id')
          .eq('garage_id', garageId)
          .eq('customer_id', customer.id)
          .eq('type', 'service_reminder')
          .limit(1)
        if (!existing || existing.length === 0) {
          const results = await sendAutomationMessages(customer, garage, 'service_reminder', templates)
          for (const r of results) {
            await logMessage(supabase, garageId, customer.id, 'service_reminder', r.channel as 'sms' | 'email', r.success)
          }
        }
      }
    }

    // Win-back catch-up: no visit in 12+ months and no message in last 60 days
    if (enabledTypes.has('win_back') && customer.last_service_date) {
      const daysSinceService = differenceInDays(today, parseISO(customer.last_service_date))
      if (daysSinceService >= 365) {
        const sixtyDaysAgo = addDays(today, -60).toISOString()
        const { data: recentMessages } = await supabase
          .from('messages')
          .select('id')
          .eq('garage_id', garageId)
          .eq('customer_id', customer.id)
          .gte('sent_at', sixtyDaysAgo)
          .limit(1)
        if (!recentMessages || recentMessages.length === 0) {
          const results = await sendAutomationMessages(customer, garage, 'win_back', templates)
          for (const r of results) {
            await logMessage(supabase, garageId, customer.id, 'win_back', r.channel as 'sms' | 'email', r.success)
          }
        }
      }
    }
  }
}

async function logMessage(
  supabase: ReturnType<typeof getAdminClient>,
  garageId: string,
  customerId: string,
  type: AutomationType,
  channel: 'sms' | 'email',
  success: boolean
) {
  await supabase.from('messages').insert({
    garage_id: garageId,
    customer_id: customerId,
    type,
    channel,
    status: success ? 'sent' : 'failed',
    sent_at: new Date().toISOString(),
  })
}
