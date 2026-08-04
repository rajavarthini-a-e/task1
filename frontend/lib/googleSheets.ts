import { google } from 'googleapis';
import { appendEnrollmentToDatabase, getEnrollmentLeadsFromDatabase } from './database';
import { EnrollmentFormData } from './validations';

export interface EnrollmentRecord extends EnrollmentFormData {
  timestamp: string;
}

const localFallbackStore: EnrollmentRecord[] = [];

function getGoogleSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function appendEnrollmentToSheet(data: EnrollmentFormData): Promise<{
  success: boolean;
  mode: 'database' | 'google_sheets' | 'fallback_demo';
  message: string;
  record: EnrollmentRecord;
}> {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
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
      // continue
    }

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

    localFallbackStore.push(record);

    return {
      success: true,
      mode: 'google_sheets',
      message: 'Successfully saved registration to Google Sheets.',
      record,
    };
  } catch (error: any) {
    localFallbackStore.push(record);
    return {
      success: true,
      mode: 'fallback_demo',
      message: `Registration saved locally. (Google Sheets sync error: ${error?.message || 'Check credentials'})`,
      record,
    };
  }
}

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
    return localFallbackStore;
  }
}
