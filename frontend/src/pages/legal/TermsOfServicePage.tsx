import { Link } from 'react-router-dom'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="text-sm text-accent hover:underline mb-8 inline-block">← Back to home</Link>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Terms of Service</h1>
        <p className="text-sm text-text-muted mb-10">Last updated: June 2026</p>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">1. Acceptance of Terms</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            By accessing or using JobTrack at job-track.app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service. These terms apply to all visitors, users, and others who access or use JobTrack.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">2. Description of Service</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            JobTrack is a job application tracking tool that helps users organize, manage, and monitor their job search activities. The service allows you to log job applications, track their status, store relevant documents, manage recruiter contacts, and view statistics about your job search progress.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            JobTrack is provided as a software-as-a-service (SaaS) product. We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice where possible.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">3. User Accounts</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            You must create an account to use JobTrack. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate and complete information when registering and to keep this information up to date.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            You must be at least 16 years old to create an account. By registering, you represent that you meet this age requirement. You may not share your account with others or create accounts for the purpose of circumventing these terms.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">4. Acceptable Use</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            You agree to use JobTrack only for lawful purposes and in a manner consistent with its intended use as a personal job search management tool. You must not:
          </p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm leading-relaxed pl-2">
            <li>Use the service to store or transmit unlawful, harmful, or infringing content</li>
            <li>Attempt to gain unauthorized access to the service or its infrastructure</li>
            <li>Reverse engineer, decompile, or attempt to extract the source code of the service</li>
            <li>Use automated means to access or scrape the service without our written permission</li>
            <li>Use the service in a way that could damage, disable, or impair its availability</li>
            <li>Resell, sublicense, or otherwise commercialize access to the service without permission</li>
          </ul>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">5. Privacy</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Your use of JobTrack is also governed by our <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>, which is incorporated into these Terms of Service by reference. The Privacy Policy explains how we collect, use, and protect your personal information. By using the service, you consent to the data practices described in the Privacy Policy.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">6. Intellectual Property</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            The JobTrack service, including its design, code, and content, is owned by JobTrack and protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the service for your personal job search management.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Content you enter into JobTrack — such as your job application data and uploaded documents — remains yours. By storing this content in the service, you grant us a limited license to process and store it solely for the purpose of providing the service to you.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">7. Disclaimers</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            JobTrack is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            We do not guarantee that using JobTrack will result in job offers, interviews, or any particular career outcome. The service is a tool to help you organize your job search; success depends on many factors entirely outside our control.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            We do not warrant that the service will be uninterrupted, error-free, or free of viruses or other harmful components. We are not responsible for the accuracy of any data you enter or for decisions you make based on that data.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">8. Limitation of Liability</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            To the maximum extent permitted by applicable law, JobTrack and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, or loss of business opportunities, arising from your use of or inability to use the service.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Our total liability to you for any claims arising from these terms or your use of the service shall not exceed the amount you have paid us in the twelve months preceding the claim, or €10, whichever is greater.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">9. Changes to Terms</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            We may update these Terms of Service from time to time. When we do, we will revise the "Last updated" date at the top of this page. For significant changes, we will make reasonable efforts to notify you — for example, by email or via a notice in the application. Your continued use of JobTrack after changes are posted constitutes acceptance of the revised terms.
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">10. Contact</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            If you have questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:pavlovicinq@gmail.com" className="text-accent hover:underline">pavlovicinq@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
