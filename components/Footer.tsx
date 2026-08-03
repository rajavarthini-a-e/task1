'use client';

import React from 'react';
import { Bot, Github, Twitter, Linkedin, Youtube, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Edu<span className="gradient-text">AI</span> Academy
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering engineers and career switchers worldwide with hands-on, production-grade education in Artificial Intelligence, Data Science, Machine Learning, and Full Stack Development.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Courses</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#courses" className="hover:text-indigo-400 transition-colors">Artificial Intelligence</a></li>
              <li><a href="#courses" className="hover:text-indigo-400 transition-colors">Data Science Professional</a></li>
              <li><a href="#courses" className="hover:text-indigo-400 transition-colors">Machine Learning Eng</a></li>
              <li><a href="#courses" className="hover:text-indigo-400 transition-colors">Full Stack Web Dev</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-indigo-400 transition-colors">Overview</a></li>
              <li><a href="#enroll" className="hover:text-indigo-400 transition-colors">Student Enrollment</a></li>
              <li><a href="#voice-agent" className="hover:text-indigo-400 transition-colors">AI Voice Agent</a></li>
              <li><a href="#contact" className="hover:text-indigo-400 transition-colors">Admissions Counseling</a></li>
            </ul>
          </div>

          {/* Legal / Integration */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Integrations</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-emerald-400">✓ Google Sheets API</span></li>
              <li><span className="text-purple-400">✓ AI Voice Webhooks</span></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduAI Academy Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
