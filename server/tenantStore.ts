import {
  SchoolTenant,
  SuperAdminUser,
  Student,
  Admission,
  AttendanceRecord,
  AttendanceSummary,
  Teacher,
  ClassItem,
  FeeRecord,
  Notice,
  MessageLog,
  SchoolSettings,
  ActivityLog,
  DashboardStats
} from '../src/types/index.js';

// Super Admin User (Password is hashed in real setup, for demo 'admin123' / sha256 or bcrypt)
export const DEFAULT_SUPER_ADMIN: SuperAdminUser = {
  admin_id: 'SUPER_ADMIN_01',
  username: 'superadmin',
  email: 'superadmin@schoolos.internal',
  name: 'Global System Administrator',
  last_login: new Date().toISOString()
};

export const SUPER_ADMIN_PASSWORD_HASH = 'admin123'; // or verified in auth

// Multi-tenant School Database
export interface SchoolDatabaseData {
  students: Student[];
  admissions: Admission[];
  attendance: AttendanceRecord[];
  attendanceSummary: AttendanceSummary[];
  teachers: Teacher[];
  classes: ClassItem[];
  fees: FeeRecord[];
  notices: Notice[];
  messageLogs: MessageLog[];
  settings: SchoolSettings;
  activityLogs: ActivityLog[];
}

// Initial Registered Schools in Super Admin Database
export const INITIAL_SCHOOLS: (SchoolTenant & { password_plain: string; pin?: string })[] = [
  {
    school_id: 'SCH001',
    school_name: 'Delhi Public Academy',
    admin_name: 'Principal Sharma',
    pin: '1234',
    password_plain: '1234',
    password_hash: '1234',
    google_sheet_id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    gas_web_app_url: 'https://script.google.com/macros/s/AKfycbySchoolOS_DPA/exec',
    status: 'ACTIVE',
    expiry_date: '2027-03-31',
    admin_email: 'principal@dpa-school.edu',
    school_phone: '+91 98765 43210',
    created_at: '2026-01-15T09:00:00.000Z',
    last_login: new Date().toISOString(),
    connection_status: 'CONNECTED',
    academic_session: '2026-2027',
    school_logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    principal_name: 'Dr. Rameshwar Verma',
    address: 'Sector 14, Rohini, New Delhi, 110085'
  },
  {
    school_id: 'SCH002',
    school_name: 'St. Xavier International School',
    admin_name: 'Sister Mary D\'Souza',
    pin: '5678',
    password_plain: '5678',
    password_hash: '5678',
    google_sheet_id: '1eO7_0p34sXavierIntlSchoolMasterDB_Sheet2026',
    gas_web_app_url: '',
    status: 'ACTIVE',
    expiry_date: '2027-06-30',
    admin_email: 'admin@stxaviers-school.org',
    school_phone: '+91 91234 56780',
    created_at: '2026-02-10T10:30:00.000Z',
    last_login: '2026-08-16T14:20:00.000Z',
    connection_status: 'CONNECTED',
    academic_session: '2026-2027',
    school_logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop&q=80',
    principal_name: 'Rev. Fr. Joseph Anthony',
    address: 'Park Street Campus, Kolkata, WB, 700016'
  },
  {
    school_id: 'SCH003',
    school_name: 'Cambridge Global Heights',
    admin_name: 'Mr. Vikram Singhania',
    pin: '9999',
    password_plain: 'cambridge2026',
    password_hash: 'cambridge2026',
    google_sheet_id: '1kL99_CambridgeGlobal_Spreadsheet_ID_99',
    gas_web_app_url: '',
    status: 'INACTIVE', // Sample inactive school to test requirement #5 and #53
    expiry_date: '2026-07-31',
    admin_email: 'director@cambridgeheights.edu',
    school_phone: '+91 99887 76655',
    created_at: '2026-03-01T11:00:00.000Z',
    last_login: '2026-07-28T09:15:00.000Z',
    connection_status: 'DISCONNECTED',
    academic_session: '2026-2027',
    school_logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80',
    principal_name: 'Mrs. Ananya Roy',
    address: 'Banjara Hills, Hyderabad, TS, 500034'
  }
];

