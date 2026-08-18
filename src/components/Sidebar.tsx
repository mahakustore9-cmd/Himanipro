import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CalendarCheck2,
  GraduationCap,
  Layers,
  CreditCard,
  BellRing,
  BarChart3,
  MessageSquare,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  X,
  School,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeView, setActiveView, currentSchool, role, logout } = useAuth();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: '',
      color: 'from-blue-600 to-indigo-600',
      activeBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
    },
    {
      id: 'admissions',
      label: 'Admissions',
      icon: UserPlus,
      badge: 'New',
      color: 'from-indigo-600 to-violet-600',
      activeBg: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
    },
    {
      id: 'students',
      label: 'Students Directory',
      icon: Users,
      badge: '',
      color: 'from-violet-600 to-purple-600',
      activeBg: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25'
    },
    {
      id: 'attendance',
      label: 'Attendance Matrix',
      icon: CalendarCheck2,
      badge: 'Live',
      color: 'from-emerald-600 to-teal-600',
      activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
    },
    {
      id: 'teachers',
      label: 'Faculty & Staff',
      icon: GraduationCap,
      badge: '',
      color: 'from-purple-600 to-pink-600',
      activeBg: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-500/25'
    },
    {
      id: 'classes',
      label: 'Classes & Sections',
      icon: Layers,
      badge: '',
      color: 'from-sky-600 to-blue-600',
      activeBg: 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/25'
    },
    {
      id: 'fees',
      label: 'Fees & Receipts',
      icon: CreditCard,
      badge: '',
      color: 'from-cyan-600 to-teal-600',
      activeBg: 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/25'
    },
    {
      id: 'notices',
      label: 'School Notice Board',
      icon: BellRing,
      badge: '',
      color: 'from-amber-500 to-orange-600',
      activeBg: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25'
    },
    {
      id: 'messages',
      label: 'WhatsApp Center',
      icon: MessageSquare,
      badge: 'Direct',
      color: 'from-emerald-500 to-green-600',
      activeBg: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/25'
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: '',
      color: 'from-slate-700 to-slate-900',
      activeBg: 'bg-gradient-to-r from-slate-800 to-slate-950 text-white shadow-md shadow-slate-900/25'
    },
    {
      id: 'settings',
      label: 'School & Database Settings',
      icon: Settings,
      badge: 'Database',
      color: 'from-slate-800 to-indigo-950',
      activeBg: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md shadow-indigo-950/30'
    }
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        ></div>
      )}

      <aside
        id="schoolos_main_sidebar"
        className={`fixed lg:sticky top-0 lg:top-18 left-0 h-screen lg:h-[calc(100vh-4.5rem)] w-72 sm:w-80 bg-white/95 backdrop-blur-md border-r border-slate-200/90 z-50 lg:z-30 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <School className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 truncate max-w-[170px]">
                {currentSchool?.school_name || 'SchoolOS'}
              </p>
              <p className="text-[10px] font-bold text-blue-700">Quick Navigation Menu</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-xl bg-white text-slate-500 hover:text-slate-900 border border-slate-200 shadow-2xs active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="flex items-center justify-between px-3 py-1 mb-1 text-[11px] font-extrabold tracking-wider text-slate-700 uppercase">
            <span>School Modules</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>

          {isSuperAdmin ? (
            <div className="space-y-1.5">
              <button
                onClick={() => handleNavClick('super_admin')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                  activeView === 'super_admin'
                    ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-lg shadow-indigo-950/30 translate-x-1'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Super Admin Master Hub</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </div>
          ) : (
            menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav_btn_${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 group active:scale-98 ${
                    isActive
                      ? `${item.activeBg} translate-x-1`
                      : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-white/20 text-white shadow-2xs'
                          : `bg-slate-100 text-slate-600 group-hover:bg-gradient-to-tr group-hover:${item.color} group-hover:text-white group-hover:shadow-xs`
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full transition-colors ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : item.badge === 'Live'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.badge === 'Database'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : item.badge === 'Direct'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Sidebar Footer: School Info & Signout (Database moved exclusively to Settings) */}
        <div className="p-4 border-t border-slate-200/90 bg-slate-50/80 space-y-2">
          {!isSuperAdmin && currentSchool && (
            <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-700 uppercase">
                  Academic Session
                </span>
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/80">
                  {currentSchool.academic_session || '2026-2027'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentSchool.school_name}
              </p>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-xl transition border border-rose-200/80 active:scale-98"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
