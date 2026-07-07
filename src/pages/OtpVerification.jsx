import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(location.state?.message || null);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
    
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [email, cooldown, navigate]);
  
  const handleResend = async () => {
    if (cooldown > 0) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await api.post('/auth/request-otp', { email });
      setCooldown(60);
      setSuccessMsg('A new OTP has been sent to your email.');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to resend OTP.');
      }
    }
  };

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && digits[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (pastedData) {
      const newDigits = [...digits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);
      if (pastedData.length < 6) {
        inputRefs.current[pastedData.length]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await verifyOtp(email, code);
      navigate('/login', { state: { message: 'Email verified successfully! Please log in.' } });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Invalid or expired OTP. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>


<div className="absolute inset-0 pointer-events-none z-0">
<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] bg-element"></div>
<div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-container/10 blur-[150px] bg-element" style={{animationDelay: '-15s'}}></div>

<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBmaWxsPSJub25lIj48cGF0aCBkPSJNMCA0MGw0MC00TTAgMGw0MCA0MCIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
</div>

<main className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">

<div className="text-center mb-md">
<h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">NeoVault</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Secure Authorization Gateway</p>
</div>

<div className="glass-panel rounded-xl p-md md:p-lg shadow-2xl relative overflow-hidden group">

<div className="absolute -inset-px rounded-xl border border-white/0 group-hover:border-primary/20 transition-colors duration-500 pointer-events-none z-0"></div>
<div className="relative z-10">
<div className="text-center mb-lg">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container border border-white/5 mb-sm">
<span className="material-symbols-outlined text-primary text-[24px]">lock_person</span>
</div>
</div>
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
<form className="space-y-lg" id="otp-form" onSubmit={handleSubmit}>

<div className="flex justify-between gap-2 md:gap-3" dir="ltr">
{[0, 1, 2, 3, 4, 5].map((index) => (
  <input 
    key={index}
    ref={el => inputRefs.current[index] = el}
    value={digits[index]}
    onChange={(e) => handleChange(index, e.target.value)}
    onKeyDown={(e) => handleKeyDown(index, e)}
    onPaste={index === 0 ? handlePaste : undefined}
    aria-label={`Digit ${index + 1}`} 
    autoComplete={index === 0 ? "one-time-code" : "off"}
    className="otp-input w-full aspect-square text-center font-headline-md text-headline-md bg-surface-container-lowest border border-white/10 rounded-lg text-on-surface focus:border-primary focus:ring-0 transition-all duration-300" 
    inputMode="numeric" 
    maxLength="1" 
    pattern="[0-9]" 
    placeholder="·" 
    type="text" 
  />
))}
</div>

<div className="space-y-md">
<button disabled={isSubmitting} className="w-full btn-glow bg-gradient-to-r from-primary to-primary-fixed-dim text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
<span>{isSubmitting ? 'Verifying...' : 'Authenticate Session'}</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
<div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant px-1">
<span>Did not receive transmission?</span>
<button onClick={handleResend} className="font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={cooldown > 0} id="resend-btn" type="button">
                                Resend {cooldown > 0 ? `in ` : ''}<span className="font-label-caps text-label-caps ml-1" id="timer">{cooldown > 0 ? `00:${cooldown < 10 ? '0'+cooldown : cooldown}` : ''}</span>
</button>
</div>
</div>
</form>
</div>

<div className="mt-md pt-md border-t border-white/5 flex items-center justify-center gap-2 text-on-surface-variant/70 font-label-caps text-label-caps text-[10px]">
<span className="material-symbols-outlined text-[14px]">encrypted</span>
<span>END-TO-END ENCRYPTED GATEWAY</span>
</div>
</div>

<div className="flex justify-center gap-md mt-md font-body-sm text-body-sm text-on-surface-variant/60">
<a className="hover:text-primary transition-colors" href="#">Support</a>
<span className="w-px h-4 bg-white/10"></span>
<Link className="hover:text-primary transition-colors" to="/login">Return to Login</Link>
</div>
</main>


    </>
  );
}
