/**
 * Google Apps Script Web App Template for SchoolOS Multi-School SaaS
 * Copy and paste this code directly into your Google Sheet's Apps Script Editor (Extensions > Apps Script).
 * Deploy as Web App -> Execute as: Me -> Who has access: Anyone.
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ============================================================================
 * SchoolOS - Multi-School Management System Backend (Google Apps Script)
 * Version: 2.0.0 Production Auto-Sync Engine
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
    "fee_id", "receipt_number", "student_id", "student_name", "class", "section", "fee_type",
    "month", "amount", "paid_amount", "balance", "payment_mode", "payment_date", "due_date",
    "status", "remarks", "created_at", "updated_at"
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
  "school_name": "SchoolOS Partner School",
  "school_logo": "",
  "address": "Campus Address, Education Hub",
  "phone": "+91 98765 43210",
  "email": "admin@schoolos.internal",
  "principal_name": "Principal",
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
 * Custom UI Menu inside Google Sheets
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🚀 SchoolOS Database")
    .addItem("✨ Initialize All Database Tables (12 Tabs)", "initializeDatabaseFromMenu")
    .addItem("🛠️ Repair / Check Missing Columns", "repairDatabaseFromMenu")
    .addSeparator()
    .addItem("🧪 Test Connection Status", "testConnectionFromMenu")
    .addToUi();
}

function initializeDatabaseFromMenu() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = initializeDatabase(ss);
  SpreadsheetApp.getUi().alert("✓ SchoolOS Database Initialized!\\nCreated Tabs: " + result.createdTabs.length + "\\nExisting Tabs: " + result.existingTabs.length);
}

function repairDatabaseFromMenu() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = repairDatabase(ss);
  SpreadsheetApp.getUi().alert("✓ SchoolOS Database Structure Verified and Repaired!");
}

function testConnectionFromMenu() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.getUi().alert("✓ Google Sheets Database Active & Ready!\\nSpreadsheet ID: " + ss.getId());
}

/**
 * Handle HTTP GET Requests (Web App URL endpoint)
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
    } else if (action === "get_all_data") {
      response = {
        success: true,
        students: getSheetObjects(ss, "Students"),
        admissions: getSheetObjects(ss, "Admissions"),
        fees: getSheetObjects(ss, "Fees"),
        notices: getSheetObjects(ss, "Notices"),
        teachers: getSheetObjects(ss, "Teachers"),
        classes: getSheetObjects(ss, "Classes"),
        settings: getSettingsObject(ss)
      };
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
 * Handle HTTP POST Requests (Data Sync from SchoolOS)
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

    // Auto-ensure database is initialized on any action
    ensureTablesExist(ss);

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

      case "save_student":
      case "save_admission":
        response = saveStudentAndAdmission(ss, data.student || data, data.admission);
        break;

      case "update_student":
        response = updateStudentRow(ss, data.student || data);
        break;

      case "save_fee":
      case "collect_fee":
        response = saveFeeRecord(ss, data.fee || data);
        break;

      case "save_attendance":
        response = saveAttendanceRecords(ss, data.records || data.attendanceList || [], data.class, data.section, data.date, data.marked_by);
        break;

      case "save_notice":
        response = saveNoticeRecord(ss, data.notice || data);
        break;

      case "delete_notice":
        response = deleteNoticeRecord(ss, data.notice_id || data.id);
        break;

      case "save_teacher":
        response = saveTeacherRecord(ss, data.teacher || data);
        break;

      case "save_class":
        response = saveClassRecord(ss, data.classItem || data);
        break;

      case "update_settings":
        response = updateSettingsData(ss, data.settings || data);
        break;

      case "log_message":
        response = logMessageRecord(ss, data.messageLog || data);
        break;

      case "upload_photo":
        response = uploadPhotoToDrive(data.base64Data, data.fileName, data.folderName);
        break;

      case "send_gmail":
        response = sendGmailNotification(data.recipient, data.subject, data.body);
        break;

      default:
        response = { success: true, message: "Action received: " + action };
    }
  } catch (error) {
    response = { success: false, error: error.toString(), stack: error.stack };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize all 12 missing tabs & headers with professional styling
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
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground("#1E40AF")
        .setFontColor("#FFFFFF")
        .setFontWeight("bold")
        .setFontFamily("Arial");
      sheet.setFrozenRows(1);
      sheet.setRowHeight(1, 32);
      createdTabs.push(sheetName);
    } else {
      existingTabs.push(sheetName);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length)
          .setBackground("#1E40AF")
          .setFontColor("#FFFFFF")
          .setFontWeight("bold")
          .setFontFamily("Arial");
        sheet.setFrozenRows(1);
        sheet.setRowHeight(1, 32);
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

  logActivity(ss, "SYSTEM", "INITIALIZE_DATABASE", "SYSTEM", "", "SUCCESS", "Initialized " + createdTabs.length + " tabs.");

  return {
    success: true,
    message: "✓ All 12 SchoolOS Database tabs created successfully!",
    createdTabs: createdTabs,
    existingTabs: existingTabs,
    totalRequired: Object.keys(REQUIRED_SHEETS).length
  };
}

function ensureTablesExist(ss) {
  for (var sheetName in REQUIRED_SHEETS) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      var headers = REQUIRED_SHEETS[sheetName];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground("#1E40AF")
        .setFontColor("#FFFFFF")
        .setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  }
}

function repairDatabase(ss) {
  var initResult = initializeDatabase(ss);
  return {
    success: true,
    message: "Database schema verified and repaired.",
    details: initResult
  };
}

/**
 * CRUD Helper: Append / Update Student & Admission
 */
