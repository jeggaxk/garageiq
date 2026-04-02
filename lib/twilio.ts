import twilio from 'twilio'

export async function sendSMS(to: string, body: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    )
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    })
    return { success: true, sid: message.sid }
  } catch (error) {
    console.error('Twilio SMS error:', error)
    return { success: false, error: String(error) }
  }
}
