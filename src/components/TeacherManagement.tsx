import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  GraduationCap,
  Plus,
  Search,
  Phone,
  Mail,
  BookOpen,
  MessageSquare,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { Teacher } from '../types/index.js';
import { apiFetch } from '../lib/api.js';

export const TeacherManagement: React.FC = () => {
  const { token, currentSchool, showToast } = useAuth();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Mathematics',
    assigned_class: 'Class 8-A',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/school/teachers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTeachers(data.data || []);
      }
    } catch (e) {
      showToast('Error loading faculty list.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please provide teacher name and phone number.', 'error');
      return;
    }

    try {
      const res = await apiFetch('/api/school/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Teacher added to faculty roster & Google Sheets!', 'success');
        setShowAddModal(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: 'Mathematics',
          assigned_class: 'Class 8-A',
          status: 'ACTIVE'
        });
        fetchTeachers();
      } else {
        showToast(data.message || 'Failed to add teacher.', 'error');
      }
    } catch (e) {
      showToast('Error adding faculty.', 'error');
    }
  };

  const handleWhatsAppTeacher = (teacher: Teacher) => {
    const rawPhone = teacher.phone || teacher.mobile || '';
    const clean = rawPhone.replace(/[^0-9]/g, '');
    const num = clean.length === 10 ? `91${clean}` : clean;
    const msg = encodeURIComponent(`Hello ${teacher.name}, message from ${currentSchool?.school_name || 'SchoolOS'} Administration.`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
    showToast('WhatsApp opened for teacher. Click Send.', 'info');
  };

  const q = (search || '').toLowerCase();
  const filteredTeachers = teachers.filter(
    t =>
      (t.name || '').toLowerCase().includes(q) ||
      (t.subject || '').toLowerCase().includes(q) ||
      (t.phone || t.mobile || '').includes(search || '')
  );

  return (
    <div id="schoolos_teacher_management_module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/25 border border-white/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Faculty & Teachers</h2>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Manage teaching staff, subject assignments, incharge roles, and direct teacher WhatsApp communications.
          </p>
        </div>

        <button
          id="btn_open_add_teacher_modal"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-purple-600/25 transition active:scale-95 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Teacher</span>
        </button>
      </div>

      {/* Search & Actions Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty by name, subject, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>

        <button
          onClick={fetchTeachers}
          className="p-2.5 rounded-2xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition active:scale-95 shadow-2xs"
          title="Refresh Faculty"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
        </button>
      </div>

      {/* Teachers Grid */}
      {isLoading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Loading Faculty Database...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No teachers found</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-md transition active:scale-95"
          >
            + Add First Teacher
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map(teacher => (
            <div
              key={teacher.teacher_id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-200 space-y-3.5 relative overflow-hidden group transform hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 via-pink-500/10 to-transparent rounded-bl-3xl"></div>

              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-purple-600/20 border border-white">
                    {(teacher.name || 'TC').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{teacher.name}</h3>
                    <span className="text-[11px] font-bold text-purple-700">{teacher.teacher_id}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  {teacher.status || 'ACTIVE'}
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs space-y-1.5 relative z-10">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500 font-medium">Subject:</span>
                  <strong className="text-slate-900 font-bold">{teacher.subject}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500 font-medium">Class Incharge:</span>
                  <strong className="text-slate-900 font-bold">{teacher.assigned_class || 'None'}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <strong className="font-mono text-slate-900">{teacher.phone || teacher.mobile || '-'}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 relative z-10">
                <a
                  href={`mailto:${teacher.email}`}
                  className="text-xs text-purple-600 hover:text-purple-800 font-bold truncate max-w-[130px]"
                >
                  {teacher.email || 'No email'}
                </a>

                <button
                  onClick={() => handleWhatsAppTeacher(teacher)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD TEACHER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Faculty Member</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp & Mobile Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  placeholder="teacher@school.edu"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 bg-white text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class Incharge</label>
                  <input
                    type="text"
                    value={formData.assigned_class}
                    onChange={e => setFormData({ ...formData, assigned_class: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 bg-white text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition active:scale-95"
                >
                  Save to Faculty Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