function saveStudentAndAdmission(ss, student, admission) {
  if (!student) return { success: false, message: "No student data provided" };
  var sheet = ss.getSheetByName("Students");
  if (!sheet) return { success: false, message: "Students sheet missing" };

  var headers = REQUIRED_SHEETS["Students"];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    row.push(student[key] !== undefined ? student[key] : "");
  }
  sheet.appendRow(row);

  // If admission details provided, record in Admissions tab
  if (admission) {
    var admSheet = ss.getSheetByName("Admissions");
    if (admSheet) {
      var admHeaders = REQUIRED_SHEETS["Admissions"];
      var admRow = [];
      for (var j = 0; j < admHeaders.length; j++) {
        var k = admHeaders[j];
        admRow.push(admission[k] !== undefined ? admission[k] : (student[k] !== undefined ? student[k] : ""));
      }
      admSheet.appendRow(admRow);
    }
  }

  logActivity(ss, "ADMIN", "SAVE_STUDENT", "STUDENTS", student.student_id, "SUCCESS", "Student saved: " + student.student_name);
  return { success: true, message: "Student saved to Google Sheet.", student_id: student.student_id };
}

function updateStudentRow(ss, student) {
  var sheet = ss.getSheetByName("Students");
  if (!sheet || !student || !student.student_id) return { success: false, message: "Invalid student update request" };

  var data = sheet.getDataRange().getValues();
  var idColIdx = 0; // student_id is first col
  var targetRowIdx = -1;

  for (var r = 1; r < data.length; r++) {
    if (data[r][idColIdx] === student.student_id) {
      targetRowIdx = r + 1; // 1-indexed sheet row
      break;
    }
  }

  var headers = REQUIRED_SHEETS["Students"];
  var updatedRow = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    updatedRow.push(student[key] !== undefined ? student[key] : "");
  }

  if (targetRowIdx > -1) {
    sheet.getRange(targetRowIdx, 1, 1, headers.length).setValues([updatedRow]);
    return { success: true, message: "Student row updated in Google Sheet." };
  } else {
    sheet.appendRow(updatedRow);
    return { success: true, message: "Student appended to Google Sheet." };
  }
}

function saveFeeRecord(ss, fee) {
  var sheet = ss.getSheetByName("Fees");
  if (!sheet || !fee) return { success: false, message: "Fee sheet not found" };

  var headers = REQUIRED_SHEETS["Fees"];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    row.push(fee[key] !== undefined ? fee[key] : "");
  }
  sheet.appendRow(row);
  logActivity(ss, "ADMIN", "SAVE_FEE", "FEES", fee.fee_id, "SUCCESS", "Collected fee ₹" + fee.paid_amount + " for " + fee.student_name);
  return { success: true, message: "Fee receipt saved to Google Sheet.", receipt: fee.receipt_number };
}

function saveAttendanceRecords(ss, records, cls, sec, date, markedBy) {
  var sheet = ss.getSheetByName("Attendance");
  if (!sheet) return { success: false, message: "Attendance sheet not found" };

  var now = new Date().toISOString();
  if (Array.isArray(records)) {
    for (var i = 0; i < records.length; i++) {
      var item = records[i];
      sheet.appendRow([
        "ATT-" + Date.now() + "-" + i,
        item.student_id,
        date || item.date || now.split("T")[0],
        cls || item.class || "",
        sec || item.section || "",
        item.status || "P",
        true,
        markedBy || "Admin",
        now,
        now
      ]);
    }
  }
  return { success: true, message: "Attendance records saved to Google Sheet." };
}

