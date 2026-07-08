import React from 'react';
import { Link } from 'react-router-dom';

export default function FormAutofill() {
  return (
    <>


<nav className="hidden md:flex fixed left-0 top-0 h-full w-[280px] bg-surface/80 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-primary/5 flex-col py-base z-50">
<div className="px-margin-desktop py-md mb-md border-b border-white/5">
<h1 className="font-headline-md text-headline-md font-bold text-primary">NeoVault</h1>
<p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Enterprise SaaS</p>
</div>
<div className="flex flex-col gap-2 px-4 flex-grow">

<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg active:scale-[0.98]" to="/dashboard">
<span className="material-symbols-outlined">dashboard</span>
                Dashboard
            </Link>

<Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 rounded-r-lg active:scale-[0.98] transition-transform" to="/url-scanner">
<span className="material-symbols-outlined">travel_explore</span>
                URL Scanner
            </Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg active:scale-[0.98]" to="/vault">
<span className="material-symbols-outlined">folder_managed</span>
                Vault
            </Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg active:scale-[0.98]" to="/upload">
<span className="material-symbols-outlined">upload_file</span>
                Document Upload
            </Link>
</div>
<div className="mt-auto px-4 pb-md">
<button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md glow-primary transition-all duration-300 hover:brightness-110 active:scale-[0.98]">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>add</span>
                New Document
            </button>
</div>
</nav>

<div className="flex-1 flex flex-col min-h-screen md:ml-[280px] w-full">

<header className="hidden md:flex fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface/60 backdrop-blur-lg border-b border-white/5 justify-between items-center px-margin-desktop z-40">
<div className="flex items-center gap-6">

<div className="flex items-center gap-2 text-tertiary font-label-md text-label-md bg-tertiary/10 px-3 py-1.5 rounded-full border border-tertiary/20">
<span className="material-symbols-outlined text-[16px]">shield</span>
                    Security Status: Secure
                </div>
<div className="flex items-center gap-2 text-primary font-label-md text-label-md bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
<span className="material-symbols-outlined text-[16px]">memory</span>
                    AI credits: 84%
                </div>
</div>
<div className="flex items-center gap-4">
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">verified_user</span>
</button>
<div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 overflow-hidden flex items-center justify-center">
<img className="w-full h-full object-cover" data-alt="A futuristic, neon-lit cyberpunk style avatar portrait of a user. The avatar features glowing cyan and magenta accents on high-tech wearable gear, set against a deep obsidian background. The lighting is cinematic, casting soft reflections on sleek, metallic surfaces. High resolution, professional digital art style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwUeYQU2bRfMsb_oVx3rWmJyaDt06QirCsR_ZzY3lzhekkGLZVYrWM4YIiXCScaY-H0bnpzfpLMtyfvWIk7JG7MJF4NR_yl8qS9RNGztniKdIq7sNlNwxmgiXc-pPLAIe9wb-RfaBXj9KIwyp9RZ8tWfd8XkVzwzyS7_oGRPI_j2Wbx-8PNPKT0i-Fvf3oC3fRiJ5VPdnDcD4NmlHAueTGSJTDcYrDfq-Qf3h3UKsBPjKSYWnjFmXfdKTOkRDhG61P9B8ZnGv-k02D" />
</div>
</div>
</header>

<main className="flex-1 overflow-y-auto pt-24 pb-md px-margin-mobile md:px-margin-desktop flex flex-col items-center">
<div className="w-full max-w-3xl space-y-md">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-lg">
<div>
<h2 className="font-headline-lg md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-2">Form Autofill Engine</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Intelligent field mapping and security validation.</p>
</div>

<div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tertiary/10 border border-tertiary/20 text-tertiary glow-safe">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span>
<span className="font-label-caps text-label-caps">SITE SECURE</span>
</div>
</div>

<div className="glass-panel rounded-xl p-md flex flex-col md:flex-row gap-4 items-end">
<div className="flex-1 w-full">
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Target URL</label>
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">link</span>
<input className="w-full bg-surface-container-low border border-white/10 rounded-lg py-3 pl-10 pr-4 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" placeholder="Enter URL to scan..." type="url" value="https://secure.acme-corp.app/checkout" />
</div>
</div>
<button className="w-full md:w-auto px-6 py-3 rounded-lg bg-surface-container-high border border-white/10 text-on-surface font-label-md text-label-md hover:bg-primary/10 hover:border-primary/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap group">
<span className="material-symbols-outlined group-hover:text-primary transition-colors">radar</span>
                        Check & Autofill
                    </button>
</div>

<div className="glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="px-md py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
<h3 className="font-label-caps text-label-caps text-on-surface">MAPPED FIELDS PREVIEW</h3>
<span className="font-label-md text-label-md text-primary bg-primary/10 px-2 py-1 rounded">12 Fields Detected</span>
</div>
<div className="p-md grid grid-cols-1 md:grid-cols-2 gap-4">

<div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low border border-white/5">
<div>
<span className="block font-label-caps text-label-caps text-outline mb-1">First Name</span>
<span className="font-body-md text-body-md text-on-surface">Jonathan</span>
</div>
<span className="material-symbols-outlined text-tertiary text-[20px]">task_alt</span>
</div>

<div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low border border-white/5">
<div>
<span className="block font-label-caps text-label-caps text-outline mb-1">Last Name</span>
<span className="font-body-md text-body-md text-on-surface">Doe</span>
</div>
<span className="material-symbols-outlined text-tertiary text-[20px]">task_alt</span>
</div>

<div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low border border-white/5">
<div>
<span className="block font-label-caps text-label-caps text-outline mb-1">Email Address</span>
<span className="font-body-md text-body-md text-on-surface">j.doe@neovault.sys</span>
</div>
<span className="material-symbols-outlined text-tertiary text-[20px]">task_alt</span>
</div>

<div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low border border-error/20 bg-error/5">
<div>
<span className="block font-label-caps text-label-caps text-error mb-1">Credit Card</span>
<span className="font-body-md text-body-md text-on-surface">•••• •••• •••• 4242</span>
</div>
<span className="material-symbols-outlined text-error text-[20px]">warning</span>
</div>
</div>
</div>

<div className="flex flex-col-reverse md:flex-row gap-4 justify-end mt-lg pt-4 border-t border-white/5">
<button className="px-6 py-3 rounded-lg bg-transparent border border-white/10 text-on-surface font-label-md text-label-md hover:bg-white/5 transition-all">
                        Cancel
                    </button>
<button className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md font-bold glow-primary hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined">bolt</span>
                        Fill Form
                    </button>
</div>
</div>
</main>
</div>

    </>
  );
}
