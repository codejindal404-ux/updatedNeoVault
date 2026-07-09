import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function IdentityVault() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVaultEntries();
  }, []);

  const fetchVaultEntries = async () => {
    try {
      const response = await api.get('/vault');
      setEntries(response.data);
    } catch (err) {
      console.error('Failed to fetch vault entries:', err);
      setError('Failed to load vault entries.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vault entry?')) return;
    try {
      await api.delete(`/vault/${id}`);
      fetchVaultEntries();
    } catch (err) {
      console.error('Failed to delete vault entry:', err);
      alert('Failed to delete vault entry. Please try again.');
    }
  };

  const groupedEntries = {
    identity: entries.filter(e => e.category === 'identity'),
    financial: entries.filter(e => e.category === 'financial'),
    medical: entries.filter(e => e.category === 'medical'),
    other: entries.filter(e => e.category === 'other'),
  };
  return (
    <>


<nav className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface/60 backdrop-blur-lg border-b border-white/5 z-40 hidden md:flex justify-between items-center px-margin-desktop shadow-sm">
<div className="flex items-center gap-6">
<span className="font-headline-md text-headline-md font-bold text-primary primary-glow tracking-tight">NeoVault</span>
<div className="h-4 w-px bg-white/10"></div>
<div className="flex gap-4">
<span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#68f5b8]"></span>
                    Security Status: Secure
                </span>
<span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[14px] text-secondary">memory</span>
                    AI credits: 84%
                </span>
</div>
</div>
<div className="flex items-center gap-4">
<div className="relative w-64 mr-4">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
<input className="w-full bg-surface-container-high border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/50" placeholder="Search Vault..." type="text" />
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full shadow-[0_0_6px_#a4e6ff]"></span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined text-tertiary">verified_user</span>
</button>
<div className="h-8 w-8 rounded-full bg-surface-container-highest border border-white/10 overflow-hidden ml-2 cursor-pointer hover:border-primary/50 transition-all">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="A professional headshot of a corporate user with subtle cyber-punk blue lighting accents on one side of their face. High definition, dark mode aesthetic, deep obsidian background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3uv4TqqbXQOh2hgLnqZCbvDT4PNVYypigLzwfbVioE-iCPTuRj5QNziPqtEoI_ZRcBp-87oDs1oG4vUvpMwfnyjXmTI_EU5YAfdnxji2UvtWexfx35PX6uJVlTM1J20LBZLLFVCrgsObhZ1rFmB8psBOGpTTS7HP3Wgq6V0kNaUHZMAIsqFdEku1WGojxpqCfRK7CwWdLi6gdrv6Qui6Wre2Rybhdo_JnpZyQZN9gfWGf9sWIg38QfXDGC1aCYcVQ90W0el6XIpyS" />
</div>
</div>
</nav>

<aside className="fixed left-0 top-0 h-full w-[280px] bg-surface/80 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-primary/5 z-50 flex flex-col py-base hidden md:flex">
<div className="px-6 py-6 mb-4 flex items-center gap-4">
<div className="w-10 h-10 rounded-lg bg-surface-container-highest border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[24px]">shield_lock</span>
</div>
<div>
<h1 className="font-headline-md text-headline-md font-bold text-primary primary-glow">NeoVault</h1>
<p className="font-label-caps text-label-caps text-on-surface-variant">Enterprise SaaS</p>
</div>
</div>
<nav className="flex-1 px-4 space-y-1">
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] transition-transform" to="/dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-body-md text-body-md">Dashboard</span>
</Link>
<Link className="relative flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 rounded-r-lg active:scale-[0.98] transition-transform" to="/vault">
<div className="nav-glow-line"></div>
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>folder_managed</span>
<span className="font-body-md text-body-md font-medium">Vault</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] transition-transform" to="/upload">
<span className="material-symbols-outlined">upload_file</span>
<span className="font-body-md text-body-md">Document Upload</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] transition-transform" to="/url-scanner">
<span className="material-symbols-outlined">travel_explore</span>
<span className="font-body-md text-body-md">URL Scanner</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] transition-transform" to="/form-autofill">
<span className="material-symbols-outlined">bolt</span>
<span className="font-body-md text-body-md">Form Autofill</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] transition-transform" to="/profile">
<span className="material-symbols-outlined">person</span>
<span className="font-body-md text-body-md">Profile</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] transition-transform" to="/settings">
<span className="material-symbols-outlined">settings</span>
<span className="font-body-md text-body-md">Settings</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] transition-transform" to="/admin">
<span className="material-symbols-outlined">admin_panel_settings</span>
<span className="font-body-md text-body-md">Admin Portal</span>
</Link>
</nav>
<div className="px-6 py-4 mt-auto">
<button className="w-full flex items-center justify-center gap-2 btn-primary font-label-md text-label-md rounded-lg py-3 px-4 active:scale-[0.98]">
<span className="material-symbols-outlined text-[18px]">add</span>
<span className="font-bold tracking-wide">New Document</span>
</button>
</div>
</aside>

