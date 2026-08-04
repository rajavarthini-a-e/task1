import { NextRequest, NextResponse } from 'next/server';
import { appendCallLog } from '../../../lib/callLogs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📩 SnapServe webhook received:', body);

    // Map webhook payload to CallRecord structure
    let transcriptArr: Array<{ sender: 'assistant' | 'user'; text: string }> = [];
    if (Array.isArray(body.transcript)) {
      transcriptArr = body.transcript.map((t: any) => ({
        sender: t.sender === 'user' || t.role === 'user' ? 'user' : 'assistant',
        text: t.text || t.content || '',
      }));
    } else if (typeof body.transcript === 'string' && body.transcript.trim()) {
      transcriptArr = [
        { sender: 'assistant', text: body.transcript }
      ];
    }

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
      summary: body.summary || 'Call processed via automated agent webhook.',
      recordingUrl: body.recordingUrl || body.recording || '',
      transcript: transcriptArr,
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

