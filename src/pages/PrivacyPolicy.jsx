import { LegalPage } from '@/components/legal/LegalPage';
import { LEGAL } from '@/config/legal';

/**
 * Privacy Policy page.
 *
 * Template content describing the data practices of a client-side streaming
 * guide (no accounts, no first-party server storage; third-party ads + APIs).
 * Review with counsel and adjust to your actual stack before publishing.
 */
export default function PrivacyPolicy() {
  return (
    <LegalPage
      title='Privacy Policy'
      lastUpdated={LEGAL.effectiveDateLabel}
      intro={`This Privacy Policy explains how ${LEGAL.entity} ("we", "us", or "our") handles information when you use our website and application (the "Service").`}
    >
      <h2>1. Overview</h2>
      <p>
        {LEGAL.entity} is a content-discovery service that helps you find
        movies, TV shows, and live TV channels using metadata from third-party
        sources. We do not require you to create an account, and we do not ask
        for or store personal information such as your name, address, or payment
        details on our own servers.
      </p>

      <h2>2. Information We Collect</h2>
      <h3>2.1 Information you provide</h3>
      <p>
        The Service has no sign-up or login. The only information you actively
        provide is anything you choose to send us directly — for example, when
        you email us through our <a href='/contact'>Contact</a> page. We use
        that information solely to respond to you.
      </p>
      <h3>2.2 Information stored on your device</h3>
      <p>
        We use your browser&rsquo;s local storage to remember preferences such
        as your selected theme (light or dark) and whether you have dismissed
        the &ldquo;install app&rdquo; prompt. This data stays on your device,
        is not transmitted to us, and can be cleared at any time through your
        browser settings.
      </p>
      <h3>2.3 Information collected automatically</h3>
      <p>
        Like most websites, our hosting provider and the third-party services
        below may automatically receive standard technical data — such as your
        IP address, browser type, device information, and pages visited — for
        security, delivery, and analytics purposes.
      </p>

      <h2>3. Cookies and Advertising</h2>
      <p>
        We display advertising through <strong>Google AdSense</strong>. Google
        and its partners use cookies and similar technologies to serve ads
        based on your prior visits to this and other websites.
      </p>
      <ul>
        <li>
          Google&rsquo;s use of advertising cookies enables it and its partners
          to serve ads to you based on your visit to our Service and/or other
          sites on the internet.
        </li>
        <li>
          You may opt out of personalized advertising by visiting{' '}
          <a
            href='https://www.google.com/settings/ads'
            target='_blank'
            rel='noopener noreferrer'
          >
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          You can learn more about how Google uses data at{' '}
          <a
            href='https://policies.google.com/technologies/partner-sites'
            target='_blank'
            rel='noopener noreferrer'
          >
            How Google uses information from sites or apps that use our services
          </a>
          .
        </li>
        <li>
          For additional opt-out options, visit{' '}
          <a
            href='https://www.aboutads.info'
            target='_blank'
            rel='noopener noreferrer'
          >
            aboutads.info
          </a>
          .
        </li>
      </ul>

      <h2>4. Third-Party Services</h2>
      <p>
        The Service relies on third parties that have their own privacy
        policies. We encourage you to review them:
      </p>
      <ul>
        <li>
          <strong>The Movie Database (TMDB)</strong> &mdash; provides movie and
          TV metadata and images.
        </li>
        <li>
          <strong>IPTV-org</strong> &mdash; provides public live TV channel
          data.
        </li>
        <li>
          <strong>Google AdSense</strong> &mdash; provides advertising.
        </li>
        <li>
          <strong>Embedded media players</strong> &mdash; when you play
          content, a third-party player may load in a frame and set its own
          cookies. We do not control these providers or their data practices.
        </li>
      </ul>

      <h2>5. How We Use Information</h2>
      <p>We use the limited information described above to:</p>
      <ul>
        <li>operate, maintain, and improve the Service;</li>
        <li>remember your preferences;</li>
        <li>display relevant advertising; and</li>
        <li>respond to your enquiries.</li>
      </ul>

      <h2>6. Your Rights and Choices</h2>
      <p>
        Depending on your location, you may have rights under laws such as the
        GDPR or CCPA, including the right to access, correct, or delete personal
        data and to object to certain processing. Because we do not maintain
        first-party accounts or store personal data on our servers, most of
        your control is exercised directly through your browser (clearing cookies
        and local storage) and the advertising opt-outs above. To make a request
        or ask a question, contact us at{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
      </p>

      <h2>7. Children&rsquo;s Privacy</h2>
      <p>
        The Service is not directed to children under the age of 13 (or the
        minimum age required in your jurisdiction), and we do not knowingly
        collect personal information from them. If you believe a child has
        provided us with personal information, please contact us so we can
        remove it.
      </p>

      <h2>8. Data Security</h2>
      <p>
        We take reasonable measures to protect the Service, but no method of
        transmission over the internet or electronic storage is completely
        secure, and we cannot guarantee absolute security.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes are
        effective when posted on this page, and the &ldquo;Last updated&rdquo;
        date above will reflect the most recent revision.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, contact us at{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> or
        through our <a href='/contact'>Contact</a> page.
      </p>
    </LegalPage>
  );
}
