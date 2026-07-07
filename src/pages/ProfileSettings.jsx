import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileSettings() {
  return (
    <>


<nav className="hidden md:flex flex-col h-full py-base bg-surface/80 backdrop-blur-xl fixed left-0 top-0 w-[280px] border-r border-white/10 shadow-2xl shadow-primary/5 z-50">
<div className="px-4 py-6">
<div className="flex items-center gap-4 mb-8">
<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
<span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>domain</span>
</div>
<div>
<h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">NeoVault</h1>
<p className="font-label-md text-label-md text-on-surface-variant">Enterprise SaaS</p>
</div>
</div>
<button className="w-full py-2 mb-6 rounded-lg btn-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2">
<span className="material-symbols-outlined">add</span>
                New Document
            </button>
</div>
<div className="flex-1 overflow-y-auto space-y-1">
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-body-md text-body-md">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/vault">
<span className="material-symbols-outlined">folder_managed</span>
<span className="font-body-md text-body-md">Vault</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/upload">
<span className="material-symbols-outlined">upload_file</span>
<span className="font-body-md text-body-md">Document Upload</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/url-scanner">
<span className="material-symbols-outlined">travel_explore</span>
<span className="font-body-md text-body-md">URL Scanner</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 transition-colors duration-200 active:scale-[0.98]" to="/profile">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>person</span>
<span className="font-body-md text-body-md font-medium">Profile</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/settings">
<span className="material-symbols-outlined">settings</span>
<span className="font-body-md text-body-md">Settings</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/admin">
<span className="material-symbols-outlined">admin_panel_settings</span>
<span className="font-body-md text-body-md">Admin Portal</span>
</Link>
</div>
</nav>

<header className="hidden md:flex justify-between items-center px-margin-desktop w-full ml-[280px] bg-surface/60 backdrop-blur-lg fixed top-0 right-0 w-[calc(100%-280px)] h-16 border-b border-white/5 z-40">
<div className="flex-1 flex justify-end items-center gap-6">
<div className="flex items-center gap-4 mr-4 border-r border-white/10 pr-4">
<span className="font-label-caps text-label-caps text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-2 py-1 rounded">Security Status: Secure</span>
<span className="font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-1 rounded">AI credits: 84%</span>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">verified_user</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 cursor-pointer ml-2">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="A futuristic, high-tech abstract portrait of an anonymous user avatar. Dark mode aesthetic with subtle neon cyan and purple highlights indicating advanced AI identity mapping." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQTj49OxW4_kAPM8X0HgxkYCt9fwwDeYkHDy_QNu8Rf74k3h7NqPsPJct_8HHQZqjSXiUcK54abeDCeuahDaDvrH_G8fupUgb4-g9g9f_ysLVPpD_sPcUCOLG5P53pmkzKiB7q92cqsFWKVuVkxJYSlvC-3BvJrCU40fS99Txz3Kmfj1kmOf_p46TEf__zU7fNQGLQrtW4u2419LOHsGCpQj5Cp0N5KcKRy3ah3RpV6zUQSj11woYobuudwNivpPYZ6cC6IXTo95dd" />
</div>
</div>
</header>

<main className="md:ml-[280px] pt-24 pb-12 px-margin-mobile md:px-margin-desktop min-h-screen flex items-center justify-center">
<div className="w-full max-w-[800px] glass-card rounded-xl p-8 shadow-2xl relative overflow-hidden">

<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
<div className="mb-10 text-center relative z-10">
<h2 className="font-headline-lg text-headline-lg text-primary mb-2">User Profile</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Manage your identity and security settings.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10 relative z-10">

<div className="flex flex-col items-center border-r border-white/5 pr-0 md:pr-10">
<div className="relative group cursor-pointer mb-6">
<div className="w-40 h-40 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors duration-300 relative">
<img className="w-full h-full object-cover" data-alt="A professional, high-end profile photo of a person in a minimalist, tech-focused environment. Dark background with a subtle rim light of neon blue, projecting an aura of digital sovereignty." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhmywtzBEC35K5eaWngr1kF8b-ARW4SLu7xfKyXzObIadxCOpsuK7qJ7lAKU6n5RW3JVfxbrhzpVBYbRXphD8A5qPrdmVeLKOMDBwaUdD4R9CRZLyPaGmC7diuLwUnGWk4AS33ye1cwWFIqaPnMnCuyM2BaS4UCFk1k2tVYJff_QTfJPi_DyvDldQxIObt8LFh30SCBRv5ZBQkcKgDaTZivfD79LDZN3PyLhzaeR2ULPfvhPNIIIYyVrDOaUeuLgfvYLDEBQAlXmWo" />
<div className="absolute inset-0 bg-surface/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
<span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
</div>
</div>
<div className="absolute bottom-2 right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-white/10 shadow-lg">
<span className="material-symbols-outlined text-on-surface-variant text-sm">edit</span>
</div>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-1 text-center">Alex Chen</h3>
<p className="font-label-caps text-label-caps text-primary/70 mb-8 text-center">Security Clearance: L4</p>
</div>

<div className="space-y-10">

<section>
<h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4 border-b border-white/5 pb-2">Personal Information</h4>
<form className="space-y-4">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-1">Full Name</label>
<input className="w-full input-dark rounded-md px-4 py-2 font-body-md text-on-surface focus:ring-0" type="text" value="Alex Chen" />
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-1">Email Address</label>
<input className="w-full input-dark rounded-md px-4 py-2 font-body-md text-on-surface focus:ring-0" type="email" value="alex.chen@enterprise.net" />
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-1">Secure Contact Number</label>
<input className="w-full input-dark rounded-md px-4 py-2 font-body-md text-on-surface focus:ring-0" type="tel" value="+1 (555) 019-8472" />
</div>
<div className="flex justify-end pt-2">
<button className="px-6 py-2 rounded-lg btn-primary font-label-md text-label-md font-bold" type="button">Save Changes</button>
</div>
</form>
</section>

<section>
<h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4 border-b border-white/5 pb-2">Authentication</h4>
<form className="space-y-4">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-1">Current Password</label>
<input className="w-full input-dark rounded-md px-4 py-2 font-body-md text-on-surface focus:ring-0" placeholder="••••••••" type="password" />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-1">New Password</label>
<input className="w-full input-dark rounded-md px-4 py-2 font-body-md text-on-surface focus:ring-0" type="password" />
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-1">Confirm Password</label>
<input className="w-full input-dark rounded-md px-4 py-2 font-body-md text-on-surface focus:ring-0" type="password" />
</div>
</div>
<div className="flex justify-end pt-2">
<button className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-on-surface font-label-md text-label-md transition-colors" type="button">Update Key</button>
</div>
</form>
</section>

<section className="mt-12 pt-8 border-t border-error/20">
<h4 className="font-label-caps text-label-caps text-error mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-sm">warning</span> Danger Zone
                        </h4>
<div className="bg-error/5 border border-error/10 rounded-lg p-4 space-y-4">
<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
<div>
<p className="font-label-md text-label-md text-on-surface">Export Vault Data</p>
<p className="font-body-sm text-body-sm text-on-surface-variant/70">Download a secure archive of all your activity and metadata.</p>
</div>
<button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-on-surface font-label-md text-label-md whitespace-nowrap transition-colors">Export .CSV</button>
</div>
<div className="h-px bg-error/10 w-full"></div>
<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
<div>
<p className="font-label-md text-label-md text-error">Terminate Identity</p>
<p className="font-body-sm text-body-sm text-on-surface-variant/70">Permanently erase your digital footprint from the NeoVault ecosystem.</p>
</div>
<button className="px-4 py-2 rounded-lg bg-error/10 hover:bg-error/20 text-error border border-error/30 font-label-md text-label-md whitespace-nowrap transition-colors">Delete Account</button>
</div>
</div>
</section>
</div>
</div>
</div>
</main>

    </>
  );
}
