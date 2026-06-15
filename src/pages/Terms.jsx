import { LegalPage } from '@/components/legal/LegalPage';
import { LEGAL } from '@/config/legal';

/**
 * Terms of Service page.
 *
 * Template content for a third-party content-discovery service. Review with
 * counsel before publishing — particularly the liability, indemnity, and
 * governing-law sections.
 */
export default function Terms() {
  return (
    <LegalPage
      title='Terms of Service'
      lastUpdated={LEGAL.effectiveDateLabel}
      intro={`These Terms of Service ("Terms") govern your access to and use of ${LEGAL.entity} (the "Service"). By using the Service, you agree to these Terms.`}
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the Service, you confirm that you have read,
        understood, and agree to be bound by these Terms and our{' '}
        <a href='/privacy'>Privacy Policy</a>. If you do not agree, please do
        not use the Service.
      </p>

      <h2>2. Description of the Service</h2>
      <p>
        {LEGAL.entity} is a search and discovery interface for movies, TV shows,
        and live TV. It aggregates publicly available metadata (titles, artwork,
        descriptions, ratings, and similar information) from third-party sources
        and may link to or embed media players operated by independent third
        parties.
      </p>
      <p>
        <strong>
          {LEGAL.entity} does not host, upload, store, or distribute any video
          or audio files.
        </strong>{' '}
        All media that may be played through the Service is located on, and
        delivered by, third-party servers over which we have no control.
      </p>

      <h2>3. Third-Party Content and Links</h2>
      <p>
        The Service contains links to and embeds from third-party websites and
        services. We do not own, operate, control, endorse, or assume
        responsibility for any third-party content, and the inclusion of any
        link or embed does not imply our endorsement. Your use of third-party
        services is at your own risk and is governed by their terms and
        policies. Please see our <a href='/disclaimer'>Disclaimer</a> for more
        detail.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        All trademarks, service marks, logos, artwork, and content accessible
        through the Service are the property of their respective owners. Movie
        and TV metadata and images are provided by The Movie Database (TMDB) and
        are subject to TMDB&rsquo;s terms; the Service is not endorsed or
        certified by TMDB. Our own name, logo, and original interface elements
        are the property of {LEGAL.entity}.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the Service for any unlawful purpose or in violation of any applicable law;</li>
        <li>
          infringe the intellectual property or other rights of any party
          through your use of the Service;
        </li>
        <li>
          attempt to gain unauthorized access to, interfere with, or disrupt the
          Service or its underlying systems;
        </li>
        <li>
          use automated means (bots, scrapers, crawlers) to access the Service
          except as permitted by our <a href='/'>robots</a> rules; or
        </li>
        <li>
          remove, obscure, or circumvent any notices, security features, or
          access controls.
        </li>
      </ul>

      <h2>6. Disclaimer of Warranties</h2>
      <p>
        The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; basis without warranties of any kind, whether express
        or implied, including but not limited to warranties of merchantability,
        fitness for a particular purpose, non-infringement, accuracy, or
        availability. We do not warrant that the Service will be uninterrupted,
        error-free, or free of harmful components.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, {LEGAL.entity} and its operators
        shall not be liable for any indirect, incidental, special, consequential,
        or punitive damages, or any loss of data, revenue, or profits, arising
        out of or related to your use of (or inability to use) the Service or any
        third-party content accessed through it.
      </p>

      <h2>8. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless {LEGAL.entity} and its operators
        from any claims, liabilities, damages, and expenses (including reasonable
        legal fees) arising out of your use of the Service or your violation of
        these Terms.
      </p>

      <h2>9. Copyright Complaints</h2>
      <p>
        We respect intellectual property rights. If you believe content
        accessible through the Service infringes your copyright, please follow
        the procedure described in our <a href='/dmca'>DMCA Policy</a>.
      </p>

      <h2>10. Termination</h2>
      <p>
        We may suspend or discontinue the Service, in whole or in part, at any
        time and without notice. We may also restrict your access if you violate
        these Terms.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of {LEGAL.jurisdiction}, without
        regard to its conflict-of-laws principles. Any disputes shall be subject
        to the exclusive jurisdiction of the courts located in{' '}
        {LEGAL.jurisdiction}.
      </p>

      <h2>12. Changes to These Terms</h2>
      <p>
        We may revise these Terms from time to time. The updated version is
        effective when posted on this page, and your continued use of the Service
        constitutes acceptance of the revised Terms.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        Questions about these Terms can be sent to{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> or via
        our <a href='/contact'>Contact</a> page.
      </p>
    </LegalPage>
  );
}
