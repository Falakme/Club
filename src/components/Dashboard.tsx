import React from 'react';
import { LogOut, Code, Users, Calendar, Trophy, Plus } from 'lucide-react';
import ProjectSubmissionForm from './ProjectSubmissionForm';
import EventRSVP from './EventRSVP';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userEmail, onLogout }) => {
  const [showProjectForm, setShowProjectForm] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'events'>('overview');

  const handleProjectSubmissionSuccess = () => {
    // Refresh or show success message
    console.log('Project submitted successfully');
  };

  return (
    <>
      <div className="min-h-screen bg-black py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome to The Falak Club</h1>
            <p className="text-gray-300">Signed in as {userEmail}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🎉 Congratulations! You're now a member!</h2>
          <p className="text-gray-300 leading-relaxed">
            Your application has been approved and you now have full access to The Falak Club platform. 
            Get ready to code, collaborate, and create amazing projects with fellow developers!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
            <Code className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">25+</div>
            <div className="text-gray-400 text-sm">Active Projects</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">50+</div>
            <div className="text-gray-400 text-sm">Club Members</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
            <Calendar className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">3</div>
            <div className="text-gray-400 text-sm">Weekly Events</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">12</div>
            <div className="text-gray-400 text-sm">Hackathons Won</div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'events'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Events & RSVP
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Upcoming Events</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">React Workshop</h4>
                  <p className="text-gray-400 text-sm">Tomorrow, 7:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Hack Night</h4>
                  <p className="text-gray-400 text-sm">Friday, 7:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">AI Hackathon</h4>
                  <p className="text-gray-400 text-sm">Next Saturday</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <button
              onClick={() => setShowProjectForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Submit New Project</span>
            </button>
          </div>

          {/* Recent Projects */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Featured Projects</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">StudySync AI</h4>
                <p className="text-gray-400 text-sm mb-3">AI-powered study companion for students</p>
                <div className="flex space-x-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">React</span>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Python</span>
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">AI</span>
                </div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">EcoTracker</h4>
                <p className="text-gray-400 text-sm mb-3">Carbon footprint tracking mobile app</p>
                <div className="flex space-x-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Flutter</span>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Node.js</span>
                </div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">CodeMentor</h4>
                <p className="text-gray-400 text-sm mb-3">Intelligent code review assistant</p>
                <div className="flex space-x-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">TypeScript</span>
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">OpenAI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'events' && (
          <EventRSVP userEmail={userEmail} />
        )}

        {/* Call to Action */}
        {activeTab === 'overview' && (
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-white/90 mb-6">
            Join our next coding session or start collaborating on a project. The community is here to support you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Join Next Event
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-purple-600 transition-colors">
              Browse Projects
            </button>
          </div>
        </div>
        )}
      </div>
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

export default Dashboard;