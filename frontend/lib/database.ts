import fs from 'fs';
import path from 'path';
import { EnrollmentFormData } from './validations';

export interface EnrollmentRecord extends EnrollmentFormData {
  timestamp: string;
}

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'enrollments.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]), 'utf8');
  }
}

export async function appendEnrollmentToDatabase(
  data: EnrollmentFormData,
  timestamp: string
): Promise<EnrollmentRecord | null> {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    const items: EnrollmentRecord[] = JSON.parse(raw || '[]');
    const record: EnrollmentRecord = { timestamp, ...data };
    items.unshift(record);
    fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), 'utf8');
    return record;
  } catch (err) {
    console.error('appendEnrollmentToDatabase error:', err);
    return null;
  }
}

export async function getEnrollmentLeadsFromDatabase(): Promise<EnrollmentRecord[]> {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    const items: EnrollmentRecord[] = JSON.parse(raw || '[]');
    return items;
  } catch (err) {
    console.error('getEnrollmentLeadsFromDatabase error:', err);
    return [];
  }
}
