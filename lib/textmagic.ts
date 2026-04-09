export async function sendSMS(
  to: string,
  body: string,
  from?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const username = process.env.TEXTMAGIC_USERNAME!
    const apiKey = process.env.TEXTMAGIC_API_KEY!

    const params: Record<string, string> = {
      phones: to,
      text: body,
    }

    if (from) {
      // Alphanumeric sender ID — max 11 chars, no spaces
      params.from = from.replace(/\s+/g, '').slice(0, 11)
    }

    const response = await fetch('https://rest.textmagic.com/api/v2/messages', {
      method: 'POST',
      headers: {
        'X-TM-Username': username,
        'X-TM-Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params).toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Textmagic SMS error:', data)
      return { success: false, error: JSON.stringify(data) }
    }

    return { success: true, id: String(data.id) }
  } catch (error) {
    console.error('Textmagic SMS error:', error)
    return { success: false, error: String(error) }
  }
}
