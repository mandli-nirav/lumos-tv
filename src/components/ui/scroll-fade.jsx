'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

function ScrollFade({ className, fadeSize = 'w-12 sm:w-16', children }) {
  const viewportRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateFades = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateFades);
      ro.disconnect();
    };
  }, [updateFades]);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={viewportRef}
        className='hide-scrollbar overflow-x-auto'
      >
        {children}
      </div>

      <motion.div
        aria-hidden
        animate={{ opacity: canScrollLeft ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 z-10',
          'bg-gradient-to-r from-background to-transparent',
          fadeSize
        )}
      />
      <motion.div
        aria-hidden
        animate={{ opacity: canScrollRight ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 z-10',
          'bg-gradient-to-l from-background to-transparent',
          fadeSize
        )}
      />
    </div>
  );
}

export { ScrollFade };
