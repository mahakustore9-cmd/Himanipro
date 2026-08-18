import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  CalendarCheck2,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Coffee,
  Save,
  CheckSquare,
  MessageSquare,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Users,
  Percent
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceSummary, AttendanceStatus } from '../types/index.js';

export const AttendanceMatrix: React.FC = () => {
  const { token, currentSchool, showToast } = useAuth();

  const today = new Date();
  const [selectedClass, setSelectedClass] = useState<string>('8');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [activeDay, setActiveDay] = useState<number>(today.getDate());

  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Completion & WhatsApp Modal state
  const [showConfirmComplete, setShowConfirmComplete] = useState<boolean>(false);
  const [showWhatsAppBatchModal, setShowWhatsAppBatchModal] = useState<boolean>(false);
  const [parentMessagesList, setParentMessagesList] = useState<{
    student_id: string;
    student_name: string;
    parent_name: string;
    phone: string;
    status: string;
    whatsAppLink: string;
    messageText: string;
    hasNumber: boolean;
    opened?: boolean;
  }[]>([]);

  // Days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/school/attendance?class=${selectedClass}&section=${selectedSection}&month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      if (data.success) {
        setStudents(data.data.students || []);
        setAttendanceRecords(data.data.attendanceRecords || []);
        setSummary(data.data.summary || []);
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      showToast('Error loading attendance matrix.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedClass, selectedSection, selectedMonth, selectedYear]);

  // Helper to format Date string: YYYY-MM-DD
  const getDateStr = (day: number) => {
    const mm = String(selectedMonth).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${selectedYear}-${mm}-${dd}`;
  };

  // Get status for specific student and day
  const getCellStatus = (studentId: string, day: number): AttendanceStatus => {
    const dateStr = getDateStr(day);
    const rec = attendanceRecords.find(r => r.student_id === studentId && r.date === dateStr);
    return rec ? rec.status : 'P';
  };

  // Cycle status on click: P -> A -> L -> H -> P
  const handleCellClick = (studentId: string, day: number) => {
    const current = getCellStatus(studentId, day);
    const order: AttendanceStatus[] = ['P', 'A', 'L', 'H'];
    const nextIndex = (order.indexOf(current) + 1) % order.length;
    const nextStatus = order[nextIndex];

    const dateStr = getDateStr(day);
    setAttendanceRecords(prev => {
      const copy = [...prev];
      const existingIdx = copy.findIndex(r => r.student_id === studentId && r.date === dateStr);
      if (existingIdx > -1) {
        copy[existingIdx] = { ...copy[existingIdx], status: nextStatus };
      } else {
        copy.push({
          attendance_id: `temp_${Date.now()}_${Math.random()}`,
          student_id: studentId,
          date: dateStr,
          class: selectedClass,
          section: selectedSection,
          status: nextStatus,
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      return copy;
    });
    setHasUnsavedChanges(true);
  };

  // Mark all students for activeDay as Present
  const handleMarkAllDay = (status: AttendanceStatus) => {
    const dateStr = getDateStr(activeDay);
    setAttendanceRecords(prev => {
      const copy = [...prev];
      for (const student of students) {
        const existingIdx = copy.findIndex(r => r.student_id === student.student_id && r.date === dateStr);
        if (existingIdx > -1) {
          copy[existingIdx] = { ...copy[existingIdx], status };
        } else {
          copy.push({
            attendance_id: `temp_${Date.now()}_${student.student_id}`,
            student_id: student.student_id,
            date: dateStr,
            class: selectedClass,
            section: selectedSection,
            status,
            completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
      return copy;
    });
    setHasUnsavedChanges(true);
    showToast(`Marked all students as ${status === 'P' ? 'Present' : status === 'A' ? 'Absent' : 'Late'} for Day ${activeDay}.`, 'info');
  };

  // Save changes to backend
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/school/attendance/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          records: attendanceRecords,
          completed: false
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Attendance changes saved to database.', 'success');
        setHasUnsavedChanges(false);
      } else {
        showToast('Failed to save changes.', 'error');
      }
    } catch (e) {
      showToast('Error saving attendance.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger Complete Attendance Flow
  const handleCompleteAttendance = async () => {
    setShowConfirmComplete(false);
    setIsSaving(true);

    const targetDate = getDateStr(activeDay);
    const attendanceList = students.map(s => ({
      student_id: s.student_id,
      status: getCellStatus(s.student_id, activeDay)
    }));

    try {
      const res = await fetch('/api/school/attendance/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          class: selectedClass,
          section: selectedSection,
          date: targetDate,
          attendanceList
        })
      });

      const result = await res.json();

      if (result.success && result.data) {
        showToast('✓ Attendance completed successfully! Parent WhatsApp messages generated.', 'success');
        setParentMessagesList(result.data.parentMessages || []);
        setShowWhatsAppBatchModal(true);
        setHasUnsavedChanges(false);
      } else {
        showToast(result.message || 'Could not complete attendance.', 'error');
      }
    } catch (e) {
      showToast('Network error during completion.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenWhatsAppLink = (index: number, link: string, studentId: string) => {
    // Mark as opened
    setParentMessagesList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], opened: true };
      return copy;
    });

    window.open(link, '_blank');
    showToast('WhatsApp opened. Please press Send in WhatsApp window.', 'info');
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'P':
        return 'bg-emerald-500 text-white hover:bg-emerald-600 font-bold';
      case 'A':
        return 'bg-rose-500 text-white hover:bg-rose-600 font-bold';
      case 'L':
        return 'bg-amber-500 text-white hover:bg-amber-600 font-bold';
      case 'H':
        return 'bg-slate-300 text-slate-700 hover:bg-slate-400 font-medium';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div id="schoolos_attendance_matrix_module" className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Monthly Attendance Matrix</h2>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Real-time monthly calendar matrix with 1-click status cycling and individual parent WhatsApp generation.
          </p>
        </div>

        {/* Legend / Status Key */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px]">P</span>
            <span className="text-emerald-700">Present</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-4 h-4 rounded bg-rose-500 text-white flex items-center justify-center text-[10px]">A</span>
            <span className="text-rose-700">Absent</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center text-[10px]">L</span>
            <span className="text-amber-700">Late</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-4 h-4 rounded bg-slate-300 text-slate-700 flex items-center justify-center text-[10px]">H</span>
            <span className="text-slate-600">Holiday</span>
          </div>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Class:</span>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Section:</span>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {['A', 'B', 'C', 'D'].map(sec => (
                <option key={sec} value={sec}>
                  Sec {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Month:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {monthNames.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Active Day:</span>
            <select
              value={activeDay}
              onChange={e => setActiveDay(Number(e.target.value))}
              className="px-3 py-1.5 bg-blue-50 border border-blue-300 rounded-xl text-xs font-black text-blue-700 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {dayNumbers.map(d => (
                <option key={d} value={d}>
                  Day {d} ({monthNames[selectedMonth - 1].substring(0, 3)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn_mark_all_present"
            onClick={() => handleMarkAllDay('P')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition"
          >
            Mark Day {activeDay} All Present
          </button>

          <button
            id="btn_mark_all_absent"
            onClick={() => handleMarkAllDay('A')}
            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition"
          >
            Mark Day {activeDay} All Absent
          </button>

          {hasUnsavedChanges && (
            <button
              id="btn_save_attendance_changes"
              disabled={isSaving}
              onClick={handleSaveChanges}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-md shadow-blue-600/20 transition active:scale-95 animate-pulse"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          )}

          <button
            id="btn_complete_attendance"
            onClick={() => setShowConfirmComplete(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 text-xs font-bold shadow-md shadow-emerald-600/25 transition active:scale-95"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Complete Attendance</span>
          </button>
        </div>
      </div>

      {/* MATRIX TABLE */}
      {isLoading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Loading Attendance Matrix from Google Sheets...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No students found in Class {selectedClass}-{selectedSection}</h3>
          <p className="text-xs text-slate-700 mt-1">Please add students to this class using the Admission module.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-3 w-12 sticky left-0 z-20 bg-slate-800 border-r border-slate-700">Roll</th>
                  <th className="py-3 px-4 w-44 sticky left-12 z-20 bg-slate-800 border-r border-slate-700">Student Name</th>
                  {dayNumbers.map(d => {
                    const isToday = d === activeDay;
                    return (
                      <th
                        key={d}
                        onClick={() => setActiveDay(d)}
                        className={`py-2 px-1 text-center min-w-[28px] cursor-pointer transition ${
                          isToday ? 'bg-blue-600 text-white font-black ring-1 ring-white' : 'hover:bg-slate-700'
                        }`}
                        title={`Day ${d}`}
                      >
                        {d}
                      </th>
                    );
                  })}
                  <th className="py-3 px-3 text-center bg-slate-900 border-l border-slate-700">P %</th>
                  <th className="py-3 px-2.5 text-center bg-slate-900 text-emerald-400">P</th>
                  <th className="py-3 px-2.5 text-center bg-slate-900 text-rose-400">A</th>
                  <th className="py-3 px-2.5 text-center bg-slate-900 text-amber-400">L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {students.map((student, idx) => {
                  // Calculate dynamic monthly counts for this student
                  let presentCount = 0;
                  let absentCount = 0;
                  let lateCount = 0;

                  for (let d = 1; d <= daysInMonth; d++) {
                    const st = getCellStatus(student.student_id, d);
                    if (st === 'P') presentCount++;
                    if (st === 'A') absentCount++;
                    if (st === 'L') lateCount++;
                  }

                  const totalMarked = presentCount + absentCount + lateCount;
                  const percentage = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 100;

                  return (
                    <tr key={student.student_id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-100">
                        {student.roll_number || idx + 1}
                      </td>

                      <td className="py-2.5 px-4 font-bold text-slate-900 sticky left-12 z-10 bg-white border-r border-slate-100">
                        <div className="flex items-center gap-2">
                          <img
                            src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="truncate max-w-[130px]" title={student.student_name}>
                            {student.student_name}
                          </span>
                        </div>
                      </td>

                      {/* Day cells 1..31 */}
                      {dayNumbers.map(d => {
                        const status = getCellStatus(student.student_id, d);
                        const isDayActive = d === activeDay;
                        return (
                          <td
                            key={d}
                            className={`p-1 text-center ${isDayActive ? 'bg-blue-50/40' : ''}`}
                          >
                            <button
                              type="button"
                              onClick={() => handleCellClick(student.student_id, d)}
                              className={`w-6 h-6 rounded-md text-[11px] font-bold transition transform active:scale-90 flex items-center justify-center mx-auto shadow-xs ${getStatusBadge(
                                status
                              )}`}
                              title={`Click to change: ${student.student_name} - Day ${d}`}
                            >
                              {status}
                            </button>
                          </td>
                        );
                      })}

                      {/* Summary Columns */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 border-l border-slate-100 bg-slate-50/50">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            percentage >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : percentage >= 75
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {percentage}%
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-emerald-600 bg-slate-50/50">{presentCount}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-rose-600 bg-slate-50/50">{absentCount}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-amber-600 bg-slate-50/50">{lateCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONFIRM COMPLETE ATTENDANCE MODAL */}
      {showConfirmComplete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckSquare className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Complete Attendance?</h3>
              <p className="text-xs text-slate-600">
                Complete attendance for <span className="font-bold text-slate-900">Class {selectedClass}-{selectedSection}</span> for{' '}
                <span className="font-bold text-slate-900">{getDateStr(activeDay)}</span>?
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Validates and seals daily attendance records in Google Sheets.</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Generates individualized Parent WhatsApp messages.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmComplete(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn_confirm_complete_submit"
                onClick={handleCompleteAttendance}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                Yes, Complete Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BATCH PARENT WHATSAPP MESSAGES MODAL */}
      {showWhatsAppBatchModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Attendance WhatsApp Messages</h3>
                  <p className="text-xs text-slate-500">
                    Class {selectedClass}-{selectedSection} • {getDateStr(activeDay)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsAppBatchModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>
                Attendance recorded! Click <strong>Open WhatsApp</strong> on each parent row to launch their pre-filled personalized attendance message.
              </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-1 scrollbar-thin">
              {parentMessagesList.map((item, idx) => (
                <div
                  key={item.student_id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.student_name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Absent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Parent: {item.parent_name} • Phone: {item.phone || 'No Number'}
                    </p>
                  </div>

                  <div>
                    {item.hasNumber ? (
                      <button
                        onClick={() => handleOpenWhatsAppLink(idx, item.whatsAppLink, item.student_id)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                          item.opened
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{item.opened ? 'Opened (Send Again)' : 'Open WhatsApp'}</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200">
                        No Phone Number
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowWhatsAppBatchModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
