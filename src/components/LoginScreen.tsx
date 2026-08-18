import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  GraduationCap,
  ShieldCheck,
  School,
  KeyRound,
  ArrowRight,
  Database,
  CheckCircle2,
  Sparkles,
  Lock
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginAsSchool, loginAsSuperAdmin, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState<'SCHOOL' | 'SUPER_ADMIN'>('SCHOOL');
  const [schoolId, setSchoolId] = useState<string>('SCH001');
  const [pin, setPin] = useState<string>('1234');
  const [superPin, setSuperPin] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId.trim() || !pin.trim()) {
      showToast('Please enter both School ID and Security PIN.', 'error');
      return;
    }
    setIsLoading(true);
    const success = await loginAsSchool(schoolId.trim(), pin.trim());
    setIsLoading(false);
  };

  const handleSuperSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!superPin.trim()) {
      showToast('Please enter the Super Admin Password.', 'error');
      return;
    }
    setIsLoading(true);
    const success = await loginAsSuperAdmin(superPin.trim());
    setIsLoading(false);
  };

  // Quick 1-click Demo Fillers
  const handleQuickFill = (sId: string, sPin: string) => {
    setActiveTab('SCHOOL');
    setSchoolId(sId);
    setPin(sPin);
    loginAsSchool(sId, sPin);
  };

  return (
    <div
      id="schoolos_auth_screen"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Banner */}
        <div className="bg-slate-900 px-6 pt-8 pb-6 text-center text-white relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">SchoolOS Cloud</h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-School Management SaaS with Google Sheets Database
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-[11px] font-semibold text-emerald-300 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Tenant-Isolated Production Engine
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('SCHOOL')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'SCHOOL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4 text-blue-600" />
            <span>School Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SUPER_ADMIN')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'SUPER_ADMIN'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Super Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {activeTab === 'SCHOOL' ? (
            <form onSubmit={handleSchoolSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  School Identifier (School ID)
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCH001"
                    value={schoolId}
                    onChange={e => setSchoolId(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-blue-700 focus:ring-2 focus:ring-blue-600 outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Security PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="e.g. 1234"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn_school_login_submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying Tenant...' : 'Access School Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSuperSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Super Admin Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Master Password (default: admin123)"
                    value={superPin}
                    onChange={e => setSuperPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn_super_admin_login_submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/30 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Authenticating...' : 'Enter Super Admin Portal'}</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </button>
            </form>
          )}

          {/* 1-Click Fast Demo Selectors */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider text-center">
              Quick 1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('SCH001', '1234')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition group"
              >
                <p className="font-bold text-slate-900 group-hover:text-blue-700">Greenwood High</p>
                <p className="text-[11px] text-slate-700">SCH001 • PIN: 1234</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('SCH002', '5678')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition group"
              >
                <p className="font-bold text-slate-900 group-hover:text-indigo-700">St. Mary's Acad.</p>
                <p className="text-[11px] text-slate-700">SCH002 • PIN: 5678</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-700 flex items-center justify-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Powered by Multi-Tenant Google Sheets Database Architecture</span>
        </div>
      </div>
    </div>
  );
};