// Helper to seed isolated school data
export function createInitialSchoolDatabase(school: SchoolTenant): SchoolDatabaseData {
  const isSch001 = school.school_id === 'SCH001';
  const prefix = school.school_id;

  const sampleStudents: Student[] = [
    {
      student_id: `${prefix}-2026-00001`,
      admission_number: 'ADM-2026-0101',
      student_name: 'Aarav Sharma',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      father_name: 'Rajesh Sharma',
      mother_name: 'Sunita Sharma',
      dob: '2012-05-14',
      gender: 'Male',
      class: '8',
      section: 'A',
      roll_number: '01',
      parent_mobile: '9876543211',
      parent_whatsapp: '9876543211',
      parent_email: 'rajesh.sharma@example.com',
      address: 'House #42, Block B, Green Park',
      city: 'New Delhi',
      state: 'Delhi',
      pin_code: '110016',
      admission_date: '2026-04-05',
      previous_school: 'DPS Junior Wing',
      remarks: 'Top in Mathematics & Science',
      status: 'ACTIVE',
      created_at: '2026-04-05T10:00:00.000Z',
      updated_at: '2026-08-10T12:00:00.000Z'
    },
    {
      student_id: `${prefix}-2026-00002`,
      admission_number: 'ADM-2026-0102',
      student_name: 'Diya Patel',
      photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      father_name: 'Manish Patel',
      mother_name: 'Pooja Patel',
      dob: '2012-08-22',
      gender: 'Female',
      class: '8',
      section: 'A',
      roll_number: '02',
      parent_mobile: '9811223344',
      parent_whatsapp: '9811223344',
      parent_email: 'manish.patel@example.com',
      address: 'Flat 304, Sunshine Heights',
      city: 'New Delhi',
      state: 'Delhi',
      pin_code: '110085',
      admission_date: '2026-04-06',
      previous_school: 'Little Angels School',
      remarks: 'Art and Debate enthusiast',
      status: 'ACTIVE',
      created_at: '2026-04-06T11:30:00.000Z',
      updated_at: '2026-08-12T15:20:00.000Z'
    },
    {
      student_id: `${prefix}-2026-00003`,
      admission_number: 'ADM-2026-0103',
      student_name: 'Rohan Gupta',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      father_name: 'Vikram Gupta',
      mother_name: 'Meena Gupta',
      dob: '2012-03-10',
      gender: 'Male',
      class: '8',
      section: 'A',
      roll_number: '03',
      parent_mobile: '9822334455',
      parent_whatsapp: '9822334455',
      parent_email: 'vikram.gupta@example.com',
      address: '15 Civil Lines Road',
      city: 'New Delhi',
      state: 'Delhi',
      pin_code: '110054',
      admission_date: '2026-04-10',
      previous_school: 'St. Marks School',
      remarks: 'Athletics team captain',
      status: 'ACTIVE',
      created_at: '2026-04-10T09:00:00.000Z',
      updated_at: '2026-08-15T11:00:00.000Z'
    },
    {
      student_id: `${prefix}-2026-00004`,
      admission_number: 'ADM-2026-0104',
      student_name: 'Ananya Verma',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      father_name: 'Sanjay Verma',
      mother_name: 'Kavita Verma',
      dob: '2012-11-05',
      gender: 'Female',
      class: '8',
      section: 'B',
      roll_number: '01',
      parent_mobile: '9833445566',
      parent_whatsapp: '9833445566',
      parent_email: 'sanjay.verma@example.com',
      address: '78 Model Town Phase 2',
      city: 'New Delhi',
      state: 'Delhi',
      pin_code: '110009',
      admission_date: '2026-04-12',
      previous_school: 'Heritage Global',
      remarks: 'Science olympiad winner',
      status: 'ACTIVE',
      created_at: '2026-04-12T14:00:00.000Z',
      updated_at: '2026-08-16T10:00:00.000Z'
    },
    {
      student_id: `${prefix}-2026-00005`,
      admission_number: 'ADM-2026-0105',
      student_name: 'Kabir Mehta',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      father_name: 'Alok Mehta',
      mother_name: 'Ritu Mehta',
      dob: '2011-09-18',
      gender: 'Male',
      class: '9',
      section: 'A',
      roll_number: '01',
      parent_mobile: '9844556677',
      parent_whatsapp: '9844556677',
      parent_email: 'alok.mehta@example.com',
      address: 'B-12 Vasant Kunj',
      city: 'New Delhi',
      state: 'Delhi',
      pin_code: '110070',
      admission_date: '2026-04-15',
      previous_school: 'Modern School',
      remarks: 'Robotics club lead',
      status: 'ACTIVE',
      created_at: '2026-04-15T09:30:00.000Z',
      updated_at: '2026-08-17T09:00:00.000Z'
    }
  ];

  const sampleAdmissions: Admission[] = sampleStudents.map((s, idx) => ({
    admission_id: `ADM-REC-${prefix}-${100 + idx}`,
    student_id: s.student_id,
    admission_number: s.admission_number,
    admission_date: s.admission_date,
    student_name: s.student_name,
    class: s.class,
    section: s.section,
    status: 'COMPLETED',
    created_at: s.created_at
  }));

  const todayStr = '2026-08-18'; // current academic day

  const sampleAttendance: AttendanceRecord[] = [
    {
      attendance_id: `ATT-${prefix}-1`,
      student_id: `${prefix}-2026-00001`,
      date: todayStr,
      class: '8',
      section: 'A',
      status: 'P',
      completed: true,
      marked_by: 'Mr. K. Sharma',
      created_at: '2026-08-18T08:30:00.000Z',
      updated_at: '2026-08-18T08:30:00.000Z'
    },
    {
      attendance_id: `ATT-${prefix}-2`,
      student_id: `${prefix}-2026-00002`,
      date: todayStr,
      class: '8',
      section: 'A',
      status: 'P',
      completed: true,
      marked_by: 'Mr. K. Sharma',
      created_at: '2026-08-18T08:30:00.000Z',
      updated_at: '2026-08-18T08:30:00.000Z'
    },
    {
      attendance_id: `ATT-${prefix}-3`,
      student_id: `${prefix}-2026-00003`,
      date: todayStr,
      class: '8',
      section: 'A',
      status: 'A', // Absent to showcase WhatsApp message generation
      completed: true,
      marked_by: 'Mr. K. Sharma',
      created_at: '2026-08-18T08:30:00.000Z',
      updated_at: '2026-08-18T08:30:00.000Z'
    }
  ];

  const sampleAttendanceSummary: AttendanceSummary[] = [
    {
      student_id: `${prefix}-2026-00001`,
      student_name: 'Aarav Sharma',
      roll_number: '01',
      class: '8',
      section: 'A',
      month: 8,
      year: 2026,
      present: 15,
      absent: 1,
      late: 0,
      holiday: 2,
      percentage: 93.75
    },
    {
      student_id: `${prefix}-2026-00002`,
      student_name: 'Diya Patel',
      roll_number: '02',
      class: '8',
      section: 'A',
      month: 8,
      year: 2026,
      present: 16,
      absent: 0,
      late: 0,
      holiday: 2,
      percentage: 100.0
    },
    {
      student_id: `${prefix}-2026-00003`,
      student_name: 'Rohan Gupta',
      roll_number: '03',
      class: '8',
      section: 'A',
      month: 8,
      year: 2026,
      present: 13,
      absent: 3,
      late: 0,
      holiday: 2,
      percentage: 81.25
    }
  ];

  const sampleTeachers: Teacher[] = [
    {
      teacher_id: `TCH-${prefix}-01`,
      name: 'Mr. Kuldeep Sharma',
      mobile: '+91 98760 11223',
      email: 'kuldeep.sharma@school.edu',
      subject: 'Mathematics',
      class: '8',
      section: 'A',
      status: 'ACTIVE',
      joined_date: '2021-07-01'
    },
    {
      teacher_id: `TCH-${prefix}-02`,
      name: 'Mrs. Neha Srivastava',
      mobile: '+91 98760 22334',
      email: 'neha.srivastava@school.edu',
      subject: 'Science & Physics',
      class: '8',
      section: 'B',
      status: 'ACTIVE',
      joined_date: '2022-04-15'
    },
    {
      teacher_id: `TCH-${prefix}-03`,
      name: 'Dr. Alistair Fernandez',
      mobile: '+91 98760 33445',
      email: 'a.fernandez@school.edu',
      subject: 'English Literature',
      class: '9',
      section: 'A',
      status: 'ACTIVE',
      joined_date: '2020-01-10'
    }
  ];

  const sampleClasses: ClassItem[] = [
    {
      class_id: `CLS-${prefix}-01`,
      class_name: '8',
      sections: ['A', 'B', 'C'],
      class_teacher: 'Mr. Kuldeep Sharma',
      status: 'ACTIVE'
    },
    {
      class_id: `CLS-${prefix}-02`,
      class_name: '9',
      sections: ['A', 'B'],
      class_teacher: 'Dr. Alistair Fernandez',
      status: 'ACTIVE'
    },
    {
      class_id: `CLS-${prefix}-03`,
      class_name: '10',
      sections: ['A', 'B'],
      class_teacher: 'Mrs. Neha Srivastava',
      status: 'ACTIVE'
    }
  ];

  const sampleFees: FeeRecord[] = [
    {
      fee_id: `FEE-${prefix}-001`,
      receipt_number: `REC-2026-1001`,
      student_id: `${prefix}-2026-00001`,
      student_name: 'Aarav Sharma',
      class: '8',
      section: 'A',
      fee_type: 'Q2 Tuition & Lab Fee',
      month: 'August 2026',
      amount: 14500,
      paid_amount: 14500,
      balance: 0,
      payment_mode: 'UPI',
      payment_date: '2026-08-10',
      due_date: '2026-08-15',
      status: 'Paid',
      created_at: '2026-07-01T10:00:00.000Z',
      updated_at: '2026-08-10T14:00:00.000Z'
    },
    {
      fee_id: `FEE-${prefix}-002`,
      receipt_number: `REC-2026-1002`,
      student_id: `${prefix}-2026-00002`,
      student_name: 'Diya Patel',
      class: '8',
      section: 'A',
      fee_type: 'Q2 Tuition & Lab Fee',
      month: 'August 2026',
      amount: 14500,
      paid_amount: 10000,
      balance: 4500,
      payment_mode: 'NET_BANKING',
      payment_date: '2026-08-12',
      due_date: '2026-08-25',
      status: 'Partial',
      created_at: '2026-07-01T10:00:00.000Z',
      updated_at: '2026-08-12T11:00:00.000Z'
    },
    {
      fee_id: `FEE-${prefix}-003`,
      receipt_number: `REC-2026-1003`,
      student_id: `${prefix}-2026-00003`,
      student_name: 'Rohan Gupta',
      class: '8',
      section: 'A',
      fee_type: 'Q2 Tuition & Sports Fee',
      month: 'August 2026',
      amount: 15500,
      paid_amount: 0,
      balance: 15500,
      payment_mode: 'CASH',
      payment_date: '2026-08-01',
      due_date: '2026-08-20',
      status: 'Pending',
      created_at: '2026-07-01T10:00:00.000Z',
      updated_at: '2026-07-01T10:00:00.000Z'
    }
  ];

  const sampleNotices: Notice[] = [
    {
      notice_id: `NOT-${prefix}-01`,
      title: 'Independence Day Celebration & Patriotic Cultural Fest',
      description: 'All students are requested to report in proper white uniform by 8:00 AM on 15th August for the flag hoisting and cultural assembly.',
      date: '2026-08-12',
      priority: 'Important',
      status: 'PUBLISHED',
      created_at: '2026-08-12T10:00:00.000Z',
      updated_at: '2026-08-12T10:00:00.000Z'
    },
    {
      notice_id: `NOT-${prefix}-02`,
      title: 'Term 1 Unit Assessment Schedule Released',
      description: 'The date sheet for Term 1 Unit Tests commencing from 1st September 2026 has been uploaded. Please review the syllabus with your subject teachers.',
      date: '2026-08-16',
      priority: 'Urgent',
      status: 'PUBLISHED',
      created_at: '2026-08-16T09:00:00.000Z',
      updated_at: '2026-08-16T09:00:00.000Z'
    },
    {
      notice_id: `NOT-${prefix}-03`,
      title: 'Parent-Teacher Meeting (PTM) Scheduled',
      description: 'PTM for Classes 6 to 10 will be conducted on Saturday from 9:00 AM to 1:00 PM. Parents can discuss term progress with respective class teachers.',
      date: '2026-08-17',
      priority: 'Normal',
      status: 'PUBLISHED',
      created_at: '2026-08-17T11:00:00.000Z',
      updated_at: '2026-08-17T11:00:00.000Z'
    }
  ];

  const sampleMessageLogs: MessageLog[] = [
    {
      message_id: `MSG-${prefix}-001`,
      school_id: prefix,
      student_id: `${prefix}-2026-00001`,
      student_name: 'Aarav Sharma',
      type: 'ADMISSION',
      channel: 'WHATSAPP_MANUAL',
      recipient: '+919876543211',
      status: 'OPENED',
      created_at: '2026-04-05T10:15:00.000Z',
      details: 'Admission confirmation message opened in WhatsApp web/mobile.',
      preview_text: `Dear Parent, Your child's admission has been successfully completed for Aarav Sharma (Class 8-A).`
    },
    {
      message_id: `MSG-${prefix}-002`,
      school_id: prefix,
      student_id: `${prefix}-2026-00003`,
      student_name: 'Rohan Gupta',
      type: 'ATTENDANCE',
      channel: 'WHATSAPP_MANUAL',
      recipient: '+919822334455',
      status: 'READY',
      created_at: '2026-08-18T08:35:00.000Z',
      details: 'Absence notification prepared for parent.',
      preview_text: `Dear Parent, Rohan Gupta has been marked Absent on 18 August 2026.`
    }
  ];

  const sampleSettings: SchoolSettings = {
    school_name: school.school_name,
    school_logo: school.school_logo || '',
    address: school.address || '123 Education Enclave, Knowledge City',
    phone: school.school_phone,
    email: school.admin_email,
    principal_name: school.principal_name || school.admin_name,
    academic_session: school.academic_session || '2026-2027',
    country_code: '+91',
    admission_whatsapp_template: `Dear Parent,\n\nYour child's admission has been successfully completed.\n\nSchool: {{school_name}}\nStudent: {{student_name}}\nAdmission No.: {{admission_number}}\nClass: {{class}}\nSection: {{section}}\n\nThank you,\n{{school_name}}`,
    attendance_whatsapp_template: `Dear Parent,\n\nToday's attendance has been recorded.\n\nStudent: {{student_name}}\nClass: {{class}}-{{section}}\nDate: {{date}}\nAttendance Status: {{attendance_status}}\n\nSchool: {{school_name}}\nThank you.`,
    notice_whatsapp_template: `📢 *Important Notice - {{school_name}}*\n\n*{{notice_title}}*\n\n{{notice_description}}\n\nDate: {{date}}\nPriority: {{priority}}\n\nRegards,\n{{school_name}}`,
    fee_whatsapp_template: `Dear Parent,\n\nThis is a friendly reminder regarding fee payment for {{student_name}} (Class {{class}}).\n\nFee Type: {{fee_type}}\nDue Amount: ₹{{balance}}\nDue Date: {{due_date}}\n\nThank you,\n{{school_name}}`,
    gmail_enabled: true,
    gmail_sender_name: `${school.school_name} Administration`,
    google_sheet_id: school.google_sheet_id,
    gas_web_app_url: school.gas_web_app_url || ''
  };

  const sampleActivityLogs: ActivityLog[] = [
    {
      log_id: `LOG-${prefix}-01`,
      timestamp: '2026-08-18T08:30:00.000Z',
      user: 'Mr. K. Sharma',
      action: 'COMPLETE_ATTENDANCE',
      module: 'ATTENDANCE',
      record_id: 'Class 8-A',
      status: 'SUCCESS',
      details: 'Marked attendance for Class 8-A (2 Present, 1 Absent).'
    },
    {
      log_id: `LOG-${prefix}-02`,
      timestamp: '2026-08-17T11:00:00.000Z',
      user: school.admin_name,
      action: 'PUBLISH_NOTICE',
      module: 'NOTICES',
      record_id: `NOT-${prefix}-03`,
      status: 'SUCCESS',
      details: 'Published Parent-Teacher Meeting notice.'
    }
  ];

  return {
    students: sampleStudents,
    admissions: sampleAdmissions,
    attendance: sampleAttendance,
    attendanceSummary: sampleAttendanceSummary,
    teachers: sampleTeachers,
    classes: sampleClasses,
    fees: sampleFees,
    notices: sampleNotices,
    messageLogs: sampleMessageLogs,
    settings: sampleSettings,
    activityLogs: sampleActivityLogs
  };
}

