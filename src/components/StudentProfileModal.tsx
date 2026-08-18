import React, { useState } from 'react';
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
  Percent,
  Clock,
  Printer
} from 'lucide-react';
import { Student } from '../types/index.js';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onClose, onUpdate }) => {
  const { token, currentSchool, showToast, setActiveView } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Student | null>(student);

  if (!student) return null;

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

  const handleSaveEdit = async () => {
    if (!editData) return;
    try {
      const res = await fetch('/api/school/students/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Student updated successfully.', 'success');
        setIsEditing(false);
        if (onUpdate) onUpdate();
      }
    } catch (e) {
      showToast('Failed to update student.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Top */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Student Profile
            </span>
            <span className="font-mono text-xs font-bold text-slate-500">{student.student_id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/80">
          <img
            src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt=""
            className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-white"
            referrerPolicy="no-referrer"
          />

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-extrabold text-slate-900">{student.student_name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                {student.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Class {student.class}-{student.section} • Roll Number: {student.roll_number} • Admission No: {student.admission_number}
            </p>
            <p className="text-[11px] text-slate-500">
              Enrolled on: {new Date(student.admission_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
              <p><span className="text-slate-400">Date of Birth:</span> <strong>{student.dob}</strong></p>
              <p><span className="text-slate-400">Gender:</span> <strong>{student.gender}</strong></p>
              <p><span className="text-slate-400">Address:</span> <strong>{student.address || 'Local Resident'}</strong></p>
              <p><span className="text-slate-400">City / State:</span> <strong>{student.city}, {student.state} ({student.pin_code})</strong></p>
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

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
