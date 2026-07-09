import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    
    if (nextState && notifications.length === 0) {
      // Fetch notifications when opened for the first time or if empty
      setLoading(true);
      try {
        const response = await api.get('/auth/notifications');
        setNotifications(response.data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getLogDetails = (action) => {
    const actions = {
      login: { title: "New Login Detected", icon: "login", colorClass: "text-primary bg-primary/10" },
      password_reset: { title: "Password Updated", icon: "lock_reset", colorClass: "text-error bg-error/10" },
      upload: { title: "Document Uploaded", icon: "cloud_upload", colorClass: "text-secondary bg-secondary/10" },
      vault_save: { title: "Vault Sync Complete", icon: "folder_special", colorClass: "text-tertiary bg-tertiary/10" },
      profile_update: { title: "Profile Updated", icon: "manage_accounts", colorClass: "text-primary-fixed bg-primary-fixed/10" },
      preferences_update: { title: "Preferences Updated", icon: "tune", colorClass: "text-primary-fixed bg-primary-fixed/10" }
    };
    return actions[action] || {
      title: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: "info",
      colorClass: "text-on-surface-variant bg-surface-container"
    };
  };

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 relative flex items-center justify-center p-2 rounded-full hover:bg-white/5"
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {/* Red dot indicator */}
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface shadow-[0_0_6px_#ffb4ab]"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl overflow-hidden shadow-2xl z-50 border border-white/10 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-white/10 bg-surface/50 backdrop-blur-md flex justify-between items-center">
            <h3 className="font-headline-md text-sm font-bold text-on-surface">Notifications</h3>
            <span className="text-xs text-primary cursor-pointer hover:underline">Mark all as read</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto bg-surface/90 backdrop-blur-xl">
            {loading ? (
              <div className="p-6 text-center text-on-surface-variant flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                <span className="text-xs">Loading...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-3xl opacity-50">notifications_off</span>
                <span className="text-sm">No recent notifications</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => {
                  const details = getLogDetails(notif.action);
                  return (
                    <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${details.colorClass}`}>
                        <span className="material-symbols-outlined text-[16px]">{details.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-on-surface truncate pr-2 group-hover:text-primary transition-colors">
                            {details.title}
                          </p>
                          <span className="text-[10px] text-on-surface-variant shrink-0 whitespace-nowrap mt-0.5">
                            {timeAgo(notif.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate">
                          {notif.ip_address ? `IP: ${notif.ip_address}` : 'System generated event'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-white/10 bg-surface/50 text-center hover:bg-white/5 transition-colors cursor-pointer">
            <span className="text-xs text-primary font-medium">View Activity Log</span>
          </div>
        </div>
      )}
    </div>
  );
}
