'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminLoginForm from '@/components/AdminLoginForm';
import AdminDashboard from '@/components/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  const checkSession = async () => {
    try {
      setCheckingAuth(true);
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (res.ok && data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLoginSuccess = (loggedInUser: { username: string; role: string }) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* If user is logged in, show Dashboard directly */}
      {user ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <>
          <Navbar />
          <main className="flex-1 flex items-center justify-center px-4 py-24 sm:py-32 relative overflow-hidden">
            {/* Background glowing gradients */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {checkingAuth ? (
              <div className="text-center space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
                <p className="text-sm text-slate-400 font-medium">Verifying admin session...</p>
              </div>
            ) : (
              <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
            )}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
