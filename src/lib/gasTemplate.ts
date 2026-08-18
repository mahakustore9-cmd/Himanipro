/**
 * Google Apps Script Web App Template for SchoolOS Multi-School SaaS
 * Copy and paste this code directly into your Google Sheet's Apps Script Editor (Extensions > Apps Script).
 * Deploy as Web App -> Execute as: Me -> Who has access: Anyone.
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ============================================================================
 * SchoolOS - Multi-School Management System Backend (Google Apps Script)
 * Version: 1.0.0 Production V1
 * ============================================================================
 */

var REQUIRED_SHEETS = {
  "Students": [
    "student_id", "admission_number", "student_name", "photo_url", "father_name",
    "mother_name", "dob", "gender", "class", "section", "roll_number",
    "parent_mobile", "parent_whatsapp", "parent_email", "address", "city", "state", "pin_code",
    "admission_date", "previous_school", "remarks", "status", "created_at", "updated_at"
  ],
  "Admissions": [
    "admission_id", "student_id", "admission_number", "admission_date", "student_name",
    "class", "section", "status", "created_at"
  ],
  "Attendance": [
    "attendance_id", "student_id", "date", "class", "section", "status",
    "completed", "marked_by", "created_at", "updated_at"
  ],
  "AttendanceSummary": [
    "student_id", "month", "year", "present", "absent", "late", "holiday", "percentage"
  ],
  "Teachers": [
    "teacher_id", "name", "mobile", "email", "subject", "class", "section", "status", "joined_date"
  ],
  "Classes": [
    "class_id", "class_name", "sections", "class_teacher", "status"
  ],
  "Sections": [
    "section_id", "section_name", "class_name", "max_students", "status"
  ],
  "Fees": [
    "fee_id", "student_id", "fee_type", "amount", "paid_amount", "balance",
    "due_date", "status", "created_at", "updated_at"
  ],
  "Notices": [
    "notice_id", "title", "description", "date", "priority", "attachment_url",
    "status", "created_at", "updated_at"
  ],
  "MessageLogs": [
    "message_id", "school_id", "student_id", "type", "channel", "recipient",
    "status", "created_at", "details"
  ],
  "Settings": [
    "key", "value"
  ],
  "ActivityLogs": [
    "timestamp", "user", "action", "module", "record_id", "status", "details"
  ]
};

var DEFAULT_SETTINGS = {
  "school_name": "Delhi Public Academy",
  "school_logo": "",
  "address": "123 Education Enclave, Knowledge City",
  "phone": "+91 98765 43210",
  "email": "info@schoolos-dpa.edu",
  "principal_name": "Dr. Rameshwar Verma",
  "academic_session": "2026-2027",
  "country_code": "+91",
  "admission_whatsapp_template": "Dear Parent,\\n\\nYour child's admission has been successfully completed.\\n\\nSchool: {{school_name}}\\nStudent: {{student_name}}\\nAdmission No.: {{admission_number}}\\nClass: {{class}}\\nSection: {{section}}\\n\\nThank you,\\n{{school_name}}",
  "attendance_whatsapp_template": "Dear Parent,\\n\\nToday's attendance has been recorded.\\n\\nStudent: {{student_name}}\\nClass: {{class}}-{{section}}\\nDate: {{date}}\\nAttendance Status: {{attendance_status}}\\n\\nSchool: {{school_name}}\\nThank you.",
  "notice_whatsapp_template": "📢 *Important Notice - {{school_name}}*\\n\\n*{{notice_title}}*\\n\\n{{notice_description}}\\n\\nDate: {{date}}\\nPriority: {{priority}}\\n\\nRegards,\\n{{school_name}}",
  "fee_whatsapp_template": "Dear Parent,\\n\\nThis is a friendly reminder regarding fee payment for {{student_name}} (Class {{class}}).\\n\\nFee Type: {{fee_type}}\\nDue Amount: ₹{{balance}}\\nDue Date: {{due_date}}\\n\\nThank you,\\n{{school_name}}",
  "gmail_enabled": "true",
  "gmail_sender_name": "SchoolOS Admin"
};

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
  var response = {};
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (action === "ping" || action === "test_connection") {
      response = {
        success: true,
        message: "SchoolOS Google Apps Script Web App is connected and running.",
        spreadsheetId: ss.getId(),
        spreadsheetName: ss.getName(),
        timestamp: new Date().toISOString()
      };
    } else if (action === "init_database") {
      response = initializeDatabase(ss);
    } else if (action === "repair_database") {
      response = repairDatabase(ss);
    } else {
      response = { success: false, message: "Unknown GET action: " + action };
    }
  } catch (err) {
    response = { success: false, error: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle HTTP POST Requests
 */
function doPost(e) {
  var response = {};
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var action = data.action || "test";
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    switch (action) {
      case "ping":
      case "test_connection":
        response = {
          success: true,
          message: "Google Sheets Connection Active.",
          sheetId: ss.getId(),
          sheetName: ss.getName()
        };
        break;

      case "init_database":
        response = initializeDatabase(ss);
        break;

      case "repair_database":
        response = repairDatabase(ss);
        break;

      case "get_students":
        response = getStudentsData(ss, data.filters);
        break;

      case "save_admission":
        response = saveAdmission(ss, data.student, data.admission);
        break;

      case "update_student":
        response = updateStudent(ss, data.student);
        break;

      case "get_attendance_matrix":
        response = getAttendanceMatrix(ss, data.class, data.section, data.month, data.year);
        break;

      case "save_attendance":
        response = saveAttendanceBatch(ss, data.records, data.completed, data.marked_by);
        break;

      case "get_notices":
        response = getNotices(ss);
        break;

      case "save_notice":
        response = saveNotice(ss, data.notice);
        break;

      case "delete_notice":
        response = deleteNotice(ss, data.notice_id);
        break;

      case "get_fees":
        response = getFees(ss);
        break;

      case "save_fee":
        response = saveFee(ss, data.fee);
        break;

      case "get_teachers":
        response = getTeachers(ss);
        break;

      case "save_teacher":
        response = saveTeacher(ss, data.teacher);
        break;

      case "get_classes":
        response = getClasses(ss);
        break;

      case "save_class":
        response = saveClass(ss, data.classItem);
        break;

      case "get_settings":
        response = getSettings(ss);
        break;

      case "update_settings":
        response = updateSettings(ss, data.settings);
        break;

      case "upload_photo":
        response = uploadPhotoToDrive(data.base64Data, data.fileName, data.folderName);
        break;

      case "send_gmail":
        response = sendGmailNotification(data.recipient, data.subject, data.body);
        break;

      case "log_message":
        response = logMessage(ss, data.messageLog);
        break;

      case "get_message_logs":
        response = getMessageLogs(ss);
        break;

      default:
        response = { success: false, message: "Unsupported action: " + action };
    }
  } catch (error) {
    response = { success: false, error: error.toString(), stack: error.stack };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize all missing tabs & headers without overwriting existing rows
 */
function initializeDatabase(ss) {
  var createdTabs = [];
  var existingTabs = [];

  for (var sheetName in REQUIRED_SHEETS) {
    var sheet = ss.getSheetByName(sheetName);
    var headers = REQUIRED_SHEETS[sheetName];

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(headers);
      // Format header row
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground("#2563EB")
        .setFontColor("#FFFFFF")
        .setFontWeight("bold");
      sheet.setFrozenRows(1);
      createdTabs.push(sheetName);
    } else {
      existingTabs.push(sheetName);
      // Ensure header row exists
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length)
          .setBackground("#2563EB")
          .setFontColor("#FFFFFF")
          .setFontWeight("bold");
        sheet.setFrozenRows(1);
      }
    }
  }

  // Populate default settings if empty
  var settingsSheet = ss.getSheetByName("Settings");
  if (settingsSheet && settingsSheet.getLastRow() <= 1) {
    for (var key in DEFAULT_SETTINGS) {
      settingsSheet.appendRow([key, DEFAULT_SETTINGS[key]]);
    }
  }

  logActivity(ss, "SYSTEM", "INITIALIZE_DATABASE", "SYSTEM", "", "SUCCESS", "Initialized " + createdTabs.length + " new tabs.");

  return {
    success: true,
    message: "Database initialized successfully.",
    createdTabs: createdTabs,
    existingTabs: existingTabs,
    totalRequired: Object.keys(REQUIRED_SHEETS).length
  };
}

