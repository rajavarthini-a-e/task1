import { google } from 'googleapis';
import { appendEnrollmentToDatabase, getEnrollmentLeadsFromDatabase } from './database';
import { EnrollmentFormData } from './validations';

export interface EnrollmentRecord extends EnrollmentFormData {
  timestamp: string;
}

// In-memory fallback buffer for testing prior to configuring Google API keys
const localFallbackStore: EnrollmentRecord[] = [];

/**
 * Gets an authenticated Google Sheets API client using Service Account JWT credentials.
 */
function getGoogleSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Handle potential escaped newline characters in environment variables
  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Appends a new student registration record to Google Sheets.
 * If credentials are missing, saves to fallback memory store with clear logging.
 */
export async function appendEnrollmentToSheet(data: EnrollmentFormData): Promise<{
  success: boolean;
  mode: 'database' | 'google_sheets' | 'fallback_demo';
  message: string;
  record: EnrollmentRecord;
}> {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata', // ISO / Local standard timestamp
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  const record: EnrollmentRecord = {
    timestamp,
    ...data,
  };

  const dbRecord = await appendEnrollmentToDatabase(data, timestamp);
  if (dbRecord) {
    localFallbackStore.push(dbRecord);
    return {
      success: true,
      mode: 'database',
      message: 'Successfully saved registration to the database.',
      record: dbRecord,
    };
  }

  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Student_Enrollments';

  if (!sheets || !spreadsheetId) {
    console.warn(
      '⚠️ [EduAI Google Sheets API] GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SHEET_ID missing in environment variables. Storing in local fallback mode.'
    );
    localFallbackStore.push(record);
    return {
      success: true,
      mode: 'fallback_demo',
      message: 'Registration recorded in local fallback buffer (Configure .env for live Google Sheets sync).',
      record,
    };
  }

  try {
    const range = `${sheetTabName}!A:G`;

    // 1. Ensure header row exists
    try {
      const getRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetTabName}!A1:G1`,
      });

      if (!getRes.data.values || getRes.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetTabName}!A1:G1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              [
                'Timestamp',
                'Student Name',
                'Email',
                'Phone Number',
                'Course Interested',
                'Qualification',
                'Learning Goal',
              ],
            ],
          },
        });
      }
    } catch (headerErr: any) {
      console.info('Notice initializing headers:', headerErr?.message || headerErr);
    }

    // 2. Append the student registration row
    const rowValues = [
      timestamp,
      data.studentName,
      data.email,
      data.phone,
      data.courseInterested,
      data.qualification,
      data.learningGoal,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowValues],
      },
    });

    // Also cache in local buffer for fast lookup
    localFallbackStore.push(record);

    return {
      success: true,
      mode: 'google_sheets',
      message: 'Successfully saved registration to Google Sheets.',
      record,
    };
  } catch (error: any) {
    console.error('❌ [Google Sheets API Error]:', error?.message || error);
    
    // Graceful fallback if Google Sheets call fails (e.g. invalid permissions or bad sheet ID)
    localFallbackStore.push(record);
    return {
      success: true,
      mode: 'fallback_demo',
      message: `Registration saved locally. (Google Sheets sync error: ${error?.message || 'Check credentials'})`,
      record,
    };
  }
}

/**
 * Retrieves all stored enrollment leads (used by AI Voice Agent API integration).
 */
export async function getEnrollmentLeads(): Promise<EnrollmentRecord[]> {
  const databaseLeads = await getEnrollmentLeadsFromDatabase();
  if (databaseLeads.length > 0) {
    return [...databaseLeads, ...localFallbackStore];
  }

  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Student_Enrollments';

  if (!sheets || !spreadsheetId) {
    return localFallbackStore;
  }

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTabName}!A2:G`,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      return localFallbackStore;
    }

    const fetchedRecords: EnrollmentRecord[] = rows.map((row) => ({
      timestamp: row[0] || '',
      studentName: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      courseInterested: row[4] || '',
      qualification: row[5] || '',
      learningGoal: row[6] || '',
    }));

    return [...fetchedRecords, ...localFallbackStore];
  } catch (error) {
    console.error('Error fetching leads from Google Sheets:', error);
    return localFallbackStore;
  }
}
