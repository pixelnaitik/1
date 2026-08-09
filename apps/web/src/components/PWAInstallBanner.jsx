import React, { useState, useEffect } from 'react';

export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let autoDismissTimer;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);

      // Auto-disappear banner after 5 seconds (5000ms)
      autoDismissTimer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (autoDismissTimer) clearTimeout(autoDismissTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA Install] User choice outcome:', outcome);
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 z-50 max-w-md bg-primary text-on-primary p-4 rounded-2xl shadow-2xl border border-secondary/40 flex items-center justify-between gap-3 transition-all duration-500 animate-fade-in">
      <div className="flex items-center gap-3">
        {/* Updated Favicon Icon from favicon_io */}
        <img 
          src="/icon-192.png" 
          alt="SecureVoyage Icon" 
          className="w-10 h-10 rounded-xl shrink-0 shadow-sm border border-secondary/40 object-cover" 
        />
        <div>
          <h4 className="text-xs font-bold text-white">Install SecureVoyage App</h4>
          <p className="text-[11px] text-slate-300">Add to Home Screen for offline emergency SOS access.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-secondary hover:bg-secondary/90 text-on-secondary px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Install
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
};
