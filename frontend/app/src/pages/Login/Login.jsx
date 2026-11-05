import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    if (token && user) {
      navigate(user.role === 'instructor' ? '/instructor' : '/student', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({
      ...formData,
      role: selectedRole
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authService.login(formData.email, formData.password);
      } else {
        response = await authService.register(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        );
      }

      const role = response.role || response.user?.role || formData.role;
      if (role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/student');
      }
    } catch (err) {
      console.error('Auth error:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'An error occurred during authentication';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Classroom Progress Tracker</h1>
        <h2>{isLogin ? 'Login' : 'Create an Account'}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="role-selector-container">
          <label className="role-label">{isLogin ? 'Login as:' : 'Register as:'}</label>
          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('student')}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-btn ${formData.role === 'instructor' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('instructor')}
            >
              Instructor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? `Login as ${formData.role === 'instructor' ? 'Instructor' : 'Student'}` : `Register as ${formData.role === 'instructor' ? 'Instructor' : 'Student'}`)}
          </button>
        </form>

        <p className="toggle-form">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
