import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { QuickActions } from './QuickActions.js';
import {
  Users,
  CalendarCheck2,
  BellRing,
  CreditCard,
  GraduationCap,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Sparkles,
  School,
  ChevronRight,
  UserPlus,
  IndianRupee,
  Layers
} from 'lucide-react';
import { DashboardStats, ActivityLog } from '../types/index.js';
import { apiFetch } from '../lib/api.js';

export const DashboardView: React.FC = () => {
  const { token, currentSchool, setActiveView, showToast } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, actRes] = await Promise.all([
        apiFetch('/api/school/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        apiFetch('/api/school/activities', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const dashData = await dashRes.json();
      const actData = await actRes.json();

      if (dashData.success) setStats(dashData.data);
      if (actData.success) setActivities(actData.data || []);
    } catch (e) {
      showToast('Error loading dashboard statistics.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = [
    {
      title: 'Total Students',
      value: stats?.totalStudents ?? 42,
      subtitle: `${stats?.activeStudents ?? 42} Active Enrollments`,
      icon: Users,
      gradient: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-100 text-blue-800',
      shadowColor: 'shadow-blue-500/20',
      view: 'students'
    },
    {
      title: "Today's Attendance",
      value: stats?.todayAttendancePercentage ? `${stats.todayAttendancePercentage}%` : '96.2%',
      subtitle: `${stats?.presentToday ?? 38} Present • ${stats?.absentToday ?? 4} Absent`,
      icon: CalendarCheck2,
      gradient: 'from-emerald-600 to-teal-600',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      shadowColor: 'shadow-emerald-500/20',
      view: 'attendance'
    },
    {
      title: 'Active Faculty',
      value: stats?.totalTeachers ?? 6,
      subtitle: 'All subject in-charges',
      icon: GraduationCap,
      gradient: 'from-purple-600 to-pink-600',
      badgeBg: 'bg-purple-100 text-purple-800',
      shadowColor: 'shadow-purple-500/20',
      view: 'teachers'
    },
    {
      title: 'School Circulars',
      value: stats?.activeNoticesCount ?? 3,
      subtitle: 'Published & Broadcasted',
      icon: BellRing,
      gradient: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-100 text-amber-800',
      shadowColor: 'shadow-amber-500/20',
      view: 'notices'
    }
  ];

  return (
    <div id="schoolos_dashboard_view" className="space-y-6">
      {/* 3D Colorful Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/20 border border-indigo-400/30">
        {/* Abstract 3D Geometric circles background */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white font-black text-[11px] uppercase tracking-wider border border-white/20 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                {currentSchool?.school_id || 'SCH001'} • Active Mini-SaaS
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 font-bold text-[11px] border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                System Operational
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              Welcome, {currentSchool?.admin_name || 'School Principal'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Managing <strong className="text-white font-bold">{currentSchool?.school_name}</strong> for Academic Session <span className="underline decoration-amber-400 decoration-2">{currentSchool?.academic_session || '2026-2027'}</span>.
            </p>
          </div>

          {/* Quick Action Hero Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveView('admissions')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-blue-800 hover:bg-blue-50 font-black text-xs shadow-lg shadow-black/10 transition active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Enroll Student</span>
            </button>

            <button
              onClick={() => setActiveView('attendance')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95 border border-emerald-400/30"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              onClick={() => setActiveView(kpi.view)}
              className={`group p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl ${kpi.shadowColor} transition-all duration-300 cursor-pointer relative overflow-hidden transform hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${kpi.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`px-2.5 py-1 text-[11px] font-black rounded-full ${kpi.badgeBg}`}>
                  1-Click View
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{kpi.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {isLoading ? (
                      <span className="inline-block w-16 h-7 bg-slate-100 animate-pulse rounded-lg"></span>
                    ) : (
                      kpi.value
                    )}
                  </h3>
                </div>
                <p className="text-xs font-medium text-slate-700 flex items-center gap-1 pt-1 border-t border-slate-100">
                  <span>{kpi.subtitle}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3D Quick Operations Bar */}
      <QuickActions />

      {/* Two-Column Grid: Quick Modules & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Operations Hub */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Today's School Operations Summary</h3>
                  <p className="text-[11px] text-slate-700">Real-time stats across grades and communications</p>
                </div>
              </div>

              <button
                onClick={() => setActiveView('attendance')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Full Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick 3-Tile Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">Attendance</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xl font-black text-emerald-950">
                  {stats?.presentToday ?? 38} Present
                </p>
                <p className="text-[10px] font-semibold text-emerald-700">
                  {stats?.absentToday ?? 4} Absentees Notified
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-800">Fee Ledger</span>
                  <CreditCard className="w-4 h-4 text-cyan-600" />
                </div>
                <p className="text-xl font-black text-cyan-950">
                  ₹{(stats?.totalStudents ? stats.totalStudents * 5000 : 210000).toLocaleString()}
                </p>
                <p className="text-[10px] font-semibold text-cyan-700">Monthly Tuition Target</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-800">Classes</span>
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xl font-black text-purple-950">12 Grades</p>
                <p className="text-[10px] font-semibold text-purple-700">Sections A, B, C active</p>
              </div>
            </div>

            {/* Quick 1-Click WhatsApp Parent Broadcast Trigger */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-emerald-600/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">Direct Parent WhatsApp Notifications</h4>
                  <p className="text-[11px] text-emerald-100">Send instant fee receipts, attendance alerts, & circulars with 1 tap.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('messages')}
                className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-black text-xs shadow-sm transition active:scale-95 w-fit"
              >
                Open Message Center
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Activity Stream */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900">Recent School Activity</h3>
            </div>
            <button
              onClick={fetchDashboardData}
              className="p-1 text-slate-400 hover:text-blue-600 transition"
              title="Refresh Activity"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
            {activities.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No recent activity logged yet.
              </div>
            ) : (
              activities.slice(0, 7).map(act => (
                <div
                  key={act.log_id}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{act.action}</span>
                    <span className="text-[10px] font-semibold text-slate-700">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px]">{act.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
