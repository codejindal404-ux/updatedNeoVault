import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import NotificationDropdown from '../components/NotificationDropdown.jsx';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Password change state
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  // Export state
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1 = confirm intent, 2 = type phrase
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Profile update state
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        setUserData(response.data);
        setProfileForm({
          full_name: response.data.full_name || '',
          phone: response.data.phone || ''
        });
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load profile settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setProfileLoading(true);
    
    try {
      const response = await api.put('/auth/update-profile', profileForm);
      setUserData(prev => ({ ...prev, full_name: response.data.user.full_name, phone: response.data.user.phone }));
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwLoading(true);
    try {
      await api.post('/auth/change-password', pwForm);
      setPwSuccess(true);
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPwError(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleExportVault = async () => {
    setExportLoading(true);
    setExportError(null);
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
      setExportError('Export failed. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deletePhrase !== 'DELETE MY ACCOUNT') {
      setDeleteError("Please type 'DELETE MY ACCOUNT' exactly to confirm.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete('/auth/delete-account', { data: { confirm: 'DELETE MY ACCOUNT' } });
      // Only remove NeoVault-specific keys (don't nuke other apps' localStorage data)
      localStorage.removeItem('neovault_token');
      localStorage.removeItem('neovault_user');
      navigate('/login');
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Failed to delete account. Please try again.');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="font-headline-md text-primary animate-pulse flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          Loading profile...
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

  const displayName = userData?.email ? userData.email.split('@')[0] : 'User';

  return (
    <>
      {/* ── Sidebar ── */}
      <nav className="hidden md:flex flex-col h-full py-base bg-surface/80 backdrop-blur-xl fixed left-0 top-0 w-[280px] border-r border-white/10 shadow-2xl shadow-primary/5 z-50">
        <div className="px-4 py-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>shield_lock</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">NeoVault</h1>
              <p className="font-label-md text-label-md text-on-surface-variant">Enterprise SaaS</p>
            </div>
          </div>
          <Link to="/upload" className="w-full py-2 mb-6 rounded-lg btn-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            New Document
          </Link>
        </div>
        <div className="flex-1 space-y-1 px-2">
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
          <Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 rounded-r-lg transition-colors duration-200 active:scale-[0.98]" to="/profile">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
            <span className="font-body-md text-body-md font-medium">Profile</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-lg active:scale-[0.98]" to="/settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md text-body-md">Settings</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-lg active:scale-[0.98]" to="/admin">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span className="font-body-md text-body-md">Admin Portal</span>
          </Link>
        </div>
      </nav>

      {/* ── Main area ── */}
      <div className="flex flex-col md:ml-[280px] h-screen overflow-hidden">
        {/* Top header */}
        <header className="hidden md:flex justify-between items-center px-margin-desktop bg-surface/60 backdrop-blur-lg fixed top-0 right-0 w-[calc(100%-280px)] h-16 border-b border-white/5 z-40">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">person</span>
            <span className="font-headline-md text-headline-md font-semibold text-on-surface">Profile Settings</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-label-caps text-label-caps text-tertiary bg-tertiary/10 px-2 py-1 rounded border border-tertiary/20">
              {userData?.is_admin ? 'Admin' : 'Standard User'}
            </span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
              <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQTj49OxW4_kAPM8X0HgxkYCt9fwwDeYkHDy_QNu8Rf74k3h7NqPsPJct_8HHQZqjSXiUcK54abeDCeuahDaDvrH_G8fupUgb4-g9g9f_ysLVPpD_sPcUCOLG5P53pmkzKiB7q92cqsFWKVuVkxJYSlvC-3BvJrCU40fS99Txz3Kmfj1kmOf_p46TEf__zU7fNQGLQrtW4u2419LOHsGCpQj5Cp0N5KcKRy3ah3RpV6zUQSj11woYobuudwNivpPYZ6cC6IXTo95dd" />
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto pt-20 pb-12 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-[900px] mx-auto w-full space-y-6">

            {/* ── Profile card ── */}
            <div className="glass-card rounded-xl p-8 relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                {/* Avatar column */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors duration-300">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhmywtzBEC35K5eaWngr1kF8b-ARW4SLu7xfKyXzObIadxCOpsuK7qJ7lAKU6n5RW3JVfxbrhzpVBYbRXphD8A5qPrdmVeLKOMDBwaUdD4R9CRZLyPaGmC7diuLwUnGWk4AS33ye1cwWFIqaPnMnCuyM2BaS4UCFk1k2tVYJff_QTfJPi_DyvDldQxIObt8LFh30SCBRv5ZBQkcKgDaTZivfD79LDZN3PyLhzaeR2ULPfvhPNIIIYyVrDOaUeuLgfvYLDEBQAlXmWo"
                        alt="User Avatar"
                      />
                      <div className="absolute inset-0 bg-surface/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                        <span className="material-symbols-outlined text-primary text-2xl">photo_camera</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-headline-md text-headline-md text-on-surface truncate max-w-[160px]">{displayName}</h3>
                    <p className="font-label-caps text-label-caps text-primary/70 mt-1">
                      {userData?.is_admin ? '⚡ Admin' : 'Standard User'}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {userData?.is_verified ? '✓ Verified' : 'Unverified'}
                    </p>
                  </div>
                </div>

                {/* Info column */}
                <div className="flex-1 min-w-0 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 space-y-4">
                  <h4 className="font-label-caps text-label-caps text-on-surface-variant border-b border-white/5 pb-2 mb-4">Account Information</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Email Address (Read-only)</label>
                      <div className="w-full input-dark rounded-md px-4 py-2.5 font-body-md text-on-surface/50 flex items-center gap-2 border border-white/5 bg-white/5 cursor-not-allowed">
                        <span className="material-symbols-outlined text-[16px] text-primary/50">mail</span>
                        {userData?.email || '—'}
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Account Status</label>
                      <div className="w-full input-dark rounded-md px-4 py-2.5 font-body-md flex items-center gap-2 border border-white/5">
                        <span className={`w-2 h-2 rounded-full ${userData?.is_active ? 'bg-tertiary shadow-[0_0_6px_#68f5b8]' : 'bg-error'}`} />
                        <span className={userData?.is_active ? 'text-tertiary' : 'text-error'}>
                          {userData?.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Member Since</label>
                      <div className="w-full input-dark rounded-md px-4 py-2.5 font-body-md text-on-surface/70 border border-white/5">
                        {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Last Login</label>
                      <div className="w-full input-dark rounded-md px-4 py-2.5 font-body-md text-on-surface/70 border border-white/5">
                        {userData?.last_login ? new Date(userData.last_login).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="mt-8 pt-6 border-t border-white/5 space-y-4">
                    <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4">Personal Details</h4>
                    
                    {profileSuccess && (
                      <div className="mb-4 p-3 rounded-lg bg-tertiary/10 border border-tertiary/20 text-tertiary font-body-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Profile updated successfully!
                      </div>
                    )}
                    {profileError && (
                      <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error font-body-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {profileError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Full Name</label>
                        <input
                          className="w-full input-dark rounded-md px-4 py-2.5 font-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all border border-white/10"
                          type="text"
                          placeholder="Not set"
                          value={profileForm.full_name}
                          onChange={e => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Phone Number</label>
                        <input
                          className="w-full input-dark rounded-md px-4 py-2.5 font-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all border border-white/10"
                          type="tel"
                          placeholder="Not set"
                          value={profileForm.phone}
                          onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="btn-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                      >
                        {profileLoading ? (
                          <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                        ) : (
                          <span className="material-symbols-outlined text-[16px]">save</span>
                        )}
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ── Change Password ── */}
            <div className="glass-card rounded-xl p-8">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-6 border-b border-white/5 pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                Change Password
              </h4>

              {pwSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-tertiary/10 border border-tertiary/20 text-tertiary font-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Password changed successfully!
                </div>
              )}
              {pwError && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error font-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {pwError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Current Password</label>
                  <input
                    className="w-full input-dark rounded-md px-4 py-2.5 font-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all border border-white/10"
                    type="password"
                    placeholder="Enter current password"
                    value={pwForm.current_password}
                    onChange={e => setPwForm(prev => ({ ...prev, current_password: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1">New Password</label>
                    <input
                      className="w-full input-dark rounded-md px-4 py-2.5 font-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all border border-white/10"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={pwForm.new_password}
                      onChange={e => setPwForm(prev => ({ ...prev, new_password: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Confirm New Password</label>
                    <input
                      className="w-full input-dark rounded-md px-4 py-2.5 font-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all border border-white/10"
                      type="password"
                      placeholder="Repeat new password"
                      value={pwForm.confirm_password}
                      onChange={e => setPwForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="btn-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                  >
                    {pwLoading ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    )}
                    {pwLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* ── Danger Zone ── */}
            <div className="glass-card rounded-xl p-8 border border-error/10">
              <h4 className="font-label-caps text-label-caps text-error mb-6 border-b border-error/10 pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Danger Zone
              </h4>

              <div className="space-y-4">
                {/* Export Vault */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface/40 rounded-lg border border-white/5">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">Export Vault Data</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Download all your vault entries as a CSV file.</p>
                    {exportError && <p className="text-error font-body-sm text-[12px] mt-1">{exportError}</p>}
                  </div>
                  <button
                    onClick={handleExportVault}
                    disabled={exportLoading}
                    className="shrink-0 px-4 py-2 rounded-lg border border-white/10 text-on-surface font-label-md text-label-md hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-[0.98]"
                  >
                    {exportLoading ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">download</span>
                    )}
                    {exportLoading ? 'Exporting...' : 'Export .CSV'}
                  </button>
                </div>

                {/* Delete Account */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-error/5 rounded-lg border border-error/15">
                  <div>
                    <p className="font-label-md text-label-md text-error">Terminate Identity</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Permanently erase your account and all associated data. This cannot be undone.</p>
                  </div>
                  <button
                    onClick={() => { setShowDeleteModal(true); setDeleteStep(1); setDeletePhrase(''); setDeleteError(null); }}
                    className="shrink-0 px-4 py-2 rounded-lg bg-error/10 text-error border border-error/30 font-label-md text-label-md hover:bg-error/20 transition-colors whitespace-nowrap active:scale-[0.98] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !deleteLoading && setShowDeleteModal(false)} />
          <div className="relative glass-panel w-full max-w-md rounded-2xl p-8 border border-error/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {deleteStep === 1 ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-2xl">warning</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Delete Account?</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">This action is permanent.</p>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                  This will permanently delete your account and erase all associated data including documents, vault entries, scan history, and activity logs. <span className="text-error font-medium">This cannot be undone.</span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 rounded-lg border border-white/10 text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setDeleteStep(2)}
                    className="flex-1 py-2.5 rounded-lg bg-error/10 text-error border border-error/30 font-label-md text-label-md hover:bg-error/20 transition-colors"
                  >
                    Yes, I understand
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-2xl">edit</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Confirm Deletion</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Step 2 of 2</p>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                  Type <span className="font-mono text-error font-semibold px-1 bg-error/10 rounded">DELETE MY ACCOUNT</span> to confirm:
                </p>
                <input
                  className="w-full input-dark rounded-md px-4 py-2.5 font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-error/50 focus:border-error transition-all border border-error/20 mb-3"
                  type="text"
                  placeholder="DELETE MY ACCOUNT"
                  value={deletePhrase}
                  onChange={e => { setDeletePhrase(e.target.value); setDeleteError(null); }}
                />
                {deleteError && (
                  <p className="text-error font-body-sm text-[12px] mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {deleteError}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => { setDeleteStep(1); setDeletePhrase(''); setDeleteError(null); }}
                    disabled={deleteLoading}
                    className="flex-1 py-2.5 rounded-lg border border-white/10 text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading || deletePhrase !== 'DELETE MY ACCOUNT'}
                    className="flex-1 py-2.5 rounded-lg bg-error text-white font-label-md text-label-md hover:bg-error/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                    )}
                    {deleteLoading ? 'Deleting...' : 'Delete Forever'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
