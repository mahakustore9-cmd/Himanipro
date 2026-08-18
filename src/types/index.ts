export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN';

export type SchoolStatus = 'ACTIVE' | 'INACTIVE';

export type ConnectionState = 'CONNECTED' | 'CHECKING' | 'DISCONNECTED';

export interface SuperAdminUser {
  admin_id: string;
  username: string;
  email: string;
  name: string;
  last_login?: string;
}

export interface SchoolTenant {
  school_id: string;
  school_name: string;
  admin_name: string;
  password_hash?: string;
  pin?: string;
  google_sheet_id: string;
  gas_web_app_url?: string;
  drive_folder_id?: string;
  status: SchoolStatus;
  expiry_date?: string;
  admin_email: string;
  school_phone: string;
  contact_phone?: string;
  contact_email?: string;
  created_at: string;
  last_login?: string;
  connection_status: ConnectionState;
  academic_session?: string;
  school_logo?: string;
  principal_name?: string;
  address?: string;
}

export type SchoolConfig = SchoolTenant;

export interface Student {
  student_id: string;
  admission_number: string;
  student_name: string;
  photo_url?: string;
  father_name: string;
  mother_name?: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  class: string;
  section: string;
  roll_number: string;
  parent_mobile: string;
  parent_whatsapp: string;
  parent_email?: string;
  address: string;
  city?: string;
  state?: string;
  pin_code?: string;
  admission_date: string;
  previous_school?: string;
  remarks?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ALUMNI';
  created_at: string;
  updated_at: string;
}

export interface Admission {
  admission_id: string;
  student_id: string;
  admission_number: string;
  admission_date: string;
  student_name: string;
  class: string;
  section: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  created_at: string;
}

export type AttendanceStatus = 'P' | 'A' | 'L' | 'H'; // Present, Absent, Late, Holiday

export interface AttendanceRecord {
  attendance_id: string;
  student_id: string;
  date: string; // YYYY-MM-DD
  class: string;
  section: string;
  status: AttendanceStatus;
  completed: boolean;
  marked_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceSummary {
  student_id: string;
  student_name?: string;
  roll_number?: string;
  class?: string;
  section?: string;
  month: number; // 1-12
  year: number;
  present: number;
  absent: number;
  late: number;
  holiday: number;
  percentage: number;
}

export interface Teacher {
  teacher_id: string;
  name: string;
  mobile: string;
  phone?: string;
  email: string;
  subject: string;
  class?: string;
  assigned_class?: string;
  section?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joined_date?: string;
}

export interface ClassItem {
  class_id: string;
  class_name: string;
  sections: string[];
  class_teacher?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FeePayment {
  fee_id: string;
  student_id: string;
  student_name: string;
  class?: string;
  section?: string;
  fee_type?: string;
  receipt_number?: string;
  amount: number;
  paid_amount?: number;
  balance?: number;
  due_date?: string;
  month?: string;
  payment_mode?: 'CASH' | 'UPI' | 'NET_BANKING' | 'CHEQUE';
  payment_date?: string;
  status: 'Paid' | 'Partial' | 'Pending';
  remarks?: string;
  created_at: string;
  updated_at?: string;
}

export type FeeRecord = FeePayment;

export type NoticePriority = 'Normal' | 'Important' | 'Urgent';

export interface Notice {
  notice_id: string;
  title: string;
  content?: string;
  description?: string;
  publish_date?: string;
  date?: string;
  target_type?: 'ALL' | 'CLASS' | 'TEACHERS' | 'PARENTS';
  target_value?: string;
  priority?: NoticePriority;
  attachment_url?: string;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  created_at: string;
  updated_at?: string;
}

export interface MessageLog {
  message_id: string;
  school_id: string;
  student_id?: string;
  student_name?: string;
  type: 'ADMISSION' | 'ATTENDANCE' | 'NOTICE' | 'CUSTOM' | 'FEE';
  channel: 'WHATSAPP_MANUAL' | 'GMAIL';
  recipient: string;
  status: 'READY' | 'OPENED' | 'SENT' | 'FAILED';
  created_at: string;
  details: string;
  preview_text?: string;
}

export interface SchoolSettings {
  school_name: string;
  school_logo?: string;
  address?: string;
  phone: string;
  email: string;
  principal_name?: string;
  academic_session: string;
  country_code?: string;
  admission_whatsapp_template?: string;
  attendance_whatsapp_template?: string;
  notice_whatsapp_template?: string;
  fee_whatsapp_template?: string;
  gmail_enabled?: boolean;
  gmail_sender_name?: string;
  google_sheet_id: string;
  gas_web_app_url?: string;
  drive_folder_id?: string;
}

export interface ActivityLog {
  activity_id?: string;
  log_id?: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  record_id?: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  details: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  errorCode?: string;
  data?: T;
}

export interface AuthSession {
  token: string;
  role: UserRole;
  school?: SchoolTenant;
  superAdmin?: SuperAdminUser;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents?: number;
  presentToday?: number;
  absentToday?: number;
  todayAttendancePercentage?: number;
  todayPresent?: number;
  todayAbsent?: number;
  todayLate?: number;
  todayNotMarked?: number;
  newAdmissionsThisMonth?: number;
  activeNotices?: number;
  activeNoticesCount?: number;
  attendancePercentage?: number;
  totalTeachers?: number;
  pendingFees?: number;
  recentAdmissions?: Student[];
  recentNotices?: Notice[];
  todayAttendanceSummary?: {
    present: number;
    absent: number;
    notMarked: number;
    total: number;
  };
}
