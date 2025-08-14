import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Code, Users, Calendar, Trophy, Plus, User, Settings, Home, FolderOpen } from 'lucide-react';
import ProjectSubmissionForm from '../components/ProjectSubmissionForm';
import EventRSVP from '../components/EventRSVP';
import ProfilePage from './ProfilePage';

interface DashboardPageProps {
  userEmail: string;
  onLogout: () => void;
}

interface DashboardStats {
  approvedProjects: number;
  upcomingEvents: number;
  achievements: number;
  totalMembers: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'event';
  title: string;
  description: string;
  date: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ userEmail, onLogout }) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    approvedProjects: 0,
    upcomingEvents: 0,
    achievements: 0,
    totalMembers: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchCurrentUser();
  }, [userEmail]);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();
        
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [projectsRes, eventsRes, achievementsRes, membersRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('events').select('id', { count: 'exact' }).gte('date', new Date().toISOString().split('T')[0]),
        supabase.from('achievements').select('id', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact' }).eq('status', 'approved')
      ]);

      setStats({
        approvedProjects: projectsRes.count || 0,
        upcomingEvents: eventsRes.count || 0,
        achievements: achievementsRes.count || 0,
        totalMembers: membersRes.count || 0
      });

      // Fetch recent activity
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('id, title, description, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: recentEvents } = await supabase
        .from('events')
        .select('id, title, description, created_at')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false })
        .limit(3);

      const activity: RecentActivity[] = [
        ...(recentProjects || []).map(p => ({
          id: p.id,
          type: 'project' as const,
          title: p.title,
          description: p.description,
          date: p.created_at
        })),
        ...(recentEvents || []).map(e => ({
          id: e.id,
          type: 'event' as const,
          title: e.title,
          description: e.description,
          date: e.created_at
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleProjectSubmissionSuccess = () => {
    fetchDashboardData();
  };

  return (
    <>
      <div className="min-h-screen bg-black">
        {/* Navigation */}
        <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-2xl font-bold text-white">
                  The Falak Club
                </Link>
                <div className="hidden md:flex space-x-6">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard/events"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Events</span>
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">{userEmail}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="py-8 px-6 md:px-12">
              <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2">Welcome back!</h1>
                  <p className="text-gray-300">Here's what's happening in The Falak Club</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
                    <FolderOpen className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stats.approvedProjects}</div>
                    <div className="text-gray-400 text-sm">Approved Projects</div>
                  </div>
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
                    <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stats.upcomingEvents}</div>
                    <div className="text-gray-400 text-sm">Upcoming Events</div>
                  </div>
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
                    <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stats.achievements}</div>
                    <div className="text-gray-400 text-sm">Total Achievements</div>
                  </div>
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
                    <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stats.totalMembers}</div>
                    <div className="text-gray-400 text-sm">Active Members</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-left"
                  >
                    <Plus className="w-8 h-8 mb-3" />
                    <h3 className="text-xl font-bold mb-2">Submit Project</h3>
                    <p className="text-white/80">Share your latest creation with the community</p>
                  </button>

                  <Link
                    to="/dashboard/events"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-left block"
                  >
                    <Calendar className="w-8 h-8 mb-3" />
                    <h3 className="text-xl font-bold mb-2">View Events</h3>
                    <p className="text-white/80">RSVP to upcoming workshops and meetups</p>
                  </Link>

                  <Link
                    to="/dashboard/profile"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-left block"
                  >
                    <User className="w-8 h-8 mb-3" />
                    <h3 className="text-xl font-bold mb-2">Edit Profile</h3>
                    <p className="text-white/80">Update your profile and showcase your skills</p>
                  </Link>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <p className="text-gray-400">No recent activity</p>
                    ) : (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            activity.type === 'project' ? 'bg-purple-600' : 'bg-blue-600'
                          }`}>
                            {activity.type === 'project' ? (
                              <Code className="w-5 h-5 text-white" />
                            ) : (
                              <Calendar className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{activity.title}</h4>
                            <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                            <p className="text-gray-500 text-xs mt-2">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/events" element={
            <div className="py-8 px-6 md:px-12">
              <div className="max-w-7xl mx-auto">
                <EventRSVP userEmail={userEmail} />
              </div>
            </div>
          } />
          <Route path="/profile" element={
            <ProfilePage currentUser={currentUser} />
          } />
        </Routes>
      </div>

      {/* Project Submission Form Modal */}
      {showProjectForm && (
        <ProjectSubmissionForm
          onClose={() => setShowProjectForm(false)}
          onSuccess={handleProjectSubmissionSuccess}
        />
      )}
    </>
  );
};

export default DashboardPage;