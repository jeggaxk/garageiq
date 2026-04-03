import { NextResponse } from 'next/server'
import { sendTrialExpiryEmails } from '@/lib/automation'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await sendTrialExpiryEmails([12])
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Evening cron failed:', error)
    return NextResponse.json({ error: 'Evening cron failed' }, { status: 500 })
  }
}
