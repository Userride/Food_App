import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate to redirect

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();  

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Send a POST request to the server with the form data
    const response = await fetch("http://localhost:5000/api/loginuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Specify the content type
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }) // Convert the credentials object to a JSON string
    });

    // Parse the JSON response
    const json = await response.json();
    console.log(json); // Log the response to the console

    // Display an alert if the login was not successful
    if (!json.success) {
      alert("Enter valid credentials");
    } else {
      // Store auth token in local storage and navigate to home page if login is successful
      localStorage.setItem("authToken", json.authToken);
      console.log(localStorage.getItem("authToken"));
      navigate("/");
    }
  };

  // Function to handle changes in the form inputs
  const onChange = (event) => {
    // Update the corresponding state property with the input's value
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  // Define inline styles
  const containerStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Replace with the path to your background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity:0.9
  };

  const formStyle = {
    background: '#353935', // Set background color to brown
    color: 'white', // Ensure text is readable on the brown background
    padding: '20px',
    opacity:0.95,
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '450px', // Increase width
    maxWidth: '90%' // Ensure it is responsive on smaller screens
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}> {/* Form submission is handled by handleSubmit */}
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
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
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
        <button type="submit" className="btn btn-primary">Submit</button>
        <Link to="/createuser" className='m-3 btn btn-danger'>I'm a new user</Link> {/* Link to the create user page */}
      </form>
    </div>
  );
}
