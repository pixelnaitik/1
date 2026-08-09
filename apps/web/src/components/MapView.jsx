import React from 'react';
import { MapPin, Navigation, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MapView = () => {
  const { currentLocation, locationConsent } = useAuth();

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between p-6">
      {/* Background Interactive Vector Canvas Mockup */}
      <div 
        className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"
        style={{
          backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.25) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Map Header Status Overlay */}
      <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/80 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-white">
            {currentLocation.city}
          </span>
        </div>
        <span className="text-xs px-2.5 py-1 bg-slate-800 text-sky-400 font-mono rounded-md border border-slate-700">
          {currentLocation.latitude.toFixed(4)}°N, {currentLocation.longitude.toFixed(4)}°E
        </span>
      </div>

      {/* Central User Location Marker */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-sky-500/20 animate-ping" />
          <div className="relative w-12 h-12 rounded-full bg-sky-600 border-4 border-white shadow-2xl flex items-center justify-center text-white">
            <Navigation className="w-6 h-6 fill-current transform rotate-45" />
          </div>
        </div>
        
        <div className="mt-3 px-3 py-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg text-center shadow-lg">
          <p className="text-xs font-semibold text-white">Current Location</p>
          <p className="text-[10px] text-slate-400">GPS Accuracy: ±15 meters</p>
        </div>
      </div>

      {/* Map Bottom Safety Factors Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Street Lighting</p>
            <p className="text-xs font-bold text-white">Optimal (88%)</p>
          </div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Crowd Density</p>
            <p className="text-xs font-bold text-white">Moderate Context</p>
          </div>
        </div>

        <div className="hidden sm:flex bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Nearby Police</p>
            <p className="text-xs font-bold text-white">800m Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};
