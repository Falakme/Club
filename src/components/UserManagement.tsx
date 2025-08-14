import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, CheckCircle, XCircle, Mail, Calendar, BookOpen, Github } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  grade: number;
  github_username: string;
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.status === filter;
  });

  const getStatusCounts = () => {
    return {
      all: users.length,
      pending: users.filter(u => u.status === 'pending').length,
      approved: users.filter(u => u.status === 'approved').length,
      rejected: users.filter(u => u.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">User Management</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{statusCounts.all}</div>
          <div className="text-gray-400 text-sm">Total Users</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{statusCounts.pending}</div>
          <div className="text-gray-400 text-sm">Pending Review</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{statusCounts.approved}</div>
          <div className="text-gray-400 text-sm">Approved</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{statusCounts.rejected}</div>
          <div className="text-gray-400 text-sm">Rejected</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-800">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Users', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'approved', label: 'Approved', count: statusCounts.approved },
            { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                filter === tab.key
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            {filter === 'all' ? 'No users found' : `No ${filter} users`}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {filter === 'all' ? 'User applications will appear here for review!' : ''}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{user.name}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Grade {user.grade}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Github className="w-4 h-4" />
                      <span>@{user.github_username}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Applied {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {user.bio && (
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Bio:</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
                    </div>
                  )}

                  <div className="flex items-center">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.status === 'approved' ? 'bg-green-900 text-green-300' :
                      user.status === 'rejected' ? 'bg-red-900 text-red-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                </div>

                {user.status === 'pending' && (
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <button
                      onClick={() => updateUserStatus(user.id, 'approved')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => updateUserStatus(user.id, 'rejected')}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;