import React from 'react';
import { Link } from 'react-router-dom';

export default function AiParsingResults() {
  return (
    <>


<div className="fixed inset-0 z-[-1] bg-[#0B0F19]"></div>

<nav className="fixed left-0 top-0 h-full w-[280px] sidenav-bg shadow-2xl shadow-primary/5 flex flex-col py-base z-50 hidden md:flex">
<div className="px-6 py-8 flex flex-col gap-2 border-b border-white/5 mb-4">
<h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">NeoVault</h1>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Enterprise SaaS</span>
</div>
<div className="flex-1 flex flex-col gap-1 px-3">
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg" to="/dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span>Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg" to="/vault">
<span className="material-symbols-outlined">folder_managed</span>
<span>Vault</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 rounded-r-lg" to="/upload">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>upload_file</span>
<span className="font-medium">Document Upload</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg" to="/url-scanner">
<span className="material-symbols-outlined">travel_explore</span>
<span>URL Scanner</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg" to="/form-autofill">
<span className="material-symbols-outlined">bolt</span>
<span>Form Autofill</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg mt-auto" to="/profile">
<span className="material-symbols-outlined">person</span>
<span>Profile</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg" to="/settings">
<span className="material-symbols-outlined">settings</span>
<span>Settings</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg" to="/admin">
<span className="material-symbols-outlined">admin_panel_settings</span>
<span>Admin Portal</span>
</Link>
</div>
<div className="px-6 py-6 mt-4">
<button className="w-full btn-primary font-body-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
<span className="material-symbols-outlined text-[20px]">add</span>
                New Document
            </button>
</div>
</nav>

<header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface/60 backdrop-blur-lg border-b border-white/5 flex justify-between items-center px-margin-desktop z-40 hidden md:flex">
<div className="flex items-center gap-6">
<span className="font-label-md text-label-md text-tertiary-fixed-dim flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim neon-glow-tertiary"></span>
                Security Status: Secure
            </span>
<span className="font-label-md text-label-md text-on-surface-variant">
                AI credits: 84%
            </span>
</div>
<div className="flex items-center gap-4">
<button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5">
<span className="material-symbols-outlined">verified_user</span>
</button>
<div className="w-8 h-8 rounded-full bg-surface-bright border border-outline-variant overflow-hidden ml-2 cursor-pointer">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="A professional headshot of a corporate user in a dark, moody high-tech environment. The lighting is cinematic with subtle cyan rim light. The individual looks confident and focused." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB-wcJLPT7vwBzWSdvp9V0uAUzw3JnZ3iPilnx7o2S01KwrzFMMLgpJ8dNypPoDZEQwz_avNF_EkJwldL6D_tSWMd4-KfDz1Zcp_y2s-HwTKfbVHxIhsHmIwON3vP2N3pBP-xXd6I0dczF-18rF6c2YQ3kz_UH0axq_nty0HZF2-ysHUAOaR76h9aHs_2Is2zuwtDwDIZ5STP16A50j7FjyscahXdqSLZSuMmBYNv7d2j6CX6Cy95nVRjve9tpxCKiCiz3_x3XsM2m" />
</div>
</div>
</header>

<main className="md:ml-[280px] pt-16 min-h-screen flex flex-col">
<div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">

<div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<div className="flex items-center gap-2 mb-2 text-primary font-label-caps text-label-caps uppercase">
<span className="material-symbols-outlined text-[16px]">psychology</span>
                        Neural Engine Active
                    </div>
<h2 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface">AI Parsing Result</h2>
<p className="font-body-md text-on-surface-variant mt-2 max-w-2xl">Review and verify the data extracted from the uploaded document before committing to the secure vault.</p>
</div>
<div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-lg border border-white/5">
<span className="material-symbols-outlined text-tertiary">task_alt</span>
<span className="font-label-caps text-label-caps text-on-surface">Scan Complete</span>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">

<div className="md:col-span-4 flex flex-col gap-gutter">
<div className="glass-card rounded-xl p-1 overflow-hidden h-[300px] relative group">
<div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10 pointer-events-none opacity-60"></div>
<img alt="Document Preview" className="w-full h-full object-cover rounded-lg opacity-80" data-alt="A macro shot of a highly secure, encrypted digital document interface glowing on a dark screen. The document contains abstract data blocks, barcodes, and biometric markers illuminated by electric blue and green neon lights against a deep obsidian background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7P9IaFt_uc6DBA-D-lYxdHcvVrCY-8tmo0YJ52YVZrv-tey-5fqNH-Rq4YRNKx3fUsatEySgsaflDqUUh9skhSSci24t7WV5reUxW8llc4d-ERpLG_bw7wcnrV1pMvNJPvCcZ65MXYzUXYAKdYjkphP6xh6zJc8P9lgGb79MgwV4t3v08kj00Btq78QVUKIdj9GzincDpiX7WRvruTAcQn5ERM5HGCTruelBHTpKtZpIPLvE49ESHsSmBqo46FT_xWVHYwsOObOV9" />
<div className="absolute bottom-4 left-4 z-20">
<span className="font-label-caps text-label-caps text-primary uppercase bg-surface-container/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20">Source Document</span>
</div>
<div className="absolute top-4 right-4 z-20">
<button className="w-8 h-8 rounded-full bg-surface-container/80 backdrop-blur-md flex items-center justify-center border border-white/10 hover:border-primary/50 transition-colors text-on-surface">
<span className="material-symbols-outlined text-[18px]">zoom_in</span>
</button>
</div>
</div>
<div className="glass-card rounded-xl p-6">
<h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4">Metadata</h3>
<div className="space-y-3 font-body-sm text-on-surface">
<div className="flex justify-between border-b border-white/5 pb-2">
<span className="text-on-surface-variant">File Type</span>
<span>Encrypted PDF</span>
</div>
<div className="flex justify-between border-b border-white/5 pb-2">
<span className="text-on-surface-variant">Processed At</span>
<span>14:23:05 UTC</span>
</div>
<div className="flex justify-between pb-1">
<span className="text-on-surface-variant">Engine Confidence</span>
<span className="text-tertiary">94% Avg</span>
</div>
</div>
</div>
</div>

<div className="md:col-span-8 glass-card rounded-xl p-6 lg:p-8 flex flex-col">
<div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
<h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary">chip_extraction</span>
                            Extracted Entities
                        </h3>
<span className="badge-safe font-label-caps text-label-caps px-3 py-1 rounded-full">All Fields Validated</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

<div className="flex flex-col gap-2">
<div className="flex justify-between items-center">
<label className="font-label-md text-label-md text-on-surface-variant">Full Name</label>
<span className="badge-safe font-label-caps text-label-caps px-2 py-0.5 rounded text-[10px]">99%</span>
</div>
<div className="relative">
<input className="w-full form-input-dark rounded-lg py-3 px-4 font-body-md text-on-surface" type="text" value="Eleanor Vance" />
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">edit</span>
</div>
</div>

<div className="flex flex-col gap-2">
<div className="flex justify-between items-center">
<label className="font-label-md text-label-md text-on-surface-variant">Date of Birth</label>
<span className="badge-safe font-label-caps text-label-caps px-2 py-0.5 rounded text-[10px]">98%</span>
</div>
<div className="relative">
<input className="w-full form-input-dark rounded-lg py-3 px-4 font-body-md text-on-surface" type="text" value="1985-10-24" />
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">edit</span>
</div>
</div>

<div className="flex flex-col gap-2">
<div className="flex justify-between items-center">
<label className="font-label-md text-label-md text-on-surface-variant">Email Address</label>
<span className="badge-safe font-label-caps text-label-caps px-2 py-0.5 rounded text-[10px]">99%</span>
</div>
<div className="relative">
<input className="w-full form-input-dark rounded-lg py-3 px-4 font-body-md text-on-surface" type="email" value="e.vance@cryptocorp.net" />
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">edit</span>
</div>
</div>

<div className="flex flex-col gap-2">
<div className="flex justify-between items-center">
<label className="font-label-md text-label-md text-on-surface-variant">Phone Number</label>
<span className="badge-safe font-label-caps text-label-caps px-2 py-0.5 rounded text-[10px]">96%</span>
</div>
<div className="relative">
<input className="w-full form-input-dark rounded-lg py-3 px-4 font-body-md text-on-surface" type="tel" value="+1 (555) 019-8372" />
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">edit</span>
</div>
</div>

<div className="flex flex-col gap-2 md:col-span-2">
<div className="flex justify-between items-center">
<label className="font-label-md text-label-md text-on-surface-variant">Residential Address</label>
<span className="badge-safe font-label-caps text-label-caps px-2 py-0.5 rounded text-[10px]">92%</span>
</div>
<div className="relative">
<input className="w-full form-input-dark rounded-lg py-3 px-4 font-body-md text-on-surface" type="text" value="482 Cipher Street, Level 4, Block B, Neo-Seattle, WA 98101" />
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">edit</span>
</div>
</div>

<div className="flex flex-col gap-2 md:col-span-2">
<div className="flex justify-between items-center">
<label className="font-label-md text-label-md text-on-surface-variant">Extracted Identification Numbers</label>
<span className="badge-safe font-label-caps text-label-caps px-2 py-0.5 rounded text-[10px]">97%</span>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-low border border-white/5 rounded-lg p-3 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-caps text-[10px] text-on-surface-variant mb-1">Passport No.</span>
<span className="font-body-md text-on-surface tracking-wider">A8392019X</span>
</div>
</div>
<div className="bg-surface-container-low border border-white/5 rounded-lg p-3 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-caps text-[10px] text-on-surface-variant mb-1">Tax ID</span>
<span className="font-body-md text-on-surface tracking-wider">XXX-XX-9821</span>
</div>
</div>
</div>
</div>
</div>
<div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
<button className="px-6 py-3 rounded-lg font-body-md text-on-surface border border-white/10 hover:bg-white/5 transition-colors">
                            Discard
                        </button>
<button className="btn-primary px-8 py-3 rounded-lg font-body-md font-medium flex items-center gap-2">
<span className="material-symbols-outlined">lock</span>
                            Save to Vault
                        </button>
</div>
</div>
</div>
</div>
</main>

    </>
  );
}
