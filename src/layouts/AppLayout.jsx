import nprogress from 'nprogress';
import { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router';

import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

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
      <Header />
      <main className='flex-1 pb-16 lg:pb-0'>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
