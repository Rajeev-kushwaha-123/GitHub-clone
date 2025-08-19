import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/logo123.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { setCurrentUser } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://13.204.45.96:3002/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
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
            <h1 className="auth-title">Sign In</h1>
          </Box>
        </div>

        <form onSubmit={handleLogin} className="login-box">
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
              autoComplete="current-password"
              name="password"
              id="password"
              className={getInputClassName('password')}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
                <span style={{ marginLeft: '8px' }}>Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="pass-box">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;