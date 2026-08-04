import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session_token';
const VALID_TOKEN_VALUE = 'eduai_admin_session_active_v1';

export interface SnapServeAgent {
  id: number;
  name: string;
  agentMode: string;
  agentType: string;
  description: string;
  status: string;
  asrProvider: string;
  asrModel: string;
  asrLanguage: string;
  asrBackgroundDenoising: boolean;
  llmProvider: string;
  llmModel: string;
  ttsProvider: string;
  ttsVoice: string;
  ttsModel: string;
  telephonyProvider: string;
  systemPrompt: string;
  temperature: number;
  maxDuration: number;
  greetingMessage: string;
  firstSpeaker: string;
  endCallPhrases: string;
  silenceTimeoutSeconds: number;
  language: string;
  backchannelingEnabled: boolean;
  noiseCancellationEnabled: boolean;
  inactivityMessage: string;
  maxConcurrentCalls: number;
  monthlySpendLimitCents: number;
  stagedPromptEnabled: boolean;
  inboundPhoneNumberId: number;
  outboundPhoneNumberId: number;
  totalCalls: number;
  successfulCalls: number;
  avgDurationSeconds: number;
  avgSttLatencyMs: number;
  avgLlmLatencyMs: number;
  avgTtsFirstChunkMs: number;
  createdAt: string;
  updatedAt: string;
}

