import React, { createContext, useContext, useState, useEffect } from 'react';
import { SchoolTenant, SuperAdminUser, UserRole, ConnectionState } from '../types/index.js';

interface AuthContextType {
  token: string | null;
  superAdminToken: string | null;
  role: UserRole | null;
  currentSchool: SchoolTenant | null;
  superAdminUser: SuperAdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginSchool: (schoolId: string, passwordOrPin: string) => Promise<{ success: boolean; message: string }>;
  loginAsSchool: (schoolId: string, passwordOrPin: string) => Promise<boolean>;
  loginSuperAdmin: (usernameOrPin: string, password?: string) => Promise<{ success: boolean; message: string }>;
  loginAsSuperAdmin: (pinOrPassword: string, username?: string) => Promise<boolean>;
  switchSchoolTenant: (schoolId: string, pinOrPassword?: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentSchool: (school: Partial<SchoolTenant>) => void;
  connectionState: ConnectionState;
  lastCheckedTime: string;
  testConnection: () => Promise<{ success: boolean; message: string }>;
  repairDatabase: () => Promise<{ success: boolean; message: string }>;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  activeView: string;
  setActiveView: (view: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('schoolos_token'));
  const [role, setRole] = useState<UserRole | null>(() => (localStorage.getItem('schoolos_role') as UserRole) || null);
  const [currentSchool, setCurrentSchool] = useState<SchoolTenant | null>(() => {
    const saved = localStorage.getItem('schoolos_school');
    return saved ? JSON.parse(saved) : null;
  });
  const [superAdminUser, setSuperAdminUser] = useState<SuperAdminUser | null>(() => {
    const saved = localStorage.getItem('schoolos_superadmin');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [connectionState, setConnectionState] = useState<ConnectionState>('CONNECTED');
  const [lastCheckedTime, setLastCheckedTime] = useState<string>(
    new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  );
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Verify session on boot
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          setRole(data.data.role);
          if (data.data.role === 'SUPER_ADMIN') {
            setSuperAdminUser(data.data.superAdmin);
          } else if (data.data.school) {
            setCurrentSchool(data.data.school);
            localStorage.setItem('schoolos_school', JSON.stringify(data.data.school));
          }
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session verify error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const loginSchool = async (schoolId: string, passwordOrPin: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_id: schoolId, password: passwordOrPin, pin: passwordOrPin })
      });
      const data = await res.json();

      if (data.success && data.data) {
        setToken(data.data.token);
        setRole('SCHOOL_ADMIN');
        setCurrentSchool(data.data.school);
        setSuperAdminUser(null);

        localStorage.setItem('schoolos_token', data.data.token);
        localStorage.setItem('schoolos_role', 'SCHOOL_ADMIN');
        localStorage.setItem('schoolos_school', JSON.stringify(data.data.school));
        localStorage.removeItem('schoolos_superadmin');

        setActiveView('dashboard');
        showToast(`Welcome back, ${data.data.school.admin_name || 'Admin'}!`, 'success');
        return { success: true, message: data.message };
      } else {
        showToast(data.message || 'Login failed', 'error');
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (err: any) {
      showToast('Network error during login. Please try again.', 'error');
      return { success: false, message: 'Server unreachable.' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsSchool = async (schoolId: string, passwordOrPin: string): Promise<boolean> => {
    const res = await loginSchool(schoolId, passwordOrPin);
    return res.success;
  };

  const loginSuperAdmin = async (usernameOrPin: string, password?: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      // Support single parameter PIN login or username+password login
      const payload = password !== undefined
        ? { username: usernameOrPin, password }
        : { username: 'superadmin', password: usernameOrPin, pin: usernameOrPin };

      const res = await fetch('/api/auth/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.data) {
        setToken(data.data.token);
        setRole('SUPER_ADMIN');
        setSuperAdminUser(data.data.superAdmin);
        setCurrentSchool(null);

        localStorage.setItem('schoolos_token', data.data.token);
        localStorage.setItem('schoolos_role', 'SUPER_ADMIN');
        localStorage.setItem('schoolos_superadmin', JSON.stringify(data.data.superAdmin));
        localStorage.removeItem('schoolos_school');

        setActiveView('super_admin');
        showToast('Logged in as Super Admin.', 'success');
        return { success: true, message: data.message };
      } else {
        showToast(data.message || 'Invalid Super Admin credentials', 'error');
        return { success: false, message: data.message || 'Login failed.' };
      }
    } catch (err) {
      showToast('Server unreachable.', 'error');
      return { success: false, message: 'Network error.' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsSuperAdmin = async (pinOrPassword: string, username?: string): Promise<boolean> => {
    const res = username
      ? await loginSuperAdmin(username, pinOrPassword)
      : await loginSuperAdmin(pinOrPassword);
    return res.success;
  };

  const switchSchoolTenant = async (schoolId: string, pinOrPassword?: string): Promise<boolean> => {
    const res = await loginSchool(schoolId, pinOrPassword || '1234');
    if (res.success) {
      setActiveView('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }

    setToken(null);
    setRole(null);
    setCurrentSchool(null);
    setSuperAdminUser(null);
    localStorage.removeItem('schoolos_token');
    localStorage.removeItem('schoolos_role');
    localStorage.removeItem('schoolos_school');
    localStorage.removeItem('schoolos_superadmin');
    setActiveView('dashboard');
    showToast('Logged out successfully.', 'info');
  };

  const updateCurrentSchool = (updated: Partial<SchoolTenant>) => {
    if (currentSchool) {
      const next = { ...currentSchool, ...updated };
      setCurrentSchool(next);
      localStorage.setItem('schoolos_school', JSON.stringify(next));
    }
  };

  const testConnection = async (): Promise<{ success: boolean; message: string }> => {
    if (!token) return { success: false, message: 'Not logged in' };
    setConnectionState('CHECKING');
    try {
      const res = await fetch('/api/school/connection/test', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const timestamp = new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      setLastCheckedTime(timestamp);

      if (data.success && data.data.connected) {
        setConnectionState('CONNECTED');
        showToast('Google Sheet connection verified & healthy.', 'success');
        return { success: true, message: data.data.message };
      } else {
        setConnectionState('DISCONNECTED');
        showToast('Google Sheet connection failed.', 'error');
        return { success: false, message: data.data?.message || 'Connection failed' };
      }
    } catch (e) {
      setConnectionState('DISCONNECTED');
      showToast('Connection test failed.', 'error');
      return { success: false, message: 'Failed to test connection' };
    }
  };

  const repairDatabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!token) return { success: false, message: 'Not logged in' };
    setConnectionState('CHECKING');
    try {
      const res = await fetch('/api/school/connection/repair', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setConnectionState('CONNECTED');
      const timestamp = new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      setLastCheckedTime(timestamp);
      showToast(data.message, 'success');
      return { success: true, message: data.message };
    } catch (e) {
      setConnectionState('DISCONNECTED');
      showToast('Database repair failed.', 'error');
      return { success: false, message: 'Repair failed.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        superAdminToken: role === 'SUPER_ADMIN' ? token : null,
        role,
        currentSchool,
        superAdminUser,
        isAuthenticated: !!token,
        isLoading,
        loginSchool,
        loginAsSchool,
        loginSuperAdmin,
        loginAsSuperAdmin,
        switchSchoolTenant,
        logout,
        updateCurrentSchool,
        connectionState,
        lastCheckedTime,
        testConnection,
        repairDatabase,
        showToast,
        toast,
        activeView,
        setActiveView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
