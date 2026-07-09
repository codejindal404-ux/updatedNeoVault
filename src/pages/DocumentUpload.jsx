import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import NotificationDropdown from '../components/NotificationDropdown.jsx';

export default function DocumentUpload() {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docDetails, setDocDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Vault state
  const [vaultCategory, setVaultCategory] = useState('other');
  const [isSavingToVault, setIsSavingToVault] = useState(false);
  const [vaultSaveSuccess, setVaultSaveSuccess] = useState(false);
  const [vaultSaveError, setVaultSaveError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setSuccessMsg(null);

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      // reset input
      e.target.value = '';
      return;
    }

    // Validate type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only PDF, PNG, and JPG are allowed.');
      e.target.value = '';
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setCurrentFile(file);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      
      setSuccessMsg('Document uploaded successfully!');
      fetchDocuments();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred during upload. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setCurrentFile(null);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.error('Failed to delete document:', err);
      alert('Failed to delete document. Please try again.');
    }
  };

  const handleRowClick = async (id) => {
    setIsModalOpen(true);
    setIsLoadingDetails(true);
    setDocDetails(null);
    setVaultCategory('other');
    setVaultSaveSuccess(false);
    setVaultSaveError(null);
    try {
      const response = await api.get(`/documents/${id}`);
      setDocDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch document details:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDocDetails(null);
  };

  const handleSaveToVault = async () => {
    if (!docDetails || !docDetails.parsed_data || Object.keys(docDetails.parsed_data).length === 0) return;
    
    setIsSavingToVault(true);
    setVaultSaveError(null);
    setVaultSaveSuccess(false);

    try {
      const fields = Object.entries(docDetails.parsed_data).map(([key, value]) => ({
        field_name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        field_value: typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)
      }));

      await api.post('/vault/save', {
        document_id: docDetails.id,
        category: vaultCategory,
        fields: fields
      });
      
      setVaultSaveSuccess(true);
    } catch (err) {
      console.error('Failed to save to vault:', err);
      setVaultSaveError(err.response?.data?.error || 'Failed to save to Vault. Please try again.');
    } finally {
      setIsSavingToVault(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };
  return (
    <>


<nav className="hidden md:flex flex-col h-full py-base bg-surface/80 backdrop-blur-xl fixed left-0 top-0 w-[280px] border-r border-white/10 shadow-2xl shadow-primary/5 z-50">
<div className="px-margin-desktop py-md mb-8 flex items-center gap-4">
<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed shadow-[0_0_15px_rgba(164,230,255,0.4)]">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>security</span>
</div>
<div>
<h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">NeoVault</h1>
<p className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Enterprise SaaS</p>
</div>
</div>
<div className="flex-1 overflow-y-auto px-4 flex flex-col gap-2">
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-md" to="/dashboard">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-md" to="/vault">
<span className="material-symbols-outlined" data-icon="folder_managed">folder_managed</span>
<span className="font-label-md text-label-md">Vault</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-primary border-l-2 border-primary shadow-[inset_4px_0_10px_-4px_rgba(76,214,255,0.4)] bg-primary/5 rounded-md side-nav-active active:scale-[0.98] transition-transform" to="/upload">
<span className="material-symbols-outlined" data-icon="upload_file">upload_file</span>
<span className="font-label-md text-label-md font-bold">Document Upload</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-md" to="/url-scanner">
<span className="material-symbols-outlined" data-icon="travel_explore">travel_explore</span>
<span className="font-label-md text-label-md">URL Scanner</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-md" to="/form-autofill">
<span className="material-symbols-outlined" data-icon="bolt">bolt</span>
<span className="font-label-md text-label-md">Form Autofill</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-md" to="/profile">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-label-md text-label-md">Profile</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-md" to="/settings">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors duration-200 rounded-md" to="/admin">
<span className="material-symbols-outlined" data-icon="admin_panel_settings">admin_panel_settings</span>
<span className="font-label-md text-label-md">Admin Portal</span>
</Link>
</div>
<div className="p-4 mt-auto">
<button className="w-full btn-primary py-3 rounded-md font-label-md text-label-md font-bold flex items-center justify-center gap-2">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>add</span>
                New Document
            </button>
</div>
</nav>

<header className="hidden md:flex justify-between items-center px-margin-desktop w-[calc(100%-280px)] ml-[280px] h-16 bg-surface/60 backdrop-blur-lg fixed top-0 right-0 border-b border-white/5 z-40">
<div className="flex items-center gap-6">
<div className="flex items-center gap-2 text-tertiary font-label-caps text-label-caps bg-tertiary/10 px-3 py-1.5 rounded-full border border-tertiary/20">
<span className="material-symbols-outlined text-[16px]">shield</span>
<span>Security Status: Secure</span>
</div>
<div className="flex items-center gap-2 text-secondary font-label-caps text-label-caps bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20">
<span className="material-symbols-outlined text-[16px]">memory</span>
<span>AI credits: 84%</span>
</div>
</div>
<div className="flex items-center gap-4">
<NotificationDropdown />
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span className="material-symbols-outlined">verified_user</span>
</button>
<div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline/30 cursor-pointer hover:border-primary transition-colors">
<img alt="User Avatar" className="w-full h-full object-cover" data-alt="A futuristic, slightly glowing minimalist user avatar profile picture, dark background, subtle neon blue highlights, highly detailed digital art." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgNZDzdNxw_aN4B2dYr928QNoUt4E8Y3unOiRNGQqLtXGtjrB7pTmkj8PWwbmJ-xTZ1X4pomVHF9JAQJxvB2NST6nfEl_Xh6dKQcGTE41H7HvP9V0XGVFUSHRFhqARbQI-ExJO9MQ4z2_KZt4Y03mqIZIB1eIyLJl0G3LS8LD3DZaA-tjF29X8oP8_Jjh5LHvLtrt8STE875AcG36EDZN8AiWCT8paWDg9GAo42fngOgLXriAivHdA4BY9ZI7RGco6i8tLj7OcVrk1" />
</div>
</div>
</header>

<div className="flex flex-col md:ml-[280px] h-screen overflow-hidden relative">
<main className="flex-1 overflow-y-auto pt-16 md:pt-[88px] p-margin-mobile md:p-margin-desktop">
<div className="max-w-container-max mx-auto space-y-8">

<div className="flex flex-col gap-2">
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-semibold text-on-surface tracking-tight">Secure Document Upload</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Upload sensitive files for encrypted storage and AI-powered analysis. Supported formats: PDF, PNG, JPG up to 10MB.</p>
</div>

{error && (
  <div className="p-3 rounded bg-error/10 border border-error/50 text-error font-body-sm">
    {error}
  </div>
)}
{successMsg && (
  <div className="p-3 rounded bg-primary/10 border border-primary/50 text-primary font-body-sm">
    {successMsg}
  </div>
)}

<div onClick={triggerFileInput} className={`glass-panel rounded-xl p-8 flex flex-col items-center justify-center text-center upload-zone h-80 relative ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}>
<input 
  type="file" 
  ref={fileInputRef} 
  onChange={handleFileSelect} 
  className="hidden" 
  accept=".pdf,.png,.jpg,.jpeg" 
/>
<div className="absolute top-4 right-4 flex gap-2">
<span className="font-label-caps text-label-caps text-outline bg-surface px-2 py-1 rounded border border-outline/20">PDF</span>
<span className="font-label-caps text-label-caps text-outline bg-surface px-2 py-1 rounded border border-outline/20">PNG</span>
<span className="font-label-caps text-label-caps text-outline bg-surface px-2 py-1 rounded border border-outline/20">JPG</span>
</div>
<div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors duration-300 shadow-[0_0_30px_rgba(237,177,255,0.15)] group-hover:shadow-[0_0_40px_rgba(237,177,255,0.3)]">
<span className="material-symbols-outlined text-4xl text-secondary" style={{fontVariationSettings: '\'FILL\' 1'}}>cloud_upload</span>
</div>
<h3 className="font-headline-md text-headline-md font-medium text-on-surface mb-2">Drag & Drop files here</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-6">or click to browse your computer</p>
<button type="button" className="btn-primary px-6 py-2.5 rounded-md font-label-md text-label-md font-semibold pointer-events-none">Select Files</button>
</div>

{isUploading && currentFile && (
  <div className="glass-panel rounded-xl p-6">
  <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4 tracking-widest">Active Uploads</h4>
  <div className="bg-surface/50 rounded-lg p-4 border border-white/5 flex items-center gap-4">
  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
  <span className="material-symbols-outlined text-primary">
    {currentFile.type.includes('pdf') ? 'picture_as_pdf' : 'image'}
  </span>
  </div>
  <div className="flex-1">
  <div className="flex justify-between items-center mb-2">
  <span className="font-label-md text-label-md text-on-surface truncate">{currentFile.name}</span>
  <span className="font-label-md text-label-md text-secondary">{uploadProgress}%</span>
  </div>
  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
  <div className="h-full progress-bar-fill rounded-full relative transition-all duration-300 bg-primary" style={{ width: `${uploadProgress}%` }}>
  <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/30 blur-[2px] animate-[pulse_2s_ease-in-out_infinite]"></div>
  </div>
  </div>
  <div className="flex justify-between items-center mt-2">
  <span className="font-body-sm text-body-sm text-outline text-[10px]">Uploading...</span>
  </div>
  </div>
  </div>
  </div>
)}

<div className="glass-panel rounded-xl overflow-hidden">
<div className="p-6 border-b border-white/5 flex justify-between items-center">
<h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Uploaded Documents</h4>
<button className="btn-ghost px-3 py-1.5 rounded text-[12px] flex items-center gap-1 font-label-md">
<span className="material-symbols-outlined text-[16px]">filter_list</span>
                        Filter
                    </button>
</div>
<div className="divide-y divide-white/5">

{documents.length === 0 ? (
  <div className="p-8 text-center text-on-surface-variant font-body-sm">
    No documents uploaded yet.
  </div>
) : (
  documents.map(doc => (
    <div key={doc.id} onClick={() => handleRowClick(doc.id)} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4 group cursor-pointer">
    <div className="w-12 h-12 rounded bg-surface border border-outline/20 flex items-center justify-center shrink-0">
    {doc.file_type === 'pdf' ? (
      <span className="material-symbols-outlined text-primary text-[24px]">description</span>
    ) : (
      <span className="material-symbols-outlined text-secondary text-[24px]">image</span>
    )}
    </div>
    <div className="flex-1 min-w-0">
    <h5 className="font-label-md text-label-md text-on-surface truncate mb-1">{doc.original_filename}</h5>
    <div className="flex items-center gap-3 font-body-sm text-[11px] text-outline">
    <span className="uppercase">{doc.file_type}</span>
    <span className="w-1 h-1 rounded-full bg-outline/50"></span>
    <span>{timeAgo(doc.uploaded_at)}</span>
    <span className="w-1 h-1 rounded-full bg-outline/50"></span>
    <span className="text-tertiary flex items-center gap-1">
      <span className="material-symbols-outlined text-[12px]">
        {doc.upload_status === 'completed' ? 'check_circle' : doc.upload_status === 'failed' ? 'error' : 'hourglass_empty'}
      </span> 
      Status: {doc.upload_status}
    </span>
    </div>
    </div>
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <button onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors" title="Delete">
    <span className="material-symbols-outlined text-[18px]">delete</span>
    </button>
    </div>
    </div>
  ))
)}

</div>
</div>
</div>
</main>

{/* Document Details Modal */}
{isModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
    <div className="glass-panel relative w-full max-w-2xl max-h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-surface/50">
        <h3 className="font-headline-md text-headline-md font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">data_object</span>
          Document Details
        </h3>
        <button onClick={closeModal} className="p-2 rounded-full hover:bg-white/10 text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 overflow-y-auto flex-1">
        {isLoadingDetails ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-4">progress_activity</span>
            <p className="text-on-surface-variant font-body-md">Fetching details...</p>
          </div>
        ) : docDetails ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Filename</span>
              <span className="font-body-lg text-body-lg text-on-surface">{docDetails.original_filename}</span>
            </div>

            {docDetails.upload_status === 'processing' && (
              <div className="p-4 rounded-lg bg-surface/50 border border-secondary/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary animate-pulse">hourglass_top</span>
                <p className="text-on-surface font-body-md">Still processing... Please check back later.</p>
              </div>
            )}

            {docDetails.upload_status === 'failed' && (
              <div className="p-4 rounded-lg bg-error/10 border border-error/30 flex items-center gap-3 text-error">
                <span className="material-symbols-outlined">error</span>
                <p className="font-body-md">Could not extract data from this document.</p>
              </div>
            )}

            {docDetails.upload_status === 'completed' && (
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                  <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Extracted Data</h4>
                  
                  {(!docDetails.parsed_data || Object.keys(docDetails.parsed_data).length === 0) ? null : (
                    <div className="flex items-center gap-3">
                      <select 
                        value={vaultCategory}
                        onChange={(e) => setVaultCategory(e.target.value)}
                        disabled={isSavingToVault || vaultSaveSuccess}
                        className="bg-surface-container-high border border-white/10 rounded px-2 py-1 text-[12px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                      >
                        <option value="identity">Identity</option>
                        <option value="financial">Financial</option>
                        <option value="medical">Medical</option>
                        <option value="other">Other</option>
                      </select>
                      
                      <button 
                        onClick={handleSaveToVault}
                        disabled={isSavingToVault || vaultSaveSuccess}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded text-[12px] font-label-md transition-all ${
                          vaultSaveSuccess 
                            ? 'bg-tertiary/20 text-tertiary cursor-default border border-tertiary/30' 
                            : 'btn-primary active:scale-[0.98]'
                        }`}
                      >
                        {isSavingToVault ? (
                          <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                        ) : vaultSaveSuccess ? (
                          <>
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Saved
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">save</span>
                            Save to Vault
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {vaultSaveError && (
                  <div className="mb-4 p-2 rounded bg-error/10 border border-error/30 text-error font-body-sm text-[12px]">
                    {vaultSaveError}
                  </div>
                )}
                
                {(!docDetails.parsed_data || Object.keys(docDetails.parsed_data).length === 0) ? (
                  <div className="p-6 rounded-lg bg-surface/30 border border-white/5 text-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-3xl mb-2">find_in_page</span>
                    <p className="text-on-surface-variant font-body-md">No data could be extracted.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dynamically render all keys from parsed_data */}
                    {Object.entries(docDetails.parsed_data).map(([key, value]) => {
                      // Formatting key: e.g. "date_of_birth" -> "Date Of Birth"
                      const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      const displayValue = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
                      const isImportant = key.toLowerCase().includes('type');
                      
                      return (
                        <div key={key} className={`p-3 rounded-lg bg-surface/40 border border-white/5 flex flex-col gap-1 ${isImportant ? 'md:col-span-2 bg-primary/5 border-primary/20' : ''}`}>
                          <span className={`font-label-sm text-[11px] uppercase tracking-wider ${isImportant ? 'text-primary' : 'text-outline'}`}>
                            {displayKey}
                          </span>
                          <span className={`font-body-md text-on-surface ${isImportant ? 'font-semibold' : ''}`}>
                            {displayValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-error">Failed to load data.</div>
        )}
      </div>
      
    </div>
  </div>
)}

</div>

    </>
  );
}
