'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { EnrollmentFormData } from '@/lib/validations';

export default function EnrollmentForm() {
  const [formData, setFormData] = useState<Partial<EnrollmentFormData>>({
    studentName: '',
    email: '',
    phone: '',
    courseInterested: 'Artificial Intelligence Masterclass',
    qualification: "Bachelor's Degree (Undergraduate)",
    learningGoal: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    message: string;
    mode?: string;
    details?: string;
  } | null>(null);

  const coursesList = [
    'Artificial Intelligence Masterclass',
    'Data Science & Analytics Professional',
    'Machine Learning Engineering',
    'Full Stack Web Development',
  ];

  const qualificationsList = [
    'High School / 12th Grade',
    "Bachelor's Degree (Undergraduate)",
    "Master's Degree (Postgraduate)",
    'PhD / Doctorate',
    'Working Professional',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSubmissionSuccess(null);

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.details && typeof data.details === 'object') {
          setErrors(data.details);
        } else {
          setErrors({ global: data.error || 'Failed to submit registration form.' });
        }
      } else {
        setSubmissionSuccess({
          message: data.message || 'Thank you for registering. Our education counsellor will contact you soon.',
          mode: data.mode,
          details: data.details,
        });

        if (typeof window !== 'undefined' && (window as any).SnapServe?.submit) {
          (window as any).SnapServe.submit({
            phone: formData.phone || '',
            student_name: formData.studentName || '',
            email: formData.email || '',
          })
          .then(() => console.log('Lead sent!'))
          .catch((err: any) => console.error(err?.message || err));
        }

        // Reset form
        setFormData({
          studentName: '',
          email: '',
          phone: '',
          courseInterested: 'Artificial Intelligence Masterclass',
          qualification: "Bachelor's Degree (Undergraduate)",
          learningGoal: '',
        });
      }
    } catch (err: any) {
      console.error('Submission Error:', err);
      setErrors({ global: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="enroll" className="py-24 bg-hero-pattern relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form Info & Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Fast-Track Enrollment
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Begin Your Journey with <span className="gradient-text">EduAI Academy</span>
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Complete the registration form to lock in your seat for the upcoming cohort. Every submission is recorded directly into our counseling team system for immediate onboarding guidance.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 glass-card p-4 rounded-xl border border-slate-800">
                <div className="p-2.5 rounded-lg bg-indigo-600/30 text-indigo-400 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Database Enrollment Capture</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your submission is stored securely in the application database for processing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 glass-card p-4 rounded-xl border border-slate-800">
                <div className="p-2.5 rounded-lg bg-purple-600/30 text-purple-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dedicated Academic Counselor</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Receive 1-on-1 curriculum planning, fee structure assistance, and flexible schedule options.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Student Registration Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-10 border border-slate-700/80 glow-blue shadow-2xl relative">
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white">Student Course Enrollment</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Fill out the details below. Required fields are marked with an asterisk (*).
                </p>
              </div>

              {/* Global Error Banner */}
              {errors.global && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-start gap-3 text-rose-300 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{errors.global}</span>
                </div>
              )}

              {/* Success Notification Alert */}
              {submissionSuccess ? (
                <div className="p-8 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-center space-y-4 my-4 animate-float">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-extrabold text-white">Enrollment Request Received!</h4>
                  <p className="text-emerald-200 text-base font-semibold max-w-md mx-auto leading-relaxed">
                    "{submissionSuccess.message}"
                  </p>
                  
                  {submissionSuccess.mode && (
                    <div className="inline-flex items-center gap-2 text-xs font-mono bg-slate-900/90 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span>Sync Status:</span>
                      <span className="text-emerald-400 font-bold uppercase">{submissionSuccess.mode}</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={() => setSubmissionSuccess(null)}
                      className="gradient-button text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md"
                    >
                      Submit Another Registration
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Fields */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Field 1: Student Name */}
                  <div className="space-y-2">
                    <label htmlFor="studentName" className="block text-xs sm:text-sm font-semibold text-slate-200">
                      Student Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="studentName"
                        name="studentName"
                        required
                        value={formData.studentName || ''}
                        onChange={handleChange}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900/90 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          errors.studentName ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                    </div>
                    {errors.studentName && (
                      <p className="text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.studentName}
                      </p>
                    )}
                  </div>

                  {/* Field 2 & 3: Email & Phone (Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-200">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email || ''}
                          onChange={handleChange}
                          placeholder="alex@example.com"
                          className={`w-full pl-10 pr-4 py-3 bg-slate-900/90 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                            errors.email ? 'border-rose-500' : 'border-slate-800'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-slate-200">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone || ''}
                          onChange={handleChange}
                          placeholder="+1 (555) 019-2834"
                          className={`w-full pl-10 pr-4 py-3 bg-slate-900/90 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                            errors.phone ? 'border-rose-500' : 'border-slate-800'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Field 4 & 5: Course Interested & Highest Qualification (Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Course Interested Dropdown */}
                    <div className="space-y-2">
                      <label htmlFor="courseInterested" className="block text-xs sm:text-sm font-semibold text-slate-200">
                        Course Interested *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <select
                          id="courseInterested"
                          name="courseInterested"
                          required
                          value={formData.courseInterested || ''}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-900/90 border rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer ${
                            errors.courseInterested ? 'border-rose-500' : 'border-slate-800'
                          }`}
                        >
                          {coursesList.map((course) => (
                            <option key={course} value={course} className="bg-slate-900 text-white">
                              {course}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.courseInterested && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.courseInterested}
                        </p>
                      )}
                    </div>

                    {/* Highest Qualification */}
                    <div className="space-y-2">
                      <label htmlFor="qualification" className="block text-xs sm:text-sm font-semibold text-slate-200">
                        Highest Qualification *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <select
                          id="qualification"
                          name="qualification"
                          required
                          value={formData.qualification || ''}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-900/90 border rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer ${
                            errors.qualification ? 'border-rose-500' : 'border-slate-800'
                          }`}
                        >
                          {qualificationsList.map((qual) => (
                            <option key={qual} value={qual} className="bg-slate-900 text-white">
                              {qual}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.qualification && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.qualification}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Field 6: Learning Goal / Message */}
                  <div className="space-y-2">
                    <label htmlFor="learningGoal" className="block text-xs sm:text-sm font-semibold text-slate-200">
                      Learning Goal / Message *
                    </label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        id="learningGoal"
                        name="learningGoal"
                        rows={4}
                        required
                        value={formData.learningGoal || ''}
                        onChange={handleChange}
                        placeholder="Tell us about your career background, target job role, or specific skills you want to build..."
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900/90 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          errors.learningGoal ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                    </div>
                    {errors.learningGoal && (
                      <p className="text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.learningGoal}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full gradient-button text-white text-base font-semibold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Saving your registration...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          <span>Submit Registration</span>
                        </>
                      )}
                    </button>

                    <a
                      href="/api/submissions/export"
                      className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 text-slate-200 text-sm font-semibold py-4 shadow-lg hover:border-slate-500 hover:text-white transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Download Submissions CSV
                    </a>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    🔒 Your information is confidential and will only be used for course enrollment counseling.
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
