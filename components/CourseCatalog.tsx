'use client';

import React, { useState } from 'react';
import {
  Brain,
  Database,
  Cpu,
  Code2,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  ArrowRight,
  X,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  category: string;
  icon: any;
  color: string;
  badgeColor: string;
  accentGlow: string;
  shortDesc: string;
  duration: string;
  level: string;
  projectsCount: number;
  skills: string[];
  overview: string;
  modules: { title: string; topics: string[] }[];
  careerOutcomes: string[];
}

export const coursesData: Course[] = [
  {
    id: 'artificial-intelligence',
    title: 'Artificial Intelligence Masterclass',
    category: 'Artificial Intelligence',
    icon: Brain,
    color: 'from-indigo-500 to-purple-600',
    badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50',
    accentGlow: 'hover:border-indigo-500/50 hover:shadow-indigo-500/20',
    shortDesc:
      'Master Generative AI, Large Language Models (LLMs), Computer Vision, Natural Language Processing, and PyTorch.',
    duration: '24 Weeks (Flexible)',
    level: 'Intermediate to Advanced',
    projectsCount: 8,
    skills: ['Generative AI', 'LLMs & RAG', 'PyTorch & TensorFlow', 'Computer Vision', 'LangChain', 'Prompt Engineering'],
    overview:
      'This comprehensive program trains you to build state-of-the-art Artificial Intelligence systems from scratch. Learn neural network architectures, fine-tune open-source LLMs (Llama 3, Mistral), build RAG pipelines, and deploy scalable AI agents into production.',
    modules: [
      {
        title: 'Module 1: Foundations of Artificial Intelligence & Math',
        topics: ['Linear Algebra & Matrix Operations', 'Probability & Inference', 'Python for AI Heavy Computing'],
      },
      {
        title: 'Module 2: Deep Learning & Neural Networks',
        topics: ['Convolutional Neural Networks (CNNs)', 'Recurrent Networks & LSTMs', 'PyTorch Framework & GPU Acceleration'],
      },
      {
        title: 'Module 3: Large Language Models (LLMs) & Generative AI',
        topics: ['Transformers & Self-Attention Mechanisms', 'Retrieval Augmented Generation (RAG)', 'LangChain & LlamaIndex Frameworks'],
      },
      {
        title: 'Module 4: AI Deployment & Autonomous Agents',
        topics: ['Building Multi-Agent Workflows', 'API Wrapper Development', 'Model Optimization & Quantization'],
      },
    ],
    careerOutcomes: ['AI Solutions Architect', 'Generative AI Engineer', 'NLP Specialist', 'Computer Vision Researcher'],
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics Professional',
    category: 'Data Science',
    icon: Database,
    color: 'from-purple-500 to-pink-600',
    badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-700/50',
    accentGlow: 'hover:border-purple-500/50 hover:shadow-purple-500/20',
    shortDesc:
      'Transform complex unstructured data into actionable business intelligence using Python, Pandas, SQL, Tableau, and Statistics.',
    duration: '20 Weeks',
    level: 'Beginner to Advanced',
    projectsCount: 10,
    skills: ['Python & Pandas', 'Advanced SQL', 'Tableau & PowerBI', 'Statistical Inference', 'Predictive Modeling', 'A/B Testing'],
    overview:
      'Become a high-impact Data Scientist capable of extracting deep commercial insights, crafting predictive dashboards, and driving data-first business strategies for Fortune 500 tech companies.',
    modules: [
      {
        title: 'Module 1: Exploratory Data Analysis & Python',
        topics: ['Pandas Data Wrangling', 'NumPy Numerical Computing', 'Seaborn & Matplotlib Visualization'],
      },
      {
        title: 'Module 2: Enterprise SQL & Data Warehousing',
        topics: ['Window Functions & CTEs', 'PostgreSQL & Snowflake Optimization', 'Data Pipeline ETL Architecture'],
      },
      {
        title: 'Module 3: Statistical Modeling & Hypothesis Testing',
        topics: ['Regression Analysis', 'ANOVA & Chi-Square Tests', 'Experimental Design & A/B Metrics'],
      },
      {
        title: 'Module 4: Predictive Business Intelligence & BI Tools',
        topics: ['Interactive Tableau Dashboards', 'Customer Lifetime Value (CLV)', 'Churn Prediction Systems'],
      },
    ],
    careerOutcomes: ['Lead Data Scientist', 'Business Intelligence Manager', 'Data Analyst Lead', 'Quantitative Strategist'],
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Engineering',
    category: 'Machine Learning',
    icon: Cpu,
    color: 'from-cyan-500 to-blue-600',
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50',
    accentGlow: 'hover:border-cyan-500/50 hover:shadow-cyan-500/20',
    shortDesc:
      'Build end-to-end Machine Learning pipelines, automated MLOps workflows, recommendation engines, and production APIs.',
    duration: '22 Weeks',
    level: 'Intermediate',
    projectsCount: 7,
    skills: ['Scikit-Learn', 'MLOps & MLflow', 'Feature Engineering', 'Kubeflow & Docker', 'XGBoost & LightGBM', 'Model Monitoring'],
    overview:
      'Bridge the gap between experimental machine learning models and high-throughput production microservices. Master algorithm selection, hyperparameter tuning, CI/CD for ML models, and continuous monitoring.',
    modules: [
      {
        title: 'Module 1: Supervised & Unsupervised Learning',
        topics: ['Decision Trees & Ensemble Learning', 'K-Means Clustering & PCA', 'Classification & Error Metrics'],
      },
      {
        title: 'Module 2: Feature Engineering & Model Optimizing',
        topics: ['Dimensionality Reduction', 'Hyperparameter Tuning (Optuna)', 'Imbalanced Dataset Handling'],
      },
      {
        title: 'Module 3: Industrial MLOps & Pipelines',
        topics: ['MLflow Experiment Tracking', 'Docker Containers for ML', 'Model Serving via FastAPI'],
      },
      {
        title: 'Module 4: Real-time Recommendation & Scaling',
        topics: ['Collaborative Filtering', 'Vector Databases (Pinecone/Weaviate)', 'Model Drift Monitoring'],
      },
    ],
    careerOutcomes: ['MLOps Engineer', 'Machine Learning Engineer', 'Algorithm Specialist', 'Data Infrastructure Engineer'],
  },
  {
    id: 'full-stack-development',
    title: 'Full Stack Development',
    category: 'Full Stack Development',
    icon: Code2,
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
    accentGlow: 'hover:border-emerald-500/50 hover:shadow-emerald-500/20',
    shortDesc:
      'Build modern, scalable web applications with React, Next.js, TypeScript, Node.js, Express, PostgreSQL, and Cloud Deployment.',
    duration: '24 Weeks',
    level: 'Beginner to Professional',
    projectsCount: 12,
    skills: ['Next.js & React', 'TypeScript', 'Node.js & Express', 'PostgreSQL & Prisma', 'Tailwind CSS', 'Docker & AWS Deployment'],
    overview:
      'Become a versatile Full Stack Developer ready for high-growth tech companies. Master front-end responsiveness, serverless API design, relational database modeling, security authentication, and automated cloud deployments.',
    modules: [
      {
        title: 'Module 1: Modern Web Foundations & UI Engineering',
        topics: ['HTML5 Semantic Markup', 'Tailwind CSS & Responsive Layouts', 'TypeScript Core & Async JavaScript'],
      },
      {
        title: 'Module 2: Advanced React & Next.js Architecture',
        topics: ['App Router & Server Components', 'State Management (Zustand/Redux)', 'REST & GraphQL API Integration'],
      },
      {
        title: 'Module 3: Backend Systems & Database Architecture',
        topics: ['Node.js Microservices', 'PostgreSQL Schema & Prisma ORM', 'JWT Authentication & Security Best Practices'],
      },
      {
        title: 'Module 4: DevOps, Cloud & AI Integration',
        topics: ['CI/CD Pipeline Configuration', 'Docker Containerization', 'Integrating Open-AI & Custom AI APIs'],
      },
    ],
    careerOutcomes: ['Full Stack Software Engineer', 'Frontend Architect', 'Backend Developer', 'Technical Co-founder'],
  },
];

