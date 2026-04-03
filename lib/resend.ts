import { Resend } from 'resend'

export async function sendEmail({
  to,
  subject,
  text,
  from = process.env.RESEND_FROM_EMAIL || 'Corviz <onboarding@resend.dev>',
}: {
  to: string
  subject: string
  text: string
  from?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!)
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
    })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Resend email error:', error)
    return { success: false, error: String(error) }
  }
}
