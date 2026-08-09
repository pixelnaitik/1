import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ConsentModal } from '../components/ConsentModal';
import { Sidebar } from '../components/Sidebar';
import { SafetyMap } from '../components/SafetyMap';

export const DashboardPage = () => {
  const { user, locationConsent } = useAuth();
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    if (!locationConsent) {
      setShowConsentModal(true);
    }
  }, [locationConsent]);

  const bhubaneswarMarkers = [
    {
      lat: 20.2745,
      lng: 85.8260,
      title: 'Capital Hospital Bhubaneswar',
      snippet: '24/7 Emergency Medical Response',
      color: '#006c49'
    },
    {
      lat: 20.3540,
      lng: 85.8170,
      title: 'KIMS Hospital Patia',
      snippet: 'Level 1 Trauma Care Center',
      color: '#006c49'
    },
    {
      lat: 20.2850,
      lng: 85.8340,
      title: 'Bhubaneswar Capital Police HQ',
      snippet: 'Urban Police Response Command',
      color: '#0f172a'
    }
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row font-sans">
      <ConsentModal isOpen={showConsentModal} onClose={() => setShowConsentModal(false)} />
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab="/dashboard" />

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-72 mt-16 lg:mt-0 p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col gap-6">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">Safety Dashboard</h1>
              <p className="text-sm text-on-surface-variant mt-1">Real-time situational awareness and risk assessment in Bhubaneswar.</p>
            </div>

            <a
              href="tel:112"
              className="inline-flex items-center gap-2 bg-error text-on-error px-4 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-error/90 transition-all"
            >
              <span className="material-symbols-outlined text-base">phone_in_talk</span>
              Call Emergency 112
            </a>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Risk Gauge Card */}
            <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
              <h2 className="text-base font-bold text-on-surface mb-6 w-full text-left">Current Risk Score</h2>
              
              {/* Circular Meter */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="45" stroke="#e0e3e5" strokeWidth="10"></circle>
                  <circle className="transition-all duration-1000 ease-out" cx="50" cy="50" fill="none" r="45" stroke="#006c49" strokeDasharray="283" strokeDashoffset="45" strokeWidth="10"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-secondary">84<span className="text-lg text-on-surface-variant">/100</span></span>
                  <span className="text-xs font-bold text-secondary tracking-wider mt-1 uppercase">SAFE ZONE</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs font-semibold text-on-surface-variant flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                  High Confidence (89%)
                </p>
                <p className="text-xs text-outline mt-1">• Data Freshness: 2 mins ago</p>
              </div>
            </div>

            {/* Factors Breakdown Card */}
            <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm col-span-1 lg:col-span-2 flex flex-col">
              <h2 className="text-base font-bold text-on-surface mb-2">Positive Environmental Factors (Bhubaneswar)</h2>
              <p className="text-xs text-on-surface-variant mb-6">Key elements contributing to the current high safety score in your immediate vicinity.</p>
              
              <div className="flex flex-wrap gap-2.5 mt-auto">
                <div className="bg-surface-container text-on-surface px-3.5 py-2 rounded-full border border-surface-variant flex items-center gap-2 text-xs font-semibold">
                  <span className="material-symbols-outlined text-secondary text-base">lightbulb</span>
                  <span>Lit Janpath Streets (+35%)</span>
                </div>
                
                <div className="bg-surface-container text-on-surface px-3.5 py-2 rounded-full border border-surface-variant flex items-center gap-2 text-xs font-semibold">
                  <span className="material-symbols-outlined text-secondary text-base">local_hospital</span>
                  <span>Capital Hospital 400m (+25%)</span>
                </div>
                
                <div className="bg-surface-container text-on-surface px-3.5 py-2 rounded-full border border-surface-variant flex items-center gap-2 text-xs font-semibold">
                  <span className="material-symbols-outlined text-secondary text-base">policy</span>
                  <span>Low Crime Zone (+24%)</span>
                </div>
                
                <div className="bg-surface-container text-on-surface px-3.5 py-2 rounded-full border border-surface-variant flex items-center gap-2 text-xs font-semibold">
                  <span className="material-symbols-outlined text-secondary text-base">groups</span>
                  <span>High Foot Traffic (+10%)</span>
                </div>
              </div>

              <div className="mt-6 bg-surface-bright p-4 rounded-xl border border-outline-variant/60 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
                <div>
                  <span className="text-xs font-bold text-on-surface block mb-0.5">Contextual Insight</span>
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    The Smart City surveillance corridor along Janpath and Patia, combined with 24/7 Capital Hospital proximity, maintains high safety baseline scores across Bhubaneswar sectors.
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Live Safety Map Section (Bhubaneswar) */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl p-4 shadow-sm h-[520px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-3 px-2 z-10 relative bg-surface-container-lowest rounded-xl">
              <h2 className="text-base font-bold text-on-surface">Live Safety Map</h2>
              <span className="text-xs px-3 py-1 bg-surface border border-outline-variant rounded-lg font-semibold text-on-surface-variant">
                Pilot Corridor: Janpath, Bhubaneswar
              </span>
            </div>

            {/* Interactive Component */}
            <div className="flex-1 rounded-xl relative overflow-hidden">
              <SafetyMap
                center={[20.2961, 85.8245]}
                zoom={13}
                showCorridor={false}
                markers={bhubaneswarMarkers}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
