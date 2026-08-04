import { NextRequest, NextResponse } from 'next/server';
import { enrollmentSchema } from '../../../lib/validations';
import { appendEnrollmentToSheet } from '../../../lib/googleSheets';
import { triggerSnapServeCall } from '../../../lib/snapServe';

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: 'Use POST to submit an enrollment request.',
      acceptedMethods: ['POST'],
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      body = await request.json();
    }

    // 1. Server-side validation using Zod
    const validationResult = enrollmentSchema.safeParse(body);

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // 2. Save enrollment to the database / fallback path
    const sheetResult = await appendEnrollmentToSheet(validatedData);

    // 3. Trigger backend call via SnapServe API
    const snapServeResult = await triggerSnapServeCall({
      agentId: Number(process.env.SNAPSERVE_AGENT_ID ?? 0),
      toNumber: validatedData.phone,
      webhookBaseUrl: process.env.SNAPSERVE_WEBHOOK_BASE_URL ?? '',
      metadata: {
        student_name: validatedData.studentName,
        email: validatedData.email,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for registering. Your details are saved to the database.',
        mode: sheetResult.mode,
        details: sheetResult.message,
        callTrigger: snapServeResult,
        timestamp: sheetResult.record.timestamp,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API Error in /api/enroll:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error. Please try again later.',
      },
      { status: 500 }
    );
  }
}
