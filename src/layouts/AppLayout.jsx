import nprogress from 'nprogress';
import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useNavigation } from 'react-router';

import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { RouteSEO } from '@/components/seo/RouteSEO';

export default function AppLayout() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'loading') {
      nprogress.start();
    } else {
      nprogress.done();
    }
  }, [navigation.state]);

  return (
    <div className='relative flex min-h-screen flex-col overflow-x-clip'>
      {/* Title, description, canonical, OG/Twitter tags for static routes;
          dynamic pages (/:type/:id, 404) render their own <SEO />. */}
      <RouteSEO />
      <Header />
      <main className='flex-1 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:pb-0'>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <ScrollRestoration getKey={(location) => location.pathname} />
    </div>
  );
}
