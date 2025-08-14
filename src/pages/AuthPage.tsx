import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="text-center mb-12">
        <Link
          to="/"
          className="text-purple-400 hover:text-purple-300 transition-colors mb-8 inline-block"
        >
          ← Back to Home
        </Link>
      </div>
      <AuthForm />
    </div>
  );
};

export default AuthPage;