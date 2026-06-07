import { Link } from 'react-router-dom'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="text-sm text-accent hover:underline mb-8 inline-block">← Back to home</Link>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-10">Last updated: June 2026</p>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">1. Information We Collect</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            We collect information you provide directly when you create an account and use JobTrack:
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm leading-relaxed pl-2">
            <li><span className="text-text-primary font-medium">Account information:</span> your email address and a hashed password. We never store your password in plain text.</li>
            <li><span className="text-text-primary font-medium">Job application data:</span> companies, roles, statuses, notes, interview dates, recruiter contacts, and any other information you choose to enter.</li>
            <li><span className="text-text-primary font-medium">Uploaded documents:</span> files such as CVs and cover letters that you attach to your applications.</li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed">
            We also collect limited usage data automatically when you interact with the service, including pages visited, features used, and general interaction patterns. This data is collected in aggregate and is used to understand how the product is used so we can improve it.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">2. How We Use Your Information</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm leading-relaxed pl-2">
            <li>To create and manage your account and provide the JobTrack service</li>
            <li>To store, retrieve, and display the job application data and documents you enter</li>
            <li>To send you account-related communications such as password reset emails</li>
            <li>To analyze aggregate usage patterns and improve the product</li>
            <li>To detect and prevent fraud, abuse, or violations of our Terms of Service</li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed">
            We do not sell your personal data. We do not use your data for advertising purposes or share it with third parties for their marketing use.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">3. Data Storage and Security</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Your data is stored securely using Supabase, a managed database and storage platform. Data is stored in the EU region. Supabase applies industry-standard security measures including encryption at rest and in transit.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Uploaded files are stored in Supabase Storage and are accessible only via short-lived signed URLs that are generated on demand. Your files are not publicly accessible.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            While we take reasonable steps to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">4. Data Retention</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            We retain your account and application data for as long as your account is active. If you delete your account, we will delete your personal data and application records within 30 days, except where we are required to retain it for legal or compliance purposes.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Aggregate, anonymized analytics data may be retained indefinitely as it cannot be linked back to you.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">5. Your Rights</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            You have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm leading-relaxed pl-2">
            <li><span className="text-text-primary font-medium">Access:</span> you can view all of your job application data within the app at any time.</li>
            <li><span className="text-text-primary font-medium">Correction:</span> you can edit or update your data directly in the app.</li>
            <li><span className="text-text-primary font-medium">Deletion:</span> you can delete individual records or your entire account from the Settings page.</li>
            <li><span className="text-text-primary font-medium">Data portability:</span> contact us if you need an export of your data in a machine-readable format.</li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed">
            To exercise any of these rights or if you have questions, contact us at{' '}
            <a href="mailto:pavlovicinq@gmail.com" className="text-accent hover:underline">pavlovicinq@gmail.com</a>.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">6. Third-Party Services</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            We use the following third-party services to operate JobTrack:
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm leading-relaxed pl-2">
            <li>
              <span className="text-text-primary font-medium">Supabase</span> — database, authentication, and file storage. Your account credentials and application data are stored on Supabase infrastructure. See{' '}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Supabase's Privacy Policy</a>.
            </li>
            <li>
              <span className="text-text-primary font-medium">PostHog</span> — product analytics. We use PostHog to track anonymized usage events (e.g., which features are used). PostHog does not receive your job application data or any sensitive personal information. See{' '}
              <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">PostHog's Privacy Policy</a>.
            </li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed">
            These providers act as data processors on our behalf and are contractually bound to process your data only as necessary to provide their services to us.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">7. Changes to This Policy</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. For material changes, we will make reasonable efforts to notify you by email or via a notice in the application. Your continued use of JobTrack after changes are posted constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">8. Contact</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us at{' '}
            <a href="mailto:pavlovicinq@gmail.com" className="text-accent hover:underline">pavlovicinq@gmail.com</a>.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            You can also review our <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
