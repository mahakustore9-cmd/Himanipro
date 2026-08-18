import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import confetti from 'canvas-confetti';
import {
  UserPlus,
  Camera,
  Upload,
  CheckCircle2,
  MessageSquare,
  Mail,
  Printer,
  Sparkles,
  RefreshCw,
  ArrowRight,
  User,
  Phone,
  MapPin,
  FileText,
  X
} from 'lucide-react';
import { Student } from '../types/index.js';

interface AdmissionModuleProps {
  onSuccessNavigate?: () => void;
}

export const AdmissionModule: React.FC<AdmissionModuleProps> = ({ onSuccessNavigate }) => {
  const { token, currentSchool, showToast } = useAuth();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [successData, setSuccessData] = useState<{
    student: Student;
    whatsAppLink: string;
    messagePreview: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Section 1: Student
    student_name: '',
    dob: '2014-06-15',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    class: '8',
    section: 'A',
    roll_number: '12',
    photo_url: '',
    // Section 2: Parent
    father_name: '',
    mother_name: '',
    parent_mobile: '',
    parent_whatsapp: '',
    parent_email: '',
    // Section 3: Address
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    pin_code: '110085',
    // Section 4: Admission
    admission_number: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    admission_date: new Date().toISOString().split('T')[0],
    previous_school: '',
    remarks: 'Regular Admission'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'parent_mobile' && !prev.parent_whatsapp) {
        next.parent_whatsapp = value;
      }
      return next;
    });
  };

  // Image Upload & Compression Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Photo size should be less than 8MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const base64 = event.target?.result as string;
      setPhotoPreview(base64);
      setFormData(prev => ({ ...prev, photo_url: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleSaveAdmission = async (andAddAnother: boolean = false) => {
    if (!formData.student_name.trim()) {
      showToast('Please enter the Student Full Name.', 'error');
      setActiveStep(1);
      return;
    }

    if (!formData.parent_mobile.trim()) {
      showToast('Please provide a valid Parent Mobile Number.', 'error');
      setActiveStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/school/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (result.success && result.data) {
        triggerConfetti();
        showToast('✓ Admission successfully recorded in Google Sheets database!', 'success');

        if (andAddAnother) {
          // Reset form for next student
          setFormData({
            student_name: '',
            dob: '2014-06-15',
            gender: 'Male',
            class: formData.class,
            section: formData.section,
            roll_number: String(Number(formData.roll_number || '1') + 1),
            photo_url: '',
            father_name: '',
            mother_name: '',
            parent_mobile: '',
            parent_whatsapp: '',
            parent_email: '',
            address: '',
            city: formData.city,
            state: formData.state,
            pin_code: formData.pin_code,
            admission_number: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            admission_date: new Date().toISOString().split('T')[0],
            previous_school: '',
            remarks: 'Regular Admission'
          });
          setPhotoPreview('');
          setActiveStep(1);
          setSuccessData(null);
        } else {
          setSuccessData({
            student: result.data.student,
            whatsAppLink: result.data.whatsAppLink,
            messagePreview: result.data.messagePreview
          });
        }
      } else {
        showToast(result.message || 'Failed to save admission.', 'error');
      }
    } catch (error) {
      showToast('Error saving admission. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendGmail = async () => {
    if (!successData?.student.parent_email) {
      showToast('No parent email address found for this student.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/school/send-gmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient: successData.student.parent_email,
          subject: `Admission Confirmation — ${currentSchool?.school_name || 'SchoolOS'}`,
          body: successData.messagePreview
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Gmail notification could not be sent.', 'error');
      }
    } catch (e) {
      showToast('Failed to dispatch Gmail.', 'error');
    }
  };

  const handlePrintAdmission = () => {
    window.print();
  };

  // Preview generated Student ID
  const projectedStudentId = `${currentSchool?.school_id || 'SCH001'}-2026-XXXXX`;

  return (
    <div id="schoolos_admission_module" className="max-w-4xl mx-auto space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Student Admission Portal</h2>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Complete multi-step student enrollment with automatic ID assignment and instant parent notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
            Session: {currentSchool?.academic_session || '2026-2027'}
          </span>
        </div>
      </div>

      {/* SUCCESS SCREEN */}
      {successData ? (
        <div
          id="admission_success_card"
          className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-xl shadow-emerald-900/5 text-center space-y-6 animate-in zoom-in-95 duration-200"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              ✓ Admission Completed & Logged to Google Sheets
            </span>
            <h3 className="text-2xl font-black text-slate-900 pt-2">
              {successData.student.student_name}
            </h3>
            <p className="text-sm text-slate-700">
              Enrolled in Class <span className="font-bold text-slate-800">{successData.student.class}-{successData.student.section}</span> • Roll No: {successData.student.roll_number}
            </p>
          </div>

          {/* Identification Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-left max-w-lg mx-auto">
            <div>
              <p className="text-[11px] font-medium text-slate-700">Student ID</p>
              <p className="text-xs font-bold font-mono text-blue-700">{successData.student.student_id}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-700">Admission No</p>
              <p className="text-xs font-bold text-slate-800">{successData.student.admission_number}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-700">Parent Mobile</p>
              <p className="text-xs font-bold text-slate-800">{successData.student.parent_mobile}</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* WhatsApp Parent Button */}
            <a
              id="btn_whatsapp_parent"
              href={successData.whatsAppLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Parent</span>
            </a>

            {/* Send Gmail Button */}
            <button
              id="btn_send_gmail_parent"
              onClick={handleSendGmail}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Send Gmail</span>
            </button>

            {/* Print Slip Button */}
            <button
              id="btn_print_admission"
              onClick={handlePrintAdmission}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md shadow-slate-900/25 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Admission</span>
            </button>

            {/* New Admission Button */}
            <button
              id="btn_new_admission_reset"
              onClick={() => {
                setSuccessData(null);
                setPhotoPreview('');
                setActiveStep(1);
                setFormData(prev => ({
                  ...prev,
                  student_name: '',
                  father_name: '',
                  mother_name: '',
                  parent_mobile: '',
                  parent_whatsapp: '',
                  admission_number: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`
                }));
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition active:scale-95 border border-slate-300"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ New Admission</span>
            </button>
          </div>
        </div>
      ) : (
        /* MULTI-SECTION ADMISSION FORM */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Step Progress Tabs */}
          <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50/70">
            {[
              { num: 1, title: 'Student Info', icon: User },
              { num: 2, title: 'Parent Info', icon: Phone },
              { num: 3, title: 'Address Details', icon: MapPin },
              { num: 4, title: 'Admission & Review', icon: FileText }
            ].map(step => {
              const Icon = step.icon;
              const isCurrent = activeStep === step.num;
              const isDone = activeStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(step.num)}
                  className={`flex items-center justify-center gap-2 py-3.5 px-2 text-xs font-bold transition-all border-b-2 ${
                    isCurrent
                      ? 'border-blue-600 text-blue-700 bg-white shadow-sm'
                      : isDone
                      ? 'border-emerald-500 text-emerald-700 bg-slate-50'
                      : 'border-transparent text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDone ? '✓' : step.num}
                  </div>
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* ============================================================= */}
            {/* SECTION 1: Student Information & Photo Upload */}
            {/* ============================================================= */}
            {activeStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    SECTION 1: Student Information
                  </h3>
                  <span className="text-xs text-blue-600 font-mono font-semibold">
                    Auto-ID: {projectedStudentId}
                  </span>
                </div>

                {/* Photo Upload Box */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shadow-inner">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Student Preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview('');
                          setFormData(prev => ({ ...prev, photo_url: '' }));
                        }}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-800">Student Profile Photo</p>
                    <p className="text-xs text-slate-700">
                      Upload student photo (JPG/PNG). Image will be stored securely in Google Drive.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-sm transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      Choose Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      name="student_name"
                      value={formData.student_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Class *
                      </label>
                      <select
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                      >
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => (
                          <option key={c} value={c}>
                            Class {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Section *
                      </label>
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                      >
                        {['A', 'B', 'C', 'D'].map(sec => (
                          <option key={sec} value={sec}>
                            Sec {sec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="roll_number"
                      value={formData.roll_number}
                      onChange={handleInputChange}
                      placeholder="e.g. 12"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.student_name.trim()) {
                        showToast('Please enter the student full name.', 'error');
                        return;
                      }
                      setActiveStep(2);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95"
                  >
                    <span>Next: Parent Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* SECTION 2: Parent Information */}
            {/* ============================================================= */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    SECTION 2: Parent Information
                  </h3>
                  <span className="text-xs text-slate-700 font-medium">Step 2 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      name="mother_name"
                      value={formData.mother_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sunita Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="parent_mobile"
                      value={formData.parent_mobile}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="parent_whatsapp"
                      value={formData.parent_whatsapp}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent Email Address (Gmail)
                    </label>
                    <input
                      type="email"
                      name="parent_email"
                      value={formData.parent_email}
                      onChange={handleInputChange}
                      placeholder="e.g. parent.sharma@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.parent_mobile.trim()) {
                        showToast('Please provide a parent mobile number.', 'error');
                        return;
                      }
                      setActiveStep(3);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95"
                  >
                    <span>Next: Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* SECTION 3: Address Information */}
            {/* ============================================================= */}
            {activeStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    SECTION 3: Residential Address
                  </h3>
                  <span className="text-xs text-slate-700 font-medium">Step 3 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Street Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="e.g. House #42, Block B, Green Park"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="pin_code"
                      value={formData.pin_code}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95"
                  >
                    <span>Next: Admission Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* SECTION 4: Admission & Confirmation */}
            {/* ============================================================= */}
            {activeStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    SECTION 4: Admission Details & Review
                  </h3>
                  <span className="text-xs text-slate-700 font-medium">Final Step</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admission Number (Auto-assigned)
                    </label>
                    <input
                      type="text"
                      name="admission_number"
                      value={formData.admission_number}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admission Date
                    </label>
                    <input
                      type="date"
                      name="admission_date"
                      value={formData.admission_date}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Previous School
                    </label>
                    <input
                      type="text"
                      name="previous_school"
                      value={formData.previous_school}
                      onChange={handleInputChange}
                      placeholder="e.g. St. Marks Junior School"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admission Remarks
                    </label>
                    <input
                      type="text"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      placeholder="e.g. Scholarship awarded"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                {/* Final Summary Card */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-blue-950">
                      Ready to enroll: {formData.student_name || 'New Student'} (Class {formData.class}-{formData.section})
                    </p>
                    <p className="text-[11px] text-blue-800">
                      Parent Contact: {formData.parent_mobile || 'N/A'} • WhatsApp Message link will be pre-formatted.
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition"
                  >
                    Back
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleSaveAdmission(true)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-300 disabled:opacity-50"
                    >
                      Save & Add Another
                    </button>

                    <button
                      type="button"
                      id="btn_save_admission_final"
                      disabled={isSubmitting}
                      onClick={() => handleSaveAdmission(false)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving to Sheets...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Save Admission</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
