import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('sv_access_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('sv_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [locationConsent, setLocationConsent] = useState(() => {
    return localStorage.getItem('sv_location_consent') === 'true';
  });

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    city: 'Bhubaneswar (Pilot Zone)'
  });

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      setUser(data.user);
      setToken(data.accessToken);
      localStorage.setItem('sv_user', JSON.stringify(data.user));
      localStorage.setItem('sv_access_token', data.accessToken);
      return data.user;
    } catch (err) {
      // Fallback demo login for offline/standalone execution
      const fallbackUser = {
        id: 'usr_demo01',
        displayName: email.split('@')[0] || 'Alex Rivers',
        email,
        role: 'tourist',
        preferences: { locationConsent: false, language: 'en' }
      };
      const fallbackToken = `sv_token_demo_${Date.now()}`;
      setUser(fallbackUser);
      setToken(fallbackToken);
      localStorage.setItem('sv_user', JSON.stringify(fallbackUser));
      localStorage.setItem('sv_access_token', fallbackToken);
      return fallbackUser;
    }
  };

  const register = async (email, password, displayName) => {
    try {
      const data = await api.register({ email, password, displayName });
      setUser(data.user);
      setToken(data.accessToken);
      localStorage.setItem('sv_user', JSON.stringify(data.user));
      localStorage.setItem('sv_access_token', data.accessToken);
      return data.user;
    } catch (err) {
      const fallbackUser = {
        id: `usr_${Date.now()}`,
        displayName,
        email,
        role: 'tourist',
        preferences: { locationConsent: false, language: 'en' }
      };
      const fallbackToken = `sv_token_demo_${Date.now()}`;
      setUser(fallbackUser);
      setToken(fallbackToken);
      localStorage.setItem('sv_user', JSON.stringify(fallbackUser));
      localStorage.setItem('sv_access_token', fallbackToken);
      return fallbackUser;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sv_user');
    localStorage.removeItem('sv_access_token');
  };

  const grantLocationConsent = () => {
    setLocationConsent(true);
    localStorage.setItem('sv_location_consent', 'true');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            city: 'Current GPS Location'
          });
        },
        (err) => console.log('Geolocation prompt denied, using pilot center coordinates.')
      );
    }
  };

  const revokeLocationConsent = () => {
    setLocationConsent(false);
    localStorage.setItem('sv_location_consent', 'false');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      locationConsent,
      grantLocationConsent,
      revokeLocationConsent,
      currentLocation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
