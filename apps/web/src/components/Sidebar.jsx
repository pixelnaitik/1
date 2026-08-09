import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Safety Dashboard', icon: 'shield' },
    { path: '/routes', label: 'Safe Route Planner', icon: 'map' },
    { path: '/sos', label: 'SOS & Live Tracking', icon: 'emergency_share' },
    { path: '/services', label: 'Services Directory', icon: 'medical_services' },
    { path: '/chat', label: 'Multilingual AI Chat', icon: 'smart_toy' },
    { path: '/contacts', label: 'Contacts & Privacy', icon: 'verified_user' },
  ];

  return (
    <>
      {/* Desktop SideNav (Hidden on mobile) */}
      <aside className="fixed left-0 top-0 h-full hidden lg:flex flex-col py-6 z-40 bg-surface-container-low shadow-sm w-72 border-r border-outline-variant/30">
        
        {/* Branding & User Card */}
        <div className="px-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src="/icon-192.png" 
              alt="SecureVoyage Icon" 
              className="w-10 h-10 rounded-xl shrink-0 shadow-sm border border-secondary/40 object-cover" 
            />
            <div>
              <h3 className="font-bold text-base text-primary leading-tight">SecureVoyage</h3>
              <p className="text-xs text-on-surface-variant">Pilot City: Bhubaneswar</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs">
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-xs font-bold text-on-surface truncate">{user?.displayName || 'Alex Rivers'}</p>
              <p className="text-[10px] text-secondary font-semibold">Tourist Account</p>
            </div>
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="text-xs text-error font-bold hover:underline shrink-0"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container shadow-xs font-bold scale-[0.98]'
                      : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                  }`
                }
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto px-3 border-t border-outline-variant/40 pt-4 space-y-1">
          <NavLink
            to="/contacts"
            className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            <span>Settings & Privacy</span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3.5 bg-surface border-b border-outline-variant lg:hidden shadow-sm">
        <div className="font-bold text-lg text-primary">SecureVoyage</div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified</span>
            Verified
          </span>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-md border-t border-outline-variant z-50 flex justify-around items-center py-2.5 px-2 lg:hidden">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${
                isActive ? 'text-secondary font-bold' : 'text-on-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-[10px]">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};