function saveNoticeRecord(ss, notice) {
  var sheet = ss.getSheetByName("Notices");
  if (!sheet || !notice) return { success: false, message: "Notices sheet not found" };

  var headers = REQUIRED_SHEETS["Notices"];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    row.push(notice[key] !== undefined ? notice[key] : "");
  }
  sheet.appendRow(row);
  return { success: true, message: "Notice saved to Google Sheet." };
}

function deleteNoticeRecord(ss, noticeId) {
  var sheet = ss.getSheetByName("Notices");
  if (!sheet || !noticeId) return { success: false, message: "Notice not found" };
  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    if (data[r][0] === noticeId) {
      sheet.deleteRow(r + 1);
      return { success: true, message: "Notice deleted from Google Sheet." };
    }
  }
  return { success: false, message: "Notice ID not found." };
}

function saveTeacherRecord(ss, teacher) {
  var sheet = ss.getSheetByName("Teachers");
  if (!sheet || !teacher) return { success: false, message: "Teachers sheet not found" };

  var headers = REQUIRED_SHEETS["Teachers"];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    row.push(teacher[key] !== undefined ? teacher[key] : "");
  }
  sheet.appendRow(row);
  return { success: true, message: "Teacher saved to Google Sheet." };
}

function saveClassRecord(ss, classItem) {
  var sheet = ss.getSheetByName("Classes");
  if (!sheet || !classItem) return { success: false, message: "Classes sheet not found" };

  var headers = REQUIRED_SHEETS["Classes"];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    var val = classItem[key];
    if (Array.isArray(val)) val = val.join(", ");
    row.push(val !== undefined ? val : "");
  }
  sheet.appendRow(row);
  return { success: true, message: "Class saved to Google Sheet." };
}

function updateSettingsData(ss, settings) {
  var sheet = ss.getSheetByName("Settings");
  if (!sheet || !settings) return { success: false, message: "Settings sheet not found" };

  var existing = {};
  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    existing[data[r][0]] = r + 1;
  }

  for (var k in settings) {
    if (existing[k]) {
      sheet.getRange(existing[k], 2).setValue(settings[k]);
    } else {
      sheet.appendRow([k, settings[k]]);
    }
  }
  return { success: true, message: "Settings updated in Google Sheet." };
}

function logMessageRecord(ss, msg) {
  var sheet = ss.getSheetByName("MessageLogs");
  if (!sheet || !msg) return { success: false };
  var headers = REQUIRED_SHEETS["MessageLogs"];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    row.push(msg[headers[i]] !== undefined ? msg[headers[i]] : "");
  }
  sheet.appendRow(row);
  return { success: true };
}

function getSheetObjects(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var result = [];
  for (var r = 1; r < values.length; r++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      obj[headers[c]] = values[r][c];
    }
    result.push(obj);
  }
  return result;
}

function getSettingsObject(ss) {
  var sheet = ss.getSheetByName("Settings");
  if (!sheet || sheet.getLastRow() <= 1) return DEFAULT_SETTINGS;
  var values = sheet.getDataRange().getValues();
  var obj = {};
  for (var r = 1; r < values.length; r++) {
    obj[values[r][0]] = values[r][1];
  }
  return obj;
}

/**
 * Upload student photo to Google Drive
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
    title: "1. Open Google Sheet & Apps Script",
    description: "Create/Open your blank Google Sheet. Click on menu: Extensions > Apps Script (विस्तार > ऍप्स स्क्रिप्ट)."
  },
  {
    step: 2,
    title: "2. Paste the SchoolOS Code",
    description: "Delete any existing code in Code.gs, paste the complete SchoolOS script above, and press Ctrl+S (Save)."
  },
  {
    step: 3,
    title: "3. Deploy as Web App (Crucial Step)",
    description: "Click Deploy (डिप्लॉय) > New deployment > Select 'Web app'. Set 'Execute as': Me and 'Who has access': Anyone. Click Deploy & Authorize access."
  },
  {
    step: 4,
    title: "4. Paste Web App URL in SchoolOS Settings",
    description: "Copy your generated Web App URL (starts with https://script.google.com/...) and paste it in SchoolOS Settings > Google Apps Script Web App URL."
  },
  {
    step: 5,
    title: "5. Auto-Create 12 Tabs",
    description: "Inside your Google Sheet, click the new top menu: '🚀 SchoolOS Database' > '✨ Initialize All Database Tables'. All 12 tabs with headers are created in 1 second!"
  }
];

export const GAS_TEMPLATE_CODE = GOOGLE_APPS_SCRIPT_CODE;
