import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    
    try {
      await register(fullName, email, phone, password);
      navigate('/otp-verification', { state: { email, message: 'Registration successful! Please check your email for the OTP.' } });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>


<div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
<div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
<div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1440px] h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEw2MCAzMEwzMCA2MEwwIDMwTDMwIDBaIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-repeat opacity-50"></div>
</div>

<main className="w-full max-w-[520px] relative z-10">
<div className="text-center mb-lg">
<h1 className="font-headline-xl text-headline-xl text-primary mb-xs tracking-tight">NeoVault</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Initialize your secure environment.</p>
</div>
<div className="glass-card rounded-xl p-md md:p-lg w-full">
<div className="mb-lg">
<h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Create Account</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Enter your details to establish a secure access node.</p>
</div>
{error && (
  <div className="mb-4 p-3 rounded bg-error/10 border border-error/50 text-error font-body-sm text-center">
    {error}
  </div>
)}
<form className="space-y-md" onSubmit={handleSubmit}>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="fullName">Full Name</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">person</span>
<input className="input-dark w-full rounded-lg py-sm pl-lg pr-sm text-on-surface font-body-md placeholder:text-outline-variant focus:ring-0" id="fullName" name="fullName" placeholder="John Doe" type="text" />
</div>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="email">Email Address</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">mail</span>
<input className="input-dark w-full rounded-lg py-sm pl-lg pr-sm text-on-surface font-body-md placeholder:text-outline-variant focus:ring-0" id="email" name="email" placeholder="john@company.com" type="email" />
</div>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="phone">Phone Number</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">phone_iphone</span>
<input className="input-dark w-full rounded-lg py-sm pl-lg pr-sm text-on-surface font-body-md placeholder:text-outline-variant focus:ring-0" id="phone" name="phone" placeholder="+1 (555) 000-0000" type="tel" />
</div>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="password">Password</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">lock</span>
<input className="input-dark w-full rounded-lg py-sm pl-lg pr-sm text-on-surface font-body-md placeholder:text-outline-variant focus:ring-0" id="password" name="password" placeholder="••••••••" type={showPassword ? "text" : "password"} required />
<button className="absolute right-sm top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors focus:outline-none" type="button" onClick={() => setShowPassword(!showPassword)}>
<span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
</button>
</div>

<div className="mt-sm flex gap-xs h-[4px]">
<div className="w-1/4 h-full rounded-full bg-surface-container-highest"></div>
<div className="w-1/4 h-full rounded-full bg-surface-container-highest"></div>
<div className="w-1/4 h-full rounded-full bg-surface-container-highest"></div>
<div className="w-1/4 h-full rounded-full bg-surface-container-highest"></div>
</div>
</div>

<div className="flex items-start gap-sm pt-xs">
<div className="flex items-center h-5">
<input className="w-4 h-4 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-surface" id="terms" type="checkbox" />
</div>
<div className="text-sm">
<label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">I agree to the <a className="text-primary hover:underline hover:text-primary-fixed" href="#">Terms of Service</a> and <a className="text-primary hover:underline hover:text-primary-fixed" href="#">Privacy Policy</a>.</label>
</div>
</div>

<div className="pt-sm">
<button disabled={isSubmitting} className="neon-btn w-full py-sm rounded-lg flex items-center justify-center gap-sm font-label-md text-label-md text-on-primary disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
<span className="font-bold">{isSubmitting ? 'Processing...' : 'Create Account'}</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</form>

<div className="mt-lg text-center border-t border-white/5 pt-md">
<p className="font-body-sm text-body-sm text-on-surface-variant">
                    Already have access? 
                    <Link className="text-primary font-medium hover:text-primary-fixed hover:underline transition-all" to="/login">Login to NeoVault</Link>
</p>
</div>
</div>

<div className="absolute -bottom-xl left-1/2 -translate-x-1/2 flex items-center gap-sm bg-tertiary/10 border border-tertiary/20 px-4 py-2 rounded-full backdrop-blur-md">
<span className="material-symbols-outlined text-tertiary text-[16px]">shield</span>
<span className="font-label-caps text-label-caps text-tertiary">SYSTEM SECURE</span>
</div>
</main>


    </>
  );
}
