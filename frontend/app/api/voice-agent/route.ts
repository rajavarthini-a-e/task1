import { NextRequest, NextResponse } from 'next/server';
import { getEnrollmentLeads } from '../../../lib/googleSheets';
import { voiceAgentQuerySchema } from '../../../lib/validations';
import { appendCallLog } from '../../../lib/callLogs';

/**
 * GET /api/voice-agent
 * Allows the AI Voice Agent to retrieve lead details by email or phone number.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');

  const leads = await getEnrollmentLeads();

  if (phone || email) {
    const matchedLead = leads.find(
      (l) =>
        (phone && l.phone.includes(phone)) ||
        (email && l.email.toLowerCase() === email.toLowerCase())
    );

    if (matchedLead) {
      return NextResponse.json({
        found: true,
        lead: {
          studentName: matchedLead.studentName,
          email: matchedLead.email,
          phone: matchedLead.phone,
          courseInterested: matchedLead.courseInterested,
          qualification: matchedLead.qualification,
          learningGoal: matchedLead.learningGoal,
          registrationTimestamp: matchedLead.timestamp,
        },
        voiceScriptContext: `Hello ${matchedLead.studentName}, thank you for your interest in our ${matchedLead.courseInterested} program at EduAI Academy! I see your goal is: "${matchedLead.learningGoal}". Would you like to schedule a 1-on-1 counseling appointment?`,
      });
    }

    return NextResponse.json(
      { found: false, message: 'No registered student lead found with provided details.' },
      { status: 444 }
    );
  }

  // Return list of leads for AI Voice Agent call queue
  return NextResponse.json({
    success: true,
    totalLeads: leads.length,
    leads: leads.map((l) => ({
      name: l.studentName,
      phone: l.phone,
      course: l.courseInterested,
    })),
  });
}

/**
 * POST /api/voice-agent
 * Endpoint for AI Voice Agent webhooks to trigger calls or update call counseling status.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = voiceAgentQuerySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid AI Voice Agent query payload', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { action, phone, email, callDetails } = parseResult.data;

    if (action === 'schedule_call') {
      return NextResponse.json({
        success: true,
        status: 'AI_CALL_QUEUED',
        message: `Automated AI Voice Counseling call scheduled for ${phone || email}.`,
        agentConfiguration: {
          voiceId: 'eleven_labs_rachel_professional',
          greeting: 'Hello, this is Alex from EduAI Academy. I noticed your recent enrollment query!',
          targetPhone: phone,
          context: callDetails,
        },
      });
    }

    if (action === 'log_call_summary') {
      console.log('📞 [AI Voice Agent Call Summary Logged]:', callDetails);

      const summaryStr = callDetails?.summary || 'AI Voice Counseling call completed.';
      const statusStr = (callDetails?.status || 'completed') as any;

      await appendCallLog({
        agentId: 101, // default counselor agent
        toNumber: phone || 'Unknown',
        fromNumber: 'AI Voice Counselor',
        status: statusStr,
        durationSeconds: 120, // default counseling call duration
        costCents: 18,
        summary: summaryStr,
        recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        transcript: [
          { sender: 'assistant', text: 'Hello, this is Alex from EduAI Academy. I noticed your recent enrollment query!' },
          { sender: 'user', text: 'Yes, hi Alex. I had some questions about the courses.' },
          { sender: 'assistant', text: `Sure. We logged the following summary of our conversation: ${summaryStr}` }
        ]
      });

      return NextResponse.json({
        success: true,
        message: 'Counseling call transcript & summary logged successfully.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Voice Agent action processed successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Voice Agent Handler Error' },
      { status: 500 }
    );
  }
}
