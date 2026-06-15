import { LegalPage } from '@/components/legal/LegalPage';
import { LEGAL } from '@/config/legal';

/**
 * Disclaimer page. Template content — review with counsel before publishing.
 */
export default function Disclaimer() {
  return (
    <LegalPage
      title='Disclaimer'
      lastUpdated={LEGAL.effectiveDateLabel}
      intro={`The information and functionality provided by ${LEGAL.entity} (the "Service") is for general informational and entertainment purposes only.`}
    >
      <h2>1. No Content Hosted</h2>
      <p>
        {LEGAL.entity} does not host, upload, store, or distribute any video or
        audio files. The Service indexes publicly available metadata and may
        link to or embed players operated by independent third parties. All such
        media is hosted on and delivered by third-party servers that we neither
        own nor control.
      </p>

      <h2>2. Third-Party Content and Links</h2>
      <p>
        The Service contains links to and embeds from external websites and
        services. We have no control over, and assume no responsibility for, the
        content, accuracy, legality, availability, or practices of any
        third-party service. The presence of a link or embed does not constitute
        an endorsement. You access third-party content entirely at your own risk
        and subject to those parties&rsquo; terms.
      </p>

      <h2>3. Accuracy of Information</h2>
      <p>
        Metadata such as titles, descriptions, ratings, release dates, and
        artwork is supplied by third parties and may be incomplete, outdated, or
        inaccurate. We make no warranty as to the accuracy or completeness of
        any information presented on the Service.
      </p>

      <h2>4. Advertising and Affiliate Disclosure</h2>
      <p>
        The Service displays third-party advertising (including Google AdSense)
        and may contain links to external platforms. We may receive
        compensation in connection with some advertising or referral links. Such
        advertising does not influence the metadata we display.
      </p>

      <h2>5. No Professional Advice</h2>
      <p>
        Nothing on the Service constitutes legal, financial, or other
        professional advice. You should not rely on the Service as a substitute
        for advice from a qualified professional.
      </p>

      <h2>6. Use at Your Own Risk</h2>
      <p>
        Your use of the Service is at your sole risk. To the fullest extent
        permitted by law, {LEGAL.entity} disclaims all liability for any loss or
        damage arising from your use of the Service or any third-party content
        accessed through it. Please also review our{' '}
        <a href='/terms'>Terms of Service</a>.
      </p>

      <h2>7. Contact</h2>
      <p>
        If you have questions about this Disclaimer, contact us at{' '}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> or via
        our <a href='/contact'>Contact</a> page.
      </p>
    </LegalPage>
  );
}