export default function CourseCatalog() {
  const [selectedCourseModal, setSelectedCourseModal] = useState<Course | null>(null);

  const handleEnrollClick = (courseTitle: string) => {
    if (selectedCourseModal) {
      setSelectedCourseModal(null);
    }
    // Select course in enrollment dropdown & scroll
    const courseSelectElement = document.getElementById('courseInterested') as HTMLSelectElement;
    if (courseSelectElement) {
      // Find matching option
      for (let i = 0; i < courseSelectElement.options.length; i++) {
        if (courseSelectElement.options[i].value.toLowerCase().includes(courseTitle.substring(0, 10).toLowerCase())) {
          courseSelectElement.selectedIndex = i;
          courseSelectElement.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }

    const formElement = document.getElementById('enroll');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="courses" className="py-24 bg-slate-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-800/50 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Industry Curriculum
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Our <span className="gradient-text">Specialized Flagship Courses</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Designed in collaboration with lead engineers from premier tech firms. Gain real-world experience with hands-on projects and industry certifications.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {coursesData.map((course) => {
            const IconComponent = course.icon;
            return (
              <div
                key={course.id}
                className={`glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 border border-slate-800 ${course.accentGlow}`}
              >
                <div className="space-y-5">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${course.badgeColor}`}>
                      {course.category}
                    </span>
                    <div className="flex items-center text-slate-400 text-xs gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Header & Icon */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-xl bg-gradient-to-br ${course.color} text-white shadow-lg shrink-0`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-indigo-400 font-medium mt-1">Level: {course.level}</p>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {course.shortDesc}
                  </p>

                  {/* Key Skills Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {course.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium bg-slate-900/90 text-slate-300 px-2.5 py-1 rounded-md border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {course.skills.length > 4 && (
                      <span className="text-xs font-medium bg-slate-900/40 text-slate-400 px-2 py-1 rounded-md">
                        +{course.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setSelectedCourseModal(course)}
                    className="w-full sm:w-1/2 glass-card hover:bg-slate-800 text-slate-200 text-sm font-semibold py-3 px-4 rounded-xl border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>View Syllabus</span>
                    <ChevronRight className="w-4 h-4 text-indigo-400" />
                  </button>

                  <button
                    onClick={() => handleEnrollClick(course.title)}
                    className="w-full sm:w-1/2 gradient-button text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Course Detail Modal */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-card max-w-3xl w-full rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCourseModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3.5 rounded-xl bg-gradient-to-br ${selectedCourseModal.color} text-white shadow-lg`}>
                <selectedCourseModal.icon className="w-8 h-8" />
              </div>
              <div>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${selectedCourseModal.badgeColor}`}>
                  {selectedCourseModal.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedCourseModal.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span>Duration: {selectedCourseModal.duration}</span>
                  <span>•</span>
                  <span>Projects: {selectedCourseModal.projectsCount}+ Practical Labs</span>
                </div>
              </div>
            </div>

            {/* Program Overview */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-2">Program Overview</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedCourseModal.overview}</p>
              </div>

              {/* Modules Breakdown */}
              <div>
                <h4 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-3">Curriculum Modules</h4>
                <div className="space-y-3">
                  {selectedCourseModal.modules.map((mod, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <h5 className="text-sm font-bold text-white mb-2">{mod.title}</h5>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {mod.topics.map((t, tIdx) => (
                          <li key={tIdx} className="text-xs text-slate-300 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Outcomes */}
              <div>
                <h4 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-2">Career Pathways</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCourseModal.careerOutcomes.map((career, cIdx) => (
                    <span key={cIdx} className="text-xs font-semibold bg-indigo-950/60 text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-800/40">
                      🎯 {career}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedCourseModal(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => handleEnrollClick(selectedCourseModal.title)}
                  className="gradient-button text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
                >
                  <span>Proceed to Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
}
