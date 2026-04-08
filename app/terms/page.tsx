export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. About Corviz</h2>
            <p>Corviz is a software-as-a-service platform operated by Corviz ("we", "us", "our"). We provide automated customer retention tools for independent UK garages, including MOT reminders, service follow-ups, review requests, and win-back campaigns delivered via SMS and email.</p>
            <p className="mt-2">By signing up for and using Corviz, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Your Account</h2>
            <p>You must provide accurate information when registering. You are responsible for maintaining the security of your account credentials. Notify us immediately at hello@getcorviz.com if you suspect unauthorised access.</p>
            <p className="mt-2">One account corresponds to one garage location. Multi-site use requires a Multi-site plan.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Free Trial</h2>
            <p>New accounts receive a 60-day free trial with access to all features. No credit card is required to start. At the end of the trial period, automations will pause unless you subscribe to a paid plan.</p>
            <p className="mt-2">We reserve the right to modify or discontinue the free trial at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Subscriptions and Billing</h2>
            <p>Paid plans are billed monthly or annually in advance. Prices are listed in GBP and exclude VAT where applicable. Payment is processed securely via Stripe.</p>
            <p className="mt-2">Plan limits apply as follows:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Solo (£79/month):</strong> Up to 500 customers, single location</li>
              <li><strong>Pro (£149/month):</strong> Up to 2,000 customers, custom templates</li>
              <li><strong>Multi-site (£249/month):</strong> Unlimited customers, multiple locations</li>
            </ul>
            <p className="mt-2">Annual plans are billed as a single payment equivalent to 10 months (saving 2 months versus monthly billing).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cancellation and Refunds</h2>
            <p>You may cancel your subscription at any time via your account settings or by contacting us at hello@getcorviz.com. Cancellation takes effect at the end of the current billing period — you retain access until then.</p>
            <p className="mt-2">We do not offer refunds for partial billing periods. If you believe there has been a billing error, contact us within 14 days and we will investigate.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Acceptable Use</h2>
            <p>You agree to use Corviz only to send messages to your own existing customers who have a prior relationship with your garage. You must not use the service to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Send unsolicited messages to people who are not your customers</li>
              <li>Send spam, misleading, fraudulent, or illegal content</li>
              <li>Violate any applicable laws including UK PECR and UK GDPR</li>
              <li>Attempt to reverse-engineer or misuse the platform</li>
            </ul>
            <p className="mt-2">We reserve the right to suspend or terminate accounts that breach these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Data and Customer Data</h2>
            <p>You retain ownership of all data you upload to Corviz, including your customer records. By using the service, you grant us a limited licence to process that data solely to provide the service to you.</p>
            <p className="mt-2">You are responsible for ensuring you have the right to contact your customers by SMS and email under applicable data protection law. We act as a data processor on your behalf — you are the data controller.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Service Availability</h2>
            <p>We aim to maintain high availability but do not guarantee uninterrupted service. Scheduled maintenance and unforeseen outages may occur. We are not liable for losses resulting from service downtime.</p>
            <p className="mt-2">Automations run daily at 9am. We do not guarantee exact delivery times for SMS or email, which are subject to third-party provider availability.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Corviz shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, including but not limited to loss of revenue, loss of customers, or reputational damage.</p>
            <p className="mt-2">Our total liability to you in any 12-month period shall not exceed the amount you paid to us in that period.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. We will notify you by email at least 14 days before material changes take effect. Continued use of the service after that date constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
            <p>These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:hello@getcorviz.com" className="text-amber-600 hover:underline">hello@getcorviz.com</a>.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
