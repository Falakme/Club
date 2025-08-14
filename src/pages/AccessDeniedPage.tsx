import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, AlertTriangle } from 'lucide-react';

const AccessDeniedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-12">
          {/* Icon */}
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-6">Access Denied</h1>

          {/* Message */}
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            You don't have permission to access the admin dashboard. This area is restricted to 
            authorized administrators only.
          </p>

          {/* Additional Info */}
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">Administrator Access Required</span>
            </div>
            <p className="text-gray-300 text-sm">
              If you believe you should have access to this area, please contact your system administrator 
              or the club leadership team.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/admin/auth"
              className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors border border-gray-700"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;