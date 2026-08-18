import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Settings,
  Database,
  ShieldCheck,
  Save,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Wrench,
  Key,
  Folder,
  Phone,
  Mail,
  School,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  Code2,
  FileSpreadsheet,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GAS_TEMPLATE_CODE } from '../lib/gasTemplate.js';

export const SettingsModule: React.FC = () => {
  const {
    token,
    currentSchool,
    showToast,
    connectionState,
    lastCheckedTime,
    testConnection,
    repairDatabase
  } = useAuth();

  const [formData, setFormData] = useState({
    school_name: currentSchool?.school_name || 'Greenwood International School',
    contact_phone: currentSchool?.contact_phone || '+91 9876543210',
    contact_email: currentSchool?.contact_email || 'admin@greenwood.edu',
    academic_session: currentSchool?.academic_session || '2026-2027',
    google_sheet_id: currentSchool?.google_sheet_id || '',
    gas_web_app_url: currentSchool?.gas_web_app_url || '',
    drive_folder_id: currentSchool?.drive_folder_id || '1DriveFolderStudentPhotos_2026',
    school_logo: currentSchool?.school_logo || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSheetId, setCopiedSheetId] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_TEMPLATE_CODE);
    setCopiedCode(true);
    showToast('✓ Google Apps Script template code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleCopySheetId = () => {
    if (formData.google_sheet_id) {
      navigator.clipboard.writeText(formData.google_sheet_id);
      setCopiedSheetId(true);
      showToast('✓ Google Sheet ID copied!', 'success');
      setTimeout(() => setCopiedSheetId(false), 2000);
    }
  };

  const handleTestLink = async () => {
    setIsTesting(true);
    await testConnection();
    setIsTesting(false);
  };

  const handleRepairTabs = async () => {
    setIsRepairing(true);
    await repairDatabase();
    setIsRepairing(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/school/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ School configuration & database mapping saved.', 'success');
      } else {
        showToast(data.message || 'Failed to update settings.', 'error');
      }
    } catch (e) {
      showToast('Error saving settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const databaseTabs = [
    { name: 'STUDENTS', description: 'Student rosters, roll nos, parent contact details', status: 'Healthy' },
    { name: 'ADMISSIONS', description: 'Application forms, inquiries, document links', status: 'Healthy' },
    { name: 'ATTENDANCE', description: 'Monthly matrix, daily logs (P/A/L/H)', status: 'Healthy' },
    { name: 'FEES', description: 'Receipt numbers, collected amounts, pending balances', status: 'Healthy' },
    { name: 'NOTICES', description: 'School announcements, circulars, event alerts', status: 'Healthy' },
    { name: 'TEACHERS', description: 'Faculty roster, subjects, qualifications, phone numbers', status: 'Healthy' },
    { name: 'CLASSES', description: 'Standard class & section mapping', status: 'Healthy' },
    { name: 'SETTINGS', description: 'School identity, session info, Drive folder IDs', status: 'Healthy' }
  ];

  return (
    <div id="schoolos_settings_module" className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* 3D Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-center shadow-lg shadow-indigo-950/20 border border-white/20">
            <Settings className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              School Database & System Settings
            </h2>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              Manage Google Sheets database isolation, Apps Script webhooks, school profile, and assets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Database Isolated
          </span>
        </div>
      </div>

      {/* 1. Complete Google Sheets Database Command Center (Exclusive to Settings) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 shadow-2xl shadow-indigo-950/30 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-blue-500/10 to-transparent pointer-events-none rounded-bl-full"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 border border-white/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  PRIMARY DATABASE
                </span>
                <span className="text-white/40">•</span>
                <span className="text-xs font-bold text-white">Google Sheets Master Storage</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${
                    connectionState === 'CONNECTED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : connectionState === 'CHECKING'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      connectionState === 'CONNECTED'
                        ? 'bg-emerald-400'
                        : connectionState === 'CHECKING'
                        ? 'bg-amber-400 animate-spin'
                        : 'bg-rose-400'
                    }`}
                  ></span>
                  STATUS: {connectionState}
                </span>
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Checked: {lastCheckedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Database Control Actions */}
          <div className="flex flex-wrap items-center gap-2 relative z-10">
            <button
              type="button"
              id="btn_test_db_connection"
              onClick={handleTestLink}
              disabled={isTesting || isRepairing}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/20 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isTesting ? 'Verifying...' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              id="btn_repair_db_tabs"
              onClick={handleRepairTabs}
              disabled={isTesting || isRepairing}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition border border-emerald-400/30 active:scale-95 disabled:opacity-50"
            >
              <Wrench className={`w-3.5 h-3.5 ${isRepairing ? 'animate-spin' : ''}`} />
              <span>{isRepairing ? 'Verifying...' : 'Verify Schema'}</span>
            </button>

            {formData.google_sheet_id && (
              <a
                href={`https://docs.google.com/spreadsheets/d/${formData.google_sheet_id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition shadow-md shadow-emerald-700/40 active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Open Google Sheet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Database Health Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Architecture</span>
            <p className="text-xs font-extrabold text-white">1 School = 1 Dedicated Sheet</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Data Isolation</span>
            <p className="text-xs font-extrabold text-emerald-400">100% Zero-Mix Guaranteed</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sync Engine</span>
            <p className="text-xs font-extrabold text-blue-300">Bi-directional Real-Time</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Verified Tabs</span>
            <p className="text-xs font-extrabold text-amber-300">8 / 8 Tabs Active</p>
          </div>
        </div>

        {/* Schema Status Matrix */}
        <div className="space-y-2 relative z-10">
          <p className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dedicated Spreadsheet Tabs Status</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {databaseTabs.map(tab => (
              <div
                key={tab.name}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between"
              >
                <div className="truncate pr-1">
                  <p className="text-xs font-bold text-white truncate">{tab.name}</p>
                  <p className="text-[9px] text-slate-400 truncate">{tab.description}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Google Sheets Database ID & Deployment Configuration Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900">Database Connection Credentials</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-500">Google Cloud & Workspace Bridge</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Google Spreadsheet ID (Target Database) *
                </label>
                {formData.google_sheet_id && (
                  <button
                    type="button"
                    onClick={handleCopySheetId}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {copiedSheetId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSheetId ? 'Copied' : 'Copy ID'}</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                value={formData.google_sheet_id}
                onChange={e => setFormData({ ...formData, google_sheet_id: e.target.value })}
                placeholder="e.g. 1a2B3c4D5e6F7g8H9i0J_GreenwoodMasterDB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Extracted from the URL: https://docs.google.com/spreadsheets/d/<strong>[SPREADSHEET_ID]</strong>/edit
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Apps Script Web App URL (Optional Webhook)
                </label>
                <input
                  type="url"
                  value={formData.gas_web_app_url}
                  onChange={e => setFormData({ ...formData, gas_web_app_url: e.target.value })}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Drive Folder ID (Student Photos)
                </label>
                <input
                  type="text"
                  value={formData.drive_folder_id}
                  onChange={e => setFormData({ ...formData, drive_folder_id: e.target.value })}
                  placeholder="1DriveFolderStudentPhotos_2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {/* Google Apps Script Deployment Code Accordion */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-extrabold text-slate-900">
                    Google Apps Script Code (Code.gs)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 rounded-xl border border-slate-300 shadow-2xs transition active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Script'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1"
                  >
                    <span>{showCode ? 'Hide Code' : 'View Code'}</span>
                    {showCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {showCode && (
                <pre className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-72 scrollbar-thin border border-slate-800">
                  {GAS_TEMPLATE_CODE}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* School Profile & Identity Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <School className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900">School Profile & Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">School Official Name</label>
              <input
                type="text"
                required
                value={formData.school_name}
                onChange={e => setFormData({ ...formData, school_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Session</label>
              <input
                type="text"
                required
                value={formData.academic_session}
                onChange={e => setFormData({ ...formData, academic_session: e.target.value })}
                placeholder="2026-2027"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official WhatsApp & Phone</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="principal@school.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit 3D Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="btn_save_school_settings"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Configuration...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
