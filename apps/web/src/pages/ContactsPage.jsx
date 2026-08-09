import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export const ContactsPage = () => {
  const { locationConsent, grantLocationConsent, revokeLocationConsent } = useAuth();
  const [pushAlerts, setPushAlerts] = useState(true);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Sarah Jenkins', phone: '+1 (555) 019-2834', verified: true, initial: 'S' },
    { id: '2', name: 'Michael Chen', phone: '+44 7700 900077', verified: true, initial: 'M' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    setContacts(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newName,
        phone: newPhone,
        verified: true,
        initial: newName.charAt(0).toUpperCase()
      }
    ]);
    setNewName('');
    setNewPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row font-sans">
      <Sidebar activeTab="/contacts" />

      <main className="flex-1 lg:ml-72 mt-16 lg:mt-0 p-4 md:p-8 max-w-[1200px] mx-auto w-full pb-24">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
            Contacts & Privacy
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant">
            Manage your trusted safety network and control your data privacy settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Trusted Contacts */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-outline-variant/60 flex justify-between items-center bg-surface-bright">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">group</span>
                  <h2 className="text-base font-bold text-primary">Trusted Emergency Contacts</h2>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1 text-secondary hover:text-primary transition-colors text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Add Contact
                </button>
              </div>

              <div className="divide-y divide-surface-variant">
                {contacts.map((c) => (
                  <div key={c.id} className="p-5 flex items-center justify-between hover:bg-surface-bright transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-base shadow-xs">
                        {c.initial}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-on-surface">{c.name}</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">{c.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-secondary text-on-secondary px-2.5 py-1 rounded-full flex items-center gap-1 font-bold text-[10px] uppercase">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Protocol Action Box */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-error-container p-5 rounded-2xl border border-error/20 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-error text-3xl mb-2">campaign</span>
                  <h3 className="text-sm font-bold text-on-error-container mb-1">SOS Alert Protocol</h3>
                  <p className="text-xs text-on-error-container/80 mb-4 leading-relaxed">
                    Contacts receive real-time location SMS alerts immediately upon SOS confirmation.
                  </p>
                </div>
                <button 
                  onClick={() => alert('Demo SOS SMS Alert dispatched to contacts!')}
                  className="bg-error text-on-error py-2.5 px-4 rounded-xl font-bold text-xs shadow-md hover:bg-error/90 transition-all text-center"
                >
                  Test SMS Alert
                </button>
              </div>

              <div className="bg-surface-container-highest p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-primary text-3xl mb-2">history</span>
                  <h3 className="text-sm font-bold text-on-surface mb-1">Privacy Activity Log</h3>
                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                    View recent location shares, pings, and transient data purges.
                  </p>
                </div>
                <button 
                  onClick={() => alert('Privacy Audit Log: 0 permanent records retained. All past sessions purged.')}
                  className="border-2 border-primary text-primary py-2 px-4 rounded-xl font-bold text-xs hover:bg-primary hover:text-on-primary transition-all text-center"
                >
                  View Privacy Log
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Privacy Toggles */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-xl">visibility_off</span>
                <h2 className="text-base font-bold text-primary">Privacy Toggles</h2>
              </div>

              <div className="space-y-6">
                
                {/* Toggle 1: Location Consent */}
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h3 className="text-xs font-bold text-on-surface mb-0.5">Live Location Consent</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Allow trusted contacts to view your real-time position during an active session.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => locationConsent ? revokeLocationConsent() : grantLocationConsent()}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      locationConsent ? 'bg-secondary' : 'bg-surface-dim'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      locationConsent ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="h-px bg-surface-variant" />

                {/* Toggle 2: Push Alerts */}
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h3 className="text-xs font-bold text-on-surface mb-0.5">Region Push Alerts</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Receive critical safety updates for your current pilot zone automatically.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushAlerts(!pushAlerts)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      pushAlerts ? 'bg-secondary' : 'bg-surface-dim'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      pushAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="h-px bg-surface-variant" />

                {/* Toggle 3: Accessibility Mode */}
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h3 className="text-xs font-bold text-on-surface mb-0.5">Accessibility Mode</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Enhance contrast and simplify UI elements for high-stress situations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccessibilityMode(!accessibilityMode)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      accessibilityMode ? 'bg-secondary' : 'bg-surface-dim'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      accessibilityMode ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

              </div>
            </section>

            {/* Data Policy Callout (High Contrast Accessible) */}
            <section className="bg-[#131b2e] p-5 rounded-2xl border border-slate-700 shadow-md">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#4edea3] text-xl shrink-0 mt-0.5">policy</span>
                <div>
                  <h3 className="text-xs font-extrabold text-white mb-1.5 tracking-wide">In-Memory Location Guarantee</h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    Your location data is strictly processed in-memory and is never permanently stored on servers. When a session ends, transient data is immediately purged.
                  </p>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant">
            <h3 className="text-base font-bold text-primary mb-4">Add Emergency Contact</h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full h-11 px-3.5 rounded-xl border border-outline-variant bg-surface-container-low text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 px-3.5 rounded-xl border border-outline-variant bg-surface-container-low text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-secondary text-on-secondary font-bold text-xs rounded-xl shadow-md hover:bg-secondary/90"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
