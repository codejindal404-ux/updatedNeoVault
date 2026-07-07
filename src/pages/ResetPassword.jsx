import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();

  function handleRequestSubmit(e) {
    e.preventDefault();
  }

  function handleNewPasswordSubmit(e) {
    e.preventDefault();
    navigate('/login');
  }

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

<div className="transition-opacity duration-300 opacity-100" id="step-1">
<div className="mb-lg">
<h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Reset Password</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Enter your email address to receive a secure reset link.</p>
</div>
<form className="space-y-md" id="reset-request-form" onSubmit={handleRequestSubmit}>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">Email Address</label>
<div className="relative input-glow rounded-DEFAULT bg-surface-container-low border border-outline-variant transition-colors overflow-hidden">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant" data-icon="mail">mail</span>
<input className="w-full bg-transparent border-none text-on-surface font-body-md pl-10 pr-sm py-sm focus:ring-0 placeholder:text-outline-variant/50" id="email" placeholder="admin@neovault.io" required type="email" />
</div>
</div>
<button className="w-full btn-glow rounded-DEFAULT py-sm font-label-md text-label-md text-white uppercase tracking-wider flex items-center justify-center gap-sm mt-lg" type="submit">
<span>Send Link</span>
<span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</form>
</div>

<div className="hidden opacity-0 transition-opacity duration-300 absolute inset-0 p-md md:p-lg bg-surface/40 backdrop-blur-md" id="step-2">
<div className="mb-lg">
<h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Create New Password</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Your new password must be at least 12 characters long and include special symbols.</p>
</div>
<form className="space-y-md" id="new-password-form" onSubmit={handleNewPasswordSubmit}>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="new-password">New Password</label>
<div className="relative input-glow rounded-DEFAULT bg-surface-container-low border border-outline-variant transition-colors overflow-hidden">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant" data-icon="lock">lock</span>
<input className="w-full bg-transparent border-none text-on-surface font-body-md pl-10 pr-sm py-sm focus:ring-0 placeholder:text-outline-variant/50" id="new-password" placeholder="••••••••••••" required type="password" />
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="confirm-password">Confirm Password</label>
<div className="relative input-glow rounded-DEFAULT bg-surface-container-low border border-outline-variant transition-colors overflow-hidden">
<span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant" data-icon="lock_reset">lock_reset</span>
<input className="w-full bg-transparent border-none text-on-surface font-body-md pl-10 pr-sm py-sm focus:ring-0 placeholder:text-outline-variant/50" id="confirm-password" placeholder="••••••••••••" required type="password" />
</div>
</div>
<button className="w-full btn-glow rounded-DEFAULT py-sm font-label-md text-label-md text-white uppercase tracking-wider flex items-center justify-center gap-sm mt-lg" type="submit">
<span>Reset Password</span>
<span className="material-symbols-outlined text-[18px]" data-icon="check_circle">check_circle</span>
</button>
</form>
</div>
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
