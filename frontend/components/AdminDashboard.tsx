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
  Bot,
  Sliders,
  Volume2,
  Activity,
  FileText,
} from 'lucide-react';
import { EnrollmentRecord } from '../lib/googleSheets';
import { SnapServeAgent } from '../app/api/admin/agents/route';
import { CallRecord } from '../lib/callLogs';

interface AdminDashboardProps {
  user: { username: string; role: string };
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'leads' | 'agents'>('leads');

  // Leads Tab States
  const [leads, setLeads] = useState<EnrollmentRecord[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedLead, setSelectedLead] = useState<EnrollmentRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Agents Tab States
  const [agents, setAgents] = useState<SnapServeAgent[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<SnapServeAgent | null>(null);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const [selectedAgentStatus, setSelectedAgentStatus] = useState('All');
  const [agentDetailsTab, setAgentDetailsTab] = useState<'config' | 'calls'>('config');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  // Global Loading States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      // 1. Fetch leads
      const leadsRes = await fetch('/api/admin/leads');
      const leadsData = await leadsRes.json();
      if (leadsData.success && Array.isArray(leadsData.leads)) {
        setLeads(leadsData.leads);
      }

      // 2. Fetch agents
      const agentsRes = await fetch('/api/admin/agents');
      const agentsData = await agentsRes.json();
      if (agentsData.success && Array.isArray(agentsData.agents)) {
        setAgents(agentsData.agents);
      }

      // 3. Fetch call logs
      const callsRes = await fetch('/api/admin/calls');
      const callsData = await callsRes.json();
      if (callsData.success && Array.isArray(callsData.calls)) {
        setCalls(callsData.calls);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
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

  // ==================== Agents Filter Logic ====================
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
      agent.llmModel.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
      agent.ttsVoice.toLowerCase().includes(agentSearchQuery.toLowerCase());

    const matchesStatus = selectedAgentStatus === 'All' || agent.status === selectedAgentStatus;

    return matchesSearch && matchesStatus;
  });

