import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  // Initialize the navigation function using the `useNavigate` hook
  const navigate = useNavigate();

  // Define the logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the authentication token from local storage
    navigate("/loginuser"); // Navigate to the "/login" route
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#90EE90",opacity:0.9 }}>
        <div className="container-fluid">
          {/* Brand link */}
          <Link className="navbar-brand fst-italic" to="/home" style={{ color: 'brown', fontSize: '2.2rem' }}>
            EatFit
          </Link>
          {/* Navbar toggler button */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Navbar content */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2">
              {/* Home link */}
              <li className="nav-item" style={{ marginTop: '5px' }}>
                <Link className="nav-link active fs-5" aria-current="page" to="/home" style={{ color: 'brown', fontSize: '1.25rem', textDecoration: 'none' }}>
                  Home
                </Link>
              </li>
              {/* My Orders link (conditionally rendered if authToken exists) */}
              {localStorage.getItem("authToken") && (
                <li className='nav-item' style={{ marginTop: '5px' }}>
                  <Link className="nav-link active fs-5" aria-current="page" to="/myorders" style={{ color: 'black', fontSize: '1.25rem', textDecoration: 'none' }}>
                    My Orders
                  </Link>
                </li>
              )}
            </ul>
            {/* Conditional rendering based on authToken */}
            {!localStorage.getItem("authToken") ? (
              // If not authenticated, show login and signup links
              <div className='d-flex'>
                <Link className="nav-link mx-1" to="/loginuser" style={{ color: 'brown', fontSize: '1.25rem', textDecoration: 'none' }}>
                  Login
                </Link>
                <Link className="nav-link mx-1" to="/createuser" style={{ color: 'brown', fontSize: '1.25rem', textDecoration: 'none' }}>
                  Signup
                </Link>
              </div>
            ) : (
              // If authenticated, show My Cart and Logout buttons
              <div className='d-flex'>
                <div className='btn bg-white text-success mx-2'>
                  My Cart
                </div>
                <button className='btn bg-white text-success mx-2' onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Styling */}
      <style>
        {`
          .nav-link:hover {
            text-decoration: underline !important;
            text-decoration-color: brown !important;
          }
        `}
      </style>
    </div>
  );
}
