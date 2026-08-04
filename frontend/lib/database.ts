import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { EnrollmentFormData } from './validations';

export interface EnrollmentRecord extends EnrollmentFormData {
  timestamp: string;
}

// Local File Fallback Configuration
const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'enrollments.json');

function ensureLocalDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]), 'utf8');
  }
}

// PostgreSQL Connection Pool (lazy initialization)
let pool: Pool | null = null;

function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Required for Neon serverless connections
      }
    });
  }
  return pool;
}

// Auto-run schema initialization
async function initDatabaseSchema() {
  const dbPool = getDbPool();
  if (!dbPool) return;

  try {
    const client = await dbPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS enrollments (
          id SERIAL PRIMARY KEY,
          student_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          course_interested TEXT NOT NULL,
          qualification TEXT NOT NULL,
          learning_goal TEXT,
          timestamp TEXT NOT NULL
        )
      `);
      console.log('✅ PostgreSQL "enrollments" table checked/created.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Failed to initialize database schema:', err);
  }
}

// Initialize database schema asynchronously when module loads
if (typeof process !== 'undefined' && process.env.DATABASE_URL) {
  initDatabaseSchema().catch(console.error);
}

export async function appendEnrollmentToDatabase(
  data: EnrollmentFormData,
  timestamp: string
): Promise<EnrollmentRecord | null> {
  const dbPool = getDbPool();
  
  if (dbPool) {
    try {
      const client = await dbPool.connect();
      try {
        const queryText = `
          INSERT INTO enrollments (student_name, email, phone, course_interested, qualification, learning_goal, timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;
        const values = [
          data.studentName,
          data.email,
          data.phone,
          data.courseInterested,
          data.qualification,
          data.learningGoal || '',
          timestamp
        ];
        
        const res = await client.query(queryText, values);
        const row = res.rows[0];
        
        return {
          studentName: row.student_name,
          email: row.email,
          phone: row.phone,
          courseInterested: row.course_interested,
          qualification: row.qualification,
          learningGoal: row.learning_goal,
          timestamp: row.timestamp
        };
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('PostgreSQL appendEnrollmentToDatabase error, falling back to local file:', err);
    }
  }

  // Local File Fallback
  try {
    ensureLocalDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    const items: EnrollmentRecord[] = JSON.parse(raw || '[]');
    const record: EnrollmentRecord = { timestamp, ...data };
    items.unshift(record);
    fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), 'utf8');
    return record;
  } catch (err) {
    console.error('Local file appendEnrollmentToDatabase error:', err);
    return null;
  }
}

export async function getEnrollmentLeadsFromDatabase(): Promise<EnrollmentRecord[]> {
  const dbPool = getDbPool();
  
  if (dbPool) {
    try {
      const client = await dbPool.connect();
      try {
        const res = await client.query('SELECT * FROM enrollments ORDER BY id DESC');
        return res.rows.map((row) => ({
          studentName: row.student_name,
          email: row.email,
          phone: row.phone,
          courseInterested: row.course_interested,
          qualification: row.qualification,
          learningGoal: row.learning_goal,
          timestamp: row.timestamp
        }));
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('PostgreSQL getEnrollmentLeadsFromDatabase error, falling back to local file:', err);
    }
  }

  // Local File Fallback
  try {
    ensureLocalDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    const items: EnrollmentRecord[] = JSON.parse(raw || '[]');
    return items;
  } catch (err) {
    console.error('Local file getEnrollmentLeadsFromDatabase error:', err);
    return [];
  }
}
