import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Api/supabaseClient';
import './Header.css';
import { FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt, FaSignOutAlt, FaChevronDown,FaProductHunt } from 'react-icons/fa';

export const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] || 'Guest';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>
        <h4>IntelliQuest</h4><br /><p>{displayName}</p>
      </div>
      <nav className="nav-links">
        <button onClick={() => navigate('/')}>
          <FaHome /> <span>Home</span>
        </button>
        <button onClick={() => navigate('/about')}>
          <FaInfoCircle /> <span>About</span>
        </button>
        <button onClick={() => navigate('/contact')}>
          <FaEnvelope /> <span>Contact</span>
        </button>

        {/* Products Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn">
          <FaProductHunt />Products <FaChevronDown />
          </button>
          <div className="dropdown-content">
            <button onClick={() => navigate('/question')}>Question Generation</button>
            <button onClick={()=>navigate('/analyser')}>Resume Checker</button>
          </div>
        </div>

        {user ? (
          <button onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        ) : (
          <button onClick={() => navigate('/login')}>
            <FaSignInAlt /> <span>Login</span>
          </button>
        )}
      </nav>
    </header>
  );
};