  const agentCalls = selectedAgent ? calls.filter((c) => c.agentId === selectedAgent.id) : [];

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
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Live System
                </span>
              </span>
              <p className="text-xs text-slate-400">Logged in as <span className="text-indigo-400 font-medium">{user.username}</span></p>
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
              className="p-2.5 px-4 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 hover:bg-red-900/60 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fadeIn">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-850 gap-2">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'leads'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>Student Leads</span>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full ml-1 font-medium">{leads.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'agents'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4.5 h-4.5" />
            <span>AI Voice Agents</span>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full ml-1 font-medium">{agents.length}</span>
          </button>
        </div>

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
        ) : (
          /* AGENTS METRICS */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Agents</p>
                  <h3 className="text-3xl font-extrabold text-white mt-1">{agents.length}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Bot className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-indigo-400 font-medium">
                <Activity className="w-3.5 h-3.5 mr-1" /> Configured SnapServe agents
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Agents</p>
                  <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">
                    {agents.filter((a) => a.status === 'active').length}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">Online and calling ready</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Logged Calls</p>
                  <h3 className="text-3xl font-extrabold text-white mt-1">{calls.length}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Phone className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Avg: {Math.round(calls.reduce((sum, c) => sum + c.durationSeconds, 0) / (calls.length || 1))}s duration
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Success Rate</p>
                  <h3 className="text-3xl font-extrabold text-blue-400 mt-1">
                    {Math.round((calls.filter((c) => c.status === 'completed').length / (calls.length || 1)) * 100)}%
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">Completed counseling calls</div>
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
        ) : (
          /* AGENTS CONTROLS */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={agentSearchQuery}
                onChange={(e) => setAgentSearchQuery(e.target.value)}
                placeholder="Search name, description, model, voice..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {agentSearchQuery && (
                <button
                  onClick={() => setAgentSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-400" />
                  <select
                    value={selectedAgentStatus}
                    onChange={(e) => setSelectedAgentStatus(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl text-white text-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
        ) : (
          /* AGENTS DATA TABLE */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                SnapServe AI Agents ({filteredAgents.length})
              </h2>
              {agentSearchQuery || selectedAgentStatus !== 'All' ? (
                <button
                  onClick={() => {
                    setAgentSearchQuery('');
                    setSelectedAgentStatus('All');
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
                <p className="text-sm">Loading agents...</p>
              </div>
            ) : filteredAgents.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <Search className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-base font-semibold text-slate-300">No matching AI agents found</p>
                <p className="text-xs text-slate-500">Try adjusting your search query or status filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <th className="py-4 px-6 font-semibold">Agent Name</th>
                      <th className="py-4 px-6 font-semibold">LLM Configuration</th>
                      <th className="py-4 px-6 font-semibold">TTS Voice / Model</th>
                      <th className="py-4 px-6 font-semibold">Total Calls</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {filteredAgents.map((agent) => (
                      <tr
                        key={agent.id}
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => {
                          setSelectedAgent(agent);
                          setAgentDetailsTab('config');
                          setSelectedCall(null);
                        }}
                      >
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {agent.name}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[280px]">
                            {agent.description}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 uppercase">
                            {agent.llmProvider}
                          </span>
                          <span className="text-xs text-slate-300 ml-2 font-mono">
                            {agent.llmModel}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-xs font-medium text-slate-200">
                            Voice: <span className="text-indigo-400 font-bold">{agent.ttsVoice}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Model: {agent.ttsModel}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-medium whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-indigo-400" />
                            {calls.filter((c) => c.agentId === agent.id).length} calls
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              agent.status === 'active'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}
                          >
                            {agent.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAgent(agent);
                              setAgentDetailsTab('config');
                              setSelectedCall(null);
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 cursor-pointer"
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

      {/* ==================== Agent Detail & Call Logs Modal ==================== */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl relative animate-fadeIn overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedAgent.name}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        selectedAgent.status === 'active'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {selectedAgent.status}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedAgent.description}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAgent(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="px-6 border-b border-slate-800 flex gap-4 bg-slate-950/20">
              <button
                onClick={() => setAgentDetailsTab('config')}
                className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  agentDetailsTab === 'config'
                    ? 'border-indigo-500 text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Agent Configuration</span>
              </button>
              <button
                onClick={() => {
                  setAgentDetailsTab('calls');
                  const firstCall = calls.find((c) => c.agentId === selectedAgent.id);
                  if (firstCall && !selectedCall) {
                    setSelectedCall(firstCall);
                  }
                }}
                className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  agentDetailsTab === 'calls'
                    ? 'border-indigo-500 text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Call History & Transcripts ({agentCalls.length})</span>
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 overflow-hidden min-h-0">
              {agentDetailsTab === 'config' ? (
                /* CONFIGURATION TAB */
                <div className="h-full overflow-y-auto p-6 space-y-6 text-left">
                  {/* System Prompt */}
                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                    <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> <span>System Prompt & Identity</span>
                    </h4>
                    <p className="text-sm font-semibold text-slate-200 mt-1">Greeting Message:</p>
                    <div className="bg-indigo-950/20 border border-indigo-500/20 p-3.5 rounded-xl text-slate-300 text-sm font-serif italic">
                      "{selectedAgent.greetingMessage}"
                    </div>
                    <p className="text-sm font-semibold text-slate-200 mt-3">Prompt Content:</p>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono bg-slate-900 p-4 rounded-xl border border-slate-800/80 max-h-56 overflow-y-auto">
                      {selectedAgent.systemPrompt}
                    </p>
                  </div>

                  {/* Core Settings Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* LLM */}
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                      <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
                        <Activity className="w-4 h-4" /> <span>Language Model (LLM)</span>
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Provider:</span>
                          <span className="font-semibold text-white capitalize">{selectedAgent.llmProvider}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Model Name:</span>
                          <span className="font-mono text-indigo-300 text-xs">{selectedAgent.llmModel}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Temperature:</span>
                          <span className="font-semibold text-slate-200">{selectedAgent.temperature}</span>
                        </div>
                      </div>
                    </div>

                    {/* TTS */}
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                      <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4" /> <span>Text to Speech (TTS)</span>
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Provider:</span>
                          <span className="font-semibold text-white capitalize">{selectedAgent.ttsProvider}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Voice ID:</span>
                          <span className="font-semibold text-indigo-300 text-xs font-mono">{selectedAgent.ttsVoice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Model ID:</span>
                          <span className="text-slate-300 text-xs font-mono">{selectedAgent.ttsModel}</span>
                        </div>
                      </div>
                    </div>

                    {/* ASR */}
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                      <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
                        <Phone className="w-4 h-4" /> <span>Speech to Text (ASR)</span>
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Provider:</span>
                          <span className="font-semibold text-white capitalize">{selectedAgent.asrProvider}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Model Name:</span>
                          <span className="font-mono text-indigo-300 text-xs">{selectedAgent.asrModel}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Language Code:</span>
                          <span className="font-semibold text-slate-200">{selectedAgent.asrLanguage}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Telephony and Constraints */}
                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                    <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
                      <Database className="w-4 h-4" /> <span>Telephony, Budget & Limits</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                      <div>
                        <span className="text-xs text-slate-400 block">Inbound Phone Identifier</span>
                        <span className="font-semibold text-slate-200 text-sm">
                          {selectedAgent.inboundPhoneNumberId || 'None (Disabled)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Outbound Phone Identifier</span>
                        <span className="font-semibold text-slate-200 text-sm">
                          {selectedAgent.outboundPhoneNumberId || 'None (Disabled)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Max Concurrent Calls</span>
                        <span className="font-semibold text-slate-200 text-sm">{selectedAgent.maxConcurrentCalls} channels</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Max Call Duration</span>
                        <span className="font-semibold text-slate-200 text-sm">{selectedAgent.maxDuration} seconds</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Silence Timeout</span>
                        <span className="font-semibold text-slate-200 text-sm">{selectedAgent.silenceTimeoutSeconds} seconds</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Monthly Spend Limit</span>
                        <span className="font-semibold text-slate-200 text-sm">
                          ${(selectedAgent.monthlySpendLimitCents / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* CALL HISTORY / LOGS TAB */
                <div className="h-full flex flex-col md:flex-row min-h-0">
                  {/* Left Column: Call List */}
                  <div className="w-full md:w-[320px] border-r border-slate-800 h-full overflow-y-auto flex-shrink-0 bg-slate-950/10">
                    {agentCalls.length === 0 ? (
                      <div className="p-12 text-center text-slate-500 text-xs italic">
                        No call logs recorded for this agent.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-800/60">
                        {agentCalls.map((call) => (
                          <div
                            key={call.callId}
                            onClick={() => setSelectedCall(call)}
                            className={`p-4 cursor-pointer text-left transition-all ${
                              selectedCall?.callId === call.callId
                                ? 'bg-indigo-950/30 border-l-4 border-indigo-500'
                                : 'hover:bg-slate-800/30 border-l-4 border-transparent'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-slate-300 font-mono font-semibold">{call.toNumber}</span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  call.status === 'completed'
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20'
                                    : call.status === 'no-answer'
                                    ? 'bg-slate-800 text-slate-400'
                                    : 'bg-red-950/80 text-red-400 border border-red-500/20'
                                }`}
                              >
                                {call.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-1">
                              {call.summary || 'No summary generated.'}
                            </p>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                              <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3 text-indigo-400" />
                                {call.durationSeconds}s
                              </span>
                              <span className="font-mono">{call.timestamp.split(', ')[1] || call.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Call Details */}
                  <div className="flex-1 h-full overflow-y-auto p-6 space-y-6 bg-slate-950/30 min-h-0 flex flex-col justify-between">
                    {selectedCall ? (
                      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                        {/* Audio Player */}
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between text-left">
                          <div>
                            <span className="text-[10px] text-indigo-400 uppercase tracking-widest block font-bold">Call Recording</span>
                            <span className="text-xs text-slate-400 font-mono block mt-0.5">{selectedCall.callId}</span>
                          </div>

                          {selectedCall.recordingUrl ? (
                            <div className="w-full md:w-auto flex-1 md:max-w-md">
                              <audio
                                src={selectedCall.recordingUrl}
                                controls
                                className="w-full h-9 accent-indigo-500 bg-slate-950 rounded-xl"
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 italic">Unanswered call - no recording available.</span>
                          )}
                        </div>

                        {/* Summary & Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                            <h5 className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> <span>Counseling Summary</span>
                            </h5>
                            <p className="text-xs text-slate-350 leading-relaxed font-serif italic">
                              "{selectedCall.summary || 'No summary available.'}"
                            </p>
                          </div>

                          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] uppercase text-slate-500 block">Dialed Number</span>
                              <span className="text-xs text-slate-200 font-mono font-bold">{selectedCall.toNumber}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-slate-500 block">From Number</span>
                              <span className="text-xs text-slate-200 font-mono font-bold">{selectedCall.fromNumber}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-slate-500 block">Call Duration</span>
                              <span className="text-xs text-slate-200 font-bold">{selectedCall.durationSeconds} seconds</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-slate-500 block">Accrued Cost</span>
                              <span className="text-xs text-slate-200 font-bold">${(selectedCall.costCents / 100).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Transcript bubble list */}
                        <div className="text-left space-y-3">
                          <h5 className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> <span>Call Transcript Logs</span>
                          </h5>

                          {!selectedCall.transcript || selectedCall.transcript.length === 0 ? (
                            <div className="text-center p-8 bg-slate-900 border border-slate-800/80 rounded-xl text-slate-500 text-xs italic">
                              No audio stream connection or transcript recorded.
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto p-4 bg-slate-950/60 rounded-2xl border border-slate-805/85 scrollbar-thin">
                              {selectedCall.transcript.map((msg, idx) => {
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
                                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
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
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm space-y-2 p-12">
                        <Phone className="w-8 h-8 text-slate-700 animate-pulse" />
                        <p>Select a call log on the left sidebar to inspect details</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 flex justify-end bg-slate-900/50">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-750/50 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close Agent Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
