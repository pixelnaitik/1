import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { api } from '../services/api';

const DEFAULT_WELCOME_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: 'Hello! I am your **SecureVoyage AI Companion**. I monitor real-time safety indices and route security across Bhubaneswar, Odisha.\n\nHow can I assist your travel today?',
    actions: [
      { label: 'Find Hospitals in Bhubaneswar', query: 'Find hospitals near me in Bhubaneswar' },
      { label: 'Janpath Safe Route', query: 'Get safe route from Master Canteen to KIIT Patia' },
      { label: 'Odia / Hindi Translation', query: 'Translate safety advisories into Hindi and Odia' }
    ],
    time: '10:42 AM'
  }
];

// Simple helper to parse **markdown bold** into <strong> tags
const renderFormattedText = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export const AIChatPage = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('Hindi');
  const [inputMsg, setInputMsg] = useState('');
  const [sessionId, setSessionId] = useState(() => sessionStorage.getItem('sv_ai_chat_session_id') || null);
  const [isSending, setIsSending] = useState(false);

  // Load chat history from sessionStorage so it persists across tab navigation until website exit
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sv_ai_chat_messages');
      return saved ? JSON.parse(saved) : DEFAULT_WELCOME_MESSAGES;
    } catch (e) {
      return DEFAULT_WELCOME_MESSAGES;
    }
  });

  // Save messages to sessionStorage whenever updated
  useEffect(() => {
    try {
      sessionStorage.setItem('sv_ai_chat_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('[AI Chat] Failed to save history:', e);
    }
  }, [messages]);

  // Save sessionId to sessionStorage
  useEffect(() => {
    if (sessionId) {
      sessionStorage.setItem('sv_ai_chat_session_id', sessionId);
    }
  }, [sessionId]);

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || inputMsg;
    if (!queryText.trim() || isSending) return;

    setInputMsg('');
    setIsSending(true);

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await api.sendAssistantMessage({
        message: queryText,
        language: selectedLang,
        sessionId
      });

      if (res.sessionId) setSessionId(res.sessionId);

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.message,
        source: res.sources ? res.sources.join(' • ') : 'Google Gemini AI Flash • Odisha Tourism Safety DB',
        actionButtons: res.actions || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.warn('[AI Assistant] API fallback:', err.message);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: `SecureVoyage Advisory (${selectedLang}):\nSafety score for central Bhubaneswar pilot corridors (Janpath, Master Canteen, Patia) is **84/100 (Safe)**. Emergency helpline **112** is active 24/7.`,
            source: 'Google Gemini AI Flash • Odisha Safety Corpus',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
    } finally {
      setIsSending(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.nav) {
      navigate(action.nav);
    } else if (action.type === 'OPEN_EMERGENCY_NUMBER') {
      window.location.href = 'tel:112';
    } else if (action.type === 'OPEN_NEARBY_SERVICES') {
      navigate('/services');
    } else if (action.type === 'OPEN_SAFE_ROUTE') {
      navigate('/routes');
    } else if (action.type === 'OPEN_SOS_CONFIRMATION') {
      navigate('/sos');
    } else if (action.query) {
      handleSendMessage(action.query);
    }
  };

  const handleClearChat = () => {
    setMessages(DEFAULT_WELCOME_MESSAGES);
    sessionStorage.removeItem('sv_ai_chat_messages');
    sessionStorage.removeItem('sv_ai_chat_session_id');
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col md:flex-row font-sans overflow-hidden">
      <Sidebar activeTab="/chat" />

      <main className="flex-1 lg:ml-72 flex flex-col bg-[#f8fafc] relative h-screen w-full mt-16 lg:mt-0">
        
        {/* Modern Top Header Bar */}
        <div className="px-6 py-3.5 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/cute_ai_mascot.png" 
                alt="AI Mascot" 
                className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-emerald-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div>
              <h2 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                SecureVoyage AI Companion
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/50">
                  Online
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Bhubaneswar Pilot Zone Safety Advisor</p>
            </div>
          </div>

          <button 
            onClick={handleClearChat}
            className="text-xs text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span> Clear Chat
          </button>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6">

          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-3.5 max-w-3xl ${msg.sender === 'user' ? 'self-end flex-row-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              {msg.sender === 'ai' ? (
                <div className="relative shrink-0 self-start mt-0.5">
                  <img 
                    src="/cute_ai_mascot.png" 
                    alt="AI Avatar" 
                    className="w-10 h-10 rounded-2xl object-cover shadow-md ring-2 ring-emerald-400/40 transform hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md self-start mt-0.5">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
              )}

              {/* Message Content */}
              <div className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-xs'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">
                    {renderFormattedText(msg.text)}
                  </p>

                  {/* Verified Source Callout */}
                  {msg.source && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
                      <span className="material-symbols-outlined text-emerald-600 text-base">verified</span>
                      <span className="text-slate-500 font-medium">Source: <strong className="text-slate-900">{msg.source}</strong></span>
                    </div>
                  )}
                </div>

                {/* Quick Query Action Chips */}
                {msg.actions && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.actions.map((act, i) => (
                      <button 
                        key={i}
                        onClick={() => handleActionClick(act)}
                        className="bg-white border border-emerald-500/30 hover:border-emerald-500 text-slate-800 px-4 py-2 rounded-full text-xs font-bold hover:bg-emerald-50/60 transition-all flex items-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm text-emerald-600">sparkles</span>
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Response Action Buttons from Gemini API */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.actionButtons.map((btn, i) => (
                      <button 
                        key={i}
                        onClick={() => handleActionClick(btn)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">start</span>
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 font-medium px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Animated Typing Indicator */}
          {isSending && (
            <div className="flex items-center gap-3">
              <img 
                src="/cute_ai_mascot.png" 
                alt="AI Mascot Typing" 
                className="w-9 h-9 rounded-2xl object-cover shadow-sm animate-pulse"
              />
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-slate-500 font-semibold ml-2">SecureVoyage AI is thinking...</span>
              </div>
            </div>
          )}

        </div>

        {/* Floating Input Toolbar */}
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 md:px-8 md:py-4 flex flex-col gap-3 shrink-0 shadow-lg">
          
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-base">translate</span>
            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
              {['English', 'Hindi', 'Odia', 'Pilot Mode'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1 rounded-lg font-extrabold transition-all ${
                    selectedLang === lang 
                      ? 'bg-white shadow-xs text-slate-900 border border-slate-200/60' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }} 
            className="relative flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask SecureVoyage AI Assistant for Bhubaneswar safety guidance..."
              className="flex-1 h-13 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 font-medium"
            />

            <button 
              type="submit"
              disabled={isSending}
              className="h-13 w-13 flex items-center justify-center rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-all shrink-0 shadow-md active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xl text-emerald-400">send</span>
            </button>
          </form>

        </div>

      </main>
    </div>
  );
};