<main className="md:ml-[280px] pt-16 min-h-screen bg-grid relative flex flex-col">

<div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
<div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
<div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-secondary-container/10 blur-[120px]"></div>
</div>
<div className="relative z-10 px-margin-mobile md:px-margin-desktop py-lg max-w-container-max mx-auto w-full flex-1">

<header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h2 className="font-headline-xl text-headline-xl text-on-surface mb-2">Identity Vault</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">Manage and secure your verified identity fields.</p>
</div>
<div className="flex items-center gap-4">
<button className="btn-ghost flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Add Custom Field
                    </button>
<div className="relative group">
<button className="glass-card flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[18px]">download</span>
                            Export
                            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
</button>

<div className="absolute right-0 top-full mt-2 w-32 glass-card rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
<button className="w-full text-left px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-white/5 hover:text-primary transition-colors">Export JSON</button>
<button className="w-full text-left px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-white/5 hover:text-primary transition-colors">Export PDF</button>
</div>
</div>
</div>
</header>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

<div className="lg:col-span-12 flex flex-col gap-6">

{isLoading ? (
  <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
    <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-primary">progress_activity</span>
    <p>Loading Vault Entries...</p>
  </div>
) : error ? (
  <div className="p-4 rounded bg-error/10 border border-error/50 text-error text-center">
    {error}
  </div>
) : entries.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
    <span className="material-symbols-outlined text-6xl mb-4 opacity-20">folder_open</span>
    <p className="font-body-lg">No entries yet.</p>
    <p className="text-sm mt-2">Upload a document and save extracted data to your vault.</p>
  </div>
) : (
  <>
    {groupedEntries.identity.length > 0 && (
      <section className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <h3 className="font-label-caps text-label-caps text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">account_box</span>
            Identity Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedEntries.identity.map(entry => (
            <div key={entry.id} className="group relative bg-surface-container-low rounded-lg p-3 border border-transparent hover:border-white/10 transition-colors">
              <span className="block font-label-md text-label-md text-on-surface-variant mb-1">{entry.field_name}</span>
              <span className="block font-body-md text-body-md text-on-surface font-medium truncate">{entry.field_value}</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-surface-container-low pl-2">
                <button onClick={() => handleDelete(entry.id)} className="text-outline hover:text-error transition-colors" title="Delete">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {groupedEntries.financial.length > 0 && (
      <section className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <h3 className="font-label-caps text-label-caps text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            Financial Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedEntries.financial.map(entry => (
            <div key={entry.id} className="group relative bg-surface-container-low rounded-lg p-3 border border-transparent hover:border-white/10 transition-colors">
              <span className="block font-label-md text-label-md text-on-surface-variant mb-1">{entry.field_name}</span>
              <span className="block font-body-md text-body-md text-on-surface font-medium truncate">{entry.field_value}</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-surface-container-low pl-2">
                <button onClick={() => handleDelete(entry.id)} className="text-outline hover:text-error transition-colors" title="Delete">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {groupedEntries.medical.length > 0 && (
      <section className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <h3 className="font-label-caps text-label-caps text-tertiary flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">medical_services</span>
            Medical Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedEntries.medical.map(entry => (
            <div key={entry.id} className="group relative bg-surface-container-low rounded-lg p-3 border border-transparent hover:border-white/10 transition-colors">
              <span className="block font-label-md text-label-md text-on-surface-variant mb-1">{entry.field_name}</span>
              <span className="block font-body-md text-body-md text-on-surface font-medium truncate">{entry.field_value}</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-surface-container-low pl-2">
                <button onClick={() => handleDelete(entry.id)} className="text-outline hover:text-error transition-colors" title="Delete">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {groupedEntries.other.length > 0 && (
      <section className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <h3 className="font-label-caps text-label-caps text-outline flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">folder</span>
            Other Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedEntries.other.map(entry => (
            <div key={entry.id} className="group relative bg-surface-container-low rounded-lg p-3 border border-transparent hover:border-white/10 transition-colors">
              <span className="block font-label-md text-label-md text-on-surface-variant mb-1">{entry.field_name}</span>
              <span className="block font-body-md text-body-md text-on-surface font-medium truncate">{entry.field_value}</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-surface-container-low pl-2">
                <button onClick={() => handleDelete(entry.id)} className="text-outline hover:text-error transition-colors" title="Delete">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}
  </>
)}

</div>
</div>
</div>
</main>

    </>
  );
}
