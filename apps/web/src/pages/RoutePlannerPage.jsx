import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { SafetyMap } from '../components/SafetyMap';

export const RoutePlannerPage = () => {
  const [activeRoute, setActiveRoute] = useState('safety'); // 'safety' | 'fastest'
  const [destination, setDestination] = useState('KIIT Square, Patia, Bhubaneswar');

  const routeMarkers = [
    {
      lat: 20.2961,
      lng: 85.8245,
      title: 'Origin: Master Canteen',
      snippet: 'Starting location',
      color: '#0f172a'
    },
    {
      lat: 20.3540,
      lng: 85.8170,
      title: 'Destination: KIIT Square',
      snippet: 'Selected route end point',
      color: '#006c49'
    }
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row font-sans">
      <Sidebar activeTab="/routes" />

      <main className="flex-1 flex flex-col lg:ml-72 mt-16 lg:mt-0 relative h-[calc(100vh-64px)] lg:h-screen overflow-hidden">
        
        {/* Interactive Bhubaneswar Map */}
        <div className="absolute inset-0 z-0 bg-surface-variant">
          <SafetyMap
            center={[20.3250, 85.8220]}
            zoom={13}
            markers={routeMarkers}
            showCorridor={false}
          />
        </div>

        {/* Floating Input Overlay */}
        <div className="absolute top-4 left-4 right-4 lg:w-96 z-10">
          <div className="bg-surface rounded-2xl shadow-lg border border-outline-variant/60 p-3 flex flex-col gap-2.5">
            <div className="flex items-center gap-3 px-2 py-1">
              <span className="material-symbols-outlined text-secondary text-xl">my_location</span>
              <input 
                className="flex-1 bg-transparent border-none text-xs font-semibold text-on-surface focus:outline-none" 
                readOnly 
                value="Master Canteen, Bhubaneswar" 
              />
            </div>
            <div className="h-px bg-outline-variant/40 mx-2"></div>
            <div className="flex items-center gap-3 px-2 py-1">
              <span className="material-symbols-outlined text-primary text-xl">location_on</span>
              <input 
                className="flex-1 bg-transparent border-none text-xs font-bold text-on-surface focus:outline-none" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination in Bhubaneswar..." 
              />
            </div>
          </div>
        </div>

        {/* Route Comparison Panel */}
        <div className="absolute bottom-0 left-0 w-full lg:w-96 lg:left-auto lg:right-0 lg:h-full lg:top-0 z-20 flex flex-col pointer-events-none">
          <div className="mt-auto lg:mt-0 flex-1 bg-surface/95 backdrop-blur-md rounded-t-2xl lg:rounded-none lg:border-l border-t lg:border-t-0 border-outline-variant pointer-events-auto flex flex-col overflow-hidden shadow-2xl">
            
            {/* Panel Header */}
            <div className="p-6 pb-3 border-b border-outline-variant/60 bg-surface shrink-0">
              <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-3 lg:hidden"></div>
              <h2 className="text-lg font-extrabold text-primary mb-1">Bhubaneswar Route Options</h2>
              <p className="text-xs text-on-surface-variant">Comparing Janpath Smart Corridor vs. Bypass.</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Safety-Prioritized Route Card */}
              <div 
                onClick={() => setActiveRoute('safety')}
                className={`border rounded-2xl p-4 shadow-xs cursor-pointer relative overflow-hidden transition-all ${
                  activeRoute === 'safety' ? 'bg-surface border-secondary ring-1 ring-secondary' : 'bg-surface/60 border-outline-variant hover:bg-surface'
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-primary">Janpath Safety Route</h3>
                    <p className="text-xs text-on-surface-variant font-medium">22 min • 11.2 km</p>
                  </div>
                  <div className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-sm">shield</span>
                    <span className="text-xs font-bold">92</span>
                  </div>
                </div>
                <p className="text-xs text-outline leading-relaxed mt-2">
                  Fully lit Smart City corridor, active PCR patrols, continuous CCTV coverage.
                </p>
              </div>

              {/* Fastest Route Card */}
              <div 
                onClick={() => setActiveRoute('fastest')}
                className={`border rounded-2xl p-4 cursor-pointer transition-all ${
                  activeRoute === 'fastest' ? 'bg-surface border-amber-500 ring-1 ring-amber-500' : 'bg-surface/60 border-outline-variant hover:bg-surface'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-primary">Cuttack-Puri Bypass</h3>
                    <p className="text-xs text-on-surface-variant font-medium">16 min • 13.5 km</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span className="text-xs font-bold">61</span>
                  </div>
                </div>
                <p className="text-xs text-outline leading-relaxed mt-2">
                  Highway route with higher speed traffic and lower pedestrian density.
                </p>
              </div>

              {/* Safety Advisories List */}
              <div className="pt-2">
                <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Advisories (Selected Route)
                </h4>
                <div className="bg-error-container/20 border border-error-container/60 rounded-xl p-3.5 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-error text-lg mt-0.5">nightlight</span>
                  <div>
                    <div className="text-xs font-bold text-primary">Lighting Precaution</div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5 leading-normal">
                      Slight dimming along Acharya Vihar underpass after 10 PM. Stick to main Janpath carriageway.
                    </div>
                  </div>
                </div>
              </div>

              {/* Turn-by-Turn Highlights */}
              <div className="pt-2">
                <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                  Route Highlights
                </h4>
                <div className="space-y-4 border-l-2 border-outline-variant ml-3 pl-4 relative">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface"></div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="material-symbols-outlined text-outline text-sm">turn_right</span>
                      <span className="text-xs font-bold text-primary">Proceed on Janpath via Vani Vihar</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary text-[11px] font-semibold">
                      <span className="material-symbols-outlined text-xs">videocam</span> Smart City CCTV Monitored
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-surface"></div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="material-symbols-outlined text-outline text-sm">location_on</span>
                      <span className="text-xs font-bold text-primary">Arrive at {destination}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-surface border-t border-outline-variant/60 shrink-0">
              <button className="w-full bg-secondary text-on-secondary py-3.5 rounded-xl font-bold text-xs hover:opacity-90 transition-all flex justify-center items-center gap-2 shadow-md">
                <span className="material-symbols-outlined text-lg">navigation</span>
                Start Safe Navigation
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};
