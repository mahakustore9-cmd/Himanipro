import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  MessageSquare,
  Mail,
  RefreshCw,
  Edit2,
  Trash2,
  AlertTriangle,
  GraduationCap,
  CheckCircle2,
  UserCheck,
  UserX,
  Sparkles
} from 'lucide-react';
import { Student } from '../types/index.js';
import { StudentProfileModal } from './StudentProfileModal.js';
import { apiFetch } from '../lib/api.js';

export const StudentManagement: React.FC = () => {
  const { token, setActiveView, showToast } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      let url = `/api/school/students?search=${encodeURIComponent(search)}&class=${classFilter}&section=${sectionFilter}&status=${statusFilter}`;
      const res = await apiFetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data || []);
      }
    } catch (e) {
      showToast('Error loading students directory.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, classFilter, sectionFilter, statusFilter]);

  const handleWhatsAppClick = (student: Student) => {
    const phone = student.parent_whatsapp || student.parent_mobile;
    if (!phone) {
      showToast('No phone number found.', 'warning');
      return;
    }
    const clean = phone.replace(/[^0-9]/g, '');
    const number = clean.length === 10 ? `91${clean}` : clean;
    const msg = encodeURIComponent(`Dear Parent of ${student.student_name} (Class ${student.class}-${student.section}), greetings from school administration.`);
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
    showToast('WhatsApp opened. Please press Send.', 'info');
  };

  const handleEmailClick = (student: Student) => {
    if (!student.parent_email) {
      showToast('No parent email registered for this student.', 'warning');
      return;
    }
    window.location.href = `mailto:${student.parent_email}?subject=Regarding ${student.student_name}`;
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditMode(true);
  };

  const handleOpenView = (student: Student) => {
    setSelectedStudent(student);
    setIsEditMode(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      const res = await apiFetch('/api/school/students/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ student_id: deletingStudent.student_id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ Student ${deletingStudent.student_name} deleted and removed from Google Sheet.`, 'success');
        setStudents(prev => prev.filter(s => s.student_id !== deletingStudent.student_id));
        setDeletingStudent(null);
      } else {
        showToast(data.message || 'Failed to delete student.', 'error');
      }
    } catch (e) {
      showToast('Error deleting student record.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalCount = students.length;
  const activeCount = students.filter(s => s.status === 'ACTIVE').length;
  const inactiveCount = students.filter(s => s.status !== 'ACTIVE').length;

  return (
    <div id="schoolos_student_management_module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Students Directory</h2>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Complete database of enrolled students with live search, filters, full edit profile, delete action, and parent communication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('admissions')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition active:scale-95 w-fit"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ New Admission</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
              <p className="text-lg font-black text-slate-900">{totalCount}</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500">Students</span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Students</p>
              <p className="text-lg font-black text-emerald-700">{activeCount}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Active</span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
              <UserX className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Inactive / Alumni</p>
              <p className="text-lg font-black text-slate-700">{inactiveCount}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">Archived</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, ID, admission no, or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="ALL">All Classes</option>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          <select
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="ALL">All Sections</option>
            {['A', 'B', 'C', 'D'].map(s => (
              <option key={s} value={s}>
                Sec {s}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ALUMNI">Alumni</option>
          </select>

          <button
            onClick={fetchStudents}
            className="p-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Students Table */}
      {isLoading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Loading Student Database...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No students found</h3>
          <p className="text-xs text-slate-700 mt-1">Try adjusting your search criteria or add new students.</p>
          <button
            onClick={() => setActiveView('admissions')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            + Add First Student
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-3">Adm No.</th>
                  <th className="py-3.5 px-3">Class</th>
                  <th className="py-3.5 px-4">Parent Contact</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions (Edit / Delete)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {students.map(student => (
                  <tr key={student.student_id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover shadow-sm flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.student_name}</p>
                          <span className="text-[11px] text-slate-700 font-normal">
                            Father: {student.father_name || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                      {student.student_id}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {student.admission_number}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-bold text-slate-800 text-xs">
                        {student.class}-{student.section}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div className="space-y-0.5">
                        <p className="font-mono font-medium">{student.parent_mobile}</p>
                        {student.parent_email && (
                          <p className="text-[10px] text-slate-600 truncate max-w-[140px]">
                            {student.parent_email}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          student.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Button */}
                        <button
                          onClick={() => handleOpenView(student)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition"
                          title="Edit Student Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingStudent(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="w-[1px] h-4 bg-slate-200 mx-1" />

                        {/* WhatsApp Parent */}
                        <button
                          onClick={() => handleWhatsAppClick(student)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition"
                          title="WhatsApp Parent"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        {/* Email Parent */}
                        <button
                          onClick={() => handleEmailClick(student)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Student Record</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
              <p className="text-slate-800 font-bold">
                Student: {deletingStudent.student_name}
              </p>
              <p className="text-slate-600">
                ID: <span className="font-mono">{deletingStudent.student_id}</span> • Class: {deletingStudent.class}-{deletingStudent.section}
              </p>
              <p className="text-slate-600">
                Adm No: {deletingStudent.admission_number}
              </p>
              <p className="text-rose-700 text-[11px] pt-1 font-medium">
                ⚠️ This will remove the student from SchoolOS and delete their row from your connected Google Sheet.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile / Edit Modal */}
      <StudentProfileModal
        student={selectedStudent}
        initialEditMode={isEditMode}
        onClose={() => {
          setSelectedStudent(null);
          setIsEditMode(false);
        }}
        onUpdate={fetchStudents}
      />
    </div>
  );
};
