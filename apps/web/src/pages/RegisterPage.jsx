import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: 'Alex Rivers',
    email: 'alex.rivers@example.com',
    password: 'password123',
    terms: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3;
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms) {
      setError('Please accept the Safety & Privacy Terms.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await register({
        displayName: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-on-background font-sans antialiased">
      
      {/* Left Hero Section (Stitch 2-Column Design) */}
      <div className="hidden md:flex md:w-1/2 bg-surface-container-low flex-col justify-between p-8 md:p-12 relative overflow-hidden">
        
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-multiply bg-cover bg-center" 
          style={{ 
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDLMuJ6TVKWDosu8TcBL8btamOztbzjEqVkO-TXlw54rzQ25FGv8QVjyCwPCUrG23I1iKlmkGwK1dd38N6r4cdcEqZ40-sGSLAI6xU0yg0c5-Al671WfAypXZ0by1qr-65OTZJo76HSpOuyrZrDaPMiZr1QFdwC9X_hL1oo_2TLFCGzuSz9oyd3gZyJZmDrIcjEJGXMJzMPLqHgxU_m20BR6v-evBkCQc3NKy2MZjY3jc6Ue9OFNEuZ")` 
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <span className="material-symbols-outlined text-[#10b981] text-3xl">shield_locked</span>
            <span className="text-xl font-extrabold text-[#0f172a] tracking-tight">SecureVoyage</span>
          </div>

          <div className="max-w-md mt-16">
            <h1 className="text-4xl font-extrabold text-[#0f172a] mb-4 leading-tight">
              Your safety,<br />monitored 24/7.
            </h1>
            <p className="text-base text-on-surface-variant leading-relaxed">
              Join SecureVoyage for peace of mind anywhere you travel. Instant alerts, verified routes, and a global safety network at your fingertips.
            </p>
          </div>
        </div>

        {/* Live Monitoring Badge */}
        <div className="relative z-10 mt-auto pt-12">
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl border border-outline-variant max-w-sm shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#10b981] text-2xl">satellite_alt</span>
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-wider text-[#0f172a] uppercase">LIVE MONITORING</h3>
              <p className="text-xs text-on-surface-variant font-medium">Active across 195+ countries (Pilot: Bhubaneswar)</p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-12 md:py-0 relative bg-surface-container-lowest">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-center gap-2 mb-8">
          <span className="material-symbols-outlined text-[#10b981] text-2xl">shield_locked</span>
          <span className="text-lg font-bold text-[#0f172a]">SecureVoyage</span>
        </div>

        <div className="mx-auto w-full max-w-md">
          
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-[#0f172a] mb-1">Create your account</h2>
            <p className="text-xs text-on-surface-variant">Enter your details to start traveling safely in Bhubaneswar.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-sm">person</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 h-12 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] transition-all shadow-xs"
                  placeholder="Alex Rivers"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-sm">mail</span>
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 h-12 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] transition-all shadow-xs"
                  placeholder="alex.rivers@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-sm">lock</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 h-12 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] transition-all shadow-xs"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>

              {/* Password Strength Indicator */}
              <div className="mt-2 flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-surface-variant">
                <div className={`flex-1 transition-all ${strength >= 1 ? 'bg-red-500' : ''}`} />
                <div className={`flex-1 transition-all ${strength >= 2 ? 'bg-yellow-500' : ''}`} />
                <div className={`flex-1 transition-all ${strength >= 3 ? 'bg-[#10b981]' : ''}`} />
              </div>
              <p className="mt-1 text-[11px] text-on-surface-variant text-right font-medium">
                Password strength: {strength === 3 ? 'Strong' : strength === 2 ? 'Medium' : 'Weak'}
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                className="mt-0.5 h-4 w-4 text-[#10b981] border-outline-variant rounded focus:ring-[#10b981] cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-on-surface-variant leading-tight cursor-pointer">
                I agree to the <a href="#" className="font-bold text-[#10b981] hover:underline">Safety & Privacy Terms</a>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/60" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-surface-container-lowest text-on-surface-variant font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant/60 rounded-xl shadow-xs bg-white text-xs font-bold text-[#0f172a] hover:bg-surface-container-low transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z" fill="#34A853" />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-on-surface-variant font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#10b981] hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
