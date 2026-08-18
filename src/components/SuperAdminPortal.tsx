import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  ShieldCheck,
  Plus,
  School,
  Database,
  ExternalLink,
  RefreshCw,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Copy,
  Users,
  Search,
  Image,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Lock,
  FileSpreadsheet,
  Check,
  KeyRound
} from 'lucide-react';
import { SchoolConfig } from '../types/index.js';

const SAMPLE_LOGOS = [
  { label: 'Academy Crest', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Emblem Shield', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80' },
  { label: 'Wisdom Book', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop&q=80' },
  { label: 'Modern Torch', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80' }
];

export const SuperAdminPortal: React.FC = () => {
  const { token, superAdminToken, switchSchoolTenant, showToast } = useAuth();

  const [schools, setSchools] = useState<SchoolConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Password Change State
  const [passData, setPassData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Add School Form State with School Logo support
  const [newSchool, setNewSchool] = useState({
    school_id: `SCH00${Math.floor(4 + Math.random() * 90)}`,
    school_name: '',
    google_sheet_id: '',
    gas_web_app_url: '',
    pin: '1234',
    contact_phone: '+91 9876543210',
    contact_email: 'principal@school.edu',
    academic_session: '2026-2027',
    school_logo: SAMPLE_LOGOS[0].url
  });

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/super-admin/schools', {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Super-Admin-Token': superAdminToken || ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setSchools(data.data || []);
      }
    } catch (e) {
      showToast('Error loading registered schools.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.school_name.trim() || !newSchool.google_sheet_id.trim()) {
      showToast('School Name and Google Sheet ID are required.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/super-admin/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Super-Admin-Token': superAdminToken || ''
        },
        body: JSON.stringify(newSchool)
      });
      const result = await res.json();
      if (result.success) {
        showToast(`✓ School "${newSchool.school_name}" created & database isolated!`, 'success');
        setShowAddModal(false);
        setNewSchool({
          school_id: `SCH00${Math.floor(4 + Math.random() * 90)}`,
          school_name: '',
          google_sheet_id: '',
          gas_web_app_url: '',
          pin: '1234',
          contact_phone: '+91 9876543210',
          contact_email: 'principal@school.edu',
          academic_session: '2026-2027',
          school_logo: SAMPLE_LOGOS[0].url
        });
        fetchSchools();
      } else {
        showToast(result.message || 'Failed to create school.', 'error');
      }
    } catch (e) {
      showToast('Network error creating school.', 'error');
    }
  };

  const handleChangeMasterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new_password !== passData.confirm_password) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (passData.new_password.length < 4) {
      showToast('Password must be at least 4 characters long.', 'error');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await fetch('/api/super-admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Super-Admin-Token': superAdminToken || ''
        },
        body: JSON.stringify({
          current_password: passData.current_password,
          new_password: passData.new_password
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('✓ Super Admin Master Password updated successfully!', 'success');
        setShowPasswordModal(false);
        setPassData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        showToast(data.message || 'Failed to update password.', 'error');
      }
    } catch (e) {
      showToast('Network error changing password.', 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('✓ Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEnterSchoolPortal = async (school: SchoolConfig) => {
    await switchSchoolTenant(school.school_id, school.pin || '1234');
  };

  const q = (search || '').toLowerCase();
  const filteredSchools = schools.filter(
    s =>
      (s.school_name || '').toLowerCase().includes(q) ||
      (s.school_id || '').toLowerCase().includes(q) ||
      (s.google_sheet_id || '').toLowerCase().includes(q)
  );

  return (
    <div id="schoolos_super_admin_portal" className="space-y-6">
      {/* 3D Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/25 border border-white/20">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Super Admin Multi-Tenant Master Hub
              </h2>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                Global SaaS Management Portal. Each school has strict zero-leakage Google Sheets isolation.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn_change_super_admin_pass"
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 shadow-2xs transition active:scale-95"
          >
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Change Master Password</span>
          </button>

          <button
            id="btn_provision_new_school"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>+ Provision New School</span>
          </button>
        </div>
      </div>

      {/* 3D Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-3xl"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Schools</p>
          <p className="text-3xl font-black text-slate-900">{schools.length}</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Multi-Tenant Isolated
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-3xl"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Google Sheet Databases</p>
          <p className="text-3xl font-black text-emerald-600">{schools.length}</p>
          <span className="text-[11px] font-medium text-slate-500">1 Dedicated Sheet per school</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-3xl"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Architecture</p>
          <p className="text-xl font-black text-indigo-900">Commercial SaaS V1</p>
          <span className="text-[11px] font-bold text-indigo-600">Zero-leakage data sandbox</span>
        </div>
      </div>

      {/* Search & Actions Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schools by name, ID, or Google Sheet ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <button
          onClick={fetchSchools}
          className="p-2.5 rounded-2xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition active:scale-95 shadow-2xs"
          title="Refresh Schools"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Schools List Grid with School Logo */}
      {isLoading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Loading Provisioned Schools...</p>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No schools matching search</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchools.map(school => (
            <div
              key={school.school_id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-200 space-y-4 flex flex-col justify-between relative overflow-hidden group transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-blue-500/10 via-indigo-500/10 to-transparent rounded-bl-3xl"></div>

              <div className="space-y-3 relative z-10">
                {/* Header with Logo */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={school.school_logo || SAMPLE_LOGOS[0].url}
                      alt={school.school_name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md shadow-blue-900/10 bg-slate-100 flex-shrink-0"
                      referrerPolicy="no-referrer"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {school.school_id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {school.status || 'ACTIVE'}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 mt-1 leading-tight line-clamp-1">
                        {school.school_name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* School Details */}
                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs space-y-1.5 font-medium">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Admin:</span>
                    <strong className="text-slate-800">{school.admin_name || 'Principal'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Session:</span>
                    <strong className="text-slate-800">{school.academic_session || '2026-2027'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Contact:</span>
                    <strong className="font-mono text-slate-800">{school.school_phone || school.contact_phone || '-'}</strong>
                  </div>
                </div>

                {/* Database Google Sheet Mapping */}
                <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                      <Database className="w-3 h-3 text-emerald-600" />
                      Google Sheet ID:
                    </span>
                    <button
                      onClick={() => handleCopy(school.school_id, school.google_sheet_id)}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                    >
                      {copiedId === school.school_id ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === school.school_id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-slate-700 truncate font-medium">
                    {school.google_sheet_id}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 relative z-10">
                <a
                  href={`https://docs.google.com/spreadsheets/d/${school.google_sheet_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open Sheet</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <button
                  onClick={() => handleEnterSchoolPortal(school)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Enter Portal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHANGE SUPER ADMIN MASTER PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Change Master Password</h3>
                  <p className="text-[11px] text-slate-500">Update global Super Admin access credentials.</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangeMasterPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Master Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password (default: admin123)"
                  value={passData.current_password}
                  onChange={e => setPassData({ ...passData, current_password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Master Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 4 characters"
                  value={passData.new_password}
                  onChange={e => setPassData({ ...passData, new_password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={passData.confirm_password}
                  onChange={e => setPassData({ ...passData, confirm_password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isChangingPass ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isChangingPass ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROVISION NEW SCHOOL MODAL WITH SCHOOL LOGO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Provision New School Tenant</h3>
                  <p className="text-[11px] text-slate-500">Configure school identity, logo, and dedicated Google Sheet ID.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSchool} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">School ID *</label>
                  <input
                    type="text"
                    required
                    value={newSchool.school_id}
                    onChange={e => setNewSchool({ ...newSchool, school_id: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white font-mono text-sm font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Admin PIN / Password *</label>
                  <input
                    type="text"
                    required
                    value={newSchool.pin}
                    onChange={e => setNewSchool({ ...newSchool, pin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Official Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cambridge Model International School"
                  value={newSchool.school_name}
                  onChange={e => setNewSchool({ ...newSchool, school_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* SCHOOL LOGO SELECTOR & URL INPUT */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-indigo-600" />
                    <span>School Logo (Official Crest / Emblem)</span>
                  </label>
                  {newSchool.school_logo && (
                    <img
                      src={newSchool.school_logo}
                      alt="Logo preview"
                      className="w-7 h-7 rounded-lg object-cover border border-slate-300 shadow-2xs"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>

                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={newSchool.school_logo}
                  onChange={e => setNewSchool({ ...newSchool, school_logo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600"
                />

                {/* Preset Logo Quick Pick */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-500">Preset Crests:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SAMPLE_LOGOS.map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setNewSchool({ ...newSchool, school_logo: item.url })}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition border ${
                          newSchool.school_logo === item.url
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dedicated Google Spreadsheet ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={newSchool.google_sheet_id}
                  onChange={e => setNewSchool({ ...newSchool, google_sheet_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-slate-50 font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  This school's students, attendance, fees, and circulars will be stored exclusively in this spreadsheet.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newSchool.contact_phone}
                    onChange={e => setNewSchool({ ...newSchool, contact_phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 bg-white text-xs outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={newSchool.contact_email}
                    onChange={e => setNewSchool({ ...newSchool, contact_email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 bg-white text-xs outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition active:scale-95"
                >
                  Provision School Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
