import { useEffect, useState } from 'react';

import { ThemeProviderContext } from '@/hooks/use-theme';

// Theme tokens used to recolor the brand favicon — same CSS variables that
// Tailwind's `text-primary` / `text-foreground` resolve to (no hardcoded hex).
const FAVICON_TOKENS = { light: '--primary', dark: '--primary' };

function updateFavicon(resolvedTheme) {
  // Read the live token value after the theme class is applied to <html>.
  const fill = getComputedStyle(document.documentElement)
    .getPropertyValue(FAVICON_TOKENS[resolvedTheme])
    .trim();
  const svg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 0C27.4768 0 31.2154 -0.000204921 34 1.60742C35.8242 2.66064 37.3394 4.17577 38.3926 6C40.0002 8.7846 40 12.5232 40 20C40 27.4768 40.0002 31.2154 38.3926 34C37.3394 35.8242 35.8242 37.3394 34 38.3926C31.2154 40.0002 27.4768 40 20 40C12.5232 40 8.7846 40.0002 6 38.3926C4.17577 37.3394 2.66064 35.8242 1.60742 34C-0.000204921 31.2154 0 27.4768 0 20C0 12.5232 -0.000204921 8.7846 1.60742 6C2.66064 4.17577 4.17577 2.66064 6 1.60742C8.7846 -0.000204921 12.5232 0 20 0ZM22 4C13.1634 4 6 11.1634 6 20C6 28.8366 13.1634 36 22 36C30.8366 36 38 28.8366 38 20C38 11.1634 30.8366 4 22 4Z" fill="${fill}"/><path d="M36 20C36 25.5228 31.5228 30 26 30C20.4772 30 16 25.5228 16 20C16 14.4772 20.4772 10 26 10C31.5228 10 36 14.4772 36 20Z" fill="${fill}"/></svg>`;
  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'lumos-tv-ui-theme',
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const resolved =
        theme === 'system' ? (mql.matches ? 'dark' : 'light') : theme;

      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      updateFavicon(resolved);
    };

    apply();

    // In "system" mode, follow live OS theme changes.
    if (theme === 'system') {
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
