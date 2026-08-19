import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  X,
  User,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  MapPin,
  FileText,
  CreditCard,
  Edit2,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  Save,
  AlertTriangle,
  BookOpen,
  Hash,
  ShieldAlert
} from 'lucide-react';
import { Student } from '../types/index.js';
import { apiFetch } from '../lib/api.js';

interface StudentProfileModalProps {
  student: Student | null;
  initialEditMode?: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  initialEditMode = false,
  onClose,
  onUpdate
}) => {
  const { token, currentSchool, showToast } = useAuth();
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState<Student | null>(student);

  useEffect(() => {
    setEditData(student);
    setIsEditing(initialEditMode);
    setShowDeleteConfirm(false);
  }, [student, initialEditMode]);

  if (!student || !editData) return null;

  const handleOpenWhatsApp = () => {
    const phone = student.parent_whatsapp || student.parent_mobile;
    if (!phone) {
      showToast('No phone number found.', 'warning');
      return;
    }
    const clean = phone.replace(/[^0-9]/g, '');
    const number = clean.length === 10 ? `91${clean}` : clean;
    const msg = encodeURIComponent(
      `Dear Parent,\n\nGreetings regarding ${student.student_name} (Class ${student.class}-${student.section}) from ${currentSchool?.school_name || 'SchoolOS'}.`
    );
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
    showToast('WhatsApp opened. Please press Send.', 'info');
  };

  const handleSendEmail = () => {
    if (!student.parent_email) {
      showToast('Parent email address is missing.', 'warning');
      return;
    }
    window.location.href = `mailto:${student.parent_email}?subject=${encodeURIComponent(
      `Regarding ${student.student_name} — ${currentSchool?.school_name || 'School'}`
    )}`;
  };

  const handleFieldChange = (field: keyof Student, value: any) => {
    setEditData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSaveEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editData) return;

    if (!editData.student_name?.trim()) {
      showToast('Student Name is required.', 'error');
      return;
    }
    if (!editData.class?.trim() || !editData.section?.trim()) {
      showToast('Class and Section are required.', 'error');
      return;
    }
    if (!editData.parent_mobile?.trim()) {
      showToast('Parent Mobile number is required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiFetch('/api/school/students/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Student record updated & synced to Google Sheet.', 'success');
        setIsEditing(false);
        if (onUpdate) onUpdate();
      } else {
        showToast(data.message || 'Failed to update student.', 'error');
      }
    } catch (e) {
      showToast('Error updating student record.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStudent = async () => {
    setIsDeleting(true);
    try {
      const res = await apiFetch('/api/school/students/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ student_id: student.student_id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ Student ${student.student_name} deleted successfully.`, 'success');
        onClose();
        if (onUpdate) onUpdate();
      } else {
        showToast(data.message || 'Failed to delete student.', 'error');
      }
    } catch (e) {
      showToast('Error deleting student record.', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in zoom-in-95 duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 max-w-2xl w-full shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isEditing ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              {isEditing ? 'Editing Student Profile' : 'Student Profile'}
            </span>
            <span className="font-mono text-xs font-bold text-slate-500">{student.student_id}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-slate-200 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Student</span>
              </button>
            )}

            {!isEditing && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Card View */}
        {showDeleteConfirm && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-600 text-white flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-rose-950">Confirm Permanent Deletion</h4>
                <p className="text-xs text-rose-800">
                  Are you sure you want to delete student <strong>{student.student_name}</strong> (ID: {student.student_id}, Class {student.class}-{student.section})?
                  This will remove the student from SchoolOS and delete their row from the Google Sheet.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting Record...' : 'Yes, Delete Student'}</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW MODE */}
        {!isEditing ? (
          <>
            {/* Profile Card Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/80">
              <img
                src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-white flex-shrink-0"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{student.student_name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${student.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {student.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  Class {student.class}-{student.section} • Roll Number: {student.roll_number || 'N/A'} • Admission No: {student.admission_number}
                </p>
                <p className="text-[11px] text-slate-500">
                  Enrolled on: {student.admission_date ? new Date(student.admission_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                </p>
              </div>

              {/* Quick Contact Buttons */}
              <div className="flex sm:flex-col gap-2">
                <button
                  onClick={handleOpenWhatsApp}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleSendEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Parent Details */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  Parent / Guardian Information
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <p><span className="text-slate-400">Father Name:</span> <strong>{student.father_name || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">Mother Name:</span> <strong>{student.mother_name || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">Primary Mobile:</span> <strong>{student.parent_mobile}</strong></p>
                  <p><span className="text-slate-400">WhatsApp:</span> <strong>{student.parent_whatsapp || student.parent_mobile}</strong></p>
                  <p><span className="text-slate-400">Email:</span> <strong>{student.parent_email || 'Not provided'}</strong></p>
                </div>
              </div>

              {/* Academic & Address */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Address & Academic Record
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <p><span className="text-slate-400">Date of Birth:</span> <strong>{student.dob || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">Gender:</span> <strong>{student.gender || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">Address:</span> <strong>{student.address || 'Local Resident'}</strong></p>
                  <p><span className="text-slate-400">City / State:</span> <strong>{student.city || ''}, {student.state || ''} ({student.pin_code || ''})</strong></p>
                  <p><span className="text-slate-400">Previous School:</span> <strong>{student.previous_school || 'Direct Admission'}</strong></p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition border border-slate-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Student Card</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Record</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        ) : (
          /* EDIT MODE FORM */
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">
                ✏️ Editing details for <strong>{student.student_name}</strong> ({student.student_id})
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-semibold text-amber-800 hover:underline"
              >
                Cancel Edit
              </button>
            </div>

            {/* Academic Information */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Academic & Profile Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editData.student_name || ''}
                    onChange={e => handleFieldChange('student_name', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Enter student full name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editData.status || 'ACTIVE'}
                    onChange={e => handleFieldChange('status', e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="ALUMNI">ALUMNI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Class *</label>
                  <select
                    value={editData.class || '1'}
                    onChange={e => handleFieldChange('class', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Section *</label>
                  <select
                    value={editData.section || 'A'}
                    onChange={e => handleFieldChange('section', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    {['A', 'B', 'C', 'D'].map(s => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={editData.roll_number || ''}
                    onChange={e => handleFieldChange('roll_number', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. 05"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    value={editData.admission_number || ''}
                    onChange={e => handleFieldChange('admission_number', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="ADM-2026-001"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editData.dob || ''}
                    onChange={e => handleFieldChange('dob', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={editData.gender || 'Male'}
                    onChange={e => handleFieldChange('gender', e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parent & Contact Information */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-600" />
                Parent & Contact Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={editData.father_name || ''}
                    onChange={e => handleFieldChange('father_name', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Father full name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={editData.mother_name || ''}
                    onChange={e => handleFieldChange('mother_name', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Mother full name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Parent Mobile (Calling) *</label>
                  <input
                    type="tel"
                    required
                    value={editData.parent_mobile || ''}
                    onChange={e => handleFieldChange('parent_mobile', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={editData.parent_whatsapp || ''}
                    onChange={e => handleFieldChange('parent_whatsapp', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="WhatsApp contact"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Parent Email</label>
                  <input
                    type="email"
                    value={editData.parent_email || ''}
                    onChange={e => handleFieldChange('parent_email', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="parent.email@example.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={editData.address || ''}
                    onChange={e => handleFieldChange('address', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="House / Street / Area"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editData.city || ''}
                    onChange={e => handleFieldChange('city', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">State / Pincode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editData.state || ''}
                      onChange={e => handleFieldChange('state', e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      value={editData.pin_code || ''}
                      onChange={e => handleFieldChange('pin_code', e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="Pin"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Student</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save & Sync to Sheet'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
