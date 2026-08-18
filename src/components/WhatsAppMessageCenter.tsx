import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  CheckCircle2,
  ExternalLink,
  Phone,
  User,
  Clock,
  Sparkles,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { MessageLog, Student } from '../types/index.js';

export const WhatsAppMessageCenter: React.FC = () => {
  const { token, currentSchool, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState<'ADMISSION' | 'ATTENDANCE' | 'NOTICE' | 'CUSTOM'>('ADMISSION');
  const [messageLogs, setMessageLogs] = useState<MessageLog[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Custom Message Form State
  const [customPhone, setCustomPhone] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [selectedStudentForCustom, setSelectedStudentForCustom] = useState<string>('');

  const fetchMessagesAndStudents = async () => {
    setIsLoading(true);
    try {
      const [msgRes, stuRes] = await Promise.all([
        fetch('/api/school/messages', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/school/students', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const msgData = await msgRes.json();
      const stuData = await stuRes.json();

      if (msgData.success) setMessageLogs(msgData.data || []);
      if (stuData.success) setStudents(stuData.data || []);
    } catch (e) {
      showToast('Error loading message logs.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagesAndStudents();
  }, []);

  const handleOpenWhatsApp = (message: MessageLog) => {
    if (!message.recipient) {
      showToast('WhatsApp phone number is missing.', 'error');
      return;
    }

    // Clean phone number
    let cleanPhone = message.recipient.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.startsWith('+')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10 && !cleanPhone.startsWith('91')) {
      cleanPhone = `91${cleanPhone}`;
    }

    const encodedText = encodeURIComponent(message.preview_text || message.details);
    const link = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    // Mark as OPENED on backend
    fetch('/api/school/messages/mark-opened', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message_id: message.message_id })
    }).catch(() => {});

    // Update local state
    setMessageLogs(prev =>
      prev.map(m => (m.message_id === message.message_id ? { ...m, status: 'OPENED' } : m))
    );

    window.open(link, '_blank');
    showToast('WhatsApp opened. Please press Send.', 'info');
  };

  const handleSendCustomMessage = () => {
    if (!customPhone.trim() || !customMessage.trim()) {
      showToast('Please enter both WhatsApp Phone Number and Message text.', 'error');
      return;
    }

    let cleanPhone = customPhone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.startsWith('+')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10 && !cleanPhone.startsWith('91')) {
      cleanPhone = `91${cleanPhone}`;
    }

    const encoded = encodeURIComponent(customMessage);
    const link = `https://wa.me/${cleanPhone}?text=${encoded}`;

    const newLog: MessageLog = {
      message_id: `MSG-CUSTOM-${Date.now()}`,
      school_id: currentSchool?.school_id || 'SCH001',
      student_name: selectedStudentForCustom ? students.find(s => s.student_id === selectedStudentForCustom)?.student_name : 'Custom Recipient',
      type: 'CUSTOM',
      channel: 'WHATSAPP_MANUAL',
      recipient: cleanPhone,
      status: 'OPENED',
      created_at: new Date().toISOString(),
      details: 'Custom parent message created and opened.',
      preview_text: customMessage
    };

    setMessageLogs(prev => [newLog, ...prev]);
    setCustomMessage('');
    window.open(link, '_blank');
    showToast('WhatsApp opened. Please press Send.', 'info');
  };

  // Filter messages by active tab and search
  const filteredMessages = messageLogs.filter(m => {
    const matchesTab = m.type === activeTab;
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (m.student_name && m.student_name.toLowerCase().includes(q)) ||
      (m.recipient && m.recipient.includes(q)) ||
      (m.preview_text && m.preview_text.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  return (
    <div id="schoolos_whatsapp_message_center" className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">WhatsApp Message Center</h2>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Manual WhatsApp deep-linking system without external WhatsApp API requirements. Opens pre-formatted messages directly in WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            ● Manual WhatsApp Mode
          </span>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        {[
          { id: 'ADMISSION', label: 'Admission Messages' },
          { id: 'ATTENDANCE', label: 'Attendance Messages' },
          { id: 'NOTICE', label: 'Notice Messages' },
          { id: 'CUSTOM', label: '+ Compose Custom Message' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-4 text-xs font-bold rounded-t-2xl transition border-t border-x -mb-px ${
              activeTab === tab.id
                ? 'bg-white border-slate-200 text-emerald-700 shadow-sm border-b-white'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CUSTOM COMPOSE VIEW */}
      {activeTab === 'CUSTOM' ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Edit3 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Compose Direct WhatsApp Message</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Student (Optional - Auto-fills Parent WhatsApp)
              </label>
              <select
                value={selectedStudentForCustom}
                onChange={e => {
                  const sId = e.target.value;
                  setSelectedStudentForCustom(sId);
                  const st = students.find(s => s.student_id === sId);
                  if (st) {
                    setCustomPhone(st.parent_whatsapp || st.parent_mobile);
                    setCustomMessage(
                      `Dear Parent of ${st.student_name},\n\nGreetings from ${currentSchool?.school_name || 'SchoolOS'}.\n\n`
                    );
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                <option value="">-- Choose a student --</option>
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.student_name} (Class {s.class}-{s.section}, Roll {s.roll_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parent WhatsApp Mobile Number *
              </label>
              <input
                type="tel"
                value={customPhone}
                onChange={e => setCustomPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message Content *
              </label>
              <textarea
                rows={4}
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Clicking <strong>Open WhatsApp</strong> will launch WhatsApp on desktop/mobile with this exact pre-filled message ready to send.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                id="btn_open_custom_whatsapp"
                onClick={handleSendCustomMessage}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* MESSAGES TABLE VIEW */
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages by student, number, or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
            <button
              onClick={fetchMessagesAndStudents}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Loading Message Logs...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No {(activeTab || '').toLowerCase()} messages yet</h3>
              <p className="text-xs text-slate-700 mt-1">
                Messages generated from Admissions, Attendance, and Notices will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Student / Recipient</th>
                      <th className="py-3 px-4">WhatsApp Number</th>
                      <th className="py-3 px-4">Message Preview</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredMessages.map(msg => (
                      <tr key={msg.message_id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>
                            <p>{msg.student_name || 'Student'}</p>
                            <span className="text-[10px] text-slate-700 font-normal">
                              {new Date(msg.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {msg.recipient || 'N/A'}
                        </td>

                        <td className="py-3 px-4 max-w-md">
                          <p className="text-slate-700 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                            {msg.preview_text || msg.details}
                          </p>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              msg.status === 'OPENED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {msg.status === 'OPENED' ? 'OPENED' : 'READY'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenWhatsApp(msg)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition active:scale-95"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Open WhatsApp</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
