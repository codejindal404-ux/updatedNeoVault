import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import logger from '../services/logger';

const DEFAULTS = {
  darkMode: true,
  neonGlow: true,
  pushAlerts: true,
  emailDigests: false,
  sessionLimits: true,
  apiKeys: false,
  telemetry: false,
};

function Toggle({ id, checked, onChange, size = 'md' }) {
  const w = size === 'md' ? 'w-12' : 'w-10';
  const h = size === 'md' ? 'h-6' : 'h-5';
  const dot = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const translateOn = size === 'md' ? 'translate-x-6' : 'translate-x-[18px]';
  const topOff = size === 'md' ? 'top-1 left-1' : 'top-[3px] left-[3px]';

  return (
    <div className={`relative inline-flex items-center ${w} ${h} cursor-pointer shrink-0`} onClick={onChange}>
      <div className={`
        ${w} ${h} rounded-full border transition-all duration-300
        ${checked
          ? 'bg-primary/20 border-primary shadow-[0_0_10px_rgba(164,230,255,0.25)]'
          : 'bg-surface-container-highest border-outline-variant'}
      `}>
        <span className={`
          absolute ${topOff} ${dot} rounded-full transition-transform duration-300 ease-out
          ${checked
            ? `${translateOn} bg-primary shadow-[0_0_8px_rgba(164,230,255,0.7)]`
            : 'translate-x-0 bg-on-surface-variant'}
        `} />
      </div>
    </div>
  );
}

