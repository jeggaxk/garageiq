import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Corviz — Automated Customer Retention for MOT Garages',
    template: '%s | Corviz',
  },
  description: 'Stop losing customers to garages down the road. Corviz sends automated MOT reminders, service follow-ups, and Google review requests to keep your customers coming back.',
  keywords: ['MOT reminder', 'garage software', 'customer retention', 'UK garage', 'MOT service'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
