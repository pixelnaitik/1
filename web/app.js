/**
 * SecureVoyage - Core Web Application Controller
 * Handles cross-page navigation, authentication, state management, and interactive widgets.
 */

(function () {
  'use strict';

  // --- 1. State Management ---
  const STORAGE_KEY_USER = 'securevoyage_user';
  const STORAGE_KEY_CONTACTS = 'securevoyage_contacts';
  const STORAGE_KEY_SOS = 'securevoyage_sos_active';

  const defaultUser = {
    displayName: 'Alex Rivers',
    email: 'alex.rivers@example.com',
    role: 'tourist',
    authenticated: true,
    locationConsent: true,
    pilotCity: 'New Delhi (Pilot Zone)'
  };

  const defaultContacts = [
    { id: 'c1', name: 'Sarah Rivers', relation: 'Spouse', phone: '+1 (555) 019-2831', notifyOnSos: true, verified: true },
    { id: 'c2', name: 'Devon Vance', relation: 'Travel Partner', phone: '+91 98765 43210', notifyOnSos: true, verified: true },
    { id: 'c3', name: 'Embassy Support', relation: 'Official Contact', phone: '+91 11 2419 8000', notifyOnSos: false, verified: true }
  ];

  function getUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : defaultUser;
    } catch (e) {
      return defaultUser;
    }
  }

  function saveUser(user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }

  function getContacts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONTACTS);
      return stored ? JSON.parse(stored) : defaultContacts;
    } catch (e) {
      return defaultContacts;
    }
  }

  function saveContacts(contacts) {
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts));
  }

  // --- 2. Navigation Routes Mapping ---
  const ROUTES = {
    dashboard: '05_dashboard_audit.html',
    login: '04_login_audit.html',
    signup: '02_sign_up_redesign.html',
    sos: '06_sos_tracking_audit.html',
    routes: '07_safe_route_planner_audit.html',
    services: '08_interactive_services_map_audit.html',
    chat: '09_multilingual_ai_chat_audit.html',
    contacts: '10_contacts_privacy_audit.html',
    home: 'index.html'
  };

  function getCurrentFilename() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }

  // --- 3. Wire Up Inter-Page Links ---
  function wireNavigation() {
    const current = getCurrentFilename();

    // Map common navigation labels/selectors to routes
    document.querySelectorAll('a, button, div').forEach(el => {
      const text = el.innerText ? el.innerText.toLowerCase().trim() : '';
      const href = el.getAttribute('href');

      // Intercept '#' or empty links that correspond to known pages
      if (href === '#' || !href || href.startsWith('javascript:')) {
        if (text.includes('dashboard') || text.includes('home') || text.includes('safety overview')) {
          el.setAttribute('href', ROUTES.dashboard);
        } else if (text.includes('safe route') || text.includes('routes') || text.includes('plan route')) {
          el.setAttribute('href', ROUTES.routes);
        } else if (text.includes('services') || text.includes('hospitals') || text.includes('police') || text.includes('nearby help') || text.includes('map')) {
          el.setAttribute('href', ROUTES.services);
        } else if (text.includes('assistant') || text.includes('ai chat') || text.includes('ask ai') || text.includes('multilingual')) {
          el.setAttribute('href', ROUTES.chat);
        } else if (text.includes('contact') || text.includes('privacy') || text.includes('trusted contacts')) {
          el.setAttribute('href', ROUTES.contacts);
        } else if (text.includes('sign in') || text.includes('log in')) {
          el.setAttribute('href', ROUTES.login);
        } else if (text.includes('sign up') || text.includes('register') || text.includes('create account')) {
          el.setAttribute('href', ROUTES.signup);
        }
      }

      // SOS Emergency Buttons across all pages
      if (text.includes('sos') || text.includes('emergency sos') || text.includes('hold for sos')) {
        el.addEventListener('click', (e) => {
          if (!current.includes('06_sos')) {
            e.preventDefault();
            window.location.href = ROUTES.sos + '?trigger=true';
          }
        });
      }
    });

    // Sidebar & Navigation Active Class Highlighting
    document.querySelectorAll('nav a, aside a, .sidebar a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href === current) {
        a.classList.add('active', 'bg-slate-800', 'text-sky-400');
      }
    });

    // Populate user profile info in navbar if present
    const user = getUser();
    document.querySelectorAll('.user-name-display').forEach(el => el.textContent = user.displayName);
    document.querySelectorAll('.user-email-display').forEach(el => el.textContent = user.email);
  }

  // --- 4. Page Specific Controllers ---
  function initLogin() {
    const loginForm = document.querySelector('form');
    if (loginForm && getCurrentFilename().includes('04_login')) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = loginForm.querySelector('input[type="email"]');
        const user = getUser();
        if (emailInput && emailInput.value) {
          user.email = emailInput.value;
          user.displayName = emailInput.value.split('@')[0];
        }
        user.authenticated = true;
        saveUser(user);

        // Feedback toast
        showToast('Logged in successfully! Redirecting to Dashboard...', 'success');
        setTimeout(() => {
          window.location.href = ROUTES.dashboard;
        }, 1000);
      });
    }
  }

  function initSignup() {
    const signupForm = document.querySelector('form');
    if (signupForm && getCurrentFilename().includes('02_sign_up')) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = signupForm.querySelector('input[placeholder*="Name"], input[type="text"]');
        const emailInput = signupForm.querySelector('input[type="email"]');
        const user = getUser();

        if (nameInput && nameInput.value) user.displayName = nameInput.value;
        if (emailInput && emailInput.value) user.email = emailInput.value;
        user.authenticated = true;
        saveUser(user);

        showToast('Account created successfully! Welcome to SecureVoyage.', 'success');
        setTimeout(() => {
          window.location.href = ROUTES.dashboard;
        }, 1000);
      });
    }
  }

  function initSOS() {
    if (!getCurrentFilename().includes('06_sos')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const autoTrigger = urlParams.get('trigger') === 'true';

    const statusBanner = document.querySelector('.sos-status-banner') || document.querySelector('h1, h2');
    const countdownEl = document.getElementById('sos-countdown');
    const sosCancelBtn = document.getElementById('sos-cancel-btn') || document.querySelector('button:contains("Cancel"), button');

    let secondsLeft = 5;
    let timer = null;

    function startCountdown() {
      showToast('🚨 SOS Emergency triggered! 5s countdown initiated.', 'danger');
      timer = setInterval(() => {
        secondsLeft--;
        if (countdownEl) countdownEl.textContent = `${secondsLeft}s`;
        if (secondsLeft <= 0) {
          clearInterval(timer);
          triggerLiveSession();
        }
      }, 1000);
    }

    function triggerLiveSession() {
      localStorage.setItem(STORAGE_KEY_SOS, 'true');
      showToast('📡 SOS Broadcast Active! Notifying trusted contacts and official responders (112)...', 'danger');
      if (statusBanner) {
        statusBanner.innerHTML = `<span style="color:#ef4444;font-weight:bold;">🚨 LIVE EMERGENCY SOS ACTIVE — Broadcast Sharing Session ID #SOS-8921-DEL</span>`;
      }
    }

    if (autoTrigger) {
      startCountdown();
    }

    // Bind SOS trigger buttons on page
    document.querySelectorAll('.sos-trigger-btn, button').forEach(btn => {
      const text = btn.innerText.toLowerCase();
      if (text.includes('cancel') || text.includes('stop')) {
        btn.addEventListener('click', () => {
          if (timer) clearInterval(timer);
          localStorage.removeItem(STORAGE_KEY_SOS);
          showToast('SOS session cancelled safely.', 'info');
          setTimeout(() => { window.location.href = ROUTES.dashboard; }, 1200);
        });
      } else if (text.includes('activate') || text.includes('confirm') || text.includes('sos')) {
        btn.addEventListener('click', () => {
          startCountdown();
        });
      }
    });
  }

  function initChat() {
    if (!getCurrentFilename().includes('09_multilingual_ai_chat')) return;

    const chatContainer = document.querySelector('.chat-messages') || document.querySelector('main div');
    const input = document.querySelector('input[placeholder*="Ask"], input[placeholder*="message"], input[type="text"]');
    const sendBtn = document.querySelector('button[type="submit"]') || document.querySelector('button:has(svg), button');

    if (!input) return;

    function appendMessage(text, isUser = false) {
      const msgDiv = document.createElement('div');
      msgDiv.style.margin = '0.75rem 0';
      msgDiv.style.display = 'flex';
      msgDiv.style.justifyContent = isUser ? 'flex-end' : 'flex-start';

      const bubble = document.createElement('div');
      bubble.style.padding = '0.75rem 1rem';
      bubble.style.borderRadius = '12px';
      bubble.style.maxWidth = '80%';
      bubble.style.fontSize = '0.95rem';
      bubble.style.lineHeight = '1.5';
      bubble.style.backgroundColor = isUser ? '#0284c7' : '#1e293b';
      bubble.style.color = '#f8fafc';
      bubble.style.border = isUser ? 'none' : '1px solid #334155';

      bubble.innerHTML = text;
      msgDiv.appendChild(bubble);
      if (chatContainer) {
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }

    function processAIResponse(query) {
      const lower = query.toLowerCase();
      setTimeout(() => {
        if (lower.includes('sos') || lower.includes('danger') || lower.includes('help') || lower.includes('emergency')) {
          appendMessage(`🚨 <strong>Safety Advisory:</strong> If you are in immediate danger, please call <strong>112</strong> immediately.<br><br>I can open the SecureVoyage SOS broadcast screen for you.<br><br><a href="${ROUTES.sos}?trigger=true" style="display:inline-block;margin-top:8px;padding:6px 12px;background:#ef4444;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">Open SOS Confirmation Screen</a>`);
        } else if (lower.includes('route') || lower.includes('walk') || lower.includes('go to')) {
          appendMessage(`🛣️ Based on verified pilot city safety data, lighting conditions are optimal along central thoroughfares. I recommend comparing routes in the Safe Route Planner.<br><br><a href="${ROUTES.routes}" style="display:inline-block;margin-top:8px;padding:6px 12px;background:#38bdf8;color:#0f172a;border-radius:6px;text-decoration:none;font-weight:600;">Open Safe Route Planner</a>`);
        } else if (lower.includes('hospital') || lower.includes('police') || lower.includes('service')) {
          appendMessage(`🏥 Verified nearby services are active. The nearest hospital (AIIMS / Safdarjung) is 1.8 km away with 24/7 emergency care.<br><br><a href="${ROUTES.services}" style="display:inline-block;margin-top:8px;padding:6px 12px;background:#10b981;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">Find Nearby Services</a>`);
        } else {
          appendMessage(` SecureVoyage Assistant (Grounded Advisory):<br>I have verified safety guidance for the New Delhi Pilot Zone. Safety conditions in your current area are categorized as <strong>Caution (Score: 57/100)</strong> due to evening hours. Stick to well-lit primary avenues.`);
        }
      }, 700);
    }

    if (sendBtn) {
      const handleSend = (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          appendMessage(text, true);
          input.value = '';
          processAIResponse(text);
        }
      };

      if (input.form) {
        input.form.addEventListener('submit', handleSend);
      } else {
        sendBtn.addEventListener('click', handleSend);
      }
    }
  }

  function initContacts() {
    if (!getCurrentFilename().includes('10_contacts_privacy')) return;

    const contactsList = document.querySelector('.contacts-list-container') || document.querySelector('main');
    const user = getUser();
    const contacts = getContacts();

    console.log('Contacts & Privacy page initialized for user:', user.displayName);
  }

  // --- 5. Global UI Toast Helper ---
  function showToast(message, type = 'info') {
    let container = document.getElementById('sv-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sv-toast-container';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '999999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.padding = '12px 18px';
    toast.style.borderRadius = '8px';
    toast.style.color = '#fff';
    toast.style.fontFamily = 'Inter, sans-serif';
    toast.style.fontSize = '14px';
    toast.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.5)';
    toast.style.transition = 'all 0.3s ease';

    if (type === 'danger') {
      toast.style.backgroundColor = '#dc2626';
    } else if (type === 'success') {
      toast.style.backgroundColor = '#16a34a';
    } else {
      toast.style.backgroundColor = '#0284c7';
    }

    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    wireNavigation();
    initLogin();
    initSignup();
    initSOS();
    initChat();
    initContacts();
  });

})();
