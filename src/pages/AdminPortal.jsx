import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminPortal() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data.users);
      } catch (err) {
        console.error("Admin data fetch error:", err);
        setError(err.response?.data?.error || err.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="font-headline-md text-primary animate-pulse flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          Loading Admin Portal...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="font-headline-md text-error bg-error/10 p-6 rounded-xl border border-error/20 flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <>


<nav className="hidden md:flex fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface/60 backdrop-blur-lg justify-between items-center px-margin-desktop ml-[280px] border-b border-white/5 z-40">
<div className="flex items-center gap-6">
<span className="font-headline-md text-headline-md font-bold text-primary">NeoVault</span>
<div className="hidden lg:flex gap-4">
<span className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">Security Status: Secure</span>
<span className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">AI credits: 84%</span>
</div>
</div>
<div className="flex items-center gap-4">
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">verified_user</span>
</button>
<img alt="User Avatar" className="w-8 h-8 rounded-full border border-outline-variant object-cover" data-alt="A small circular avatar profile picture of a professional user in a dark sleek tech environment, high tech lighting, blue accents, minimalist, photorealistic, 8k resolution, cinematic lighting, cybersecurity context" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk9go0vrK847dfsIRZDH5Xw42CTek5Uz4C1aT5VI-LJeOP-H9QgCfl4nFjSz_v42DpDUtsD_tR3mLRzS2L9ofzSO4T2DVn-fA6bxFUhevJ6SxCqE54NGcXOQJNgaXrGVECXT5lv7vBxVQDOG4KcUQ4LgRtq3lNVJgy1vOTKQbbGJZycVVGajS6TckF_yjbJEoB7k6Qyf02L88KR28MDSm3-nZMVV6pZ6WvaP_XIe3L5TkaJUp8Fq87nHX_Z_wSVoALUWRAZafFImaQ" />
</div>
</nav>

<aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[280px] bg-surface/80 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-primary/5 py-base z-50">
<div className="px-6 py-6 mb-4">
<div className="flex items-center gap-3">
<img alt="Organization Logo" className="w-10 h-10 rounded-lg" data-alt="A stylized geometric vector logo representing a secure vault or tech shield, glowing light blue on a dark background, minimal, clean lines, cybersecurity startup aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEZFeP9bW5Rj8DcLq9qZSMjyaQSa2h2x6C_hXKpY5WdbcoBa3mQuM3wRf4-zkR45vuyztnvY_0T2DkwGELHcuVifJJALd9AB5ZPky0ULERRxFwvCnbp_ZKx-0elQ2Bu6n8Jc60FY6HWnVZBuIXiaAXbFj0ygNKE-shaIp_lPh8fWy253Xs3qgTQKiRrBXC01GAmwPVwg7rP2B5hhioqLjIwyjG7TspCXJptMSIap8w-VOgFL4UzPqCwCXsg3vdbPRo5KvesbHcdYvX" />
<div>
<h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">NeoVault</h1>
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Enterprise SaaS</p>
</div>
</div>
</div>
<button className="mx-6 mb-8 py-3 px-4 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-label-md text-label-md shadow-[0_0_15px_rgba(0,209,255,0.3)] hover:shadow-[0_0_25px_rgba(0,209,255,0.5)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
<span className="material-symbols-outlined text-[18px]">add</span>
            New Document
        </button>
<nav className="flex-1 flex flex-col gap-1 font-body-md text-body-md">
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/dashboard">
<span className="material-symbols-outlined">dashboard</span>
                Dashboard
            </Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/vault">
<span className="material-symbols-outlined">folder_managed</span>
                Vault
            </Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/upload">
<span className="material-symbols-outlined">upload_file</span>
                Document Upload
            </Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/url-scanner">
<span className="material-symbols-outlined">travel_explore</span>
                URL Scanner
            </Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/form-autofill">
<span className="material-symbols-outlined">bolt</span>
                Form Autofill
            </Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/profile">
<span className="material-symbols-outlined">person</span>
                Profile
            </Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98]" to="/settings">
<span className="material-symbols-outlined">settings</span>
                Settings
            </Link>
<Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 active:scale-[0.98] transition-transform" to="/admin">
<span className="material-symbols-outlined">admin_panel_settings</span>
                Admin Portal
            </Link>
</nav>
</aside>

<main className="md:ml-[280px] pt-24 md:pt-24 px-margin-mobile md:px-margin-desktop pb-20 max-w-container-max mx-auto w-full">
<header className="mb-8">
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">System Command Center</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time overview of global operations and security events.</p>
</header>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">

<div className="glass-card rounded-xl p-6 relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-primary/20 transition-all duration-500"></div>
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Users</span>
<span className="material-symbols-outlined text-primary">group</span>
</div>
<div className="font-headline-xl text-headline-xl text-on-surface text-glow mb-1">{stats?.total_users || 0}</div>
<div className="flex items-center gap-1 text-tertiary font-label-md text-label-md">
<span className="material-symbols-outlined text-[14px]">verified</span>
<span>Verified: {stats?.verified_users || 0}</span>
</div>
</div>

<div className="glass-card rounded-xl p-6 relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-secondary/20 transition-all duration-500"></div>
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Uploads</span>
<span className="material-symbols-outlined text-secondary">cloud_upload</span>
</div>
<div className="font-headline-xl text-headline-xl text-on-surface mb-1">{stats?.total_documents || 0}</div>
<div className="flex items-center gap-1 text-tertiary font-label-md text-label-md">
<span className="material-symbols-outlined text-[14px]">folder_managed</span>
<span>Vault Entries: {stats?.total_vault_entries || 0}</span>
</div>
</div>

<div className="glass-card rounded-xl p-6 relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-primary/20 transition-all duration-500"></div>
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Scans Today</span>
<span className="material-symbols-outlined text-primary">radar</span>
</div>
<div className="font-headline-xl text-headline-xl text-on-surface text-glow mb-1">84,301</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
<span className="material-symbols-outlined text-[14px]">horizontal_rule</span>
<span>Stable load</span>
</div>
</div>

<div className="glass-card rounded-xl p-6 relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-error/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-error/20 transition-all duration-500"></div>
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Errors</span>
<span className="material-symbols-outlined text-error">warning</span>
</div>
<div className="font-headline-xl text-headline-xl text-on-surface mb-1">23</div>
<div className="flex items-center gap-1 text-error font-label-md text-label-md">
<span className="material-symbols-outlined text-[14px]">trending_down</span>
<span>-2% from yesterday</span>
</div>
</div>
</div>

<div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">

<div className="xl:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
<div className="p-6 border-b border-white/5 flex justify-between items-center">
<h3 className="font-headline-md text-headline-md text-on-surface">Active Personnel</h3>
<div className="flex gap-2">
<button className="p-2 rounded hover:bg-white/5 text-on-surface-variant transition-colors border border-outline-variant">
<span className="material-symbols-outlined text-[18px]">filter_list</span>
</button>
<button className="p-2 rounded hover:bg-white/5 text-on-surface-variant transition-colors border border-outline-variant">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-white/5">
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">User ID / Name</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Role</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Status</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Last Active</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal text-right">Actions</th>
</tr>
</thead>
<tbody className="font-body-sm text-body-sm">
{users.length > 0 ? users.map((user) => (
<tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className={`w-8 h-8 rounded ${user.is_admin ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'} flex items-center justify-center font-bold`}>
{user.email.substring(0, 2).toUpperCase()}
</div>
<div>
<div className="text-on-surface font-medium">{user.email}</div>
<div className="text-on-surface-variant text-xs">ID: {user.id}</div>
</div>
</div>
</td>
<td className="py-4 px-6 text-on-surface-variant">{user.is_admin ? 'Admin' : 'User'}</td>
<td className="py-4 px-6">
{user.is_active ? (
<span className="inline-flex items-center px-2 py-1 rounded status-safe font-label-caps text-label-caps border border-tertiary/20">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5 shadow-[0_0_5px_#68f5b8]"></span> Active
</span>
) : (
<span className="inline-flex items-center px-2 py-1 rounded status-danger font-label-caps text-label-caps border border-error/20">
<span className="w-1.5 h-1.5 rounded-full bg-error mr-1.5 shadow-[0_0_5px_#ffb4ab]"></span> Suspended
</span>
)}
</td>
<td className="py-4 px-6 text-on-surface-variant">
{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
</td>
<td className="py-4 px-6 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors p-1">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
</td>
</tr>
)) : (
<tr>
<td colSpan="5" className="py-4 px-6 text-center text-on-surface-variant">No users found</td>
</tr>
)}
</tbody>
</table>
</div>
</div>

<div className="glass-card rounded-xl p-6 flex flex-col relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-6 relative z-10">Threat Analytics</h3>
<div className="flex-1 flex flex-col justify-end relative z-10 h-[250px] border-b border-l border-white/10 p-4">

<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between h-[200px]">
<div className="w-1/6 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t h-[30%] border-t border-primary/50 relative group">
<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-surface p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">12k</div>
</div>
<div className="w-1/6 bg-primary/30 hover:bg-primary/50 transition-colors rounded-t h-[45%] border-t border-primary/60 relative group">
<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-surface p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">18k</div>
</div>
<div className="w-1/6 bg-primary/40 hover:bg-primary/60 transition-colors rounded-t h-[60%] border-t border-primary/70 relative group">
<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-surface p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">24k</div>
</div>
<div className="w-1/6 bg-secondary/50 hover:bg-secondary/70 transition-colors rounded-t h-[85%] border-t border-secondary/80 shadow-[0_0_15px_rgba(237,177,255,0.4)] relative group">
<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-surface p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">34k</div>
</div>
<div className="w-1/6 bg-primary/30 hover:bg-primary/50 transition-colors rounded-t h-[50%] border-t border-primary/60 relative group">
<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-surface p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">20k</div>
</div>
</div>

<svg className="absolute inset-0 w-full h-full pointer-events-none" preserveaspectratio="none" viewbox="0 0 100 100">
<path d="M0,80 Q20,70 40,50 T80,20 T100,40" fill="none" stroke="#a4e6ff" stroke-opacity="0.8" strokeWidth="1.5" style={{filter: 'drop-shadow(0 0 4px #a4e6ff)'}}></path>
</svg>
</div>
<div className="flex justify-between mt-4 text-xs text-on-surface-variant font-label-caps uppercase z-10">
<span>Mon</span>
<span>Tue</span>
<span>Wed</span>
<span>Thu</span>
<span>Fri</span>
</div>
</div>
</div>
</main>

    </>
  );
}
