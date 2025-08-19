import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/logo123.png";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({});
  const { setCurrentUser } = useAuth();

  // Password strength checker
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) setPasswordStrength("weak");
    else if (strength <= 3) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  }, [password]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://13.204.45.96:3002/signup", {
        email: email,
        password: password,
        username: username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    return `input ${errors[fieldName] ? 'error' : ''}`;
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <h1 className="auth-title">Sign Up</h1>
          </Box>
        </div>
        
        <form onSubmit={handleSignup} className="login-box">
          <div className="input-group">
            <label className="label" htmlFor="username">Username</label>
            <input
              autoComplete="username"
              name="username"
              id="username"
              className={getInputClassName('username')}
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <div className="error-message">
                <span>⚠</span>
                {errors.username}
              </div>
            )}
          </div>
          
          <div className="input-group">
            <label className="label" htmlFor="email">Email address</label>
            <input
              autoComplete="email"
              name="email"
              id="email"
              className={getInputClassName('email')}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <div className="error-message">
                <span>⚠</span>
                {errors.email}
              </div>
            )}
          </div>
          
          <div className="input-group">
            <label className="label" htmlFor="password">Password</label>
            <input
              autoComplete="new-password"
              name="password"
              id="password"
              className={getInputClassName('password')}
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordStrength && (
              <div className={`password-strength ${passwordStrength}`}>
                Password strength: {passwordStrength}
              </div>
            )}
            {errors.password && (
              <div className="error-message">
                <span>⚠</span>
                {errors.password}
              </div>
            )}
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                <span style={{ marginLeft: '8px' }}>Creating Account...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        
        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;