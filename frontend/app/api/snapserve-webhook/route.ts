import { NextRequest, NextResponse } from 'next/server';
import { appendCallLog, parseTranscript } from '../../../lib/callLogs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📩 SnapServe webhook received:', body);

    const duration = Number(body.durationSeconds || body.duration || 0);
    const cost = Number(body.costCents || body.cost || Math.round(duration * 0.15));

    await appendCallLog({
      agentId: Number(body.agentId || 101),
      agentName: body.agentName || 'SnapServe AI Agent',
      toNumber: body.toNumber || body.phone || 'Unknown',
      fromNumber: body.fromNumber || 'Inbound Caller',
      callType: body.direction === 'outbound' ? (body.campaignId ? 'Campaign' : 'Outbound') : 'Inbound',
      status: body.status || 'completed',
      durationSeconds: duration,
      costCents: cost,
      summary: body.callSummary || body.summary || 'Call processed via automated agent webhook.',
      recordingUrl: body.recordingUrl || body.recording || '',
      transcript: parseTranscript(body.transcript),
    });

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('SnapServe webhook error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to parse webhook payload' },
      { status: 400 }
    );
  }
}

