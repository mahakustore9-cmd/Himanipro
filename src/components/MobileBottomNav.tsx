import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck2,
  CreditCard,
  Settings,
  ShieldCheck,
  MessageSquare,
  Users
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMoreMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMoreMenu }) => {
  const { activeView, setActiveView, role } = useAuth();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const navItems = isSuperAdmin
    ? [
        { id: 'super_admin', label: 'Master Hub', icon: ShieldCheck },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    : [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
        { id: 'fees', label: 'Fees', icon: CreditCard },
        { id: 'settings', label: 'Settings', icon: Settings }
      ];

  return (
    <div
      id="schoolos_mobile_bottom_nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`mobile_nav_${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[60px] min-h-[48px] ${
                isActive
                  ? 'text-blue-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
