export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Who We Are</h2>
            <p>Corviz is a software-as-a-service platform operated by Corviz ("we", "us", "our"). We provide automated customer retention tools for independent UK garages. Our contact email is <a href="mailto:hello@getcorviz.com" className="text-amber-600 hover:underline">hello@getcorviz.com</a>.</p>
            <p className="mt-2">This Privacy Policy explains how we collect, use, and protect personal data in connection with the Corviz platform and website (getcorviz.com).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Data We Collect About You (Garage Owners)</h2>
            <p>When you register and use Corviz, we collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Account data:</strong> your name, email address, and password (hashed)</li>
              <li><strong>Garage information:</strong> garage name, address, phone number</li>
              <li><strong>Billing data:</strong> payment details processed and stored securely by Stripe — we do not store card numbers</li>
              <li><strong>Usage data:</strong> how you interact with the platform, automation logs, message delivery records</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Customer Data You Upload</h2>
            <p>You may upload personal data about your customers (names, phone numbers, email addresses, vehicle details, and service history) to Corviz for the purpose of sending automated reminders.</p>
            <p className="mt-2">In relation to this data:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You are the <strong>data controller</strong> — you determine the purpose and means of processing</li>
              <li>We are the <strong>data processor</strong> — we process data only on your instructions to deliver the service</li>
              <li>We do not use your customer data for any other purpose</li>
              <li>We do not sell or share customer data with third parties except as necessary to deliver the service (e.g. SMS gateway providers)</li>
            </ul>
            <p className="mt-2">You are responsible for ensuring you have a lawful basis to contact your customers under UK GDPR and UK PECR before using Corviz to send them messages.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How We Use Your Data</h2>
            <p>We use the data we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and operate the Corviz platform</li>
              <li>Process payments and manage your subscription</li>
              <li>Send you service notifications and account-related emails</li>
              <li>Respond to support requests</li>
              <li>Improve the platform and fix issues</li>
            </ul>
            <p className="mt-2">Our lawful basis for processing your data is the performance of a contract (your subscription) and our legitimate interests in operating and improving the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services to operate Corviz:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Supabase</strong> — database and authentication (data stored in EU region)</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Twilio / SMS provider</strong> — SMS delivery</li>
            </ul>
            <p className="mt-2">Each provider has their own privacy policy and security standards. We only share data with these providers to the extent necessary to deliver the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. If you cancel your subscription and do not reactivate within 90 days, we may delete your account and associated data.</p>
            <p className="mt-2">You can request deletion of your data at any time by emailing <a href="mailto:hello@getcorviz.com" className="text-amber-600 hover:underline">hello@getcorviz.com</a>. We will action deletion requests within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data ("right to be forgotten")</li>
              <li>Restrict or object to processing</li>
              <li>Data portability — receive your data in a machine-readable format</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, contact us at <a href="mailto:hello@getcorviz.com" className="text-amber-600 hover:underline">hello@getcorviz.com</a>.</p>
            <p className="mt-2">You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">ico.org.uk</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies</h2>
            <p>We use only essential cookies required for authentication and session management. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Security</h2>
            <p>We take reasonable technical and organisational measures to protect your data, including encrypted connections (HTTPS), hashed passwords, and access controls. No system is completely secure — in the event of a data breach affecting your rights, we will notify you and the ICO as required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you by email at least 14 days before material changes take effect. Continued use of the service after that date constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
            <p>For any privacy-related questions or requests, contact us at <a href="mailto:hello@getcorviz.com" className="text-amber-600 hover:underline">hello@getcorviz.com</a>.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
