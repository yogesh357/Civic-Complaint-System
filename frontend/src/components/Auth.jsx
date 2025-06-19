import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = ({ mode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // In a real app, you would call your authentication API here
      const userData = {
        email,
        name: mode === 'register' ? name : 'User',
        type: email.endsWith('@city.gov') ? 'department' : 'citizen'
      };
      
      login(userData);
      navigate(mode === 'login' ? '/' : '/submit-complaint');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        
        <button type="submit" className="submit-btn">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      
      <div className="auth-footer">
        {mode === 'login' ? (
          <p>Don't have an account? <button onClick={() => navigate('/register')}>Register</button></p>
        ) : (
          <p>Already have an account? <button onClick={() => navigate('/login')}>Login</button></p>
        )}
      </div>
    </div>
  );
};

export default Auth;