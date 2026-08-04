import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getEnrollmentLeads, EnrollmentRecord } from '@/lib/googleSheets';

const COOKIE_NAME = 'admin_session_token';
const VALID_TOKEN_VALUE = 'eduai_admin_session_active_v1';

// Seed sample leads if no leads exist yet, to ensure a rich demo experience
const DEMO_SEED_LEADS: EnrollmentRecord[] = [
  {
    timestamp: 'Aug 4, 2026, 11:30:00 AM',
    studentName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    courseInterested: 'Artificial Intelligence Masterclass',
    qualification: "Bachelor's Degree (Undergraduate)",
    learningGoal: 'I want to master LLM fine-tuning and agentic AI frameworks to advance my career.',
  },
  {
    timestamp: 'Aug 4, 2026, 10:15:22 AM',
    studentName: 'Priya Patel',
    email: 'priya.patel@techcorp.io',
    phone: '+91 98123 76543',
    courseInterested: 'Machine Learning Engineering',
    qualification: 'Working Professional',
    learningGoal: 'Transitioning from data analyst to senior ML engineer building production RAG pipelines.',
  },
  {
    timestamp: 'Aug 3, 2026, 05:45:10 PM',
    studentName: 'Rohan Verma',
    email: 'rohan.v@university.edu',
    phone: '+91 97654 32109',
    courseInterested: 'Data Science & Analytics Professional',
    qualification: "Bachelor's Degree (Undergraduate)",
    learningGoal: 'Preparing for data analyst campus placements and capstone project build.',
  },
  {
    timestamp: 'Aug 3, 2026, 02:20:00 PM',
    studentName: 'Ananya Gupta',
    email: 'ananya.g@gmail.com',
    phone: '+91 99887 66554',
    courseInterested: 'Full Stack Web Development',
    qualification: 'High School / 12th Grade',
    learningGoal: 'Building modern AI-powered Next.js applications and SaaS products.',
  },
];

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (token !== VALID_TOKEN_VALUE) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access. Please log in.' },
        { status: 401 }
      );
    }

    const liveLeads = await getEnrollmentLeads();
    
    // Combine live leads with demo seed leads if list is short
    const leads = [...liveLeads];
    if (leads.length === 0) {
      leads.push(...DEMO_SEED_LEADS);
    }

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch enrollment leads' },
      { status: 500 }
    );
  }
}
