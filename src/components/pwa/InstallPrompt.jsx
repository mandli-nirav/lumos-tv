import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Initialize showPrompt based on localStorage check
  const [showPrompt, setShowPrompt] = useState(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      // Don't show if dismissed within the last 7 days
      return Date.now() - dismissedTime >= sevenDays;
    }
    // Show by default if never dismissed
    return false;
  });

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null);
    setShowPrompt(false);

    console.log(`User response to install prompt: ${outcome}`);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className='fixed right-4 bottom-20 left-4 z-50 md:right-4 md:left-auto md:w-96'>
      <div className='rounded-lg border border-white/10 bg-black/95 p-4 shadow-2xl backdrop-blur-md'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-2'>
            <Download className='h-5 w-5 text-white' />
          </div>
          <div className='flex-1'>
            <h3 className='font-bold text-white'>Install Lumos TV</h3>
            <p className='mt-1 text-sm text-white/60'>
              Install our app for a better experience with offline support and
              faster loading.
            </p>
            <div className='mt-3 flex gap-2'>
              <Button
                onClick={handleInstallClick}
                size='sm'
                className='flex-1 gap-2'
              >
                <Download className='h-4 w-4' />
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                size='sm'
                variant='ghost'
                className='text-white/60 hover:text-white'
              >
                Not now
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className='flex-shrink-0 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
