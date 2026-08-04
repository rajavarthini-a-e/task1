'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  LogOut,
  RefreshCw,
  BookOpen,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  X,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Award,
  Clock,
  Database,
  ExternalLink,
} from 'lucide-react';
import { EnrollmentRecord } from '@/lib/googleSheets';

interface AdminDashboardProps {
  user: { username: string; role: string };
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [leads, setLeads] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedLead, setSelectedLead] = useState<EnrollmentRecord | null>(null);

  const fetchLeads = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.learningGoal && lead.learningGoal.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = selectedCourse === 'All' || lead.courseInterested === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  // Calculate Metrics
  const totalLeadsCount = leads.length;
  const courseCounts = leads.reduce((acc, lead) => {
    acc[lead.courseInterested] = (acc[lead.courseInterested] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCourse =
    Object.entries(courseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Unique Courses for filter
  const availableCourses = Array.from(new Set(leads.map((l) => l.courseInterested).filter(Boolean)));

  // Export to CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Timestamp', 'Student Name', 'Email', 'Phone', 'Course Interested', 'Qualification', 'Learning Goal'];
    const csvRows = [headers.join(',')];

    filteredLeads.forEach((lead) => {
      const row = [
        `"${lead.timestamp || ''}"`,
        `"${lead.studentName.replace(/"/g, '""')}"`,
        `"${lead.email.replace(/"/g, '""')}"`,
        `"${lead.phone.replace(/"/g, '""')}"`,
        `"${lead.courseInterested.replace(/"/g, '""')}"`,
        `"${lead.qualification.replace(/"/g, '""')}"`,
        `"${(lead.learningGoal || '').replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EduAI_Enrollments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      {/* Admin Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold text-white flex items-center gap-2">
                EduAI Admin Hub
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Live System
                </span>
              </span>
              <p className="text-xs text-slate-400">Logged in as <span className="text-indigo-400 font-medium">{user.username}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchLeads}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
              title="Refresh leads list"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2.5 px-4 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 hover:bg-red-900/60 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Leads</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{totalLeadsCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Active registrations stored
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Requested Course</p>
                <h3 className="text-sm font-bold text-indigo-300 mt-1 truncate max-w-[170px]" title={topCourse}>
                  {topCourse}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Highest student enrollment interest
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Latest Submission</p>
                <h3 className="text-xs font-bold text-slate-200 mt-2 truncate">
                  {leads[0]?.timestamp || 'No recent activity'}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-400">Real-time captured</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Storage Backend</p>
                <h3 className="text-sm font-bold text-slate-200 mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Database & Sheets
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Database className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-400">Synchronized lead store</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, email, phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-400" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl text-white text-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="All">All Courses ({leads.length})</option>
                  {availableCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              Student Registration Records ({filteredLeads.length})
            </h2>
            {searchQuery || selectedCourse !== 'All' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCourse('All');
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                Reset filters
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
              <p className="text-sm">Loading enrollment records...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Search className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-base font-semibold text-slate-300">No matching student records found</p>
              <p className="text-xs text-slate-500">Try adjusting your search keywords or course filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <th className="py-4 px-6 font-semibold">Date & Time</th>
                    <th className="py-4 px-6 font-semibold">Student Name</th>
                    <th className="py-4 px-6 font-semibold">Contact Info</th>
                    <th className="py-4 px-6 font-semibold">Course Interested</th>
                    <th className="py-4 px-6 font-semibold">Qualification</th>
                    <th className="py-4 px-6 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredLeads.map((lead, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="py-4 px-6 text-xs text-slate-400 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          {lead.timestamp || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {lead.studentName}
                      </td>
                      <td className="py-4 px-6 text-xs space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          {lead.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {lead.courseInterested}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-300">
                        {lead.qualification}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedLead.studentName}</h3>
                <p className="text-xs text-indigo-400 font-medium">{selectedLead.courseInterested}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-slate-200 hover:text-indigo-400 flex items-center gap-1.5 font-medium">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                  <a href={`tel:${selectedLead.phone}`} className="text-slate-200 hover:text-indigo-400 flex items-center gap-1.5 font-medium">
                    <Phone className="w-4 h-4 text-indigo-400" />
                    {selectedLead.phone}
                  </a>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Highest Qualification</span>
                <span className="text-slate-200 font-medium">{selectedLead.qualification}</span>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Learning Goals / Notes</span>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mt-1">
                  {selectedLead.learningGoal || 'No additional details specified.'}
                </p>
              </div>

              <div className="text-xs text-slate-500 pt-2 flex items-center justify-between">
                <span>Submitted at: {selectedLead.timestamp || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
