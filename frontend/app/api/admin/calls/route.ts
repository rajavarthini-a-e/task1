import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCallLogs } from '../../../../lib/callLogs';

const COOKIE_NAME = 'admin_session_token';
const VALID_TOKEN_VALUE = 'eduai_admin_session_active_v1';

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

    const logs = await getCallLogs(isNaN(agentId as number) ? undefined : agentId);

    return NextResponse.json({
      success: true,
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
