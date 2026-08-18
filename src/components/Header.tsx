import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Building2,
  ShieldCheck,
  School,
  Menu,
  Sparkles,
  Settings,
  UserPlus,
  MessageSquare
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { currentSchool, superAdminUser, role, logout, setActiveView } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isSuperAdmin = role === 'SUPER_ADMIN';

  return (
    <header
      id="schoolos_top_header"
      className="sticky top-0 z-30 flex items-center justify-between h-16 sm:h-18 px-3 sm:px-6 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
    >
      {/* Left: Mobile Toggle + School Identity */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Mobile Hamburger Menu Button */}
        <button
          id="btn_mobile_sidebar_toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Navigation Menu"
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all shadow-xs border border-slate-200/80"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* School Logo / 3D Icon */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-md shadow-indigo-500/25 text-white overflow-hidden flex-shrink-0 border-2 border-white transform group-hover:scale-105 transition duration-200">
              {isSuperAdmin ? (
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              ) : currentSchool?.school_logo ? (
                <img
                  src={currentSchool.school_logo}
                  alt="School Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <School className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 line-clamp-1">
                {isSuperAdmin ? 'SchoolOS Multi-Tenant Hub' : currentSchool?.school_name || 'SchoolOS Management'}
              </h1>
              {!isSuperAdmin && currentSchool?.school_id && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg shadow-2xs">
                  {currentSchool.school_id}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-semibold text-slate-700">
                Session: {currentSchool?.academic_session || '2026-2027'}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>
                Active School
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Quick Action Buttons & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Admission / WhatsApp Shortcuts (Desktop) */}
        {!isSuperAdmin && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveView('admissions')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Admission</span>
            </button>

            <button
              onClick={() => setActiveView('messages')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        )}

        {/* Notifications Bell with 3D Badge */}
        <div className="relative">
          <button
            id="schoolos_notification_btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200 shadow-2xs active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">School Notifications</h3>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full">
                  3 Updates
                </span>
              </div>
              <div className="divide-y divide-slate-100 mt-2 max-h-72 overflow-y-auto space-y-1">
                <div className="py-2.5 flex gap-3 text-xs">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 h-fit shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Attendance Completed</p>
                    <p className="text-slate-700 mt-0.5">Today's daily attendance saved and prepared for parents.</p>
                    <span className="text-[10px] text-slate-600 mt-1 block">5 mins ago</span>
                  </div>
                </div>

                <div className="py-2.5 flex gap-3 text-xs">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-800 h-fit shadow-2xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">WhatsApp Broadcast Prepared</p>
                    <p className="text-slate-700 mt-0.5">Circular links generated for all class parents.</p>
                    <span className="text-[10px] text-slate-600 mt-1 block">20 mins ago</span>
                  </div>
                </div>

                <div className="py-2.5 flex gap-3 text-xs">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800 h-fit shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">New Student Enrolled</p>
                    <p className="text-slate-700 mt-0.5">Admission recorded with fee voucher generated.</p>
                    <span className="text-[10px] text-slate-600 mt-1 block">1 hour ago</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveView('messages');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  View WhatsApp Message Center →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            id="schoolos_admin_profile_btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {isSuperAdmin
                ? 'SA'
                : currentSchool?.admin_name
                ? currentSchool.admin_name.substring(0, 2).toUpperCase()
                : 'AD'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                {isSuperAdmin ? 'Super Admin' : currentSchool?.admin_name || 'Admin'}
              </p>
              <p className="text-[10px] font-medium text-slate-700 leading-tight">
                {isSuperAdmin ? 'Multi-School Master' : 'School Principal'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3.5 py-3 border-b border-slate-100 mb-1.5 bg-slate-50/70 rounded-2xl">
                <p className="text-xs font-bold text-slate-900">
                  {isSuperAdmin ? superAdminUser?.name : currentSchool?.admin_name}
                </p>
                <p className="text-[11px] text-slate-700 truncate mt-0.5">
                  {isSuperAdmin ? superAdminUser?.email : currentSchool?.admin_email}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200">
                    STATUS: ACTIVE
                  </span>
                  {!isSuperAdmin && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-lg border border-blue-200">
                      {currentSchool?.school_id}
                    </span>
                  )}
                </div>
              </div>

              {!isSuperAdmin ? (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveView('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition text-left"
                >
                  <Settings className="w-4 h-4 text-blue-600" />
                  School & Database Settings
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveView('super_admin');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Super Admin Management
                </button>
              )}

              <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
