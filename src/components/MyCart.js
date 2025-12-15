import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('https://eatfit-ecwm.onrender.com');

// Static hotel coordinates
const hotelCoords = { lat: 22.9753, lon: 88.4345 };

export default function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [distance, setDistance] = useState(null);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const validItems = cartData.filter(item => item && item.price != null && item.qty != null);
    setCartItems(validItems);
  }, []);

  // Socket listener for status updates
  useEffect(() => {
    if (orderId) {
      socket.emit('join_order', orderId);
      socket.on('orderStatusUpdate', (data) => {
        if (data.orderId === orderId) setOrderStatus(data.status);
      });
    }
    return () => socket.off('orderStatusUpdate');
  }, [orderId]);

  // Delete cart item
  const handleDelete = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  // Place order
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      navigate("/loginuser");
      return;
    }

    if (!address || !paymentMethod) return alert('Please fill all fields.');

    const orderData = { userId, cartItems, address, paymentMethod };

    try {
      const res = await axios.post('https://eatfit-ecwm.onrender.com/api/orders/createOrder', orderData);
      setOrderId(res.data.orderId);
      setOrderStatus('Order Placed');
      setIsOrderPlaced(true);

      // Clear cart
      localStorage.removeItem("cart");
      setCartItems([]);
      window.dispatchEvent(new Event("storage"));

      // Get user distance
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const userCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          const km = getDistanceFromLatLonInKm(userCoords.lat, userCoords.lon, hotelCoords.lat, hotelCoords.lon);
          setDistance(km.toFixed(2));
        });
      }

      // Redirect to order tracking
      setTimeout(() => navigate(`/track-order/${res.data.orderId}`), 2000);
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  // Haversine formula
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const deg2rad = (deg) => deg * (Math.PI / 180);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item?.price || 0) * (item?.qty || 0), 0);

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Size</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.size}</td>
                <td>₹{item.price * item.qty}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>Total:</td>
              <td colSpan="2" style={{ fontWeight: "bold" }}>₹{totalPrice}</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Address Section */}
      <div className="mt-3">
        <textarea
          placeholder="Enter Address"
          className="form-control"
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          className="btn btn-info mt-2"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setAddress(`Lat:${lat}, Lon:${lon}`);
                const km = getDistanceFromLatLonInKm(lat, lon, hotelCoords.lat, hotelCoords.lon);
                setDistance(km.toFixed(2));
              });
            }
          }}
        >
          Use Current Location
        </button>
      </div>

      {/* Payment Section */}
      <div className="mt-3">
        <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">Select Payment Method</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="Credit Card">Credit Card</option>
        </select>
      </div>

      {/* Place Order Button */}
      <button className="btn btn-success mt-3" onClick={handleSubmit}>
        Place Order
      </button>

      {isOrderPlaced && (
        <div className="popup mt-3">
          <h4>Order ID: {orderId}</h4>
          <p>Status: {orderStatus}</p>
          {distance && <p>Distance to hotel: {distance} km</p>}
        </div>
      )}
    </div>
  );
}