// In-Memory Multi-Tenant Store with complete isolation
export class MultiTenantStore {
  private schools: Map<string, SchoolTenant & { password_plain: string }> = new Map();
  private schoolDatabases: Map<string, SchoolDatabaseData> = new Map();
  private activeSessions: Map<string, { role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN'; schoolId?: string; username?: string; expiresAt: number }> = new Map();
  private superAdminActivityLogs: ActivityLog[] = [];

  private superAdminPassword: string = process.env.SUPER_ADMIN_PASSWORD || 'admin123';

  constructor() {
    this.initDefaultData();
  }

  public getSuperAdminPassword(): string {
    return this.superAdminPassword;
  }

  public setSuperAdminPassword(newPassword: string): boolean {
    if (!newPassword || newPassword.length < 4) return false;
    this.superAdminPassword = newPassword;
    this.logSuperAdminActivity('CHANGE_SUPER_ADMIN_PASSWORD', 'SUPER_ADMIN_01', 'SUCCESS', 'Super Admin master password changed successfully.');
    return true;
  }

  private initDefaultData() {
    for (const school of INITIAL_SCHOOLS) {
      this.schools.set(school.school_id, { ...school });
      this.schoolDatabases.set(school.school_id, createInitialSchoolDatabase(school));
    }

    this.superAdminActivityLogs.push({
      log_id: 'LOG-SYS-001',
      timestamp: new Date().toISOString(),
      user: 'SUPER_ADMIN',
      action: 'SYSTEM_BOOT',
      module: 'MULTI_TENANT_CORE',
      record_id: 'ALL',
      status: 'SUCCESS',
      details: 'SchoolOS Multi-Tenant Server Engine initialized with isolated school instances.'
    });
  }

  // --- Super Admin Operations ---
  public getSuperAdminUser(): SuperAdminUser {
    return DEFAULT_SUPER_ADMIN;
  }

  public getAllSchools(): SchoolTenant[] {
    return Array.from(this.schools.values()).map(s => {
      const { password_plain, ...rest } = s;
      return rest;
    });
  }

  public getSchoolById(schoolId: string): (SchoolTenant & { password_plain: string }) | undefined {
    return this.schools.get(schoolId);
  }

  public createSchool(newSchool: {
    school_name: string;
    admin_name: string;
    school_id: string;
    password: string;
    admin_email: string;
    google_sheet_id: string;
    expiry_date?: string;
    school_phone?: string;
    gas_web_app_url?: string;
    academic_session?: string;
    school_logo?: string;
  }): { success: boolean; school?: SchoolTenant; message?: string } {
    const cleanId = newSchool.school_id.trim().toUpperCase();
    if (this.schools.has(cleanId)) {
      return { success: false, message: `School ID ${cleanId} already exists.` };
    }

    const tenant: SchoolTenant & { password_plain: string } = {
      school_id: cleanId,
      school_name: newSchool.school_name.trim(),
      admin_name: newSchool.admin_name.trim(),
      password_plain: newSchool.password,
      password_hash: newSchool.password,
      google_sheet_id: newSchool.google_sheet_id.trim(),
      gas_web_app_url: newSchool.gas_web_app_url || '',
      status: 'ACTIVE',
      expiry_date: newSchool.expiry_date || '2027-03-31',
      admin_email: newSchool.admin_email.trim(),
      school_phone: newSchool.school_phone || '+91 98765 00000',
      created_at: new Date().toISOString(),
      last_login: undefined,
      connection_status: 'CONNECTED',
      academic_session: newSchool.academic_session || '2026-2027',
      school_logo: newSchool.school_logo || ''
    };

    this.schools.set(cleanId, tenant);
    this.schoolDatabases.set(cleanId, createInitialSchoolDatabase(tenant));

    this.logSuperAdminActivity('CREATE_SCHOOL', cleanId, 'SUCCESS', `Created school ${tenant.school_name} (${cleanId}) with isolated Google Sheet.`);

    const { password_plain, ...safeTenant } = tenant;
    return { success: true, school: safeTenant, message: 'School created and database initialized successfully.' };
  }

  public toggleSchoolStatus(schoolId: string, status: 'ACTIVE' | 'INACTIVE'): { success: boolean; message: string } {
    const school = this.schools.get(schoolId);
    if (!school) return { success: false, message: 'School not found' };

    school.status = status;
    this.schools.set(schoolId, school);

    this.logSuperAdminActivity('STATUS_CHANGE', schoolId, 'SUCCESS', `Switched status of ${school.school_name} to ${status}.`);
    return { success: true, message: `School status updated to ${status}.` };
  }

  public resetSchoolPassword(schoolId: string, newPassword: string): { success: boolean; message: string } {
    const school = this.schools.get(schoolId);
    if (!school) return { success: false, message: 'School not found' };

    school.password_plain = newPassword;
    school.password_hash = newPassword;
    this.schools.set(schoolId, school);

    this.logSuperAdminActivity('RESET_PASSWORD', schoolId, 'SUCCESS', `Reset password for school ${schoolId}.`);
    return { success: true, message: 'Password reset successfully.' };
  }

  public updateSchoolSettings(schoolId: string, updates: Partial<SchoolSettings & SchoolTenant>): boolean {
    const school = this.schools.get(schoolId);
    if (!school) return false;

    if (updates.google_sheet_id !== undefined) school.google_sheet_id = updates.google_sheet_id;
    if (updates.gas_web_app_url !== undefined) school.gas_web_app_url = updates.gas_web_app_url;
    if (updates.school_name !== undefined) school.school_name = updates.school_name;
    if (updates.academic_session !== undefined) school.academic_session = updates.academic_session;
    if (updates.school_logo !== undefined) school.school_logo = updates.school_logo;
    if (updates.principal_name !== undefined) school.principal_name = updates.principal_name;
    if (updates.address !== undefined) school.address = updates.address;
    if (updates.school_phone !== undefined || updates.phone !== undefined) {
      school.school_phone = updates.school_phone || updates.phone || school.school_phone;
    }
    if (updates.admin_email !== undefined || updates.email !== undefined) {
      school.admin_email = updates.admin_email || updates.email || school.admin_email;
    }

    this.schools.set(schoolId, school);
    return true;
  }

  public logSuperAdminActivity(action: string, recordId: string, status: 'SUCCESS' | 'WARNING' | 'ERROR', details: string) {
    this.superAdminActivityLogs.unshift({
      log_id: `LOG-SUPER-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'SUPER_ADMIN',
      action,
      module: 'SUPER_ADMIN',
      record_id: recordId,
      status,
      details
    });
  }

  public getSuperAdminActivityLogs(): ActivityLog[] {
    return this.superAdminActivityLogs;
  }

  // --- Session Management ---
  public createSession(role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN', payload: { schoolId?: string; username?: string }): string {
    const token = `tok_${role.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    this.activeSessions.set(token, { role, schoolId: payload.schoolId, username: payload.username, expiresAt });
    return token;
  }

  public verifySession(token: string): { valid: boolean; role?: 'SUPER_ADMIN' | 'SCHOOL_ADMIN'; schoolId?: string; school?: SchoolTenant } {
    if (!token) return { valid: false };
    const session = this.activeSessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
      if (session) this.activeSessions.delete(token);
      return { valid: false };
    }

    if (session.role === 'SUPER_ADMIN') {
      return { valid: true, role: 'SUPER_ADMIN' };
    }

    if (session.schoolId) {
      const rawSchool = this.schools.get(session.schoolId);
      if (!rawSchool) return { valid: false };
      const { password_plain, ...safeSchool } = rawSchool;
      return { valid: true, role: 'SCHOOL_ADMIN', schoolId: session.schoolId, school: safeSchool };
    }

    return { valid: false };
  }

  public deleteSession(token: string) {
    this.activeSessions.delete(token);
  }

  // --- Isolated School Tenant Database Retrieval & Writes ---
  public getSchoolData(schoolId: string): SchoolDatabaseData | undefined {
    return this.schoolDatabases.get(schoolId);
  }

  public logSchoolActivity(schoolId: string, user: string, action: string, module: string, recordId: string, status: 'SUCCESS' | 'WARNING' | 'ERROR', details: string) {
    const db = this.schoolDatabases.get(schoolId);
    if (db) {
      db.activityLogs.unshift({
        log_id: `LOG-${schoolId}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user,
        action,
        module,
        record_id: recordId,
        status,
        details
      });
    }
  }

  // Calculate high-performance dashboard statistics for a school
  public getDashboardStats(schoolId: string): DashboardStats | null {
    const db = this.schoolDatabases.get(schoolId);
    if (!db) return null;

    const totalStudents = db.students.filter(s => s.status === 'ACTIVE').length;
    const today = new Date().toISOString().split('T')[0];
    
    // Find attendance records for today or the most recent marked date
    let todayRecords = db.attendance.filter(a => a.date === today);
    if (todayRecords.length === 0 && db.attendance.length > 0) {
      // Use the latest available date for lively demo
      const latestDate = db.attendance[0].date;
      todayRecords = db.attendance.filter(a => a.date === latestDate);
    }

    const todayPresent = todayRecords.filter(a => a.status === 'P').length;
    const todayAbsent = todayRecords.filter(a => a.status === 'A').length;
    const todayLate = todayRecords.filter(a => a.status === 'L').length;
    const totalMarked = todayPresent + todayAbsent + todayLate;
    const todayNotMarked = Math.max(0, totalStudents - totalMarked);

    const attendancePercentage = totalMarked > 0 ? Math.round((todayPresent / totalMarked) * 100) : 94;

    const activeNotices = db.notices.filter(n => n.status === 'PUBLISHED').length;
    const totalTeachers = db.teachers.filter(t => t.status === 'ACTIVE').length;
    const pendingFees = db.fees.filter(f => f.status !== 'Paid').reduce((acc, curr) => acc + curr.balance, 0);

    const recentAdmissions = [...db.students].sort((a, b) => new Date(b.admission_date).getTime() - new Date(a.admission_date).getTime()).slice(0, 5);
    const recentNotices = [...db.notices].filter(n => n.status === 'PUBLISHED').slice(0, 4);

    return {
      totalStudents,
      todayPresent,
      todayAbsent,
      todayLate,
      todayNotMarked,
      newAdmissionsThisMonth: db.admissions.length,
      activeNotices,
      attendancePercentage,
      totalTeachers,
      pendingFees,
      recentAdmissions,
      recentNotices,
      todayAttendanceSummary: {
        present: todayPresent,
        absent: todayAbsent,
        notMarked: todayNotMarked,
        total: totalStudents
      }
    };
  }
}

export const tenantStore = new MultiTenantStore();
