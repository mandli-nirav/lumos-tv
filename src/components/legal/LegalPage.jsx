import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

/**
 * Shared layout shell for legal/informational pages (Privacy, Terms, DMCA,
 * Disclaimer, Contact).
 *
 * Renders a breadcrumb trail, a page header (visible H1 + last-updated line)
 * and a readable prose container that styles plain semantic children
 * (`h2`, `h3`, `p`, `ul`/`ol`, `a`, `strong`) — no @tailwindcss/typography
 * dependency required.
 *
 * Page meta (title/description/canonical/OG) is emitted by `RouteSEO` from the
 * `routeSeo` config, so this component intentionally does NOT render `<SEO />`
 * — keeping exactly one managed set of head tags per page.
 *
 * @param {Object} props
 * @param {string} props.title - Visible H1 and final breadcrumb label.
 * @param {string} [props.lastUpdated] - Human-readable "last updated" date.
 * @param {string} [props.intro] - Optional lead paragraph under the title.
 * @param {import('react').ReactNode} props.children - Prose content.
 */
export function LegalPage({ title, lastUpdated, intro, children }) {
  return (
    <div className='container mx-auto max-w-3xl px-4 pt-24 pb-16'>
      <Breadcrumbs
        className='mb-6'
        items={[{ label: 'Home', href: '/' }, { label: title }]}
      />

      <article>
        <header className='border-border/60 mb-8 border-b pb-6'>
          <h1 className='text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl'>
            {title}
          </h1>
          {lastUpdated && (
            <p className='text-muted-foreground mt-2 text-sm'>
              Last updated: {lastUpdated}
            </p>
          )}
          {intro && (
            <p className='text-muted-foreground mt-4 leading-relaxed'>{intro}</p>
          )}
        </header>

        {/* Prose styling: one margin-top per element type (no space-y, which
            would conflict with per-heading margins). */}
        <div
          className='text-muted-foreground text-sm leading-relaxed sm:text-base [&>*:first-child]:mt-0 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_li]:mt-1.5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:text-foreground/90 [&_strong]:font-semibold [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6'
        >
          {children}
        </div>
      </article>
    </div>
  );
}
