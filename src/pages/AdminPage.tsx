import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LogOut, Users, FolderOpen, Calendar, Trophy, Settings, Shield, UserCog } from 'lucide-react';
import ProjectManagement from '../components/ProjectManagement';
import UserManagement from '../components/UserManagement';
import EventManagement from '../components/EventManagement';
import AchievementManagement from '../components/AchievementManagement';
import AdminManagement from '../components/AdminManagement';

interface AdminPageProps {
  adminRole: 'normal' | 'superadmin';
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ adminRole, onLogout }) => {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link to="/admin" className="text-2xl font-bold text-white">
                Admin Dashboard
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Projects</span>
                </Link>
                {adminRole === 'superadmin' && (
                  <Link
                    to="/admin/users"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                  </Link>
                )}
                <Link
                  to="/admin/events"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Events</span>
                </Link>
                <Link
                  to="/admin/achievements"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Achievements</span>
                </Link>
                {adminRole === 'superadmin' && (
                  <Link
                    to="/admin/manage-admins"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <UserCog className="w-4 h-4" />
                    <span>Manage Admins</span>
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm capitalize">{adminRole} Admin</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <div className="py-8 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <ProjectManagement />
            </div>
          </div>
        } />
        {adminRole === 'superadmin' && (
          <Route path="/users" element={
            <div className="py-8 px-6 md:px-12">
              <div className="max-w-7xl mx-auto">
                <UserManagement />
              </div>
            </div>
          } />
        )}
        <Route path="/events" element={
          <div className="py-8 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <EventManagement isAdmin={true} />
            </div>
          </div>
        } />
        <Route path="/achievements" element={
          <div className="py-8 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <AchievementManagement />
            </div>
          </div>
        } />
        {adminRole === 'superadmin' && (
          <Route path="/manage-admins" element={
            <div className="py-8 px-6 md:px-12">
              <div className="max-w-7xl mx-auto">
                <AdminManagement />
              </div>
            </div>
          } />
        )}
      </Routes>
    </div>
  );
};

export default AdminPage;