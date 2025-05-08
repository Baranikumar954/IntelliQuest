import React, { useState, useEffect } from 'react';
import { supabase } from '../Api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../PageStyles/Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Handle session when user returns from OAuth login (e.g., Google)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
    });

    // Check if session already exists (e.g., user already logged in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });

    // Cleanup the subscription on component unmount
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorMsg(error.message);
    else navigate('/');
  };

  const handleSignup = async () => {
    setErrorMsg('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setErrorMsg(error.message);
    else alert('Signup successful! Please check your email for verification.');
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/home' // Change if deployed
      }
    });
    if (error) setErrorMsg(error.message);
  };

  return (
    <div>
      <div className="login-container">
        <h2 className="login-title">Welcome to IntelliQuest</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <div className="login-buttons">
          <button className="btn" onClick={handleLogin}>Login</button>
          <button className="btn secondary" onClick={handleSignup}>Signup</button>
        </div>

        <div className="oauth-section">
          <p>Or continue with</p>
          <button className="btn google" onClick={handleGoogleLogin}>Google</button>
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}
      </div>

    </div>
  );
};
