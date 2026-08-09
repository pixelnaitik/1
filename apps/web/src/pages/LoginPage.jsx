import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex items-center justify-center p-4">
      <main className="w-full max-w-[1200px] min-h-[700px] lg:h-[800px] max-h-[921px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 flex overflow-hidden">
        
        {/* Left Side: Hero Image & Branding */}
        <div className="hidden lg:flex w-1/2 relative bg-surface-variant flex-col justify-between overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqtE2FDt-BfG4nYtykxGWxgijyuofu4GTK5ZVdTxzCnsR8lFA2VQfkvkKNGUCGMXpRB9sKmT-dtFeCjwv0mO9NTUg_B3oXez7z5Owxt-wo78Nh3NcL96zvt58MSOZiSDddllM06AUGUQ5Q6lTq7d-d3ddbnQq1RkgM44YB-geN6xyKb-sNn3m6O-8ane-Q7Z8HmB4p6YDX3RR8E0pE9hAT_w1j6A72Do0EbgZjzyPtwvFqa2-dYG3O')`
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
          
          <div className="relative z-10 p-12 mt-auto text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm text-secondary-fixed-dim">verified_user</span>
              AI Tourist Safety System
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">SecureVoyage</h1>
            <p className="text-lg text-white/90 font-medium leading-relaxed">
              Your Trusted Companion for Safe Travels Across Pilot Destinations.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest">
          <div className="max-w-[400px] w-full mx-auto">
            
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
              <p className="text-sm text-on-surface-variant">Sign in to access your advisory safety dashboard.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 text-xs rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.rivers@example.com"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-sm text-on-surface placeholder:text-outline"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 pl-11 pr-11 rounded-xl border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-sm text-on-surface placeholder:text-outline"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-on-surface">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="font-semibold text-secondary hover:underline">Forgot password?</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.99]"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative flex items-center mb-6">
                <div className="flex-grow border-t border-outline-variant/60"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-outline">or continue with</span>
                <div className="flex-grow border-t border-outline-variant/60"></div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => { setEmail('alex.rivers@example.com'); setPassword('demo_password'); }}
                  className="flex-1 h-11 bg-surface border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors text-xs font-semibold text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg text-sky-600">account_circle</span> Demo User
                </button>
                <button 
                  type="button"
                  onClick={() => { setEmail('tourist.demo@securevoyage.org'); setPassword('demo_password'); }}
                  className="flex-1 h-11 bg-surface border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors text-xs font-semibold text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg text-emerald-600">explore</span> Tourist Account
                </button>
              </div>
            </div>

            {/* Registration Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-on-surface-variant">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-secondary hover:underline ml-1">
                  Sign up
                </Link>
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};
