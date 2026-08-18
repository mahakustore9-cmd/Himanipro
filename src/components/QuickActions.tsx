import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  UserPlus,
  CalendarCheck2,
  BellPlus,
  Users,
  BarChart3,
  CreditCard,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { setActiveView } = useAuth();

  const actions = [
    {
      id: 'admissions',
      title: 'New Admission',
      subtitle: 'Enroll student & photo',
      icon: UserPlus,
      gradient: 'from-blue-600 via-indigo-600 to-blue-700',
      badge: 'Fast Flow',
      borderHover: 'hover:border-blue-400',
      shadowColor: 'shadow-blue-500/20'
    },
    {
      id: 'attendance',
      title: 'Take Attendance',
      subtitle: 'Daily 1-click matrix',
      icon: CalendarCheck2,
      gradient: 'from-emerald-600 via-teal-600 to-emerald-700',
      badge: 'Live',
      borderHover: 'hover:border-emerald-400',
      shadowColor: 'shadow-emerald-500/20'
    },
    {
      id: 'fees',
      title: 'Collect Fees',
      subtitle: 'Receipt & WhatsApp bill',
      icon: CreditCard,
      gradient: 'from-cyan-600 via-sky-600 to-blue-700',
      badge: 'Instant',
      borderHover: 'hover:border-cyan-400',
      shadowColor: 'shadow-cyan-500/20'
    },
    {
      id: 'messages',
      title: 'WhatsApp Center',
      subtitle: 'Direct broadcast to parents',
      icon: MessageSquare,
      gradient: 'from-green-600 via-emerald-600 to-teal-700',
      badge: 'Zero-Cost',
      borderHover: 'hover:border-green-400',
      shadowColor: 'shadow-green-500/20'
    },
    {
      id: 'notices',
      title: 'Post Notice',
      subtitle: 'School circulars & events',
      icon: BellPlus,
      gradient: 'from-amber-500 via-orange-600 to-amber-700',
      badge: 'Public',
      borderHover: 'hover:border-amber-400',
      shadowColor: 'shadow-amber-500/20'
    },
    {
      id: 'students',
      title: 'Student Roster',
      subtitle: 'Directory & Profiles',
      icon: Users,
      gradient: 'from-violet-600 via-purple-600 to-indigo-700',
      badge: 'Directory',
      borderHover: 'hover:border-purple-400',
      shadowColor: 'shadow-purple-500/20'
    }
  ];

  return (
    <div id="schoolos_quick_actions" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
          <h2 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 uppercase">
            3D Quick Operations
          </h2>
        </div>
        <span className="text-[11px] font-bold text-slate-700">1-Tap Fast Launch</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={`quick_action_${action.id}`}
              onClick={() => setActiveView(action.id)}
              className={`group flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg ${action.shadowColor} ${action.borderHover} transition-all duration-200 text-left relative overflow-hidden transform hover:-translate-y-1 active:translate-y-0 min-h-[120px]`}
            >
              {/* 3D Top Corner Gradient Accent */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${action.gradient} opacity-10 rounded-bl-3xl group-hover:opacity-20 transition-opacity`}
              ></div>

              <div className="flex items-center justify-between w-full relative z-10 mb-2">
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${action.gradient} text-white flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                  {action.badge}
                </span>
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                  <span>{action.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600 hidden sm:block" />
                </h3>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-700 line-clamp-1">
                  {action.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
