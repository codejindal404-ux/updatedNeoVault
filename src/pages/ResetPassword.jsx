import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import logger from '../services/logger';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccessMsg(response.data.message || 'OTP reset code sent to your email.');
      setStep(2);
    } catch (err) {
      logger.error("Forgot password request error:", err);
      setError(err.response?.data?.error || err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        code,
        new_password: newPassword
      });
      navigate('/login', { state: { message: response.data.message || 'Password reset successfully. Please log in.' } });
    } catch (err) {
      logger.error("Reset password submission error:", err);
      setError(err.response?.data?.error || err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-grid"></div>
      <div className="ambient-bloom"></div>
      <main className="w-full max-w-[420px] px-margin-mobile md:px-0 z-10">
        <div className="text-center mb-xl">
          <h1 className="font-headline-lg text-headline-lg md:font-headline-xl md:text-headline-xl text-on-surface mb-xs tracking-tight">NeoVault</h1>
          <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Enterprise SaaS</p>
        </div>

        <div className="glass-card rounded-xl p-md md:p-lg w-full relative overflow-hidden">
          {error && (
            <div className="mb-4 p-3 rounded bg-error/10 border border-error/50 text-error font-body-sm text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded bg-primary/10 border border-primary/50 text-primary font-body-sm text-center">
              {successMsg}
            </div>
          )}

          {step === 1 && (
            <div className="transition-opacity duration-300 opacity-100" id="step-1">
              <div className="mb-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Reset Password</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Enter your email address to receive a secure reset code.</p>
              </div>
              <form className="space-y-md" id="reset-request-form" onSubmit={handleRequestSubmit}>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">Email Address</label>
                  <div className="relative input-glow rounded-DEFAULT bg-surface-container-low border border-outline-variant transition-colors overflow-hidden">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant" data-icon="mail">mail</span>
                    <input 
                      className="w-full bg-transparent border-none text-on-surface font-body-md pl-10 pr-sm py-sm focus:ring-0 placeholder:text-outline-variant/50" 
                      id="email" 
                      placeholder="admin@neovault.io" 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <button 
                  className="w-full btn-glow rounded-DEFAULT py-sm font-label-md text-label-md text-white uppercase tracking-wider flex items-center justify-center gap-sm mt-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Sending...' : 'Send Reset Code'}</span>
                  <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="transition-opacity duration-300 opacity-100" id="step-2">
              <div className="mb-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Create New Password</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Enter the 6-digit reset code received in your email and your new password.</p>
              </div>
              <form className="space-y-md" id="new-password-form" onSubmit={handleNewPasswordSubmit}>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="code">Reset Code (OTP)</label>
                  <div className="relative input-glow rounded-DEFAULT bg-surface-container-low border border-outline-variant transition-colors overflow-hidden">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant" data-icon="pin">pin</span>
                    <input 
                      className="w-full bg-transparent border-none text-on-surface font-body-md pl-10 pr-sm py-sm focus:ring-0 placeholder:text-outline-variant/50" 
                      id="code" 
                      placeholder="123456" 
                      required 
                      type="text" 
                      maxLength="6"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="new-password">New Password</label>
                  <div className="relative input-glow rounded-DEFAULT bg-surface-container-low border border-outline-variant transition-colors overflow-hidden">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant" data-icon="lock">lock</span>
                    <input 
                      className="w-full bg-transparent border-none text-on-surface font-body-md pl-10 pr-sm py-sm focus:ring-0 placeholder:text-outline-variant/50" 
                      id="new-password" 
                      placeholder="••••••••••••" 
                      required 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="confirm-password">Confirm Password</label>
                  <div className="relative input-glow rounded-DEFAULT bg-surface-container-low border border-outline-variant transition-colors overflow-hidden">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant" data-icon="lock_reset">lock_reset</span>
                    <input 
                      className="w-full bg-transparent border-none text-on-surface font-body-md pl-10 pr-sm py-sm focus:ring-0 placeholder:text-outline-variant/50" 
                      id="confirm-password" 
                      placeholder="••••••••••••" 
                      required 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <button 
                  className="w-full btn-glow rounded-DEFAULT py-sm font-label-md text-label-md text-white uppercase tracking-wider flex items-center justify-center gap-sm mt-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
                  <span className="material-symbols-outlined text-[18px]" data-icon="check_circle">check_circle</span>
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-lg text-center">
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-xs" to="/login">
            <span className="material-symbols-outlined text-[16px]" data-icon="arrow_back">arrow_back</span>
            Return to Login
          </Link>
        </div>
      </main>
    </>
  );
}
