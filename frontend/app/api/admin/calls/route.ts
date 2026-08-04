import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCallLogs, CallRecord } from '../../../../lib/callLogs';

const COOKIE_NAME = 'admin_session_token';
const VALID_TOKEN_VALUE = 'eduai_admin_session_active_v1';

function parseTranscript(rawTranscript: any): Array<{ sender: 'assistant' | 'user'; text: string }> {
  if (Array.isArray(rawTranscript)) {
    return rawTranscript.map((t: any) => ({
      sender: t.sender === 'user' || t.role === 'user' || t.sender === 'caller' ? 'user' : 'assistant',
      text: t.text || t.content || '',
    }));
  }

  if (typeof rawTranscript === 'string') {
    const lines = rawTranscript.split('\n');
    const messages: Array<{ sender: 'assistant' | 'user'; text: string }> = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Match "Agent:", "Assistant:", "Caller:", "User:"
      const match = trimmed.match(/^(agent|assistant|caller|user)\s*:\s*(.*)$/i);
      if (match) {
        const role = match[1].toLowerCase();
        const text = match[2];
        const sender = (role === 'caller' || role === 'user') ? 'user' : 'assistant';
        messages.push({ sender, text });
      } else {
        // If no colon pattern, append to previous message or add as assistant
        if (messages.length > 0) {
          messages[messages.length - 1].text += '\n' + trimmed;
        } else {
          messages.push({ sender: 'assistant', text: trimmed });
        }
      }
    }
    return messages;
  }

  return [];
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (token !== VALID_TOKEN_VALUE) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized access. Please log in.' },
          { status: 401 }
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const agentIdStr = searchParams.get('agentId');
    const agentId = agentIdStr ? parseInt(agentIdStr, 10) : undefined;

    // Fallback to environment variable default if query parameter not specified
    const envAgentId = process.env.SNAPSERVE_AGENT_ID ? parseInt(process.env.SNAPSERVE_AGENT_ID, 10) : undefined;
    const targetAgentId = agentId !== undefined ? agentId : envAgentId;

    const snapserveToken = process.env.SNAPSERVE_API_TOKEN;

    if (snapserveToken) {
      try {
        const response = await fetch('https://app.snapserve.ai/api/calls', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${snapserveToken}`,
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const liveCalls = await response.json();
          if (Array.isArray(liveCalls)) {
            // Map live calls to our schema
            const mappedCalls: CallRecord[] = liveCalls.map((call: any) => {
              const duration = Number(call.durationSeconds || 0);
              const cost = Number(call.costCents || 0);
              
              // Normalize status
              let status: 'completed' | 'failed' | 'no-answer' | 'busy' = 'completed';
              if (call.status === 'no-answer' || call.status === 'no_answer') status = 'no-answer';
              else if (call.status === 'busy') status = 'busy';
              else if (call.status === 'failed' || call.status === 'error') status = 'failed';

              const timestamp = call.createdAt
                ? new Date(call.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })
                : 'N/A';

              let callType = 'Live Call';
              if (call.direction === 'outbound') {
                callType = call.campaignId ? 'Campaign' : 'Outbound';
              } else if (call.direction === 'inbound') {
                callType = 'Inbound';
              }

              return {
                callId: (call.id || call.executionId || String(Math.random())).toString(),
                agentId: Number(call.agentId || 0),
                agentName: call.agentName || 'Unknown Agent',
                toNumber: call.toNumber || 'Unknown',
                fromNumber: call.fromNumber || 'Inbound',
                callType,
                status,
                durationSeconds: duration,
                costCents: cost,
                summary: call.callSummary || 'No summary available.',
                recordingUrl: call.recordingUrl || '',
                transcript: parseTranscript(call.transcript),
                timestamp
              };
            });

            // Filter by agent if specified
            const filteredCalls = targetAgentId !== undefined && !isNaN(targetAgentId)
              ? mappedCalls.filter((c) => c.agentId === targetAgentId)
              : mappedCalls;

            return NextResponse.json({
              success: true,
              source: 'live',
              count: filteredCalls.length,
              calls: filteredCalls,
            });
          }
        }
        console.warn(`⚠️ SnapServe Calls API returned status ${response.status}. Falling back to local logs.`);
      } catch (fetchErr) {
        console.error('❌ Failed to fetch calls from SnapServe API:', fetchErr);
      }
    }

    // Local JSON fallback
    const logs = await getCallLogs(targetAgentId !== undefined && !isNaN(targetAgentId) ? targetAgentId : undefined);

    return NextResponse.json({
      success: true,
      source: 'mock',
      count: logs.length,
      calls: logs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch call logs' },
      { status: 500 }
    );
  }
}
