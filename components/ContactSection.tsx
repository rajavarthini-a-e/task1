'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Globe } from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" /> Support & Admissions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get in Touch with Our <span className="gradient-text">Academic Counselors</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Have questions about course syllabus, batch timings, installment options, or job placement assistance? Reach out to us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Email Admissions</h4>
                <p className="text-xs text-slate-400 mt-1">Direct query resolution within 2 hours</p>
                <a href="mailto:admissions@eduai-academy.com" className="text-sm font-semibold text-indigo-400 hover:underline mt-2 inline-block">
                  admissions@eduai-academy.com
                </a>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Student Helpline</h4>
                <p className="text-xs text-slate-400 mt-1">Monday – Saturday: 9:00 AM – 8:00 PM EST</p>
                <a href="tel:+18005553382" className="text-sm font-semibold text-purple-400 hover:underline mt-2 inline-block">
                  +1 (800) 555-EDUAI (+1 800 555 3382)
                </a>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-600/20 text-cyan-400 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Global Headquarters</h4>
                <p className="text-xs text-slate-400 mt-1">EduAI Innovation Campus, Tech Park Drive</p>
                <p className="text-sm font-medium text-slate-300 mt-1">San Francisco, CA 94107</p>
              </div>
            </div>

          </div>

          {/* Right: Quick Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Send Us a Direct Message</h3>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-950/80 border border-emerald-700 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Message Sent Successfully!</h4>
                  <p className="text-xs text-emerald-200">Our support team will respond to your email shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Email</label>
                      <input
                        type="email"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                    <input
                      type="text"
                      required
                      value={contactData.subject}
                      onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                      placeholder="Course fees inquiry / Batch schedule"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      placeholder="Write your question here..."
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full gradient-button text-white text-sm font-semibold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
