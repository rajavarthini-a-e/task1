import { NextResponse } from 'next/server';
import { getEnrollmentLeadsFromDatabase } from '../../../lib/database';

export async function GET() {
  try {
    const leads = await getEnrollmentLeadsFromDatabase();
    return NextResponse.json({ success: true, count: leads.length, submissions: leads });
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Unable to retrieve submissions' },
      { status: 500 }
    );
  }
}
