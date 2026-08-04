'use client';

import React, { useState, useEffect } from 'react';
import { Bot, GraduationCap, Menu, X, Sparkles, PhoneCall, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#hero' },
    { name: 'Courses', href: '/#courses' },
    { name: 'Enrollment', href: '/#enroll' },
    { name: 'AI Voice Counselor', href: '/#voice-agent' },
    { name: 'Contact Us', href: '/#contact' },
    { name: 'Admin Portal', href: '/admin' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3 shadow-2xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/#hero" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
              Edu<span className="gradient-text">AI</span> Academy
            </span>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold block -mt-1">
              Future Skills Platform
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              {link.name === 'AI Voice Counselor' && <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
              {link.name === 'Admin Portal' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#enroll"
            className="gradient-button text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Enroll Now</span>
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white focus:outline-none p-2 rounded-lg bg-slate-900/50 border border-slate-800"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-slate-800 px-4 pt-3 pb-6 mt-3 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-200 hover:text-indigo-400 py-2 border-b border-slate-800/50"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#enroll"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center gradient-button text-white text-sm font-semibold px-5 py-3 rounded-xl block shadow-lg mt-4"
          >
            Enroll Now
          </a>
        </div>
      )}
    </header>
  );
}
