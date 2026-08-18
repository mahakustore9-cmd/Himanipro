import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Layers,
  Users,
  CalendarCheck2,
  ChevronRight,
  UserCheck,
  Plus,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { Student } from '../types/index.js';
import { apiFetch } from '../lib/api.js';

export const ClassesAndSections: React.FC = () => {
  const { token, setActiveView, showToast } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C'];

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/school/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setStudents(data.data || []);
    } catch (e) {
      showToast('Error loading class counts.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div id="schoolos_classes_module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Classes & Sections</h2>
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Overview of academic grades, section capacities, student strength, and quick navigation.
          </p>
        </div>

        <button
          onClick={() => setActiveView('admissions')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition active:scale-95 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll to Class</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Loading Academic Grade Structure...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(c => {
            const classStudents = students.filter(s => s.class === c);
            const totalCount = classStudents.length;

            return (
              <div
                key={c}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 font-black text-base flex items-center justify-center border border-blue-100">
                      {c}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Class {c}</h3>
                      <p className="text-[11px] text-slate-700">Total: {totalCount} Enrolled</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveView('attendance')}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 transition"
                    title="Open Attendance Matrix"
                  >
                    <CalendarCheck2 className="w-3.5 h-3.5" />
                    <span>Attendance</span>
                  </button>
                </div>

                {/* Section breakdown */}
                <div className="grid grid-cols-3 gap-2">
                  {sections.map(sec => {
                    const secCount = classStudents.filter(s => s.section === sec).length;
                    return (
                      <div
                        key={sec}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-0.5"
                      >
                        <p className="text-xs font-bold text-slate-700">Sec {sec}</p>
                        <p className="text-sm font-extrabold text-blue-700">{secCount}</p>
                        <p className="text-[10px] text-slate-600">Students</p>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Curriculum: CBSE / State
                  </span>
                  <button
                    onClick={() => setActiveView('students')}
                    className="font-bold text-blue-700 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    <span>View List</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
