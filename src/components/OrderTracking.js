import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// ✅ Connect socket to backend
const socket = io('https://eatfit-ecwm.onrender.com', { withCredentials: true });

const hotelCoords = { lat: 22.9753, lon: 88.4345 };

export default function OrderTracking() {
  const { orderId } = useParams();
  const [status, setStatus] = useState('Fetching...');
  const [order, setOrder] = useState(null);
  const [distance, setDistance] = useState(null);
  const userId = localStorage.getItem("userId");

  // ✅ Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !userId) {
        setStatus("Invalid session or order ID.");
        return;
      }

      try {
        const res = await axios.get(
          `https://eatfit-ecwm.onrender.com/api/orders/${orderId}?userId=${userId}`,
          { withCredentials: true }
        );

        setOrder(res.data.order);
        setStatus(res.data.order.status);

        // Calculate distance to hotel
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition((pos) => {
            const userCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            const km = getDistanceFromLatLonInKm(
              userCoords.lat, userCoords.lon,
              hotelCoords.lat, hotelCoords.lon
            );
            setDistance(km.toFixed(2));
          });
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        if (err.response?.status === 403) setStatus('You are not authorized to view this order.');
        else if (err.response?.status === 404) setStatus('Order not found.');
        else setStatus('Unable to fetch order details.');
      }
    };
    fetchOrder();
  }, [orderId, userId]);

  // ✅ Real-time status listener
  useEffect(() => {
    socket.emit('join_order', orderId);
    socket.on('orderStatusUpdate', (data) => {
      if (data.orderId === orderId) {
        console.log('📦 Live Update:', data.status);
        setStatus(data.status);
      }
    });
    return () => socket.off('orderStatusUpdate');
  }, [orderId]);

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

  if (!order) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px', color: 'white' }}>
        <h2>🚚 Track Your Order</h2>
        <p><strong>Status:</strong> <span style={{ color: '#ffc107' }}>{status}</span></p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '40px', color: 'white', maxWidth: '600px', margin: 'auto' }}>
      <h2>🚚 Track Your Order</h2>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Status:</strong> <span style={{ color: '#00ff00' }}>{status}</span></p>
      {distance && <p><strong>Distance to Hotel:</strong> <span style={{ color: '#ffd700' }}>{distance} km</span></p>}

      <div style={{ textAlign: 'left', marginTop: '20px', backgroundColor: '#222', padding: '15px', borderRadius: '10px' }}>
        <h4>Items:</h4>
        <ul>
          {order.cartItems.map((item, i) => (
            <li key={i}>{item.name} ({item.qty}x, {item.size}) - ₹{item.price}</li>
          ))}
        </ul>
        <p><strong>Delivery Address:</strong> {order.address}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      </div>
    </div>
  );
}
