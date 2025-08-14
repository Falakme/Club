import React from 'react';
import { Clock, Mail, CheckCircle, LogOut } from 'lucide-react';

interface PendingApprovalProps {
  userEmail: string;
  onLogout: () => void;
}

const PendingApproval: React.FC<PendingApprovalProps> = ({ userEmail, onLogout }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-12">
          {/* Icon */}
          <div className="w-24 h-24 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-6">Application Under Review</h1>

          {/* Message */}
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Thank you for applying to join The Falak Club! Your application is currently being reviewed by our admin team.
            You'll receive an email notification at <span className="text-purple-400 font-medium">{userEmail}</span> once 
            your application has been processed.
          </p>

          {/* What happens next */}
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Our admin team reviews your application</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">You'll receive an email with the decision</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">If approved, you'll gain access to the platform</span>
              </div>
            </div>
          </div>

          {/* Benefits reminder */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-orange-400 mb-4">What you'll get as a member:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Access to weekly coding sessions</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Collaborate on exciting projects</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Mentorship opportunities</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Networking with peers</span>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Questions?</span>
            </div>
            <p className="text-gray-300">
              Contact us at <a href="mailto:hello@falakclub.dev" className="text-purple-400 hover:text-purple-300">clubs@falak.me</a>
            </p>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors mx-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;