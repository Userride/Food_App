import React, { useState } from 'react'; // Import React and useState hook
import { Link } from 'react-router-dom'; // Import Link component for navigation

export default function Signup() {
    // Initialize state to hold form data
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Send a POST request to the server with the form data
        const response = await fetch("http://localhost:5000/api/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Specify the content type
            },
            body: JSON.stringify({
                name: credentials.name,
                email: credentials.email,
                password: credentials.password,
                location: credentials.geolocation
            }) // Convert the credentials object to a JSON string
        });

        // Parse the JSON response
        const json = await response.json();
        console.log(json); // Log the response to the console

        // Display an alert if the sign-up was not successful
        if (!json.success) {
            alert("Enter valid credentials");
        }
    };

    // Function to handle changes in the form inputs
    const onChange = (event) => {
        // Update the corresponding state property with the input's value
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    // Function to find the user's live location
    const findLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=YOUR_API_KEY&lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await response.json();
                    if (data.address) {
                        const location = `${data.address.road}, ${data.address.city}, ${data.address.state}, ${data.address.country}`;
                        setCredentials({ ...credentials, geolocation: location });
                    } else {
                        alert("Unable to fetch location data");
                    }
                } catch (error) {
                    console.error("Error fetching location data:", error);
                }
            }, (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location");
            });
        } else {
            alert("Geolocation is not supported by this browser");
        }
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
        justifyContent: 'center'
    };

    const formStyle = {
        background: '#353935', // Set background color to brown
        color: 'white', // Ensure text is readable on the brown background
        padding: '20px',
        borderRadius: '10px',
        opacity:0.97,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '500px', // Increase width
        maxWidth: '90%' // Ensure it is responsive on smaller screens
    };

    return (
        <div style={containerStyle}>
            <form style={formStyle} onSubmit={handleSubmit}> {/* Form submission is handled by handleSubmit */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name='name' 
                        value={credentials.name} 
                        onChange={onChange} 
                        id="name" 
                    />
                </div>
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
                <div className="mb-3">
                    <label htmlFor="geolocation" className="form-label">Address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name='geolocation' 
                        value={credentials.geolocation} 
                        onChange={onChange} 
                        id="geolocation" 
                    />
                    <button type="button" className="btn btn-secondary mt-2" onClick={findLocation}>Find My Location</button>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <Link to="/login" className='m-3 btn btn-danger'>Already a user</Link> {/* Link to the login page */}
            </form>
        </div>
    );
}
