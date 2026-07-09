import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import NotificationDropdown from '../components/NotificationDropdown.jsx';

export default function AdminPortal() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('personnel'); // 'personnel', 'documents', 'logs'

  // User Filtering & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // User Details State
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Users specifically (triggered by filters/pagination)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users', {
          params: {
            search: debouncedSearch,
            status: statusFilter,
            verified: verifiedFilter,
            role: roleFilter,
            page: currentPage,
            per_page: 10
          }
        });
        setUsers(res.data.users);
        setTotalPages(res.data.total_pages);
        setTotalUsers(res.data.total_count);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [debouncedSearch, statusFilter, verifiedFilter, roleFilter, currentPage]);

  // Fetch Dashboard Stats (Runs once)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, docsRes, logsRes, alertsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/documents'),
          api.get('/admin/logs'),
          api.get('/admin/security-alerts')
        ]);
        setStats(statsRes.data);
        setDocuments(docsRes.data.documents);
        setLogs(logsRes.data.logs);
        setAlerts(alertsRes.data.alerts);
      } catch (err) {
        console.error("Admin data fetch error:", err);
        setError(err.response?.data?.error || err.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Fetch User Details
  useEffect(() => {
    if (!selectedUserId) {
      setUserDetails(null);
      return;
    }
    const fetchDetails = async () => {
      setIsDetailsLoading(true);
      try {
        const res = await api.get(`/admin/users/${selectedUserId}/details`);
        setUserDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setIsDetailsLoading(false);
      }
    };
    fetchDetails();
  }, [selectedUserId]);

  const handleToggleAdmin = async (userId, currentIsAdmin) => {
    const action = currentIsAdmin ? 'revoke' : 'grant';
    if (!window.confirm(`Are you sure you want to ${action} admin access to this user?`)) return;
    
    try {
      await api.put(`/admin/users/${userId}/toggle-admin`);
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, is_admin: !currentIsAdmin } : u));
      if (userDetails && userDetails.id === userId) {
        setUserDetails({...userDetails, is_admin: !currentIsAdmin});
      }
    } catch (err) {
      console.error("Toggle admin error:", err);
      alert(err.response?.data?.error || "Failed to toggle admin status");
    }
  };

  const handleToggleStatus = async (userId, currentIsActive) => {
    const action = currentIsActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentIsActive } : u));
      if (userDetails && userDetails.id === userId) {
        setUserDetails({...userDetails, is_active: !currentIsActive});
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      alert(err.response?.data?.error || "Failed to toggle user status");
    }
  };

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
      <nav className="hidden md:flex fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface/60 backdrop-blur-lg justify-between items-center px-margin-desktop border-b border-white/5 z-40">
        <div className="flex items-center gap-6">
          <span className="font-headline-md text-headline-md font-bold text-primary">NeoVault</span>
          <div className="hidden lg:flex gap-4">
            <span className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">Security Status: Secure</span>
            <span className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">System Healthy</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined">verified_user</span>
          </button>
          <div className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          </div>
        </div>
      </nav>

      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[280px] bg-surface/80 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-primary/5 py-base z-50">
        <div className="px-6 py-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-white/10">
              <span className="material-symbols-outlined text-primary">shield_lock</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">NeoVault</h1>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Admin Center</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 font-body-md text-body-md px-4">
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] rounded-lg" to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] rounded-lg" to="/vault">
            <span className="material-symbols-outlined">folder_managed</span>
            Vault
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] rounded-lg" to="/upload">
            <span className="material-symbols-outlined">upload_file</span>
            Document Upload
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] rounded-lg" to="/url-scanner">
            <span className="material-symbols-outlined">travel_explore</span>
            URL Scanner
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] rounded-lg" to="/form-autofill">
            <span className="material-symbols-outlined">bolt</span>
            Form Autofill
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] rounded-lg" to="/profile">
            <span className="material-symbols-outlined">person</span>
            Profile
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 active:scale-[0.98] rounded-lg" to="/settings">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 active:scale-[0.98] transition-transform rounded-r-lg" to="/admin">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            Admin Portal
          </Link>
        </nav>
      </aside>

      <div className="flex flex-col md:ml-[280px] h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-24 px-margin-mobile md:px-margin-desktop pb-20">
          <header className="mb-8">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">System Command Center</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Real-time overview of global operations and security events.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
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
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Documents</span>
                <span className="material-symbols-outlined text-secondary">cloud_upload</span>
              </div>
              <div className="font-headline-xl text-headline-xl text-on-surface mb-1">{stats?.total_documents || 0}</div>
              <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
                <span className="material-symbols-outlined text-[14px]">description</span>
                <span>Uploaded</span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-tertiary/20 transition-all duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Vault Entries</span>
                <span className="material-symbols-outlined text-tertiary">folder_special</span>
              </div>
              <div className="font-headline-xl text-headline-xl text-on-surface text-glow mb-1">{stats?.total_vault_entries || 0}</div>
              <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Encrypted records</span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-outline/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-outline/20 transition-all duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">System Events</span>
                <span className="material-symbols-outlined text-outline">history</span>
              </div>
              <div className="font-headline-xl text-headline-xl text-on-surface mb-1">{logs?.length || 0}</div>
              <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
                <span className="material-symbols-outlined text-[14px]">sync</span>
                <span>Recent logs</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden flex flex-col mb-8">
            <div className="border-b border-white/5 flex">
              <button 
                className={`px-6 py-4 font-label-md text-label-md transition-colors border-b-2 ${activeTab === 'personnel' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
                onClick={() => setActiveTab('personnel')}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  Personnel
                </div>
              </button>
              <button 
                className={`px-6 py-4 font-label-md text-label-md transition-colors border-b-2 ${activeTab === 'documents' ? 'border-secondary text-secondary bg-secondary/5' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
                onClick={() => setActiveTab('documents')}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  Documents
                </div>
              </button>
              <button 
                className={`px-6 py-4 font-label-md text-label-md transition-colors border-b-2 ${activeTab === 'logs' ? 'border-tertiary text-tertiary bg-tertiary/5' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
                onClick={() => setActiveTab('logs')}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  System Logs
                </div>
              </button>
              <button 
                className={`px-6 py-4 font-label-md text-label-md transition-colors border-b-2 ${activeTab === 'alerts' ? 'border-error text-error bg-error/5' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
                onClick={() => setActiveTab('alerts')}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">gpp_bad</span>
                  Security Alerts
                </div>
              </button>
            </div>

            <div className="p-0">
              {activeTab === 'personnel' && (
                <div className="flex flex-col">
                  {/* Search and Filters */}
                  <div className="p-4 border-b border-white/5 bg-surface-container/20 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-1/3">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                      <input 
                        type="text" 
                        placeholder="Search by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface-container border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <select 
                        value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}}
                        className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <select 
                        value={roleFilter} onChange={(e) => {setRoleFilter(e.target.value); setCurrentPage(1);}}
                        className="bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-surface-container/30">
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
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedUserId(user.id)}
                              className="px-2 py-1 rounded text-xs font-medium border border-tertiary/30 text-tertiary hover:bg-tertiary/10 transition-colors flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">visibility</span>
                              Details
                            </button>
                            <button 
                              onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                              className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                                user.is_admin 
                                  ? 'border-error/30 text-error hover:bg-error/10' 
                                  : 'border-secondary/30 text-secondary hover:bg-secondary/10'
                              }`}
                            >
                              {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-on-surface-variant">No users found matching your criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-white/5 bg-surface-container/20">
                    <div className="text-sm text-on-surface-variant">
                      Showing page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="px-3 py-1 rounded border border-white/10 text-on-surface hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="px-3 py-1 rounded border border-white/10 text-on-surface hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-surface-container/30">
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Document ID</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Filename</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Owner ID</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Status</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Date</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm">
                    {documents.length > 0 ? documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 text-on-surface-variant">#{doc.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[18px]">description</span>
                            <span className="text-on-surface truncate max-w-[200px]" title={doc.original_filename}>{doc.original_filename}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">User {doc.user_id}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-1 rounded font-label-caps text-label-caps border 
                            ${doc.upload_status === 'completed' ? 'border-tertiary/20 text-tertiary' : 
                              doc.upload_status === 'failed' ? 'border-error/20 text-error' : 'border-primary/20 text-primary'}`}>
                            {doc.upload_status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">
                          {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-on-surface-variant">No documents found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-surface-container/30">
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Log ID</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">User ID</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Action</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">IP Address</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm">
                    {logs.length > 0 ? logs.map((log) => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 text-on-surface-variant">#{log.id}</td>
                        <td className="py-4 px-6 text-on-surface-variant">User {log.user_id}</td>
                        <td className="py-4 px-6">
                          <span className="text-on-surface bg-surface-container px-2 py-1 rounded font-mono text-xs">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant font-mono text-xs">{log.ip_address || 'N/A'}</td>
                        <td className="py-4 px-6 text-on-surface-variant">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-on-surface-variant">No system logs found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-surface-container/30">
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Alert ID</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Action</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">User ID</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">IP Address</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase font-normal">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm">
                    {alerts.length > 0 ? alerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-white/5 hover:bg-white/5 transition-colors bg-error/5">
                        <td className="py-4 px-6 text-on-surface-variant">#{alert.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-error text-[18px]">gpp_bad</span>
                            <span className="text-error font-mono text-xs font-bold">{alert.action}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">User {alert.user_id}</td>
                        <td className="py-4 px-6 text-on-surface-variant font-mono text-xs">{alert.ip_address || 'N/A'}</td>
                        <td className="py-4 px-6 text-on-surface-variant">
                          {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-on-surface-variant flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-4xl opacity-50">gpp_good</span>
                          No security alerts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* User Details Slideover Modal */}
      {selectedUserId && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedUserId(null)}></div>
          
          {/* Slideover Panel */}
          <div className="relative w-full max-w-md h-full bg-surface border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container/50">
              <h2 className="font-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                User Details
              </h2>
              <button onClick={() => setSelectedUserId(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {isDetailsLoading || !userDetails ? (
                <div className="flex justify-center items-center h-40">
                  <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${userDetails.is_admin ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'} flex items-center justify-center font-headline-md font-bold shrink-0`}>
                      {userDetails.email.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-title-md text-on-surface truncate">{userDetails.email}</h3>
                      <p className="text-sm text-on-surface-variant mb-2">ID: {userDetails.id} • Joined {new Date(userDetails.created_at).toLocaleDateString()}</p>
                      <div className="flex flex-wrap gap-2">
                        {userDetails.is_admin && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-secondary/20 text-secondary border border-secondary/30">Admin</span>}
                        {userDetails.is_active ? 
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-tertiary/20 text-tertiary border border-tertiary/30">Active</span> : 
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-error/20 text-error border border-error/30">Suspended</span>
                        }
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => handleToggleAdmin(userDetails.id, userDetails.is_admin)}
                      className="px-3 py-2 rounded-lg text-sm font-medium border border-white/10 hover:bg-white/5 transition-colors flex justify-center items-center gap-2 text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">{userDetails.is_admin ? 'remove_moderator' : 'add_moderator'}</span>
                      {userDetails.is_admin ? 'Demote Admin' : 'Make Admin'}
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(userDetails.id, userDetails.is_active)}
                      className="px-3 py-2 rounded-lg text-sm font-medium border border-white/10 hover:bg-white/5 transition-colors flex justify-center items-center gap-2 text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">{userDetails.is_active ? 'block' : 'check_circle'}</span>
                      {userDetails.is_active ? 'Suspend User' : 'Activate User'}
                    </button>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-container rounded-xl p-4 border border-white/5">
                      <div className="text-on-surface-variant text-xs font-label-caps uppercase mb-1">Documents</div>
                      <div className="text-2xl font-bold text-on-surface">{userDetails.document_count}</div>
                    </div>
                    <div className="bg-surface-container rounded-xl p-4 border border-white/5">
                      <div className="text-on-surface-variant text-xs font-label-caps uppercase mb-1">Vault Entries</div>
                      <div className="text-2xl font-bold text-on-surface">{userDetails.vault_entry_count}</div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-label-md text-on-surface-variant uppercase mb-3">Recent Activity</h4>
                    {userDetails.recent_activity.length > 0 ? (
                      <div className="space-y-3">
                        {userDetails.recent_activity.map(log => (
                          <div key={log.id} className="flex gap-3 text-sm">
                            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">history</span>
                            <div>
                              <div className="text-on-surface font-mono text-xs">{log.action}</div>
                              <div className="text-on-surface-variant text-[11px] mt-0.5">{new Date(log.timestamp).toLocaleString()} • {log.ip_address}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-on-surface-variant italic">No recent activity.</div>
                    )}
                  </div>

                  {/* Recent Scans */}
                  <div>
                    <h4 className="font-label-md text-on-surface-variant uppercase mb-3">Recent URL Scans</h4>
                    {userDetails.recent_scans.length > 0 ? (
                      <div className="space-y-3">
                        {userDetails.recent_scans.map(scan => (
                          <div key={scan.id} className="flex gap-3 text-sm">
                            <span className={`material-symbols-outlined text-[18px] shrink-0 ${scan.verdict === 'Safe' ? 'text-tertiary' : 'text-error'}`}>
                              {scan.verdict === 'Safe' ? 'verified_user' : 'gpp_bad'}
                            </span>
                            <div className="overflow-hidden">
                              <div className="text-on-surface truncate" title={scan.url}>{scan.url}</div>
                              <div className="text-on-surface-variant text-[11px] mt-0.5">{new Date(scan.scanned_at).toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-on-surface-variant italic">No recent scans.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
