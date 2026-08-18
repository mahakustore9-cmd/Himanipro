import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Users,
  CalendarCheck2,
  CreditCard,
  CheckCircle2,
  Table,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { apiFetch } from '../lib/api.js';

export const ReportsModule: React.FC = () => {
  const { token, currentSchool, showToast } = useAuth();
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  const handleExportCSV = async (type: string, filename: string) => {
    setDownloadingType(type);
    try {
      const res = await apiFetch(`/api/school/reports/export?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_${currentSchool?.school_id || 'SCH'}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast(`✓ Exported ${filename}.csv successfully!`, 'success');
    } catch (e) {
      showToast('Export failed.', 'error');
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div id="schoolos_reports_module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-800/20">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Reports & Data Export</h2>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Download verified CSV data exports and generate consolidated performance reports.
          </p>
        </div>

        {currentSchool?.google_sheet_id && (
          <a
            href={`https://docs.google.com/spreadsheets/d/${currentSchool.google_sheet_id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Open Master Google Sheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Students Export */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Students Master List</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Export complete student demographic records, roll numbers, admission dates, parent contacts, and residential addresses.
            </p>
          </div>

          <button
            onClick={() => handleExportCSV('students', 'Students_Master')}
            disabled={downloadingType === 'students'}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingType === 'students' ? 'Exporting...' : 'Export Students CSV'}</span>
          </button>
        </div>

        {/* Attendance Export */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Attendance Log</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Export detailed daily attendance logs with Present/Absent/Late status stamps, completion audit trails, and student percentages.
            </p>
          </div>

          <button
            onClick={() => handleExportCSV('attendance', 'Attendance_Log')}
            disabled={downloadingType === 'attendance'}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingType === 'attendance' ? 'Exporting...' : 'Export Attendance CSV'}</span>
          </button>
        </div>

        {/* Fees Export */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Fee Ledger & Receipts</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Export comprehensive payment records including receipt numbers, amounts in INR, payment modes (UPI/Cash), and dates.
            </p>
          </div>

          <button
            onClick={() => handleExportCSV('fees', 'Fee_Ledger')}
            disabled={downloadingType === 'fees'}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingType === 'fees' ? 'Exporting...' : 'Export Fees CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
