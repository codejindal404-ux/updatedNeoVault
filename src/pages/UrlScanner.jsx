import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import logger from '../services/logger';
import NotificationDropdown from '../components/NotificationDropdown.jsx';

export default function UrlScanner() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExtensionTip, setShowExtensionTip] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to scan.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/scanner/check-url', { url: url.trim() });
      setResult(response.data);
    } catch (err) {
      logger.error('Scan error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to scan the URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAndAutofill = () => {
    window.open(url, '_blank');
    setShowExtensionTip(true);
    // Auto-hide the tip after 6 seconds
    setTimeout(() => setShowExtensionTip(false), 6000);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'tertiary'; // Green
    if (score >= 40) return 'secondary'; // Yellow
    return 'error'; // Red
  };

  const getScoreText = (score) => {
    if (score >= 70) return 'Low Risk';
    if (score >= 40) return 'Medium Risk';
    return 'High Risk';
  };

  const SecurityCard = ({ title, status, isGood, subtitle }) => {
    const colorClass = isGood ? 'tertiary-fixed' : 'error';
    const bgClass = isGood ? 'bg-tertiary-fixed-dim/20' : 'bg-error/20';
    const borderClass = isGood ? 'border-white/5' : 'border-error/20';
    const panelBg = isGood ? 'bg-white/5' : 'bg-error/10';
    const icon = isGood ? 'check' : 'warning';
    
    return (
        <div className={`flex items-center gap-4 p-3 rounded-lg ${panelBg} border ${borderClass} relative overflow-hidden group`}>
            {!isGood && <div className="absolute inset-0 bg-gradient-to-r from-error/0 to-error/5 group-hover:to-error/10 transition-colors"></div>}
            <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center relative z-10`}>
                <span className={`material-symbols-outlined text-${colorClass} text-sm`} data-icon={icon}>{icon}</span>
            </div>
            <div className="relative z-10">
                <p className="font-body-md text-body-md text-on-surface">{title}</p>
                <p className={`font-label-md text-label-md text-${colorClass}`}>{subtitle || status}</p>
            </div>
        </div>
    );
  };

  return (
    <>
      <nav className="hidden md:flex flex-col h-full py-base bg-surface/80 backdrop-blur-xl fixed left-0 top-0 w-[280px] border-r border-white/10 shadow-2xl shadow-primary/5 z-50">
        <div className="px-6 py-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <span className="material-symbols-outlined text-primary" data-icon="shield_lock" data-weight="fill" style={{fontVariationSettings: '\'FILL\' 1'}}>shield_lock</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">NeoVault</h1>
            <p className="font-label-md text-label-md text-on-surface-variant">Enterprise SaaS</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-4 px-2">
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg mx-2" to="/dashboard">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            <span className="font-body-md text-body-md">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg mx-2" to="/vault">
            <span className="material-symbols-outlined" data-icon="folder_managed">folder_managed</span>
            <span className="font-body-md text-body-md">Vault</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg mx-2" to="/upload">
            <span className="material-symbols-outlined" data-icon="upload_file">upload_file</span>
            <span className="font-body-md text-body-md">Document Upload</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 rounded-r-lg ml-0 mr-2 active:scale-[0.98] transition-transform" to="/url-scanner">
            <span className="material-symbols-outlined" data-icon="travel_explore">travel_explore</span>
            <span className="font-body-md text-body-md">URL Scanner</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg mx-2" to="/form-autofill">
            <span className="material-symbols-outlined" data-icon="bolt">bolt</span>
            <span className="font-body-md text-body-md">Form Autofill</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg mx-2" to="/profile">
            <span className="material-symbols-outlined" data-icon="person">person</span>
            <span className="font-body-md text-body-md">Profile</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg mx-2" to="/settings">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
            <span className="font-body-md text-body-md">Settings</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all rounded-lg mx-2" to="/admin">
            <span className="material-symbols-outlined" data-icon="admin_panel_settings">admin_panel_settings</span>
            <span className="font-body-md text-body-md">Admin Portal</span>
          </Link>
        </div>
        <div className="mt-auto px-6 pb-8">
          <button className="w-full glow-btn-primary rounded-lg py-3 px-4 flex items-center justify-center gap-2 text-surface-container-lowest font-body-md text-body-md font-semibold">
            <span className="material-symbols-outlined" data-icon="add">add</span>
            New Document
          </button>
        </div>
      </nav>

      <div className="flex flex-col md:ml-[280px] h-screen overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"></div>
        </div>

        <header className="flex justify-between items-center px-margin-desktop w-full h-16 bg-surface/60 backdrop-blur-lg fixed top-0 right-0 md:w-[calc(100%-280px)] border-b border-white/5 z-40">
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6">
              <span className="font-label-md text-label-md text-on-surface-variant">Security Status: Secure</span>
              <span className="font-label-md text-label-md text-on-surface-variant">AI credits: 84%</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
              <span className="material-symbols-outlined" data-icon="verified_user">verified_user</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 overflow-hidden ml-2 cursor-pointer">
              <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV3D7KoozMwrdFazSF00sVQTKXKoLuzqkOrqkwoQsePLGZb4gTimLQLed4hZiBqOd1eu47YapdmDqbbUppAkdwb8tR6S-PynpjZlbmigSuOEoLI3FaggJNaJSVXK2tzLSLGS5V9mPXDAdiA760nn--_IFnwHhAVkqb7rkL6q5P3rmvCNAZDDkLEy2FKtLfiY6N2wWzYX78CApsHuGzQesBe0qW3D9CPdNS0z2YcJaIzsIyGI9jV_Hr0WF4v1oYf5fpB89VM6X5oCcs" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-margin-mobile md:px-margin-desktop pt-24 pb-12 z-10">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-4">Deep Threat <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">URL Scanner</span></h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Analyze any web address for phishing attempts, malware signatures, and SSL vulnerabilities using our proprietary AI threat engine.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center glass-panel rounded-xl p-2 pl-6">
              <span className="material-symbols-outlined text-on-surface-variant mr-3" data-icon="link">link</span>
              <input 
                className="flex-1 bg-transparent border-none outline-none text-on-surface font-body-lg text-body-lg placeholder-on-surface-variant/50 focus:ring-0" 
                placeholder="https://example.com/login" 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
              <button 
                onClick={handleScan}
                disabled={loading}
                className="glow-btn-primary px-8 py-4 rounded-lg font-body-md text-body-md font-semibold text-surface-container-lowest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                    <>
                        <span className="material-symbols-outlined animate-spin" data-icon="refresh">refresh</span>
                        Scanning...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined" data-icon="radar">radar</span>
                        Scan Now
                    </>
                )}
              </button>
            </div>
          </div>
          
          {error && (
             <div className="max-w-6xl mx-auto mb-6 bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-3 text-error">
                <span className="material-symbols-outlined">error</span>
                <span className="font-body-md">{error}</span>
             </div>
          )}

          {!result && !loading && !error && (
              <div className="max-w-6xl mx-auto text-center py-16 glass-panel rounded-2xl">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 opacity-50">travel_explore</span>
                  <p className="font-body-lg text-on-surface-variant opacity-70">Enter a URL above to start the deep threat scan.</p>
              </div>
          )}

          {result && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
                <div className="md:col-span-5 glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                  {getScoreColor(result.safety_score) === 'error' && <div className="absolute inset-0 bg-error/5 animate-pulse"></div>}
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-8 self-start w-full relative z-10">Overall Threat Score</h3>
                  <div className="relative w-48 h-48 mb-6 z-10">
                    <svg className={`circular-chart text-${getScoreColor(result.safety_score)}`} viewBox="0 0 36 36">
                      <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                      <path className={`circle stroke-${getScoreColor(result.safety_score)}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray={`${result.safety_score}, 100`}></path>
                      <text className={`percentage font-headline-xl text-headline-xl fill-${getScoreColor(result.safety_score)} font-bold`} x="18" y="20.35">{result.safety_score}</text>
                      <text className="fill-on-surface-variant font-label-caps text-[6px] uppercase tracking-wider text-anchor-middle" x="18" y="26">{getScoreText(result.safety_score)}</text>
                    </svg>
                  </div>

                  <div className={`flex items-center gap-2 px-6 py-2 rounded-full bg-${getScoreColor(result.safety_score)}/10 border border-${getScoreColor(result.safety_score)}/20 z-10`}>
                    <span className={`material-symbols-outlined text-${getScoreColor(result.safety_score)} text-sm`} data-icon={result.safety_score >= 70 ? 'verified_user' : 'warning'} data-weight="fill" style={{fontVariationSettings: '\'FILL\' 1'}}>
                      {result.safety_score >= 70 ? 'verified_user' : 'warning'}
                    </span>
                    <span className={`font-label-caps text-label-caps text-${getScoreColor(result.safety_score)} uppercase`}>
                        {result.verdict}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col gap-6">
                  <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Target URL</p>
                      <p className={`font-body-md text-body-md truncate max-w-sm text-${getScoreColor(result.safety_score)}`}>{url}</p>
                    </div>
                    {/* Open & Autofill button — only shown when verdict is Safe */}
                    {result.verdict === 'Safe' && (
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={handleOpenAndAutofill}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-tertiary/10 border border-tertiary-fixed/30 text-tertiary-fixed font-body-md text-body-md font-semibold hover:bg-tertiary/20 active:scale-[0.97] transition-all"
                          title="Open URL and autofill with NeoVault extension"
                        >
                          <span className="material-symbols-outlined text-sm" data-icon="open_in_new" style={{fontVariationSettings: "'FILL' 1"}}>open_in_new</span>
                          Open &amp; Autofill
                        </button>
                        {showExtensionTip && (
                          <div className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-lg px-3 py-2 max-w-[220px] text-right animate-fade-in">
                            <span className="material-symbols-outlined text-primary text-xs mt-0.5" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>extension</span>
                            <p className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
                              Make sure the <span className="text-primary font-semibold">NeoVault extension</span> is installed and you&apos;re logged in within it.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="glass-panel rounded-2xl p-8 flex-1">
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-6">Security Vectors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SecurityCard 
                          title="HTTPS Enabled" 
                          isGood={result.is_https} 
                          status={result.is_https ? "Valid Certificate" : "Not Secured"} 
                      />
                      <SecurityCard 
                          title="SSL Certificate" 
                          isGood={result.ssl_valid} 
                          status={result.ssl_valid ? "Valid" : result.ssl_error || "Invalid SSL"} 
                      />
                      <SecurityCard 
                          title="Blacklist Check" 
                          isGood={result.blacklist_status === 'safe'} 
                          status={result.blacklist_status === 'safe' ? "Not Listed" : "Blacklisted"} 
                      />
                      <SecurityCard 
                          title="IP-based URL" 
                          isGood={!result.domain_check.is_ip} 
                          status={result.domain_check.is_ip ? "Suspicious IP Link" : "Standard Domain"} 
                      />
                      <SecurityCard 
                          title="Excessive Subdomains" 
                          isGood={!result.domain_check.too_many_subdomains} 
                          status={result.domain_check.too_many_subdomains ? "Multiple Hops" : "Normal"} 
                      />
                      <SecurityCard 
                          title="Typosquatting Detected" 
                          isGood={!result.domain_check.typosquatting_detected} 
                          status={result.domain_check.typosquatting_detected ? "Misleading URL" : "Clean"} 
                      />
                    </div>
                  </div>
                </div>
              </div>
          )}
        </main>
      </div>
    </>
  );
}
