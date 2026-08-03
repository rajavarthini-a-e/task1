import { Pool } from 'pg';
import { EnrollmentFormData } from './validations';

export interface EnrollmentRecord extends EnrollmentFormData {
  timestamp: string;
}

const globalForDb = globalThis as typeof globalThis & {
  dbPool?: Pool;
};

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL && /sslmode=require|ssl=true/i.test(process.env.DATABASE_URL)
      ? { rejectUnauthorized: false }
      : undefined,
};

export const dbPool = globalForDb.dbPool ?? new Pool(poolConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbPool = dbPool;
}

export async function initializeEnrollmentTable() {
  if (!process.env.DATABASE_URL) {
    return;
  }

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS enrollment_leads (
      id SERIAL PRIMARY KEY,
      timestamp TEXT NOT NULL,
      student_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      course_interested TEXT NOT NULL,
      qualification TEXT NOT NULL,
      learning_goal TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function appendEnrollmentToDatabase(
  data: EnrollmentFormData,
  timestamp: string
): Promise<EnrollmentRecord | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  await initializeEnrollmentTable();

  await dbPool.query(
    `
      INSERT INTO enrollment_leads (
        timestamp,
        student_name,
        email,
        phone,
        course_interested,
        qualification,
        learning_goal
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      timestamp,
      data.studentName,
      data.email,
      data.phone,
      data.courseInterested,
      data.qualification,
      data.learningGoal,
    ]
  );

  return {
    timestamp,
    ...data,
  };
}

export async function getEnrollmentLeadsFromDatabase(): Promise<EnrollmentRecord[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  await initializeEnrollmentTable();

  const result = await dbPool.query(`
    SELECT timestamp, student_name, email, phone, course_interested, qualification, learning_goal
    FROM enrollment_leads
    ORDER BY id DESC
  `);

  return result.rows.map((row) => ({
    timestamp: row.timestamp,
    studentName: row.student_name,
    email: row.email,
    phone: row.phone,
    courseInterested: row.course_interested,
    qualification: row.qualification,
    learningGoal: row.learning_goal,
  }));
}
