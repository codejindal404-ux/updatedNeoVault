import React from 'react';
import { Link } from 'react-router-dom';

export default function SystemSettings() {
  return (
    <>


<nav className="fixed left-0 top-0 h-full w-[280px] bg-surface/80 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-primary/5 z-50 hidden md:flex flex-col py-base">

<div className="px-6 py-8 flex items-center gap-4">
<div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(164,230,255,0.3)]">
<span className="material-symbols-outlined text-primary">security</span>
</div>
<div>
<h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">NeoVault</h1>
<p className="font-label-caps text-label-caps text-on-surface-variant opacity-70">Enterprise SaaS</p>
</div>
</div>

<div className="px-4 mb-6">
<button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(164,230,255,0.3)] hover:shadow-[0_0_25px_rgba(164,230,255,0.5)] transition-all duration-300">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>add</span>
                New Document
            </button>
</div>

<ul className="flex-1 flex flex-col gap-1 overflow-y-auto w-full">
<li>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 cursor-pointer active:scale-[0.98] transition-transform" to="/dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-body-md text-body-md">Dashboard</span>
</Link>
</li>
<li>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 cursor-pointer active:scale-[0.98] transition-transform" to="/vault">
<span className="material-symbols-outlined">folder_managed</span>
<span className="font-body-md text-body-md">Vault</span>
</Link>
</li>
<li>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 cursor-pointer active:scale-[0.98] transition-transform" to="/upload">
<span className="material-symbols-outlined">upload_file</span>
<span className="font-body-md text-body-md">Document Upload</span>
</Link>
</li>
<li>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 cursor-pointer active:scale-[0.98] transition-transform" to="/url-scanner">
<span className="material-symbols-outlined">travel_explore</span>
<span className="font-body-md text-body-md">URL Scanner</span>
</Link>
</li>
<li>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 cursor-pointer active:scale-[0.98] transition-transform" to="/profile">
<span className="material-symbols-outlined">person</span>
<span className="font-body-md text-body-md">Profile</span>
</Link>
</li>

<li>
<Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 cursor-pointer active:scale-[0.98] transition-transform" to="/settings">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>settings</span>
<span className="font-body-md text-body-md font-medium">Settings</span>
</Link>
</li>
<li>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 cursor-pointer active:scale-[0.98] transition-transform" to="/admin">
<span className="material-symbols-outlined">admin_panel_settings</span>
<span className="font-body-md text-body-md">Admin Portal</span>
</Link>
</li>
</ul>
</nav>

<header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface/60 backdrop-blur-lg border-b border-white/5 z-40 hidden md:flex justify-between items-center px-margin-desktop shadow-none">

<div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px]">settings</span>
<span>Settings Configuration</span>
</div>

<div className="flex items-center gap-6">
<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20">
<span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(104,245,184,0.8)]"></span>
<span className="font-label-caps text-label-caps text-tertiary">Security Status: Secure</span>
</div>
<div className="flex items-center gap-2">
<span className="font-label-caps text-label-caps text-on-surface-variant">AI credits: 84%</span>
<div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
<div className="h-full bg-primary w-[84%] shadow-[0_0_8px_rgba(164,230,255,0.8)]"></div>
</div>
</div>

<div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-6">
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">verified_user</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="A futuristic avatar of a user in a neon-lit cyberpunk environment, wearing high-tech cybernetic gear. Dark moody background with cyan and magenta accents highlighting the subject's face." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiDEKEgNOHXdgpWAkOGxKGJjSNwgg4krIlTnSJ5KyHCspa_eBuyoy46IVJsgrw0uxmP6B59h-5Se99LEYKkIUF6RX7cGf7-wspLyCy-DqQmYBBzfGsOeS6Ztzle_Gwo100yNA8XdDmtxA38K99B48GxypamDsjcsbQUBQmQD8PdVmbj0mIUfCpKudDAkTe5ca3ANsVD1W7exc-ZXWpGKrwRSFdsg6s1PEIzxAD3RrxHR4BzAi49XTByggdIZVnkTn7KVMxvb_jZ23x" />
</div>
</div>
</div>
</header>

<main className="md:ml-[280px] pt-[80px] min-h-screen p-margin-mobile md:p-margin-desktop">
<div className="max-w-[1000px] mx-auto w-full space-y-md">
<header className="mb-lg">
<h2 className="font-headline-xl text-headline-xl text-on-surface mb-xs">System Preferences</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Configure your environment, security protocols, and operational parameters. Changes apply globally across your active session.</p>
</header>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-md">

<section className="lg:col-span-12 glass-card rounded-xl p-md">
<div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
<span className="material-symbols-outlined text-primary">palette</span>
<h3 className="font-headline-md text-headline-md">Appearance</h3>
</div>
<div className="space-y-6">
<div className="flex items-center justify-between">
<div>
<h4 className="font-body-lg text-body-lg text-on-surface">Dark Mode</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Enable obsidian dark mode for reduced eye strain.</p>
</div>

<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
<input checked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ease-in-out opacity-0" id="theme-toggle" name="toggle" type="checkbox" />
<label className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-container-highest cursor-pointer border border-outline-variant transition-all duration-300 relative" htmlFor="theme-toggle">
<span className="absolute left-1 top-1 bottom-1 w-4 h-4 rounded-full bg-on-surface-variant transition-transform duration-300 ease-in-out"></span>
</label>
</div>
</div>
<div className="flex items-center justify-between">
<div>
<h4 className="font-body-lg text-body-lg text-on-surface">Neon Accent Glow</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Enable ambient glows on active elements and cards.</p>
</div>
<div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
<input checked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ease-in-out opacity-0" id="glow-toggle" name="toggle" type="checkbox" />
<label className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-container-highest cursor-pointer border border-outline-variant transition-all duration-300 relative" htmlFor="glow-toggle">
<span className="absolute left-1 top-1 bottom-1 w-4 h-4 rounded-full bg-on-surface-variant transition-transform duration-300 ease-in-out"></span>
</label>
</div>
</div>
</div>
</section>

