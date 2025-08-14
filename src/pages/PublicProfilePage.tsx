import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, Github, Linkedin, ArrowLeft, Calendar } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  grade: number;
  github_username: string;
  bio: string;
  created_at: string;
  profiles?: {
    profile_pic_url: string | null;
    bio: string | null;
    skills: string[] | null;
    github_link: string | null;
    linkedin_link: string | null;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  github_link: string;
  demo_link: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      // Fetch user data with profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          profiles (
            profile_pic_url,
            bio,
            skills,
            github_link,
            linkedin_link
          )
        `)
        .eq('id', userId)
        .eq('status', 'approved')
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          setError('User not found or not approved');
        } else {
          throw userError;
        }
        return;
      }

      setUser(userData);

      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);

      // Fetch approved projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('submitted_by', userId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Profile not found'}</div>
          <Link
            to="/"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 sticky top-8">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                {user.profiles?.profile_pic_url ? (
                  <img
                    src={user.profiles.profile_pic_url}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
                <h1 className="text-2xl font-bold text-white mt-4">{user.name}</h1>
                <p className="text-gray-400">Grade {user.grade}</p>
                <p className="text-gray-500 text-sm">@{user.github_username}</p>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {user.profiles?.bio || user.bio || 'No bio available.'}
                </p>
              </div>

              {/* Skills */}
              {user.profiles?.skills && user.profiles.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profiles.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
                <div className="space-y-2">
                  {user.profiles?.github_link && (
                    <a
                      href={user.profiles.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {user.profiles?.linkedin_link && (
                    <a
                      href={user.profiles.linkedin_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="text-center pt-4 border-t border-gray-700">
                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Achievements */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
              {achievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-lg"
                    >
                      <h3 className="text-white font-bold mb-2">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-white/80 text-sm mb-2">{achievement.description}</p>
                      )}
                      <p className="text-white/60 text-xs">
                        Earned {formatDate(achievement.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400">No achievements yet</div>
                </div>
              )}
            </div>

            {/* Projects */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Projects</h2>
              {projects.length > 0 ? (
                <div className="grid gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                          <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                          <div className="flex items-center space-x-4 mb-4">
                            <a
                              href={project.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              <Github className="w-4 h-4" />
                              <span>View Code</span>
                            </a>
                            {project.demo_link && (
                              <a
                                href={project.demo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <span>Live Demo</span>
                              </a>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm">
                            Created {formatDate(project.created_at)}
                          </p>
                        </div>
                        {project.thumbnail_url && (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-24 h-24 object-cover rounded-lg ml-6"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400">No projects yet</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;