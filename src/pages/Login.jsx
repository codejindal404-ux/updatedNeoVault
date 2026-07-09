import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(location.state?.message || null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        // Redirect to OTP verification
        navigate('/otp-verification', { state: { email, message: err.response.data.error } });
      } else if (err.response && err.response.status === 429) {
        setError('Too many login attempts. Please wait a moment before trying again.');
      } else if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-glow-1 pointer-events-none"></div>
      <div className="absolute inset-0 bg-glow-2 pointer-events-none"></div>
      
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: '0.5'}}></div>
      
      <main className="w-full max-w-md px-margin-mobile md:px-0 relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface-container-high border border-white/10 shadow-lg shadow-primary/10 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl" data-weight="fill" style={{fontVariationSettings: "'FILL' 1"}}>shield_lock</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">NeoVault</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Secure Enterprise Authentication</p>
        </div>

        <div className="glass-card rounded-xl p-8 shadow-2xl w-full">
          {error && (
            <div className="mb-4 p-3 rounded bg-error/10 border border-error/50 text-error font-body-sm text-center flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded bg-primary/10 border border-primary/50 text-primary font-body-sm text-center flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {successMsg}
            </div>
          )}
          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">mail</span>
                </div>
                <input className="input-field w-full pl-10 pr-4 py-3 rounded-lg text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:ring-1 focus:ring-primary/50 border border-white/10 bg-surface/50" id="email" name="email" placeholder="admin@neovault.io" required type="email" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                <Link className="font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors" to="/reset-password">Forgot Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">key</span>
                </div>
                <input className="input-field w-full pl-10 pr-10 py-3 rounded-lg text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:ring-1 focus:ring-primary/50 border border-white/10 bg-surface/50" id="password" name="password" placeholder="••••••••" required type={showPassword ? "text" : "password"} />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none" type="button" onClick={() => setShowPassword(!showPassword)}>
                    <span className="material-symbols-outlined text-xl">{showPassword ? "visibility" : "visibility_off"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input className="h-4 w-4 rounded border-outline-variant bg-surface-container-high text-primary focus:ring-primary focus:ring-offset-background" id="remember-me" name="remember-me" type="checkbox" />
                <label className="ml-2 block font-body-sm text-body-sm text-on-surface-variant" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button 
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg btn-primary font-label-md text-label-md text-on-primary-fixed uppercase tracking-wider font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">login</span>
                )}
                {loading ? 'Authenticating...' : 'Authenticate Sequence'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Require access credentials? 
              <Link className="text-primary hover:text-primary-fixed font-medium transition-colors ml-1" to="/register">Request Authorization</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
          </span>
          <span className="font-label-caps text-label-caps text-tertiary-fixed">SYSTEM SECURE</span>
        </div>
      </main>
    </div>
  );
}
