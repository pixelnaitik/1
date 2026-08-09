import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export const SOSPage = () => {
  const { user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isHolding, setIsHolding] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [timer, setTimer] = useState(null);

  const startSosCount = () => {
    setSosActive(true);
    let count = 5;
    const interval = setInterval(() => {
      count--;
      setSecondsLeft(count);
      if (count <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    setTimer(interval);
  };

  const cancelSos = () => {
    if (timer) clearInterval(timer);
    setSosActive(false);
    setSecondsLeft(5);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row font-sans">
      <Sidebar activeTab="/sos" />

      <main className="flex-1 lg:ml-72 mt-16 lg:mt-0 p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] gap-8">
          
          {/* Header */}
          <div className="text-center max-w-lg">
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight mb-2">
              SOS Emergency & Live Tracking
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant">
              Deliberate emergency trigger with time-boxed location broadcast to your trusted contacts.
            </p>
          </div>

          {/* Central SOS Interaction Button */}
          <div className="flex flex-col items-center justify-center text-center relative w-full max-w-md">
            <div 
              onClick={startSosCount}
              className={`relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center cursor-pointer rounded-full bg-error-container/30 border border-error/30 shadow-[0_0_50px_rgba(186,26,26,0.2)] hover:shadow-[0_0_70px_rgba(186,26,26,0.35)] transition-all duration-300 ${sosActive ? 'scale-105' : ''}`}
            >
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 220 220">
                <circle className="text-error-container stroke-current" cx="110" cy="110" fill="none" r="100" strokeWidth="8"></circle>
                <circle className={`text-error stroke-current transition-all duration-500 ${sosActive ? 'stroke-dasharray-none' : ''}`} cx="110" cy="110" fill="none" r="100" strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              
              <div className="z-10 flex flex-col items-center justify-center p-6 rounded-full bg-error text-on-error w-48 h-48 md:w-60 md:h-60 shadow-2xl">
                <span className="material-symbols-outlined text-6xl mb-1">sos</span>
                <span className="text-lg md:text-xl font-bold uppercase tracking-widest">
                  {sosActive ? `CANCEL (${secondsLeft}s)` : 'Tap to Activate'}
                </span>
                <span className="text-xs opacity-90 mt-1">
                  {sosActive ? 'Broadcast Initiated' : 'Deliberate SOS Action'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Tracking Status Card */}
          <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/60">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl animate-pulse">my_location</span>
                <h2 className="text-base font-bold text-on-surface">Live Tracking Status</h2>
              </div>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                {sosActive ? 'EMERGENCY SOS ACTIVE' : 'Standby Ready'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-surface-container p-3.5 rounded-xl">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Session Status</p>
                <p className="text-xs font-bold text-on-surface">{sosActive ? 'Broadcasting Location' : 'Inactive'}</p>
              </div>
              <div className="bg-surface-container p-3.5 rounded-xl">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Expires In</p>
                <p className="text-xs font-bold text-error">60m 00s Session</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-surface-bright p-3.5 rounded-xl border border-outline-variant/60 text-xs text-on-surface">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">group</span>
              <span><strong>3 Emergency Contacts</strong> will receive location SMS alerts upon confirmation.</span>
            </div>
          </div>

          {/* Emergency 112 Fallback & Actions */}
          <div className="w-full max-w-lg flex flex-col gap-3">
            <a 
              href="tel:112"
              className="w-full bg-error text-on-error py-4 rounded-xl font-bold text-sm hover:bg-error/90 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">call</span>
              Call Official 112 Emergency
            </a>

            {sosActive && (
              <button
                onClick={cancelSos}
                className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface py-3 rounded-xl font-bold text-xs border border-outline-variant transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">close</span>
                Cancel Active SOS Broadcast
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};
