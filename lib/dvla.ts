export interface DvlaVehicleData {
  motExpiryDate: string | null  // YYYY-MM-DD
  make: string | null
}

// Server-side DVLA fetch used by automation cron jobs.
// Returns null on any error so callers can fail open.
export async function fetchDvlaVehicle(reg: string): Promise<DvlaVehicleData | null> {
  if (!process.env.DVLA_API_KEY) return null

  try {
    const response = await fetch(
      'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiries/v1/vehicles',
      {
        method: 'POST',
        headers: {
          'x-api-key': process.env.DVLA_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrationNumber: reg.replace(/\s+/g, '').toUpperCase() }),
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    return {
      motExpiryDate: data.motExpiryDate || null,
      make: data.make || null,
    }
  } catch {
    return null
  }
}
