import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Corviz — Automated Customer Retention for MOT Garages',
    template: '%s | Corviz',
  },
  description: 'Stop losing customers to garages down the road. Corviz sends automated MOT reminders, service follow-ups and review requests. Full refund guaranteed.',
  keywords: ['MOT reminder', 'garage software', 'customer retention', 'UK garage', 'MOT service'],
  alternates: {
    canonical: 'https://getcorviz.com',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Corviz',
  url: 'https://getcorviz.com',
  logo: 'https://getcorviz.com/corviz-logo-transparent.png',
  email: 'jack@getcorviz.com',
  founder: { '@type': 'Person', name: 'Jack' },
  description: 'Automated MOT reminders, service follow-ups and Google review requests for UK independent garages.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TCWNT38K');` }} />
      </head>
      <body>
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TCWNT38K" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        {children}
      </body>
    </html>
  )
}
