import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AdminAuthPage from './pages/AdminAuthPage';
import JoinPage from './pages/JoinPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

function App() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userStatus, setUserStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [adminRole, setAdminRole] = useState<'normal' | 'superadmin' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserStatus(session.user.email!);
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserStatus(session.user.email!);
        checkAdminStatus(session.user.id);
      } else {
        setUserStatus(null);
        setAdminRole(null);
        setLoading(false);
        if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')) {
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const checkUserStatus = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('status')
        .eq('email', email)
        .single();

      if (error) {
        // User not found in users table, create a basic entry
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: insertError } = await supabase
            .from('users')
            .upsert([
              {
                id: user.id,
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                email: user.email,
                status: 'pending'
              }
            ]);
          
          if (!insertError) {
            setUserStatus('pending');
          } else {
            console.error('Error creating user entry:', insertError);
            setUserStatus(null);
          }
        } else {
          setUserStatus(null);
        }
      } else {
        setUserStatus(data.status);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      // First check if user exists in admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('role')
        .eq('id', userId)
        .single();

      if (adminError) {
        // If not in admins table, check if they're in the hardcoded superadmin list
        const { data: { user } } = await supabase.auth.getUser();
        const superAdminEmails = ['abdulrahman@falak.me', 'aman@falak.me', 'theyjashri@falak.me', 'hessah@falak.me'];
        
        if (user && superAdminEmails.includes(user.email?.toLowerCase() || '')) {
          setAdminRole('superadmin');
        } else {
          setAdminRole(null);
        }
      } else {
        // User exists in admins table, use their role
        setAdminRole(adminData.role);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setAdminRole(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAdminRole(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/admin/auth" element={<AdminAuthPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/profile/:userId" element={<PublicProfilePage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard/*" 
        element={
          user && userStatus === 'approved' ? (
            <DashboardPage userEmail={user.email!} onLogout={handleLogout} />
          ) : user && userStatus === 'pending' ? (
            <Navigate to="/pending" replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
      
      <Route 
        path="/pending" 
        element={
          user && userStatus === 'pending' ? (
            <PendingApprovalPage userEmail={user.email!} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      <Route 
        path="/admin/*" 
        element={
          user && adminRole ? (
            <AdminPage adminRole={adminRole} onLogout={handleLogout} />
          ) : (
            user ? (
              <Navigate to="/access-denied" replace />
            ) : (
              <Navigate to="/admin/auth" replace />
            )
          )
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;