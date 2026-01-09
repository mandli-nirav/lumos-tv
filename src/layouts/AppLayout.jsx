import { Outlet } from 'react-router';

import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MediaDialog } from '@/components/media/MediaDialog';

export default function AppLayout() {
  return (
    <div className='relative flex min-h-screen flex-col overflow-x-clip'>
      <Header />
      <main className='flex-1 pb-16 lg:pb-0'>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <MediaDialog />
    </div>
  );
}
