import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import NotificationDropdown from '../components/NotificationDropdown.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/auth/dashboard-stats');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setError("Could not load stats data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const username = user?.email ? user.email.split('@')[0] : 'User';

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>

      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none z-[-1]"></div>

      <aside className="hidden md:flex fixed left-0 top-0 h-full w-[280px] bg-surface/80 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-primary/5 flex-col py-base z-50">
        <div className="px-6 py-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary font-bold text-[24px]">lock</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">NeoVault</h1>
            <p className="font-label-md text-label-md text-on-surface-variant">Enterprise SaaS</p>
          </div>
        </div>
        <div className="px-4 mb-6">
          <button className="w-full btn-primary py-3 rounded-lg font-body-sm font-medium flex items-center justify-center gap-2 transition-all duration-300">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Document
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto flex flex-col gap-1 px-2">
          <Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 rounded-r-lg group relative overflow-hidden" to="/dashboard">
            <span className="material-symbols-outlined text-[20px] relative z-10" style={{fontVariationSettings: '\'FILL\' 1'}}>dashboard</span>
            <span className="font-body-md text-body-md relative z-10 font-medium">Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 rounded-lg group" to="/vault">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">folder_managed</span>
            <span className="font-body-md text-body-md">Vault</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 rounded-lg group" to="/upload">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">upload_file</span>
            <span className="font-body-md text-body-md">Document Upload</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 rounded-lg group" to="/url-scanner">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">travel_explore</span>
            <span className="font-body-md text-body-md">URL Scanner</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 rounded-lg group" to="/form-autofill">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">bolt</span>
            <span className="font-body-md text-body-md">Form Autofill</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 rounded-lg group" to="/profile">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">person</span>
            <span className="font-body-md text-body-md">Profile</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 rounded-lg group" to="/settings">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">settings</span>
            <span className="font-body-md text-body-md">Settings</span>
          </Link>
          <div className="mt-8 mb-2 px-6">
            <span className="font-label-caps text-label-caps text-outline uppercase">Administration</span>
          </div>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 rounded-lg group" to="/admin">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">admin_panel_settings</span>
            <span className="font-body-md text-body-md">Admin Portal</span>
          </Link>
        </nav>
      </aside>

      <div className="md:ml-[280px] h-screen overflow-hidden flex flex-col">
        <header className="hidden md:flex fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface/60 backdrop-blur-lg border-b border-white/5 z-40 justify-between items-center px-margin-desktop">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-surface-container-high/50 rounded-full px-3 py-1.5 border border-white/5">
              <span className="material-symbols-outlined text-tertiary text-[16px]">security</span>
              <span className="font-label-md text-label-md text-tertiary">Security Status: Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-high/50 rounded-full px-3 py-1.5 border border-white/5">
              <span className="material-symbols-outlined text-secondary text-[16px]">memory</span>
              <span className="font-label-md text-label-md text-secondary">AI credits: 84%</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <Link className="flex items-center gap-3 hover:bg-white/5 px-2 py-1 rounded-lg transition-colors" to="/profile">
              <img alt="User Avatar" className="w-8 h-8 rounded-full object-cover border border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNiRq5TsT3xfW9vEkmuUFsxlCctpbvqksCayany35Uj61CySH_7WnZEA81jo0eiIdzijcfUV5Ie1CeWJHbO9pr8M34hm2GryPm2QbGhRoc1ZofFJySxZ7JyWegFpKXJ8dAmeMrIFAvDkP74a2F91LeGkGOQeOGddrg2f9Q1_4LcB3j9nlOuqu84xR00y-ef3ViZsJrFtqH22Mo62Ppq8jYWaCl-nToS1ujHHVRMY6VYZITfhVm-iQdNclye1Cz9NwTizQfSgd7zC4c" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-margin-mobile md:p-margin-desktop md:pt-[calc(16px+64px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto">
            <div className="lg:col-span-8 flex flex-col gap-gutter">
              <div className="glass-panel rounded-xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 glow-hover transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent opacity-50 blur-2xl rounded-full pointer-events-none"></div>
                <div className="relative z-10 flex-1">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Welcome back, <span className="text-primary font-bold">{username}</span></h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    Your vault security is optimal. {stats?.total_documents ? `You have saved ${stats.total_documents} documents in the vault.` : "Upload a document to start parsing."}
                  </p>
                  <div className="bg-surface-container/50 rounded-lg p-4 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-label-md text-label-md text-on-surface">Vault Completion Profile</span>
                      <span className="font-label-md text-label-md text-primary">78%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-bright rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary w-[78%] rounded-full shadow-[0_0_8px_rgba(164,230,255,0.6)]"></div>
                    </div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mt-2 text-xs">Add recovery email to reach 100%</p>
                  </div>
                </div>
                <div className="relative z-10 shrink-0 w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-dashed animate-[spin_20s_linear_infinite]"></div>
                  <div className="absolute inset-2 rounded-full border border-secondary/30 animate-[spin_15s_linear_infinite_reverse]"></div>
                  <div className="w-20 h-20 rounded-full bg-surface-container-high border border-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(164,230,255,0.2)]">
                    <span className="material-symbols-outlined text-[36px] text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>shield_locked</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel rounded-lg p-5 flex flex-col justify-between h-32 glow-hover transition-all duration-300 group">
                  <div className="flex justify-between items-start">
                    <span className="font-label-caps text-label-caps text-outline">Total Docs</span>
                    <span className="material-symbols-outlined text-[20px] text-primary group-hover:scale-110 transition-transform">description</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">
                      {loading ? "..." : (stats?.total_documents ?? 0)}
                    </div>
                    <div className="flex items-center gap-1 text-tertiary mt-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span className="font-label-md text-label-md text-[11px]">Sync Live</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-lg p-5 flex flex-col justify-between h-32 glow-hover transition-all duration-300 group">
                  <div className="flex justify-between items-start">
                    <span className="font-label-caps text-label-caps text-outline">Vault Entries</span>
                    <span className="material-symbols-outlined text-[20px] text-secondary group-hover:scale-110 transition-transform">folder_special</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">
                      {loading ? "..." : (stats?.vault_entries ?? 0)}
                    </div>
                    <div className="flex items-center gap-1 text-secondary mt-1">
                      <span className="material-symbols-outlined text-[14px]">encrypted</span>
                      <span className="font-label-md text-label-md text-[11px]">Fernet Encrypted</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-lg p-5 flex flex-col justify-between h-32 glow-hover transition-all duration-300 group">
                  <div className="flex justify-between items-start">
                    <span className="font-label-caps text-label-caps text-outline">URL Scans</span>
                    <span className="material-symbols-outlined text-[20px] text-tertiary group-hover:scale-110 transition-transform">travel_explore</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">
                      {loading ? "..." : (stats?.total_scans ?? 0)}
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant mt-1">
                      <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
                      <span className="font-label-md text-label-md text-[11px]">Scanner Online</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-lg p-5 flex flex-col justify-between h-32 glow-hover transition-all duration-300 group">
                  <div className="flex justify-between items-start">
                    <span className="font-label-caps text-label-caps text-outline">AI Requests</span>
                    <span className="material-symbols-outlined text-[20px] text-primary group-hover:scale-110 transition-transform">memory</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">
                      {loading ? "..." : (stats?.total_documents ?? 0)}
                    </div>
                    <div className="w-full bg-surface-bright h-1 rounded-full mt-3 overflow-hidden">
                      <div className="w-[100%] h-full bg-gradient-to-r from-transparent to-primary"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-6">
                <h3 className="font-label-caps text-label-caps text-outline mb-4">Quick Operations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/upload" className="bg-surface-container/40 hover:bg-surface-container border border-white/5 hover:border-primary/30 rounded-lg p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 group h-32 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <span className="material-symbols-outlined text-[24px] text-primary">cloud_upload</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center">Upload Document</span>
                  </Link>
                  <Link to="/vault" className="bg-surface-container/40 hover:bg-surface-container border border-white/5 hover:border-secondary/30 rounded-lg p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 group h-32 text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 group-hover:scale-110 transition-all">
                      <span className="material-symbols-outlined text-[24px] text-secondary">folder_open</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface group-hover:text-secondary transition-colors text-center">Open Vault</span>
                  </Link>
                  <Link to="/url-scanner" className="bg-surface-container/40 hover:bg-surface-container border border-white/5 hover:border-tertiary/30 rounded-lg p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 group h-32 text-center">
                    <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center group-hover:bg-tertiary/20 group-hover:scale-110 transition-all">
                      <span className="material-symbols-outlined text-[24px] text-tertiary">radar</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface group-hover:text-tertiary transition-colors text-center">Scan URL</span>
                  </Link>
                  <Link to="/form-autofill" className="bg-surface-container/40 hover:bg-surface-container border border-white/5 hover:border-primary-fixed-dim/30 rounded-lg p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 group h-32 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/10 flex items-center justify-center group-hover:bg-primary-fixed-dim/20 group-hover:scale-110 transition-all">
                      <span className="material-symbols-outlined text-[24px] text-primary-fixed-dim">auto_awesome</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface group-hover:text-primary-fixed-dim transition-colors text-center">Autofill Forms</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-gutter">
              <div className="glass-panel rounded-xl p-6 flex-1 flex flex-col max-h-[800px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-label-caps text-label-caps text-outline">Activity Log</h3>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10 z-0"></div>
                  <div className="flex flex-col gap-6 relative z-10">
                    {loading && (
                      <div className="text-center py-8 text-on-surface-variant opacity-60">
                        Loading activity...
                      </div>
                    )}
                    {!loading && (!stats?.recent_activity || stats.recent_activity.length === 0) && (
                      <div className="text-center py-8 text-on-surface-variant opacity-50 font-body-sm">
                        No recent activity logs.
                      </div>
                    )}
                    {stats?.recent_activity?.map(log => {
                      const timeAgo = (dateString) => {
                        if (!dateString) return '';
                        const date = new Date(dateString);
                        const now = new Date();
                        const diffInSeconds = Math.floor((now - date) / 1000);
                        if (diffInSeconds < 60) return 'Just now';
                        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
                        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
                        return `${Math.floor(diffInSeconds / 86400)}d ago`;
                      };

                      const getLogDetails = (action) => {
                        const actions = {
                          login: {
                            title: "New Login Detected",
                            desc: `Authorized session from IP`,
                            icon: "login",
                            colorClass: "border-primary/30 group-hover:border-primary group-hover:shadow-[0_0_10px_rgba(164,230,255,0.3)] text-primary"
                          },
                          password_reset: {
                            title: "Password Updated",
                            desc: "Account security key changed",
                            icon: "lock_reset",
                            colorClass: "border-error/30 group-hover:border-error group-hover:shadow-[0_0_10px_rgba(255,107,107,0.3)] text-error"
                          },
                          upload: {
                            title: "Document Uploaded",
                            desc: "Processed by Neural Engine",
                            icon: "cloud_upload",
                            colorClass: "border-secondary/30 group-hover:border-secondary group-hover:shadow-[0_0_10px_rgba(237,177,255,0.3)] text-secondary"
                          },
                          vault_save: {
                            title: "Vault Sync Complete",
                            desc: "Secure fields saved to Vault",
                            icon: "folder_special",
                            colorClass: "border-tertiary/30 group-hover:border-tertiary group-hover:shadow-[0_0_10px_rgba(104,245,184,0.3)] text-tertiary"
                          }
                        };
                        return actions[action] || {
                          title: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                          desc: "Security event processed",
                          icon: "info",
                          colorClass: "border-white/20 text-on-surface-variant"
                        };
                      };

                      const details = getLogDetails(log.action);

                      return (
                        <div key={log.id} className="flex gap-4 group cursor-pointer">
                          <div className={`w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border transition-all shrink-0 z-10 ${details.colorClass}`}>
                            <span className="material-symbols-outlined text-[16px]">{details.icon}</span>
                          </div>
                          <div className="flex-1 pb-4 border-b border-white/5 group-hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-body-sm text-on-surface group-hover:text-primary transition-colors">{details.title}</h4>
                              <span className="font-label-md text-[10px] text-on-surface-variant">{timeAgo(log.timestamp)}</span>
                            </div>
                            <p className="font-label-md text-on-surface-variant text-xs">{details.desc} {log.ip_address || ''}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
