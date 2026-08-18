import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  BellRing,
  Plus,
  MessageSquare,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Send,
  AlertCircle,
  Megaphone,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Notice } from '../types/index.js';

export const NoticeBoard: React.FC = () => {
  const { token, currentSchool, showToast } = useAuth();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    target_type: 'ALL' as 'ALL' | 'CLASS' | 'TEACHERS' | 'PARENTS',
    target_value: 'ALL',
    publish_date: new Date().toISOString().split('T')[0]
  });

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/school/notices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotices(data.data || []);
      }
    } catch (e) {
      showToast('Error loading notices.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      showToast('Please provide both title and circular content.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/school/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newNotice)
      });
      const result = await res.json();
      if (result.success) {
        showToast('✓ Notice published & logged to Google Sheets!', 'success');
        setShowAddModal(false);
        setNewNotice({
          title: '',
          content: '',
          target_type: 'ALL',
          target_value: 'ALL',
          publish_date: new Date().toISOString().split('T')[0]
        });
        fetchNotices();
      } else {
        showToast(result.message || 'Failed to publish notice.', 'error');
      }
    } catch (e) {
      showToast('Error submitting notice.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareWhatsAppNotice = (notice: Notice) => {
    const formattedMessage = `📢 *NOTICE: ${notice.title}*\n🏫 *${currentSchool?.school_name || 'SchoolOS'}*\n📅 Date: ${notice.publish_date}\n👥 Audience: ${notice.target_type} (${notice.target_value})\n\n${notice.content}\n\n_Regards,_\n_School Administration_`;

    const encoded = encodeURIComponent(formattedMessage);
    const link = `https://wa.me/?text=${encoded}`;
    window.open(link, '_blank');
    showToast('WhatsApp opened. Please select your group or parent broadcast.', 'info');
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const res = await fetch(`/api/school/notices/${noticeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Notice deleted.', 'success');
        fetchNotices();
      }
    } catch (e) {
      showToast('Failed to delete notice.', 'error');
    }
  };

  return (
    <div id="schoolos_notice_board_module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Megaphone className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">School Notice Board</h2>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Publish circulars, announcements, and push one-click formatted messages to WhatsApp groups.
          </p>
        </div>

        <button
          id="btn_open_add_notice_modal"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition active:scale-95 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Notice</span>
        </button>
      </div>

      {/* Notices Grid */}
      {isLoading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Loading School Circulars...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <BellRing className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No active circulars</h3>
          <p className="text-xs text-slate-700 mt-1">Publish notices for parents, teachers, or specific classes.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            + Publish First Notice
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.map(notice => (
            <div
              key={notice.notice_id}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Audience: {notice.target_type} ({notice.target_value})
                  </span>
                  <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {notice.publish_date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {notice.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed line-clamp-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {notice.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleDeleteNotice(notice.notice_id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  title="Delete Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleShareWhatsAppNotice(notice)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD NOTICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Publish New Notice</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Meet 2026 Schedule"
                  value={newNotice.title}
                  onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newNotice.target_type}
                    onChange={e => setNewNotice({ ...newNotice, target_type: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="ALL">All School</option>
                    <option value="CLASS">Specific Class</option>
                    <option value="PARENTS">Parents Only</option>
                    <option value="TEACHERS">Teachers Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={newNotice.publish_date}
                    onChange={e => setNewNotice({ ...newNotice, publish_date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {newNotice.target_type === 'CLASS' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Class (e.g. Class 8 or Class 10)
                  </label>
                  <select
                    value={newNotice.target_value}
                    onChange={e => setNewNotice({ ...newNotice, target_value: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {['ALL', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Circular Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the announcement details..."
                  value={newNotice.content}
                  onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn_save_notice_submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Publish Circular</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
