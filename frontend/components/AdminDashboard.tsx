'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  LogOut,
  RefreshCw,
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
  FileText,
  AlertTriangle,
  Activity,
  Download,
} from 'lucide-react';
import { EnrollmentRecord } from '../lib/googleSheets';
import { CallRecord } from '../lib/callLogs';

interface AdminDashboardProps {
  user: { username: string; role: string };
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'leads' | 'calls'>('leads');

  // Leads Tab States
  const [leads, setLeads] = useState<EnrollmentRecord[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedLead, setSelectedLead] = useState<EnrollmentRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Call Logs Tab States
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [callsSource, setCallsSource] = useState<'live' | 'mock'>('mock');
  const [callSearchQuery, setCallSearchQuery] = useState('');
  const [selectedCallAgent, setSelectedCallAgent] = useState('All');
  const [selectedCallStatus, setSelectedCallStatus] = useState('All');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  const [callsError, setCallsError] = useState<string | null>(null);

  // Global Loading States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      setRefreshing(true);
      setCallsError(null);
      
      // 1. Fetch leads
      const leadsRes = await fetch('/api/admin/leads');
      const leadsData = await leadsRes.json();
      if (leadsData.success && Array.isArray(leadsData.leads)) {
        setLeads(leadsData.leads);
      }

