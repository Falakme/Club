import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, CheckCircle, XCircle, Github, ExternalLink, Calendar, User } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  github_link: string;
  demo_link: string | null;
  thumbnail_url: string | null;
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  users?: {
    name: string;
    email: string;
  };
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          users!submitted_by(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', projectId);

      if (error) throw error;

      // Update local state
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, status } : project
      ));
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const getStatusCounts = () => {
    return {
      all: projects.length,
      pending: projects.filter(p => p.status === 'pending').length,
      approved: projects.filter(p => p.status === 'approved').length,
      rejected: projects.filter(p => p.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Project Management</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
          <FileText className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{statusCounts.all}</div>
          <div className="text-gray-400 text-sm">Total Projects</div>
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
            { key: 'all', label: 'All Projects', count: statusCounts.all },
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

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            {filter === 'all' ? 'No projects submitted yet' : `No ${filter} projects`}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {filter === 'all' ? 'Projects will appear here once members start submitting!' : ''}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{project.users?.name || 'Unknown User'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
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
                            <ExternalLink className="w-4 h-4" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          project.status === 'approved' ? 'bg-green-900 text-green-300' :
                          project.status === 'rejected' ? 'bg-red-900 text-red-300' :
                          'bg-yellow-900 text-yellow-300'
                        }`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {project.thumbnail_url && (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-24 h-24 object-cover rounded-lg ml-6"
                      />
                    )}
                  </div>

                  {project.status === 'pending' && (
                    <div className="flex space-x-3 pt-4 border-t border-gray-700">
                      <button
                        onClick={() => updateProjectStatus(project.id, 'approved')}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => updateProjectStatus(project.id, 'rejected')}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;