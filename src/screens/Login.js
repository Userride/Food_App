import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://eatfit-ecwm.onrender.com/api/loginuser", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    });

    const json = await response.json();
    console.log(json);

    if (!json.success) {
      alert("Enter valid credentials");
    } else {
      // *** FIX: Save authToken and the new userId ***
      localStorage.setItem("authToken", json.authToken);
      localStorage.setItem("userId", json.userId); // <-- Corrected from json.user
      
      console.log("Logged in, userId saved:", json.userId); // For debugging
      navigate("/");
    }
  };

  // Google login
  const handleGoogleLogin = () => {
    window.open("https://eatfit-ecwm.onrender.com/auth/google", "_self");
  };

  const onChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const containerStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9
  };

  const formStyle = {
    background: '#353935',
    color: 'white',
    padding: '20px',
    opacity: 0.95,
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '450px',
    maxWidth: '90%'
  };

  const googleBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    color: '#3c4043',
    border: '1px solid #dadce0',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '500',
    padding: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
    width: '100%'
  };

  const googleIconStyle = {
    height: '20px',
    width: '20px',
    marginRight: '10px'
  };

  const handleHover = (e, enter) => {
    if (enter) {
      e.currentTarget.style.backgroundColor = '#f7f8f8';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
    } else {
      e.currentTarget.style.backgroundColor = 'white';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h3 className="text-center mb-3">Welcome Back 👋</h3>
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            name='email'
            value={credentials.email}
            onChange={onChange}
            id="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text text-light">
            We'll never share your email with anyone else.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name='password'
            value={credentials.password}
            onChange={onChange}
            id="password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
        <Link to="/createuser" className='btn btn-outline-light w-100 mb-3'>I'm a new user</Link>

        {/* ✅ Realistic Google login button */}
        <div
          style={googleBtnStyle}
          onClick={handleGoogleLogin}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            style={googleIconStyle}
          />
          <span>Sign in with Google</span>
        </div>
      </form>
    </div>
  );
}
