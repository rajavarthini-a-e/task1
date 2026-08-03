import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📩 SnapServe webhook received:', body);

    // Add handling logic here if you want to persist webhook payloads or trigger actions.
    // Example: persist to a log table, notify staff, or update lead status.

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('SnapServe webhook error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to parse webhook payload' },
      { status: 400 }
    );
  }
}
