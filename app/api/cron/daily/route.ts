import { NextResponse } from 'next/server'
import { runDailyAutomations, sendTrialExpiryEmails } from '@/lib/automation'

export const runtime = 'nodejs'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expected = `Bearer ${process.env.CRON_SECRET}`
  if (authHeader !== expected) {
    return NextResponse.json({
      error: 'Unauthorized',
      receivedLength: authHeader?.length,
      expectedLength: expected.length,
    }, { status: 401 })
  }

  try {
    await sendTrialExpiryEmails([168, 48, 24])
    const result = await runDailyAutomations()
    return NextResponse.json({
      success: true,
      sent: result.sent,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
