'use client';

import React from 'react';
import { ArrowRight, Sparkles, Code2, Brain, Database, CheckCircle2, ShieldCheck, Users, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-hero-pattern">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Next-Generation Online Academy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 text-xs">Batch 2026 Open</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Upgrade Your Skills with{' '}
              <span className="gradient-text">Industry Ready Courses</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Master high-demand tech fields with live hands-on projects in{' '}
              <span className="text-indigo-400 font-semibold">Artificial Intelligence</span>,{' '}
              <span className="text-purple-400 font-semibold">Data Science</span>,{' '}
              <span className="text-cyan-400 font-semibold">Machine Learning</span>, and{' '}
              <span className="text-emerald-400 font-semibold">Full Stack Development</span>. 
              Accelerate your career with 1-on-1 industry mentorship and automated counseling.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#enroll"
                className="w-full sm:w-auto gradient-button text-white text-base font-semibold px-8 py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 group"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#courses"
                className="w-full sm:w-auto glass-card hover:bg-slate-800/60 text-slate-200 text-base font-semibold px-6 py-4 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <span>Explore Curriculum</span>
              </a>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-white font-bold text-base">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-slate-400">Student Satisfaction</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-emerald-400">
                  <Users className="w-4 h-4" />
                  <span className="text-white font-bold text-base">12,500+</span>
                </div>
                <p className="text-xs text-slate-400">Enrolled Learners</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-white font-bold text-base">94%</span>
                </div>
                <p className="text-xs text-slate-400">Career Transition</p>
              </div>
            </div>

          </div>

          {/* Right Hero Graphic & Floating Tech Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Central Code Card */}
              <div className="glass-card rounded-2xl p-6 glow-purple relative z-10 border border-slate-700/60">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-md border border-indigo-800/40">
                    EduAI-Kernel.py
                  </span>
                </div>

                <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
                  <code>{`# EduAI Academy Learning Pipeline
import eduai_sdk as edu

student = edu.Student(
    name="Future Tech Leader",
    track="AI & Data Science"
)

pipeline = edu.LearningPath([
    "Generative AI & LLMs",
    "Deep Learning & PyTorch",
    "Full Stack Cloud Apps"
])

result = student.enroll(pipeline)
print(result.career_ready) # True`}</code>
                </pre>

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Google Sheets API Connected
                  </span>
                  <span className="text-xs font-semibold text-purple-400 bg-purple-950/50 px-2.5 py-1 rounded-md">
                    AI Voice Ready
                  </span>
                </div>
              </div>

              {/* Floating Badge 1: AI Track */}
              <div className="absolute -top-6 -left-6 glass-card p-3.5 rounded-xl flex items-center gap-3 border border-indigo-500/40 shadow-xl hidden sm:flex animate-float">
                <div className="p-2.5 rounded-lg bg-indigo-600/30 text-indigo-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Core Specialization</p>
                  <p className="text-xs font-bold text-white">Artificial Intelligence</p>
                </div>
              </div>

              {/* Floating Badge 2: Data Science */}
              <div className="absolute -bottom-6 -right-6 glass-card p-3.5 rounded-xl flex items-center gap-3 border border-purple-500/40 shadow-xl hidden sm:flex animate-float" style={{ animationDelay: '2s' }}>
                <div className="p-2.5 rounded-lg bg-purple-600/30 text-purple-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Industry Benchmark</p>
                  <p className="text-xs font-bold text-white">Data Science & Analytics</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