      // 2. Fetch call logs
      const callsRes = await fetch('/api/admin/calls');
      const callsData = await callsRes.json();
      if (callsData.success && Array.isArray(callsData.calls)) {
        setCalls(callsData.calls);
        setCallsSource(callsData.source || 'mock');
      } else {
        setCallsError(callsData.error || 'Failed to retrieve call logs.');
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setCallsError(err?.message || 'A network error occurred while loading call logs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==================== Leads Filter Logic ====================
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.learningGoal && lead.learningGoal.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = selectedCourse === 'All' || lead.courseInterested === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  // Calculate Leads Metrics
  const totalLeadsCount = leads.length;
  const courseCounts = leads.reduce((acc, lead) => {
    acc[lead.courseInterested] = (acc[lead.courseInterested] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCourse =
    Object.entries(courseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const availableCourses = Array.from(new Set(leads.map((l) => l.courseInterested).filter(Boolean)));

  // Export Leads to CSV
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

  // ==================== Call Logs Filter Logic ====================
  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.toNumber.includes(callSearchQuery) ||
      call.fromNumber.includes(callSearchQuery) ||
      call.callId.toLowerCase().includes(callSearchQuery.toLowerCase()) ||
      call.agentName.toLowerCase().includes(callSearchQuery.toLowerCase());

    const matchesAgent = selectedCallAgent === 'All' || call.agentName === selectedCallAgent;
    const matchesStatus = selectedCallStatus === 'All' || call.status === selectedCallStatus;

    return matchesSearch && matchesAgent && matchesStatus;
  });

  // Calculate Call Metrics
  const totalCalls = calls.length;
  const completedCalls = calls.filter((c) => c.status === 'completed').length;
  const failedCalls = calls.filter((c) => c.status === 'failed' || c.status === 'busy').length;
  
  const avgSeconds = Math.round(
    calls.reduce((sum, c) => sum + c.durationSeconds, 0) / (calls.length || 1)
  );

  const formatDuration = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  // Unique Agent Names in Logs
  const uniqueAgents = Array.from(new Set(calls.map((c) => c.agentName).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold text-white flex items-center gap-2">
                EduAI Admin Hub
                <span className="text-[10px] bg-indigo-500/20 text-indigo-305 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Live System
                </span>
              </span>
              <p className="text-xs text-slate-400">Logged in as <span className="text-indigo-405 font-medium">{user.username}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
              title="Refresh all data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2.5 px-4 rounded-xl bg-red-955/40 border border-red-900/60 text-red-300 hover:bg-red-900/60 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fadeIn text-left">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'leads'
                ? 'border-indigo-500 text-indigo-404 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>Student Leads</span>
            <span className="text-xs bg-slate-805 text-slate-400 px-2 py-0.5 rounded-full ml-1 font-medium">{leads.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'calls'
                ? 'border-indigo-500 text-indigo-404 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-4.5 h-4.5" />
            <span>Call Logs</span>
            <span className="text-xs bg-slate-805 text-slate-400 px-2 py-0.5 rounded-full ml-1 font-medium">{calls.length}</span>
          </button>
        </div>

        {/* Vercel Environment Variables warning banner if in fallback mode */}
        {activeTab === 'calls' && callsSource === 'mock' && (
          <div className="bg-amber-955/40 border border-amber-500/20 rounded-2xl p-5 text-amber-300 text-xs sm:text-sm flex flex-col sm:flex-row gap-3 sm:items-center justify-between backdrop-blur-sm">
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong>Demo Mode Active:</strong> Showing seeded mock data. To view real-time call logs from SnapServe, add the <strong><code>SNAPSERVE_API_TOKEN</code></strong> environment variable to your project settings.
              </span>
            </div>
            <a 
              href="https://vercel.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all w-fit"
            >
              Configure Vercel
            </a>
          </div>
        )}

        {/* Error banner if fetching calls failed */}
        {activeTab === 'calls' && callsError && (
          <div className="bg-red-955/40 border border-red-500/20 rounded-2xl p-5 text-red-300 text-xs sm:text-sm flex items-start gap-2.5 backdrop-blur-sm">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <strong className="font-bold">Error Fetching SnapServe Call History:</strong>
              <p className="mt-1 text-slate-300">{callsError}</p>
            </div>
          </div>
        )}

        {/* Tab Specific KPI Cards */}
        {activeTab === 'leads' ? (
          /* LEADS METRICS */
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
                  <h3 className="text-sm font-bold text-indigo-305 mt-1 truncate max-w-[170px]" title={topCourse}>
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
        ) : (
          /* CALL LOGS METRICS */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Calls</p>
                  <h3 className="text-3xl font-extrabold text-white mt-1">{totalCalls}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Phone className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-indigo-400 font-medium">
                <Activity className="w-3.5 h-3.5 mr-1" /> Total outbound & inbound calls
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed</p>
                  <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{completedCalls}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">Uninterrupted conversations</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Failed / Busy</p>
                  <h3 className="text-3xl font-extrabold text-red-400 mt-1">{failedCalls}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">Busy lines, fails, unanswered</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Duration</p>
                  <h3 className="text-2xl font-extrabold text-blue-400 mt-2">{formatDuration(avgSeconds)}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">Average conversation time</div>
            </div>
          </div>
        )}

        {/* Tab Specific Filter / Controls */}
        {activeTab === 'leads' ? (
          /* LEADS CONTROLS */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, email, phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-505 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                  <Filter className="w-4 h-4 text-indigo-405" />
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
        ) : (
          /* CALL LOGS CONTROLS */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={callSearchQuery}
                onChange={(e) => setCallSearchQuery(e.target.value)}
                placeholder="Search number, agent, ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-505 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {callSearchQuery && (
                <button
                  onClick={() => setCallSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
              {/* Agent Filter */}
              <div className="relative flex-1 sm:flex-none">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-405 font-semibold" />
                  <select
                    value={selectedCallAgent}
                    onChange={(e) => setSelectedCallAgent(e.target.value)}
                    className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl text-white text-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All">All Agents</option>
                    {uniqueAgents.map((agentName) => (
                      <option key={agentName} value={agentName}>
                        {agentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative flex-1 sm:flex-none">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-405 font-semibold" />
                  <select
                    value={selectedCallStatus}
                    onChange={(e) => setSelectedCallStatus(e.target.value)}
                    className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl text-white text-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="busy">Busy</option>
                    <option value="no-answer">No Answer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Specific Content Table */}
        {activeTab === 'leads' ? (
          /* LEADS DATA TABLE */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-405" />
                Student Registration Records ({filteredLeads.length})
              </h2>
              {searchQuery || selectedCourse !== 'All' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCourse('All');
                  }}
                  className="text-xs text-indigo-405 hover:underline"
                >
                  Reset filters
                </button>
              ) : null}
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-405" />
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
                            <Calendar className="w-3.5 h-3.5 text-indigo-405" />
                            {lead.timestamp || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-white group-hover:text-indigo-305 transition-colors">
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
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-950/80 text-indigo-305 border border-indigo-800/60">
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
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-805 hover:bg-indigo-600 text-slate-205 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
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
        ) : (
          /* CALL LOGS DATA TABLE */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-405" />
                Call Interactions List ({filteredCalls.length})
              </h2>
              {callSearchQuery || selectedCallAgent !== 'All' || selectedCallStatus !== 'All' ? (
                <button
                  onClick={() => {
                    setCallSearchQuery('');
                    setSelectedCallAgent('All');
                    setSelectedCallStatus('All');
                  }}
                  className="text-xs text-indigo-405 hover:underline"
                >
                  Reset filters
                </button>
              ) : null}
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-405" />
                <p className="text-sm">Loading call logs...</p>
              </div>
            ) : filteredCalls.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <Phone className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-base font-semibold text-slate-300">No call logs found</p>
                <p className="text-xs text-slate-500">Try modifying your search or dropdown filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <th className="py-4 px-6 font-semibold">Date & Time</th>
                      <th className="py-4 px-6 font-semibold">Call ID</th>
                      <th className="py-4 px-6 font-semibold">Agent</th>
                      <th className="py-4 px-6 font-semibold">From</th>
                      <th className="py-4 px-6 font-semibold">To</th>
                      <th className="py-4 px-6 font-semibold">Call Type</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 font-semibold">Duration</th>
                      <th className="py-4 px-6 font-semibold">Cost</th>
                      <th className="py-4 px-6 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {filteredCalls.map((call) => (
                      <tr
                        key={call.callId}
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => setSelectedCall(call)}
                      >
                        <td className="py-4 px-6 text-xs text-slate-400 whitespace-nowrap">
                          {call.timestamp}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                          {call.callId.length > 12 ? `${call.callId.substring(0, 10)}...` : call.callId}
                        </td>
                        <td className="py-4 px-6 font-semibold text-white group-hover:text-indigo-305 transition-colors">
                          {call.agentName}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-300 font-mono">
                          {call.fromNumber}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-300 font-mono">
                          {call.toNumber}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400 font-medium">
                          {call.callType}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              call.status === 'completed'
                                ? 'bg-emerald-950/80 text-emerald-450 border border-emerald-500/20'
                                : call.status === 'no-answer'
                                ? 'bg-slate-900 text-slate-500 border border-slate-800'
                                : 'bg-red-950/80 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {call.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-300">
                          {formatDuration(call.durationSeconds)}
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold text-slate-200">
                          ₹{(call.costCents / 100).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCall(call);
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-805 hover:bg-indigo-600 text-slate-205 hover:text-white transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Inspect</span>
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
        )}
      </main>

      {/* ==================== Lead Detail Modal ==================== */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative animate-fadeIn text-left">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-405">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedLead.studentName}</h3>
                <p className="text-xs text-indigo-405 font-medium">{selectedLead.courseInterested}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm font-sans">
              <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-slate-200 hover:text-indigo-405 flex items-center gap-1.5 font-medium">
                    <Mail className="w-4 h-4 text-indigo-405" />
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                  <a href={`tel:${selectedLead.phone}`} className="text-slate-200 hover:text-indigo-405 flex items-center gap-1.5 font-medium">
                    <Phone className="w-4 h-4 text-indigo-405" />
                    {selectedLead.phone}
                  </a>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Highest Qualification</span>
                <span className="text-slate-200 font-medium">{selectedLead.qualification}</span>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Learning Goals / Notes</span>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mt-1">
                  {selectedLead.learningGoal || 'No additional details specified.'}
                </p>
              </div>

              <div className="text-xs text-slate-500 pt-2 flex items-center justify-between">
                <span>Submitted at: {selectedLead.timestamp || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 font-sans">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-805 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== Call Log Detail Modal ==================== */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative animate-fadeIn text-left">
            <button
              onClick={() => setSelectedCall(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-405">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Call Log Details
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedCall.status === 'completed'
                        ? 'bg-emerald-950/80 text-emerald-450 border border-emerald-500/20'
                        : selectedCall.status === 'no-answer'
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : 'bg-red-950/80 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {selectedCall.status}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Call ID: {selectedCall.callId}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Audio Recording */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div>
                  <span className="text-[10px] text-indigo-405 uppercase tracking-widest block font-bold">Call Recording</span>
                  <span className="text-xs text-slate-400 mt-0.5 block">{selectedCall.agentName}</span>
                </div>
                {selectedCall.recordingUrl ? (
                  <audio
                    src={selectedCall.recordingUrl}
                    controls
                    className="w-full sm:w-auto h-9 accent-indigo-500 bg-slate-900 rounded-xl"
                  />
                ) : (
                  <span className="text-xs text-slate-500 italic">No recording available (e.g. Call unanswered)</span>
                )}
              </div>

              {/* Call Summary & Meta Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-left">
                  <h5 className="text-[10px] uppercase font-bold tracking-widest text-indigo-405 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> <span>Counseling Summary</span>
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                    "{selectedCall.summary || 'No summary available.'}"
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-left grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Agent Name</span>
                    <span className="text-xs text-slate-200 font-bold">{selectedCall.agentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Call Type</span>
                    <span className="text-xs text-slate-200 font-bold">{selectedCall.callType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">To Number</span>
                    <span className="text-xs text-slate-200 font-mono font-bold">{selectedCall.toNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">From Number</span>
                    <span className="text-xs text-slate-200 font-mono font-bold">{selectedCall.fromNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Duration</span>
                    <span className="text-xs text-slate-200 font-bold">{formatDuration(selectedCall.durationSeconds)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Accrued Cost</span>
                    <span className="text-xs text-slate-200 font-bold">₹{(selectedCall.costCents / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Chat Transcript bubble list */}
              <div className="text-left space-y-2">
                <h5 className="text-[10px] uppercase font-bold tracking-widest text-indigo-405 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> <span>Call Transcript Logs</span>
                </h5>

                {!selectedCall.transcript || selectedCall.transcript.length === 0 ? (
                  <div className="text-center p-6 bg-slate-950/40 border border-slate-850 rounded-xl text-slate-500 text-xs italic">
                    No transcript recorded (e.g. Call unanswered or busy).
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[220px] overflow-y-auto p-4 bg-slate-950/60 rounded-2xl border border-slate-850 scrollbar-thin">
                    {selectedCall.transcript.map((msg: any, idx: number) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col max-w-[85%] ${
                            isUser ? 'ml-auto items-end' : 'mr-auto items-start'
                          }`}
                        >
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5 px-2">
                            {isUser ? 'Student' : 'AI Assistant'}
                          </span>
                          <div
                            className={`px-4 py-2 rounded-2xl text-xs leading-relaxed ${
                              isUser
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-750/50'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCall(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-805 text-slate-350 hover:text-white text-xs font-semibold border border-slate-700/50 hover:bg-slate-700 transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
