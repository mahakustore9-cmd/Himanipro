import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Database,
  RefreshCw,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Radio,
  Mail,
  MessageSquare
} from 'lucide-react';

export const DatabaseConnectionCard: React.FC = () => {
  const { currentSchool, connectionState, lastCheckedTime, testConnection, repairDatabase } = useAuth();
  const [isTesting, setIsTesting] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    await testConnection();
    setIsTesting(false);
  };

  const handleRepair = async () => {
    setIsRepairing(true);
    await repairDatabase();
    setIsRepairing(false);
  };

  const statusConfig = {
    CONNECTED: {
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'CONNECTED',
      icon: CheckCircle2
    },
    CHECKING: {
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      dot: 'bg-amber-500 animate-spin',
      label: 'CHECKING',
      icon: RefreshCw
    },
    DISCONNECTED: {
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      dot: 'bg-rose-500',
      label: 'DISCONNECTED',
      icon: AlertCircle
    }
  };

  const currentStatus = statusConfig[connectionState];

  return (
    <div
      id="database_connection_card"
      className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-50/70 via-indigo-50/30 to-transparent pointer-events-none rounded-bl-full"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-600/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                DATABASE CONNECTION
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-900">Google Sheets Master</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentStatus.color}`}
              >
                <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`}></span>
                {currentStatus.label}
              </span>
              <span className="text-xs text-slate-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-600" />
                Last checked: {lastCheckedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn_test_db_connection"
            onClick={handleTest}
            disabled={isTesting || isRepairing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100/90 hover:bg-slate-200/90 rounded-xl transition border border-slate-200/80 active:scale-95 disabled:opacity-60 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <button
            id="btn_repair_database"
            onClick={handleRepair}
            disabled={isTesting || isRepairing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition border border-blue-200/80 active:scale-95 disabled:opacity-60 shadow-sm"
          >
            <Wrench className={`w-3.5 h-3.5 ${isRepairing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isRepairing ? 'Repairing Tabs...' : 'Repair Database'}</span>
          </button>
        </div>
      </div>

      {/* Connectivity Diagnostic Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-slate-600">Google Sheets</span>
          </div>
          <span className="text-xs font-bold text-emerald-600">Connected</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-600">Backend API</span>
          </div>
          <span className="text-xs font-bold text-emerald-600">Connected</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-slate-600">Gmail</span>
          </div>
          <span className="text-xs font-bold text-slate-800">Configured</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-slate-600">WhatsApp</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
            Manual WhatsApp
          </span>
        </div>
      </div>

      {/* Target Sheet ID Reference */}
      {currentSchool?.google_sheet_id && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Target Spreadsheet ID:</span>
            <span className="text-slate-800 font-semibold truncate max-w-xs">{currentSchool.google_sheet_id}</span>
          </div>
          <a
            href={`https://docs.google.com/spreadsheets/d/${currentSchool.google_sheet_id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <span>Open in Google Sheets</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};
