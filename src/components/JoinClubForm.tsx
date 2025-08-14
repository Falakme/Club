import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, Github, Mail, BookOpen, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  grade: string;
  github_username: string;
  bio: string;
}

interface JoinClubFormProps {
  currentUser: SupabaseUser | null;
}

const JoinClubForm: React.FC<JoinClubFormProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: currentUser?.email || '',
    grade: '',
    github_username: '',
    bio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      if (!currentUser) {
        setErrorMessage('You must be signed in to complete your profile.');
        setSubmitStatus('error');
        return;
      }

      const { error } = await supabase
        .from('users')
        .update(
          {
            name: formData.name,
            grade: parseInt(formData.grade),
            github_username: formData.github_username,
            bio: formData.bio,
            status: 'approved' // Auto-approve since they're already authenticated
          }
        )
        .eq('id', currentUser.id);

      if (error) {
        setErrorMessage('Failed to update profile. Please try again.');
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          grade: '',
          github_username: '',
          bio: ''
        });
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Profile Completed!</h3>
          <p className="text-gray-300 mb-6">
            Welcome to The Falak Club! Your profile has been completed and you now have access to the dashboard.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Complete Your Profile</h2>
        <p className="text-gray-300">
          Complete your profile to get full access to The Falak Club dashboard.
        </p>
      </div>

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2 flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2 flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@school.edu"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            disabled
            required
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2 flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Grade Level</span>
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            required
          >
            <option value="">Select your grade</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-medium mb-2 flex items-center space-x-2">
            <Github className="w-4 h-4" />
            <span>GitHub Username</span>
          </label>
          <input
            type="text"
            name="github_username"
            value={formData.github_username}
            onChange={handleInputChange}
            placeholder="your-github-username"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Short Bio</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself, your coding experience, and why you want to join..."
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating Profile...' : 'Complete Profile →'}
        </button>
      </form>
    </div>
  );
};

export default JoinClubForm;