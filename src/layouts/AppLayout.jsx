import { Outlet } from 'react-router';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function AppLayout() {
  return (
    <div className='relative flex min-h-screen flex-col overflow-x-clip'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
