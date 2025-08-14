import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Plus, Edit, Trash2, X, CheckCircle, AlertCircle, Users } from 'lucide-react';

interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
  users?: {
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

const AchievementManagement: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    fetchAchievements();
    fetchUsers();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select(`
          *,
          users (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, status')
        .eq('status', 'approved')
        .order('name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteAchievement = async (achievementId: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', achievementId);

      if (error) throw error;

      setAchievements(achievements.filter(achievement => achievement.id !== achievementId));
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Achievement Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{achievements.length}</div>
          <div className="text-gray-400 text-sm">Total Achievements</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {new Set(achievements.map(a => a.user_id)).size}
          </div>
          <div className="text-gray-400 text-sm">Users with Achievements</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {achievements.length > 0 ? Math.round(achievements.length / new Set(achievements.map(a => a.user_id)).size * 10) / 10 : 0}
          </div>
          <div className="text-gray-400 text-sm">Avg per User</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-white mb-1">{users.length}</div>
          <div className="text-gray-400 text-sm">Eligible Users</div>
        </div>
      </div>

      {/* Achievements List */}
      {achievements.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No achievements created yet</p>
          <p className="text-gray-500 text-sm mt-2">Create your first achievement to recognize member contributions!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                    {achievement.description && (
                      <p className="text-gray-300 mb-3">{achievement.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{achievement.users?.name || 'Unknown User'}</span>
                      </span>
                      <span>{formatDate(achievement.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingAchievement(achievement)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAchievement(achievement.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Achievement Modal */}
      {(showCreateForm || editingAchievement) && (
        <AchievementFormModal
          achievement={editingAchievement}
          users={users}
          onClose={() => {
            setShowCreateForm(false);
            setEditingAchievement(null);
          }}
          onSuccess={() => {
            fetchAchievements();
            setShowCreateForm(false);
            setEditingAchievement(null);
          }}
        />
      )}
    </div>
  );
};

interface AchievementFormModalProps {
  achievement?: Achievement | null;
  users: User[];
  onClose: () => void;
  onSuccess: () => void;
}

const AchievementFormModal: React.FC<AchievementFormModalProps> = ({ 
  achievement, 
  users, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    user_id: achievement?.user_id || '',
    title: achievement?.title || '',
    description: achievement?.description || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (achievement) {
        // Update existing achievement
        const { error } = await supabase
          .from('achievements')
          .update({
            user_id: formData.user_id,
            title: formData.title,
            description: formData.description || null
          })
          .eq('id', achievement.id);

        if (error) throw error;
      } else {
        // Create new achievement
        const { error } = await supabase
          .from('achievements')
          .insert([{
            user_id: formData.user_id,
            title: formData.title,
            description: formData.description || null
          }]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      setError('Failed to save achievement. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            {achievement ? 'Edit Achievement' : 'Add New Achievement'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Select User</label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              required
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Achievement Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Hackathon Winner, Top Contributor, etc."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this achievement recognizes..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (achievement ? 'Update Achievement' : 'Add Achievement')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AchievementManagement;