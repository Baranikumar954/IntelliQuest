import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../Api/supabaseClient';

export const PrivateRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  return session ? children : <Navigate to="/login" />;
};

