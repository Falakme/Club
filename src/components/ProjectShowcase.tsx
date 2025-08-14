import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Github, ExternalLink, Calendar, User } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  github_link: string;
  demo_link: string | null;
  thumbnail_url: string | null;
  created_at: string;
  submitted_by: string;
  users?: {
    name: string;
    id: string;
  };
}

interface ProjectShowcaseProps {
  limit?: number;
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ limit }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedProjects();
  }, []);

  const fetchApprovedProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          users (
            name,
            id
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No projects to showcase yet.</div>
        <div className="text-gray-500 text-sm mt-2">Check back soon for amazing projects from our members!</div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <div key={project.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden hover:border-purple-500 transition-all duration-300 group">
          {/* Project Thumbnail */}
          <div className="relative h-48 bg-gray-800">
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl font-bold text-gray-600">
                  {project.title.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Project Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
              {project.title}
            </h3>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Project Meta */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
              {project.users ? (
                <Link
                  to={`/profile/${project.users.id}`}
                  className="flex items-center space-x-1 hover:text-purple-400 transition-colors"
                >
                  <User className="w-3 h-3" />
                  <span>{project.users.name}</span>
                </Link>
              ) : (
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>Anonymous</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(project.created_at)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex-1 justify-center"
              >
                <Github className="w-4 h-4" />
                <span>Code</span>
              </a>
              {project.demo_link && (
                <a
                  href={project.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex-1 justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectShowcase;