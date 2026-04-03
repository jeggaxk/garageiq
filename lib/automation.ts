import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { sendSMS } from './twilio'
import { sendEmail } from './resend'
import { interpolateTemplate, formatPhoneForTwilio, getMotDueDate } from './utils'
import { differenceInDays, subMonths, subYears, addDays, parseISO, startOfDay } from 'date-fns'
import type { AutomationType, Customer, Garage, MessageTemplate } from '@/types'

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

export async function sendTrialExpiryEmails(): Promise<void> {
  const supabase = getAdminClient()
  const today = startOfDay(new Date())
  const in7Days = addDays(today, 7)
  const in8Days = addDays(today, 8)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getrevvia.com'

  const { data: garages } = await supabase
    .from('garages')
    .select('name, email, owner_name, trial_ends_at')
    .eq('plan', 'trial')
    .gte('trial_ends_at', in7Days.toISOString())
    .lt('trial_ends_at', in8Days.toISOString())

  if (!garages) return

  for (const garage of garages) {
    if (!garage.email) continue
    await sendEmail({
      to: garage.email,
      subject: `Your Revvia trial ends in 7 days`,
      text: `Hi ${garage.owner_name || 'there'},

Your free trial ends in 7 days. Don't lose the customers you've been protecting.

Upgrade now to keep your automations running and your customers coming back.

${appUrl}/settings

If you have any questions just reply to this email.

The Revvia team`,
    })
  }
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
    // Check plan is active (trial or paid)
    if (garage.plan === 'trial' && garage.trial_ends_at) {
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
      const targetDateStr = targetDate.toISOString().split('T')[0]

      // last_mot_date + 1 year = targetDate → last_mot_date = targetDate - 1 year
      const lastMotTarget = subYears(targetDate, 1)
      const lastMotTargetStr = lastMotTarget.toISOString().split('T')[0]

      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('garage_id', garage.id)
        .eq('last_mot_date', lastMotTargetStr)

      if (customers) {
        for (const customer of customers) {
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
        for (const customer of customers) {
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

    // --- Review Request (24 hours after service = yesterday) ---
    if (enabledTypes.has('review_request')) {
      const yesterday = addDays(today, -1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('garage_id', garage.id)
        .eq('last_service_date', yesterdayStr)

      if (customers) {
        for (const customer of customers) {
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
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getrevvia.com'
      await sendEmail({
        to: garage.email,
        subject: `Revvia sent ${garageSent} message${garageSent !== 1 ? 's' : ''} for you today`,
        text: `Hi ${garage.owner_name || 'there'},

Here's what Revvia did for ${garage.name} this morning:

✓ ${garageSent} message${garageSent !== 1 ? 's' : ''} sent automatically

Your customers are being kept warm without you lifting a finger. View the full log here:

${appUrl}/messages

The Revvia team`,
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
): Promise<Array<{ channel: string; success: boolean }>> {
  const firstName = customer.name.split(' ')[0]
  const vars = {
    firstName,
    vehicleReg: customer.vehicle_reg || undefined,
    vehicleMake: customer.vehicle_make || undefined,
    garageName: garage.name,
    garagePhone: garage.phone || undefined,
    googleReviewLink: garage.google_review_url || undefined,
  }

  const results: Array<{ channel: string; success: boolean }> = []

  // SMS
  if (customer.phone) {
    const smsTemplate = templates.find((t) => t.type === type && t.channel === 'sms')
    if (smsTemplate) {
      const body = interpolateTemplate(smsTemplate.body, vars)
      const phone = formatPhoneForTwilio(customer.phone)
      const result = await sendSMS(phone, body)
      results.push({ channel: 'sms', success: result.success })
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