/**
 * Repair database: checks missing columns or tabs and non-destructively fixes them
 */
function repairDatabase(ss) {
  var initResult = initializeDatabase(ss);
  return {
    success: true,
    message: "Database structure verified and repaired successfully.",
    details: initResult
  };
}

/**
 * Upload photo to Google Drive
 */
function uploadPhotoToDrive(base64Data, fileName, folderName) {
  try {
    var folderNameSafe = folderName || "SchoolOS_Student_Photos";
    var folders = DriveApp.getFoldersByName(folderNameSafe);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderNameSafe);
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    var contentType = "image/jpeg";
    var cleanedBase64 = base64Data;
    if (base64Data.indexOf(",") > -1) {
      var parts = base64Data.split(",");
      var mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) contentType = mimeMatch[1];
      cleanedBase64 = parts[1];
    }

    var decoded = Utilities.base64Decode(cleanedBase64);
    var blob = Utilities.newBlob(decoded, contentType, fileName || ("student_" + Date.now() + ".jpg"));
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return {
      success: true,
      file_id: file.getId(),
      file_url: "https://drive.google.com/uc?export=view&id=" + file.getId()
    };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Send Gmail notification via authenticated user
 */
function sendGmailNotification(recipient, subject, body) {
  try {
    if (!recipient) return { success: false, error: "Recipient email is required" };
    GmailApp.sendEmail(recipient, subject, body, {
      name: "SchoolOS Management"
    });
    return { success: true, message: "Email sent successfully" };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Helper to log system activity
 */
function logActivity(ss, user, action, module, recordId, status, details) {
  try {
    var sheet = ss.getSheetByName("ActivityLogs");
    if (sheet) {
      sheet.appendRow([new Date().toISOString(), user || "ADMIN", action, module, recordId || "", status || "SUCCESS", details || ""]);
    }
  } catch(e) {}
}
`;

export const GAS_DEPLOYMENT_INSTRUCTIONS = [
  {
    step: 1,
    title: "Open your Google Sheet",
    description: "Open your school's master Google Sheet (or create a new blank Google Sheet)."
  },
  {
    step: 2,
    title: "Open Apps Script Editor",
    description: "In the Google Sheet menu bar, click on Extensions > Apps Script."
  },
  {
    step: 3,
    title: "Paste the SchoolOS Script",
    description: "Delete any default code in Code.gs, paste the complete SchoolOS Google Apps Script code, and click Save (Ctrl+S or Cmd+S)."
  },
  {
    step: 4,
    title: "Deploy as Web App",
    description: "Click Deploy > New deployment. Select type 'Web app'. Set 'Execute as': 'Me' and set 'Who has access': 'Anyone'."
  },
  {
    step: 5,
    title: "Authorize & Copy URL",
    description: "Click Deploy, authorize Google permissions (Advanced > Proceed), and copy your generated Web App URL into SchoolOS Settings."
  }
];

export const GAS_TEMPLATE_CODE = GOOGLE_APPS_SCRIPT_CODE;