<section className="lg:col-span-6 glass-card rounded-xl p-md">
<div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
<span className="material-symbols-outlined text-secondary">notifications_active</span>
<h3 className="font-headline-md text-headline-md">Notifications</h3>
</div>
<div className="space-y-6">
<div className="flex items-center justify-between">
<div>
<h4 className="font-body-md text-body-md text-on-surface">Push Alerts</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Real-time system updates.</p>
</div>
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input checked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ease-in-out opacity-0" id="push-toggle" name="toggle" type="checkbox" />
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-container-highest cursor-pointer border border-outline-variant transition-all duration-300 relative" htmlFor="push-toggle">
<span className="absolute left-0.5 top-0.5 bottom-0.5 w-4 h-4 rounded-full bg-on-surface-variant transition-transform duration-300 ease-in-out"></span>
</label>
</div>
</div>
<div className="flex items-center justify-between">
<div>
<h4 className="font-body-md text-body-md text-on-surface">Email Digests</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Daily summary reports.</p>
</div>
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ease-in-out opacity-0" id="email-toggle" name="toggle" type="checkbox" />
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-container-highest cursor-pointer border border-outline-variant transition-all duration-300 relative" htmlFor="email-toggle">
<span className="absolute left-0.5 top-0.5 bottom-0.5 w-4 h-4 rounded-full bg-on-surface-variant transition-transform duration-300 ease-in-out"></span>
</label>
</div>
</div>
</div>
</section>

<section className="lg:col-span-6 glass-card rounded-xl p-md">
<div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
<span className="material-symbols-outlined text-error">gpp_maybe</span>
<h3 className="font-headline-md text-headline-md">Security</h3>
</div>
<div className="space-y-6">
<div className="flex items-center justify-between">
<div>
<h4 className="font-body-md text-body-md text-on-surface flex items-center gap-2">
                                    2FA Enforced
                                    <span className="px-2 py-0.5 rounded text-[10px] font-label-caps bg-error/10 text-error border border-error/20">REQUIRED</span>
</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Two-factor authentication.</p>
</div>
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input checked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-not-allowed z-10 transition-transform duration-300 ease-in-out opacity-0" disabled id="2fa-toggle" name="toggle" type="checkbox" />
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-primary/20 border-primary cursor-not-allowed transition-all duration-300 relative shadow-[0_0_10px_rgba(164,230,255,0.2)]" htmlFor="2fa-toggle">
<span className="absolute left-0.5 top-0.5 bottom-0.5 w-4 h-4 rounded-full bg-primary translate-x-full transition-transform duration-300 ease-in-out"></span>
</label>
</div>
</div>
<div className="flex items-center justify-between">
<div>
<h4 className="font-body-md text-body-md text-on-surface">Strict Session limits</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Auto-logout after 15m idle.</p>
</div>
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input checked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ease-in-out opacity-0" id="session-toggle" name="toggle" type="checkbox" />
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-container-highest cursor-pointer border border-outline-variant transition-all duration-300 relative" htmlFor="session-toggle">
<span className="absolute left-0.5 top-0.5 bottom-0.5 w-4 h-4 rounded-full bg-on-surface-variant transition-transform duration-300 ease-in-out"></span>
</label>
</div>
</div>
</div>
</section>

<div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-md">

<section className="glass-card rounded-xl p-md">
<div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
<span className="material-symbols-outlined text-tertiary">code</span>
<h3 className="font-headline-md text-headline-md">Developer</h3>
</div>
<div className="space-y-6">
<div className="flex items-center justify-between">
<div>
<h4 className="font-body-md text-body-md text-on-surface">Expose API Keys</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Allow programmatic access.</p>
</div>
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ease-in-out opacity-0" id="api-toggle" name="toggle" type="checkbox" />
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-container-highest cursor-pointer border border-outline-variant transition-all duration-300 relative" htmlFor="api-toggle">
<span className="absolute left-0.5 top-0.5 bottom-0.5 w-4 h-4 rounded-full bg-on-surface-variant transition-transform duration-300 ease-in-out"></span>
</label>
</div>
</div>
</div>
</section>

<section className="glass-card rounded-xl p-md">
<div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
<span className="material-symbols-outlined text-on-surface">policy</span>
<h3 className="font-headline-md text-headline-md">Privacy</h3>
</div>
<div className="space-y-6">
<div className="flex items-center justify-between">
<div>
<h4 className="font-body-md text-body-md text-on-surface">Telemetry Data</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Share anonymous usage stats.</p>
</div>
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-300 ease-in-out opacity-0" id="telemetry-toggle" name="toggle" type="checkbox" />
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-container-highest cursor-pointer border border-outline-variant transition-all duration-300 relative" htmlFor="telemetry-toggle">
<span className="absolute left-0.5 top-0.5 bottom-0.5 w-4 h-4 rounded-full bg-on-surface-variant transition-transform duration-300 ease-in-out"></span>
</label>
</div>
</div>
</div>
</section>
</div>
</div>
<div className="flex justify-end pt-8">
<button className="px-6 py-2 rounded border border-white/10 text-on-surface-variant font-label-md hover:bg-white/5 transition-colors mr-4">Discard Changes</button>
<button className="px-6 py-2 rounded bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md shadow-[0_0_15px_rgba(164,230,255,0.3)] hover:shadow-[0_0_25px_rgba(164,230,255,0.5)] transition-all duration-300">Save Configuration</button>
</div>
</div>
</main>


    </>
  );
}