function SettingRow({ id, title, subtitle, storageKey, settings, onToggle, disabled = false, badge = null, customChecked = null }) {
  const checked = disabled ? true : (customChecked !== null ? customChecked : (settings[storageKey] ?? false));
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex-1 min-w-0">
        <h4 className="font-body-md text-body-md text-on-surface flex items-center gap-2 flex-wrap">
          {title}
          {badge && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-label-caps whitespace-nowrap ${
              badge === 'ACTIVE' ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 
              badge === 'REQUIRED' ? 'bg-error/10 text-error border border-error/20' : 
              'bg-white/5 text-on-surface-variant border border-white/10'
            }`}>
              {badge}
            </span>
          )}
        </h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">{subtitle}</p>
      </div>
      {disabled ? (
        <div className={`relative inline-flex items-center w-10 h-5 shrink-0`}>
          <div className="w-10 h-5 rounded-full border bg-primary/20 border-primary shadow-[0_0_10px_rgba(164,230,255,0.2)] cursor-not-allowed">
            <span className="absolute top-[3px] left-[3px] w-3.5 h-3.5 rounded-full bg-primary translate-x-[18px] transition-transform duration-300" />
          </div>
        </div>
      ) : (
        <Toggle
          id={id}
          checked={checked}
          onChange={() => onToggle(storageKey)}
          size="sm"
        />
      )}
    </div>
  );
}

export default function SystemSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('neovault_settings');
      if (saved) return { ...DEFAULTS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULTS;
  });

  const [saved, setSaved] = useState(false);
  
  // Real backend state
  const [realEmailNotifications, setRealEmailNotifications] = useState(true);
  const [loginHistory, setLoginHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  // Clear Activity Log modal
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  
  useEffect(() => {
    // Fetch user data and login history
    const fetchData = async () => {
      try {
        const [meRes, historyRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/auth/login-history')
        ]);
        setRealEmailNotifications(meRes.data.email_notifications_enabled);
        setLoginHistory(historyRes.data.login_history);
      } catch (err) {
        logger.error("Failed to fetch real settings data", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('neovault_settings', JSON.stringify(updated));
      return updated;
    });
    setSaved(false);
  };

  const handleRealEmailToggle = async () => {
    const newVal = !realEmailNotifications;
    setRealEmailNotifications(newVal);
    try {
      await api.put('/auth/update-preferences', { email_notifications_enabled: newVal });
    } catch (err) {
      setRealEmailNotifications(!newVal); // revert on fail
    }
  };

  const handleSave = () => {
    localStorage.setItem('neovault_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDiscard = () => {
    try {
      const saved = localStorage.getItem('neovault_settings');
      if (saved) {
        setSettings({ ...DEFAULTS, ...JSON.parse(saved) });
      } else {
        setSettings(DEFAULTS);
      }
    } catch {
      setSettings(DEFAULTS);
    }
  };
  
  const handleClearActivityLog = async () => {
    setClearLoading(true);
    try {
      await api.delete('/auth/clear-activity-log');
      setLoginHistory([]);
      setShowClearModal(false);
    } catch (err) {
      logger.error('Failed to clear activity log:', err);
    } finally {
      setClearLoading(false);
    }
  };
  
  const handleExportVault = async () => {
    try {
      const response = await api.get('/vault/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `neovault_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      logger.error("Export failed", err);
    }
  };

  return (
    <>
      <nav className="fixed left-0 top-0 h-full w-[280px] bg-surface/80 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-primary/5 z-50 hidden md:flex flex-col py-base">
        <div className="px-6 py-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(164,230,255,0.3)]">
            <span className="material-symbols-outlined text-primary">security</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">NeoVault</h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant opacity-70">Enterprise SaaS</p>
          </div>
        </div>

        <div className="px-4 mb-4">
          <Link to="/upload" className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(164,230,255,0.3)] hover:shadow-[0_0_25px_rgba(164,230,255,0.5)] transition-all duration-300 active:scale-[0.98]">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
            New Document
          </Link>
        </div>

        <div className="flex-1 flex flex-col gap-1 px-2">
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-lg active:scale-[0.98]" to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body-md text-body-md">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-lg active:scale-[0.98]" to="/vault">
            <span className="material-symbols-outlined">folder_managed</span>
            <span className="font-body-md text-body-md">Vault</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-lg active:scale-[0.98]" to="/upload">
            <span className="material-symbols-outlined">upload_file</span>
            <span className="font-body-md text-body-md">Document Upload</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-lg active:scale-[0.98]" to="/url-scanner">
            <span className="material-symbols-outlined">travel_explore</span>
            <span className="font-body-md text-body-md">URL Scanner</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-lg active:scale-[0.98]" to="/form-autofill">
            <span className="material-symbols-outlined">bolt</span>
            <span className="font-body-md text-body-md">Form Autofill</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-lg active:scale-[0.98]" to="/profile">
            <span className="material-symbols-outlined">person</span>
            <span className="font-body-md text-body-md">Profile</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 rounded-r-lg active:scale-[0.98]" to="/settings">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>settings</span>
            <span className="font-body-md text-body-md font-medium">Settings</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-lg active:scale-[0.98]" to="/admin">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span className="font-body-md text-body-md">Admin Portal</span>
          </Link>
        </div>
      </nav>

      <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface/60 backdrop-blur-lg border-b border-white/5 z-40 hidden md:flex justify-between items-center px-margin-desktop">
        <div className="flex items-center gap-2 text-on-surface font-headline-md text-headline-md font-semibold">
          <span className="material-symbols-outlined text-primary text-[20px]">settings</span>
          System Preferences
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20">
            <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(104,245,184,0.8)]" />
            <span className="font-label-caps text-label-caps text-tertiary">Secure</span>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
            <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiDEKEgNOHXdgpWAkOGxKGJjSNwgg4krIlTnSJ5KyHCspa_eBuyoy46IVJsgrw0uxmP6B59h-5Se99LEYKkIUF6RX7cGf7-wspLyCy-DqQmYBBzfGsOeS6Ztzle_Gwo100yNA8XdDmtxA38K99B48GxypamDsjcsbQUBQmQD8PdVmbj0mIUfCpKudDAkTe5ca3ANsVD1W7exc-ZXWpGKrwRSFdsg6s1PEIzxAD3RrxHR4BzAi49XTByggdIZVnkTn7KVMxvb_jZ23x" />
          </div>
        </div>
      </header>

      <main className="md:ml-[280px] h-screen overflow-y-auto pt-20 pb-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[960px] mx-auto w-full space-y-6">

          <div className="mb-2">
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-1">System Preferences</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Configure your environment and operational parameters. Settings marked as ACTIVE apply immediately to your account.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex gap-3 items-start">
            <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">info</span>
            <div className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              <span className="text-on-surface font-medium">Note on toggle behavior:</span> All toggles are persisted and survive page reloads.
              Toggles marked <span className="text-primary font-medium">cosmetic-only</span> save your preference for a future backend integration but do not affect the app's behavior today.
              Toggles marked <span className="text-tertiary font-medium">ACTIVE</span> have an immediate effect on the backend.
            </div>
          </div>

          {/* 2FA Reminder */}
          <div className="p-4 rounded-xl border border-secondary/30 bg-secondary/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">security_update_good</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Enable 2FA for extra security</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Protect your vault from unauthorized access.</p>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-secondary/20 text-secondary font-label-caps text-[11px] border border-secondary/30">COMING SOON</span>
          </div>

          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
              <span className="material-symbols-outlined text-primary">palette</span>
              <h3 className="font-headline-md text-headline-md">Appearance</h3>
              <span className="ml-auto text-[11px] font-label-caps text-on-surface-variant/50 bg-white/5 px-2 py-0.5 rounded">cosmetic-only</span>
            </div>
            <div className="space-y-5">
              <SettingRow
                id="darkMode"
                storageKey="darkMode"
                title="Dark Mode"
                subtitle="NeoVault is permanently dark. Preference saved for future light-mode support."
                settings={settings}
                onToggle={handleToggle}
              />
              <div className="h-px bg-white/5" />
              <SettingRow
                id="neonGlow"
                storageKey="neonGlow"
                title="Neon Accent Glow"
                subtitle="Ambient glow on active elements. Preference saved — conditional CSS wiring is a roadmap item."
                settings={settings}
                onToggle={handleToggle}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
                <span className="material-symbols-outlined text-secondary">notifications_active</span>
                <h3 className="font-headline-md text-headline-md">Notifications</h3>
              </div>
              <div className="space-y-5">
                <SettingRow
                  id="emailNotifications"
                  storageKey="emailNotifications"
                  title="Security Alerts (Email)"
                  subtitle="Immediate email alerts for suspicious logins."
                  settings={settings}
                  onToggle={handleRealEmailToggle}
                  customChecked={realEmailNotifications}
                  badge="ACTIVE"
                />
                <div className="h-px bg-white/5" />
                <SettingRow
                  id="pushAlerts"
                  storageKey="pushAlerts"
                  title="Push Alerts"
                  subtitle="Browser push notifications for vault updates."
                  settings={settings}
                  onToggle={handleToggle}
                  badge="cosmetic-only"
                />
                <div className="h-px bg-white/5" />
                <SettingRow
                  id="emailDigests"
                  storageKey="emailDigests"
                  title="Weekly Digest"
                  subtitle="Summary of security scans and document activity."
                  settings={settings}
                  onToggle={handleToggle}
                  badge="cosmetic-only"
                />
              </div>
            </section>

            <section className="glass-card rounded-xl p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
                <span className="material-symbols-outlined text-primary">history</span>
                <h3 className="font-headline-md text-headline-md">Active Sessions</h3>
                <span className="ml-auto text-[11px] font-label-caps text-tertiary bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2" style={{maxHeight: "200px"}}>
                {historyLoading ? (
                  <div className="text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined animate-spin text-[16px]">refresh</span> Loading...</div>
                ) : loginHistory.length === 0 ? (
                  <div className="text-on-surface-variant text-sm">No recent login activity found.</div>
                ) : (
                  <div className="space-y-4">
                    {loginHistory.map((log) => (
                      <div key={log.id} className="flex items-center justify-between text-sm">
                        <div className="flex flex-col">
                          <span className="text-on-surface">Login successful</span>
                          <span className="text-on-surface-variant text-xs font-mono">{log.ip_address || 'Unknown IP'}</span>
                        </div>
                        <span className="text-on-surface-variant/70 text-xs text-right">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
                <span className="material-symbols-outlined text-tertiary">code</span>
                <h3 className="font-headline-md text-headline-md">Developer</h3>
                <span className="ml-auto text-[11px] font-label-caps text-on-surface-variant/50 bg-white/5 px-2 py-0.5 rounded">cosmetic-only</span>
              </div>
              <div className="space-y-5">
                <SettingRow
                  id="apiKeys"
                  storageKey="apiKeys"
                  title="Expose API Keys"
                  subtitle="Allow programmatic access via API keys. Roadmap feature — preference saved."
                  settings={settings}
                  onToggle={handleToggle}
                />
              </div>
            </section>

            <section className="glass-card rounded-xl p-6 border border-error/10">
              <div className="flex items-center gap-3 mb-6 border-b border-error/10 pb-3">
                <span className="material-symbols-outlined text-error">policy</span>
                <h3 className="font-headline-md text-headline-md text-error">Data & Privacy</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 p-3 bg-surface/40 rounded-lg border border-white/5">
                  <div>
                    <p className="font-label-md text-on-surface text-sm">Download My Data</p>
                    <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">Export all encrypted vault entries as CSV.</p>
                  </div>
                  <button onClick={handleExportVault} className="shrink-0 px-3 py-1.5 rounded border border-white/10 text-on-surface text-sm hover:bg-white/5 transition-colors flex items-center gap-1 active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[16px]">download</span> Export
                  </button>
                </div>
                
                <div className="flex items-center justify-between gap-4 p-3 bg-error/5 rounded-lg border border-error/15">
                  <div>
                    <p className="font-label-md text-error text-sm">Clear Activity Log</p>
                    <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">Wipe all recorded session history.</p>
                  </div>
                  <button onClick={() => setShowClearModal(true)} className="shrink-0 px-3 py-1.5 rounded bg-error/10 text-error border border-error/30 text-sm hover:bg-error/20 transition-colors flex items-center gap-1 active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[16px]">delete</span> Clear
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between pt-2 pb-4">
            <p className="font-body-sm text-body-sm text-on-surface-variant/60">
              Changes to cosmetic toggles auto-save. Use "Save" to explicitly confirm.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDiscard}
                className="px-5 py-2 rounded-lg border border-white/10 text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-colors active:scale-[0.98]"
              >
                Reset to Saved
              </button>
              <button
                onClick={handleSave}
                className={`px-5 py-2 rounded-lg font-label-md text-label-md transition-all duration-300 flex items-center gap-2 active:scale-[0.98] ${
                  saved
                    ? 'bg-tertiary/20 text-tertiary border border-tertiary/30'
                    : 'bg-gradient-to-r from-primary to-secondary text-on-primary shadow-[0_0_15px_rgba(164,230,255,0.3)] hover:shadow-[0_0_25px_rgba(164,230,255,0.5)]'
                }`}
              >
                {saved ? (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Saved!
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    Save Configuration
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </main>
      
      {showClearModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !clearLoading && setShowClearModal(false)} />
          <div className="relative glass-panel w-full max-w-sm rounded-2xl p-6 border border-error/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-error text-2xl">warning</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Clear Activity Log?</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                This will permanently delete all recorded session history and active session data. This cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearActivityLog}
                  disabled={clearLoading}
                  className="flex-1 py-2.5 rounded-lg bg-error text-white font-label-md text-label-md hover:bg-error/80 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {clearLoading ? <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span> : 'Yes, Clear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
