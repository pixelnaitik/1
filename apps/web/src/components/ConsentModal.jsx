import React from 'react';
import { ShieldCheck, MapPin, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ConsentModal = ({ isOpen, onClose }) => {
  const { grantLocationConsent, revokeLocationConsent } = useAuth();

  if (!isOpen) return null;

  const handleGrant = () => {
    grantLocationConsent();
    if (onClose) onClose();
  };

  const handleDecline = () => {
    revokeLocationConsent();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 text-sky-600 mb-4 mx-auto">
          <MapPin className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
          Enable Location Safety Assistance
        </h3>
        
        <p className="text-slate-600 text-sm text-center mb-6 leading-relaxed">
          SecureVoyage needs explicit permission to access your location to calculate real-time safety scores, highlight nearby verified hospitals & police, and enable live SOS tracking.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-start gap-3 text-xs text-slate-700">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Privacy First:</strong> Routine GPS coordinates remain in-memory and are never permanently stored.</span>
          </div>
          <div className="flex items-start gap-3 text-xs text-slate-700">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span><strong>Time-Boxed SOS:</strong> Precise location sharing only activates during an active emergency SOS.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGrant}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Grant Location Consent (Tap to Continue)
          </button>
          
          <button
            onClick={handleDecline}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors"
          >
            Select Pilot City Manually Instead
          </button>
        </div>
      </div>
    </div>
  );
};
