import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserCog, Plus, Edit, Trash2, X, CheckCircle, AlertCircle, Mail, Shield, Users } from 'lucide-react';

interface Admin {
  id: string;
  email: string;
  role: 'normal' | 'superadmin';
  created_at: string;
}

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to remove this admin? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      setAdmins(admins.filter(admin => admin.id !== adminId));
    } catch (error) {
      console.error('Error deleting admin:', error);
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
        <div className="text-white text-xl">Loading admin accounts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Admin Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <UserCog className="w-8 h-8 text-orange-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{admins.length}</div>
          <div className="text-gray-400 text-sm">Total Admins</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {admins.filter(a => a.role === 'normal').length}
          </div>
          <div className="text-gray-400 text-sm">Normal Admins</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {admins.filter(a => a.role === 'superadmin').length}
          </div>
          <div className="text-gray-400 text-sm">Superadmins</div>
        </div>
      </div>

      {/* Admins List */}
      {admins.length === 0 ? (
        <div className="text-center py-12">
          <UserCog className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No admin accounts found</p>
          <p className="text-gray-500 text-sm mt-2">Add your first admin to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {admins.map((admin) => (
            <div key={admin.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    admin.role === 'superadmin' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-orange-600'
                  }`}>
                    {admin.role === 'superadmin' ? (
                      <Users className="w-6 h-6 text-white" />
                    ) : (
                      <Shield className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{admin.email}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        admin.role === 'superadmin' 
                          ? 'bg-purple-900 text-purple-300' 
                          : 'bg-orange-900 text-orange-300'
                      }`}>
                        {admin.role === 'superadmin' ? 'Superadmin' : 'Normal Admin'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>Added {formatDate(admin.created_at)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingAdmin(admin)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAdmin(admin.id)}
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

      {/* Create/Edit Admin Modal */}
      {(showCreateForm || editingAdmin) && (
        <AdminFormModal
          admin={editingAdmin}
          onClose={() => {
            setShowCreateForm(false);
            setEditingAdmin(null);
          }}
          onSuccess={() => {
            fetchAdmins();
            setShowCreateForm(false);
            setEditingAdmin(null);
          }}
        />
      )}
    </div>
  );
};

interface AdminFormModalProps {
  admin?: Admin | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminFormModal: React.FC<AdminFormModalProps> = ({ admin, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: admin?.email || '',
    role: admin?.role || 'normal' as 'normal' | 'superadmin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (admin) {
        // Update existing admin
        const { error } = await supabase
          .from('admins')
          .update({
            email: formData.email,
            role: formData.role
          })
          .eq('id', admin.id);

        if (error) throw error;
      } else {
        // Create new admin - first check if user exists in auth
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          setError('Unable to verify user. Please ensure the email exists in the system.');
          return;
        }

        const existingUser = authUsers.users.find(u => u.email === formData.email);
        
        if (!existingUser) {
          setError('User with this email does not exist. Please ask them to create an account first.');
          return;
        }

        // Add to admins table
        const { error } = await supabase
          .from('admins')
          .insert([{
            id: existingUser.id,
            email: formData.email,
            role: formData.role
          }]);

        if (error) {
          if (error.code === '23505') {
            setError('This user is already an admin.');
          } else {
            throw error;
          }
          return;
        }
      }

      onSuccess();
    } catch (error: any) {
      if (error.message?.includes('duplicate key')) {
        setError('This user is already an admin.');
      } else {
        setError('Failed to save admin. Please try again.');
      }
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
            {admin ? 'Edit Admin' : 'Add New Admin'}
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
            <label className="block text-white font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@school.edu"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              required
              disabled={!!admin}
            />
            {!admin && (
              <p className="text-gray-400 text-sm mt-2">
                The user must already have an account in the system
              </p>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Admin Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              required
            >
              <option value="normal">Normal Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <div className="mt-3 space-y-2 text-sm text-gray-400">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-orange-400 font-medium">Normal Admin:</span> Can approve/reject projects and manage events
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-purple-400 font-medium">Superadmin:</span> Can do everything + manage users and admin accounts
                </div>
              </div>
            </div>
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
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (admin ? 'Update Admin' : 'Add Admin')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminManagement;