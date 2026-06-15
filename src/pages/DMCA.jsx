import { LegalPage } from '@/components/legal/LegalPage';
import { LEGAL } from '@/config/legal';

/**
 * DMCA / copyright-policy page.
 *
 * Template notice-and-takedown procedure. The designated-agent details and
 * process should be confirmed with counsel; in the US, formal DMCA safe-harbor
 * protection also requires registering an agent with the U.S. Copyright Office.
 */
export default function DMCA() {
  return (
    <LegalPage
      title='DMCA Policy'
      lastUpdated={LEGAL.effectiveDateLabel}
      intro={`${LEGAL.entity} respects the intellectual property rights of others and expects its users to do the same. This page explains how to submit a copyright infringement notice.`}
    >
      <h2>1. Our Role</h2>
      <p>
        {LEGAL.entity} is a discovery and indexing service. We do not host,
        upload, or store any video or audio files; such content resides on
        third-party servers that we do not control. Where a valid notice
        concerns material that is within our control (for example, a link,
        embed, or metadata entry on our Service), we will act expeditiously to
        remove or disable access to it.
      </p>
      <p>
        Because the underlying media files are hosted by third parties, the most
        effective remedy is usually to contact the hosting provider directly. We
        are glad to assist by removing the corresponding reference from our
        index.
      </p>

      <h2>2. Filing a Copyright Infringement Notice</h2>
      <p>
        If you are a copyright owner (or authorized to act on behalf of one) and
        believe material accessible through the Service infringes your
        copyright, please send a written notice to our designated agent that
        includes all of the following:
      </p>
      <ol>
        <li>
          A physical or electronic signature of the copyright owner or a person
          authorized to act on their behalf;
        </li>
        <li>
          Identification of the copyrighted work claimed to have been infringed
          (or, if multiple works, a representative list);
        </li>
        <li>
          Identification of the material that is claimed to be infringing,
          including the specific URL(s) on our Service, with enough detail to
          let us locate it;
        </li>
        <li>
          Your contact information, including your full name, mailing address,
          telephone number, and email address;
        </li>
        <li>
          A statement that you have a good-faith belief that the use of the
          material is not authorized by the copyright owner, its agent, or the
          law; and
        </li>
        <li>
          A statement that the information in the notice is accurate, and under
          penalty of perjury, that you are the copyright owner or authorized to
          act on the owner&rsquo;s behalf.
        </li>
      </ol>

      <h2>3. Where to Send Your Notice</h2>
      <p>
        Send your complete notice to our designated copyright agent at{' '}
        <a href={`mailto:${LEGAL.dmcaEmail}`}>{LEGAL.dmcaEmail}</a>. Please use
        the subject line &ldquo;DMCA Takedown Request&rdquo; so we can act on it
        promptly.
      </p>

      <h2>4. Counter-Notification</h2>
      <p>
        If you believe material you submitted was removed or disabled by mistake
        or misidentification, you may send a counter-notification to the same
        address that includes:
      </p>
      <ol>
        <li>your physical or electronic signature;</li>
        <li>
          identification of the material that was removed and the location where
          it appeared before removal;
        </li>
        <li>
          a statement under penalty of perjury that you have a good-faith belief
          the material was removed as a result of mistake or misidentification;
          and
        </li>
        <li>
          your name, address, and telephone number, and a statement that you
          consent to the jurisdiction of the appropriate court and will accept
          service of process from the party who filed the original notice.
        </li>
      </ol>

      <h2>5. Repeat Infringers</h2>
      <p>
        In appropriate circumstances and at our discretion, we will limit access
        to the Service and/or remove references submitted by parties who are
        determined to be repeat infringers.
      </p>

      <h2>6. Contact</h2>
      <p>
        Copyright-related enquiries may be directed to{' '}
        <a href={`mailto:${LEGAL.dmcaEmail}`}>{LEGAL.dmcaEmail}</a>. For all
        other matters, see our <a href='/contact'>Contact</a> page.
      </p>
    </LegalPage>
  );
}