const MOCK_AGENTS: SnapServeAgent[] = [
  {
    id: 101,
    name: 'EduAI Admissions Assistant',
    agentMode: 'managed',
    agentType: 'general',
    description: 'Handles student inquiries about course details, fee structures, and enrollment requirements.',
    status: 'active',
    asrProvider: 'deepgram',
    asrModel: 'nova-2',
    asrLanguage: 'en-US',
    asrBackgroundDenoising: true,
    llmProvider: 'openai',
    llmModel: 'gpt-4o',
    ttsProvider: 'elevenlabs',
    ttsVoice: 'rachel_professional',
    ttsModel: 'eleven_multilingual_v2',
    telephonyProvider: 'twilio',
    systemPrompt: 'You are Rachel, an enthusiastic admissions counselor at EduAI Academy. Your goal is to explain course structures and guide prospective students to register.',
    temperature: 0.7,
    maxDuration: 600,
    greetingMessage: "Hello! Thank you for calling EduAI Academy admissions. I'm Rachel, your AI counselor. How can I help you today?",
    firstSpeaker: 'assistant',
    endCallPhrases: 'goodbye, bye, talk to you later',
    silenceTimeoutSeconds: 8,
    language: 'en-US',
    backchannelingEnabled: true,
    noiseCancellationEnabled: true,
    inactivityMessage: 'Are you still there? I can help you with course fees or syllabus details.',
    maxConcurrentCalls: 10,
    monthlySpendLimitCents: 5000,
    stagedPromptEnabled: false,
    inboundPhoneNumberId: 201,
    outboundPhoneNumberId: 202,
    totalCalls: 124,
    successfulCalls: 118,
    avgDurationSeconds: 142,
    avgSttLatencyMs: 180,
    avgLlmLatencyMs: 410,
    avgTtsFirstChunkMs: 250,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-08-04T12:00:00.000Z',
  },
  {
    id: 102,
    name: 'AI Coding Tutor',
    agentMode: 'managed',
    agentType: 'general',
    description: 'Assists students in Python, Next.js, and SQL coding exercises. Features real-time debugging advice.',
    status: 'active',
    asrProvider: 'assemblyai',
    asrModel: 'conformer-2',
    asrLanguage: 'en-US',
    asrBackgroundDenoising: true,
    llmProvider: 'anthropic',
    llmModel: 'claude-3-5-sonnet',
    ttsProvider: 'elevenlabs',
    ttsVoice: 'adam_tutor',
    ttsModel: 'eleven_turbo_v2',
    telephonyProvider: 'vonage',
    systemPrompt: 'You are Adam, a friendly AI programming coach. Walk students through their coding issues step by step. Do not just give them the code; explain the concepts.',
    temperature: 0.5,
    maxDuration: 900,
    greetingMessage: "Hey! I'm Adam, your AI Coding Tutor. Stuck on some code? Let's fix it together!",
    firstSpeaker: 'assistant',
    endCallPhrases: 'done, fixed, see ya',
    silenceTimeoutSeconds: 10,
    language: 'en-US',
    backchannelingEnabled: true,
    noiseCancellationEnabled: true,
    inactivityMessage: 'What line of code are we looking at right now?',
    maxConcurrentCalls: 5,
    monthlySpendLimitCents: 3000,
    stagedPromptEnabled: false,
    inboundPhoneNumberId: 301,
    outboundPhoneNumberId: 302,
    totalCalls: 89,
    successfulCalls: 82,
    avgDurationSeconds: 185,
    avgSttLatencyMs: 220,
    avgLlmLatencyMs: 650,
    avgTtsFirstChunkMs: 280,
    createdAt: '2026-07-15T14:30:00.000Z',
    updatedAt: '2026-08-03T18:00:00.000Z',
  },
  {
    id: 103,
    name: 'Support Coordinator',
    agentMode: 'managed',
    agentType: 'general',
    description: 'Directs technical complaints, billing queries, and schedules human staff callbacks.',
    status: 'inactive',
    asrProvider: 'google-speech',
    asrModel: 'chirp',
    asrLanguage: 'en-US',
    asrBackgroundDenoising: false,
    llmProvider: 'google',
    llmModel: 'gemini-1.5-pro',
    ttsProvider: 'playht',
    ttsVoice: 'susan_support',
    ttsModel: 'playht_v2',
    telephonyProvider: 'twilio',
    systemPrompt: 'You are Susan, a support specialist. Determine if the call is technical or financial, collect details, and offer callback scheduling.',
    temperature: 0.2,
    maxDuration: 400,
    greetingMessage: 'Hello, this is Susan. How can I assist you with your support inquiry today?',
    firstSpeaker: 'assistant',
    endCallPhrases: 'thank you, bye',
    silenceTimeoutSeconds: 6,
    language: 'en-US',
    backchannelingEnabled: false,
    noiseCancellationEnabled: true,
    inactivityMessage: 'Are you still experiencing the login issue?',
    maxConcurrentCalls: 2,
    monthlySpendLimitCents: 1500,
    stagedPromptEnabled: false,
    inboundPhoneNumberId: 401,
    outboundPhoneNumberId: 0,
    totalCalls: 45,
    successfulCalls: 38,
    avgDurationSeconds: 98,
    avgSttLatencyMs: 190,
    avgLlmLatencyMs: 520,
    avgTtsFirstChunkMs: 310,
    createdAt: '2026-07-20T09:15:00.000Z',
    updatedAt: '2026-07-29T10:00:00.000Z',
  }
];

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    // Allow local development without cookie for easier testing
    if (token !== VALID_TOKEN_VALUE) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized access. Please log in.' },
          { status: 401 }
        );
      }
    }

    const snapserveToken = process.env.SNAPSERVE_API_TOKEN;

    if (!snapserveToken) {
      console.warn('⚠️ SNAPSERVE_API_TOKEN is not defined in environment. Serving mock agents.');
      return NextResponse.json({
        success: true,
        source: 'mock',
        count: MOCK_AGENTS.length,
        agents: MOCK_AGENTS,
      });
    }

    try {
      const response = await fetch('https://app.snapserve.ai/api/agents', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${snapserveToken}`,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const agents = await response.json();
        // If SnapServe returns a valid agent list, return it
        if (Array.isArray(agents)) {
          return NextResponse.json({
            success: true,
            source: 'live',
            count: agents.length,
            agents,
          });
        }
      }

      console.warn(`⚠️ SnapServe API returned status ${response.status}. Serving mock agents.`);
    } catch (fetchErr) {
      console.error('❌ Failed to fetch from SnapServe API, using mock fallback:', fetchErr);
    }

    // Default fallback
    return NextResponse.json({
      success: true,
      source: 'mock',
      count: MOCK_AGENTS.length,
      agents: MOCK_AGENTS,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}
