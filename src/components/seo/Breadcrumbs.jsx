import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

import { breadcrumbSchema } from '@/lib/structuredData';
import { cn } from '@/lib/utils';

import { JsonLd } from './JsonLd';

/**
 * Breadcrumb trail with matching BreadcrumbList structured data.
 *
 * Internal links use real anchors so crawlers can follow the hierarchy;
 * the last item is the current page (no link, `aria-current`).
 *
 * @param {Object} props
 * @param {Array<{label: string, href?: string}>} props.items - Ordered trail, current page last.
 * @param {string} [props.className]
 */
export function Breadcrumbs({ items, className }) {
  if (!items?.length) return null;

  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label='Breadcrumb' className={cn('font-sans', className)}>
        <ol className='text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs font-semibold'>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${item.label}-${i}`} className='flex items-center gap-1.5'>
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className='text-foreground/80 line-clamp-1 max-w-60'
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className='hover:text-foreground transition-colors'
                  >
                    {item.label}
                  </Link>
                )}
                {!isLast && (
                  <ChevronRight aria-hidden className='h-3 w-3 opacity-50' />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
