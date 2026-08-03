'use client';

import React, { useState } from 'react';
import { PhoneCall, Bot, Sparkles, CheckCircle2, Mic, Play, Volume2, ShieldCheck, ArrowRight, Code } from 'lucide-react';

export default function VoiceAgentDemo() {
  const [testPhone, setTestPhone] = useState('');
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) return;

    setLoading(true);
    setCallStatus(null);

    try {
      const res = await fetch('/api/voice-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule_call',
          phone: testPhone,
          callDetails: {
            summary: 'Simulated preview call for prospective student',
            status: 'queued',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCallStatus(`🤖 AI Voice Counselor dispatching call to ${testPhone}... [Status: AI_CALL_QUEUED]`);
      } else {
        setCallStatus('Failed to trigger voice agent call preview.');
      }
    } catch (error) {
      setCallStatus('Error connecting to Voice Agent API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="voice-agent" className="py-24 bg-slate-950 relative overflow-hidden border-t border-b border-slate-800">
      
      {/* Background ambient glow */}
      <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Next-Gen Extension
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Integrated <span className="gradient-text">AI Voice Counseling Agent</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Registered students receive automated voice calls powered by conversational AI. The agent answers course queries, details syllabus highlights, and books counselling appointments into Google Sheets automatically.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: AI Capabilities & Flow */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">How the AI Voice Agent Operates</h3>
                  <p className="text-xs text-slate-400">Integrated via /api/voice-agent backend webhooks</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-indigo-700">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Instant Lead Synchronization</h4>
                    <p className="text-xs text-slate-400">
                      As soon as a student registers, their profile (Name, Phone, Course Goal) is indexed by the AI backend.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-950 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-purple-700">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Natural Conversational Phone Call</h4>
                    <p className="text-xs text-slate-400">
                      The Voice Agent initiates a phone call, greets the student by name, and addresses their specific learning goals in human-like voice.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-cyan-700">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Appointment & Query Resolution</h4>
                    <p className="text-xs text-slate-400">
                      Schedules live 1-on-1 counselor meetings and appends call transcripts back to the master database.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Live Interactive Call Simulator */}
          <div className="lg:col-span-6">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-purple-500/30 glow-purple shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-sm font-bold text-white">AI Voice Dispatcher</span>
                </div>
                <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-3 py-1 rounded-md border border-purple-800">
                  /api/voice-agent
                </span>
              </div>

              {/* Simulated Audio Call Visualizer */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-purple-600/30 text-purple-300">
                      <Mic className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Sample Voice Audio</p>
                      <p className="text-sm font-bold text-white">Course Counselor AI Agent</p>
                    </div>
                  </div>
                  <Volume2 className="w-5 h-5 text-indigo-400" />
                </div>

                {/* Animated Voice Waveform bars */}
                <div className="flex items-center justify-center gap-1.5 h-10 py-1">
                  {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 30, 65, 85, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  "Hello Alex! I see you registered for the Artificial Intelligence Masterclass. Our upcoming batch includes hands-on LLM projects. Would 4 PM work for your counseling session?"
                </p>
              </div>

              {/* Test Phone Trigger Form */}
              <form onSubmit={handleSimulateCall} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Test AI Voice Call Trigger (Demo)
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="Enter phone number (+1 555 0192)"
                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="gradient-button text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Trigger AI Call</span>
                  </button>
                </div>
              </form>

              {callStatus && (
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800 text-xs text-purple-200 font-mono">
                  {callStatus}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
