import fs from 'fs';
import path from 'path';

export interface CallMessage {
  sender: 'assistant' | 'user';
  text: string;
}

export interface CallRecord {
  callId: string;
  agentId: number;
  agentName: string;
  toNumber: string;
  fromNumber: string;
  callType: string;
  status: 'completed' | 'failed' | 'no-answer' | 'busy';
  durationSeconds: number;
  costCents: number;
  transcript: CallMessage[];
  summary: string;
  recordingUrl: string;
  timestamp: string;
}

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'call_logs.json');

const SEED_CALL_LOGS: CallRecord[] = [
  {
    callId: 'call_f12a34b5_1',
    agentId: 101,
    agentName: 'EduAI Admissions Assistant',
    toNumber: '+1 (555) 019-2834',
    fromNumber: '+1 (555) 987-6543',
    callType: 'Campaign',
    status: 'completed',
    durationSeconds: 125,
    costCents: 18,
    summary: 'Customer Aarav Sharma inquired about the AI Masterclass start date (Sept 7) and fee structure ($1200). Undecided on payment plan.',
    recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    timestamp: 'Aug 4, 2026, 11:32:15 AM',
    transcript: [
      { sender: 'assistant', text: "Hello! Thank you for calling EduAI Academy admissions. I'm Rachel, your AI counselor. How can I help you today?" },
      { sender: 'user', text: "Hi, I wanted to ask about the Artificial Intelligence Masterclass. When does the next batch start?" },
      { sender: 'assistant', text: "The next batch for the AI Masterclass starts on Monday, September 7th. Registrations close on August 31st. Would you like me to walk you through the enrollment process?" },
      { sender: 'user', text: "Yes, please. What is the fee structure?" },
      { sender: 'assistant', text: "The masterclass fee is $1,200. We also offer a flexible 3-month installment plan of $420 per month. Do you have any preference for the payment plan?" },
      { sender: 'user', text: "I will think about it and let you know. Thank you for the details." },
      { sender: 'assistant', text: "You're very welcome! Feel free to call back if you have any other questions. Have a great day!" }
    ]
  },
  {
    callId: 'call_f12a34b5_2',
    agentId: 101,
    agentName: 'EduAI Admissions Assistant',
    toNumber: '+1 (555) 014-9988',
    fromNumber: '+1 (555) 234-5678',
    callType: 'Campaign',
    status: 'completed',
    durationSeconds: 92,
    costCents: 12,
    summary: 'Priya Patel inquired about ML prerequisites. Confirmed Python basics is enough. Sent syllabus link to priya.patel@techcorp.io.',
    recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    timestamp: 'Aug 4, 2026, 10:17:40 AM',
    transcript: [
      { sender: 'assistant', text: "Hello! Thank you for calling EduAI Academy admissions. I'm Rachel, your AI counselor. How can I help you today?" },
      { sender: 'user', text: "Hello, I wanted to check if there are any prerequisite skills for the Machine Learning course?" },
      { sender: 'assistant', text: "For the Machine Learning course, basic knowledge of Python and introductory statistics is highly recommended. Are you comfortable with Python?" },
      { sender: 'user', text: "Yes, I am a web developer. I know Python basics." },
      { sender: 'assistant', text: "That is perfect! Your coding background will serve you very well. Let me send a syllabus copy to your email. What is your email address?" },
      { sender: 'user', text: "It is priya.patel@techcorp.io" },
      { sender: 'assistant', text: "Thank you! I have sent the syllabus link to priya.patel@techcorp.io. You should receive it in a few minutes. Is there anything else I can help you with?" },
      { sender: 'user', text: "No, that's all. Thank you." },
      { sender: 'assistant', text: "Glad to help! Have a wonderful day!" }
    ]
  },
  {
    callId: 'call_f12a34b5_3',
    agentId: 101,
    agentName: 'EduAI Admissions Assistant',
    toNumber: '+1 (555) 012-3456',
    fromNumber: '+1 (555) 876-5432',
    callType: 'Inbound',
    status: 'no-answer',
    durationSeconds: 0,
    costCents: 0,
    summary: 'Call unanswered. Customer did not pick up.',
    recordingUrl: '',
    timestamp: 'Aug 3, 2026, 05:46:00 PM',
    transcript: []
  },
  {
    callId: 'call_f12a34b5_4',
    agentId: 102,
    agentName: 'AI Coding Tutor',
    toNumber: '+1 (555) 017-7766',
    fromNumber: '+1 (555) 111-2222',
    callType: 'Live Call',
    status: 'completed',
    durationSeconds: 180,
    costCents: 25,
    summary: 'Student code debugged. Solved React useEffect infinite loop by explaining and adding empty dependency array `[]`.',
    recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    timestamp: 'Aug 3, 2026, 02:22:15 PM',
    transcript: [
      { sender: 'assistant', text: "Hey! I'm Adam, your AI Coding Tutor. Stuck on some code? Let's fix it together!" },
      { sender: 'user', text: "Hi Adam. I'm trying to use React useEffect, but it keeps running in an infinite loop." },
      { sender: 'assistant', text: "Ah, the classic infinite loop! This usually happens when you update a state variable inside useEffect, and that state variable is listed in the dependency array. Can you tell me what your dependency array looks like?" },
      { sender: 'user', text: "I didn't include a dependency array at all." },
      { sender: 'assistant', text: "Aha! That's exactly it. If you don't provide a dependency array, useEffect runs on every single render. When you update state inside it, it triggers a new render, which runs useEffect again, creating a loop. To fix it, add an empty dependency array `[]` if you only want it to run once when the component mounts." },
      { sender: 'user', text: "Oh, that makes sense. Let me add `[]`... Yes, it stopped looping! Thank you!" },
      { sender: 'assistant', text: "Awesome! High five! Let me know if you run into any other React quirks. Happy coding!" }
    ]
  }
];

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(SEED_CALL_LOGS, null, 2), 'utf8');
  }
}

export async function appendCallLog(
  log: Omit<CallRecord, 'callId' | 'timestamp'>
): Promise<CallRecord | null> {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    const items: CallRecord[] = JSON.parse(raw || '[]');
    
    const newRecord: CallRecord = {
      callId: `call_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      ...log
    };
    
    items.unshift(newRecord);
    fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), 'utf8');
    return newRecord;
  } catch (err) {
    console.error('appendCallLog error:', err);
    return null;
  }
}

export async function getCallLogs(agentId?: number): Promise<CallRecord[]> {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    const items: CallRecord[] = JSON.parse(raw || '[]');
    
    if (agentId !== undefined) {
      return items.filter(item => item.agentId === agentId);
    }
    return items;
  } catch (err) {
    console.error('getCallLogs error:', err);
    return [];
  }
}

export function parseTranscript(rawTranscript: any): CallMessage[] {
  if (Array.isArray(rawTranscript)) {
    return rawTranscript.map((t: any) => ({
      sender: t.sender === 'user' || t.role === 'user' || t.sender === 'caller' ? 'user' : 'assistant',
      text: t.text || t.content || '',
    }));
  }

  if (typeof rawTranscript === 'string') {
    const lines = rawTranscript.split('\n');
    const messages: CallMessage[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const match = trimmed.match(/^(agent|assistant|caller|user)\s*:\s*(.*)$/i);
      if (match) {
        const role = match[1].toLowerCase();
        const text = match[2];
        const sender = (role === 'caller' || role === 'user') ? 'user' : 'assistant';
        messages.push({ sender, text });
      } else {
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
