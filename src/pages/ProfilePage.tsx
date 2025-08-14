import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Github, Linkedin, Mail, Edit, Save, X, Upload, Plus, Trash2 } from 'lucide-react';

interface Profile {
  user_id: string;
  profile_pic_url: string | null;
  bio: string | null;
  skills: string[] | null;
  github_link: string | null;
  linkedin_link: string | null;
}

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

interface ProfilePageProps {
  currentUser?: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [allUserProjects, setAllUserProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    bio: '',
    github_link: '',
    linkedin_link: '',
    profile_pic_url: ''
  });

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
      fetchAchievements();
      fetchAllUserProjects();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          bio: data.bio || '',
          github_link: data.github_link || '',
          linkedin_link: data.linkedin_link || '',
          profile_pic_url: data.profile_pic_url || ''
        });
      } else {
        // Create empty profile
        const newProfile = {
          user_id: currentUser.id,
          profile_pic_url: null,
          bio: null,
          skills: null,
          github_link: null,
          linkedin_link: null
        };
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchAllUserProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('submitted_by', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllUserProjects(data || []);
      
      // Also set approved projects for the existing section
      const approvedProjects = (data || []).filter(project => project.status === 'approved');
      setUserProjects(approvedProjects);
    } catch (error) {
      console.error('Error fetching all user projects:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      setFormData({
        ...formData,
        profile_pic_url: publicUrl
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && profile) {
      const currentSkills = profile.skills || [];
      if (!currentSkills.includes(newSkill.trim())) {
        setProfile({
          ...profile,
          skills: [...currentSkills, newSkill.trim()]
        });
        setNewSkill('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: (profile.skills || []).filter(skill => skill !== skillToRemove)
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const profileData = {
        user_id: currentUser.id,
        profile_pic_url: formData.profile_pic_url || null,
        bio: formData.bio || null,
        skills: profile?.skills || null,
        github_link: formData.github_link || null,
        linkedin_link: formData.linkedin_link || null
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      setProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        github_link: profile.github_link || '',
        linkedin_link: profile.linkedin_link || '',
        profile_pic_url: profile.profile_pic_url || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="py-8 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {(isEditing ? formData.profile_pic_url : profile?.profile_pic_url) ? (
                    <img
                      src={isEditing ? formData.profile_pic_url : profile?.profile_pic_url!}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </label>
                  )}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mt-4">{currentUser?.name}</h2>
                <p className="text-gray-400">{currentUser?.email}</p>
                <p className="text-gray-400">Grade {currentUser?.grade}</p>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Bio</h3>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                ) : (
                  <p className="text-gray-300">
                    {profile?.bio || 'No bio added yet.'}
                  </p>
                )}
              </div>

              {/* Links */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">GitHub</label>
                        <input
                          type="url"
                          value={formData.github_link}
                          onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                          placeholder="https://github.com/username"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">LinkedIn</label>
                        <input
                          type="url"
                          value={formData.linkedin_link}
                          onChange={(e) => setFormData({ ...formData, linkedin_link: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {profile?.github_link && (
                        <a
                          href={profile.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {profile?.linkedin_link && (
                        <a
                          href={profile.linkedin_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {!profile?.github_link && !profile?.linkedin_link && (
                        <p className="text-gray-400 text-sm">No links added yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Skills</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <button
                      onClick={addSkill}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.skills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-300 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(profile?.skills || []).length > 0 ? (
                    (profile?.skills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">No skills added yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
              {achievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-lg"
                    >
                      <h4 className="text-white font-bold mb-2">{achievement.title}</h4>
                      {achievement.description && (
                        <p className="text-white/80 text-sm">{achievement.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No achievements yet. Keep contributing to earn badges!</p>
              )}
            </div>

            {/* All Submitted Projects */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">All My Submissions</h3>
              {allUserProjects.length > 0 ? (
                <div className="grid gap-4">
                  {allUserProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-white font-bold">{project.title}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              project.status === 'approved' ? 'bg-green-900 text-green-300' :
                              project.status === 'rejected' ? 'bg-red-900 text-red-300' :
                              'bg-yellow-900 text-yellow-300'
                            }`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                          <div className="flex items-center space-x-4 mb-3">
                            <a
                              href={project.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                            >
                              <Github className="w-4 h-4" />
                              <span>GitHub</span>
                            </a>
                            {project.demo_link && (
                              <a
                                href={project.demo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                              >
                                <span>Demo</span>
                              </a>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Submitted: {new Date(project.created_at).toLocaleDateString()}</span>
                            {project.status === 'pending' && (
                              <span className="text-yellow-400">⏳ Awaiting review</span>
                            )}
                            {project.status === 'approved' && (
                              <span className="text-green-400">✅ Approved & showcased</span>
                            )}
                            {project.status === 'rejected' && (
                              <span className="text-red-400">❌ Not approved</span>
                            )}
                          </div>
                        </div>
                        {project.thumbnail_url && (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-16 h-16 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400">No projects submitted yet.</div>
                  <div className="text-gray-500 text-sm mt-2">Submit your first project from the dashboard!</div>
                </div>
              )}
            </div>

            {/* Projects */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Approved Projects</h3>
              {userProjects.length > 0 ? (
                <div className="grid gap-4">
                  {userProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-bold mb-2">{project.title}</h4>
                          <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                          <div className="flex space-x-4">
                            <a
                              href={project.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                            >
                              <Github className="w-4 h-4" />
                              <span>Code</span>
                            </a>
                            {project.demo_link && (
                              <a
                                href={project.demo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                              >
                                <span>Demo</span>
                              </a>
                            )}
                          </div>
                        </div>
                        {project.thumbnail_url && (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-16 h-16 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No approved projects yet. Submit your first project!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;