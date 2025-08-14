import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import JoinClubForm from '../components/JoinClubForm';

const JoinPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

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
      <JoinClubForm currentUser={currentUser} />
    </div>
  );
};

export default JoinPage;