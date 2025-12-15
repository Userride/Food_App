import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { CartProvider } from './components/ContextReducer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import MyCart from './components/MyCart';
import OrderTracking from './components/OrderTracking';
import GoogleLoginSuccess from './screens/GoogleLoginSuccess';

// ✅ Wrapper for dynamic orderId
function OrderTrackingWrapper() {
  const { orderId } = useParams();
  return <OrderTracking orderId={orderId} />;
}

// ✅ MyOrders Logic directly here (no separate file)
function MyOrdersInline() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("userId") || storedUser?.email;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("🟡 Fetching orders for user:", userId);
        if (!userId) throw new Error("No userId found — please login first.");

        const res = await axios.get(
          `https://eatfit-ecwm.onrender.com/api/orders/myOrders/${userId}`,
          { withCredentials: true }
        );

        console.log("✅ Orders fetched:", res.data);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getTotalPrice = (cartItems = []) =>
    cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed": return "#3498db";
      case "Processing": return "#f1c40f";
      case "Out for Delivery": return "#e67e22";
      case "Delivered": return "#2ecc71";
      default: return "#95a5a6";
    }
  };

  return (
    <div className="container mt-5 text-light">
      <h2 className="mb-4 text-center">🛒 My Orders</h2>

      {loading && <p className="text-center">Loading your orders...</p>}
      {error && (
        <p className="text-center text-danger">
          ⚠️ {error} — check console for details.
        </p>
      )}
      {!loading && !error && orders.length === 0 && (
        <p className="text-center text-muted">You have no past orders.</p>
      )}

      {!loading &&
        orders.length > 0 &&
        orders.map((order) => (
          <div
            key={order._id}
            className="card mb-4 shadow-sm"
            style={{
              backgroundColor: "#1f1f1f",
              border: "1px solid #333",
              borderRadius: "10px",
            }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: "#292929",
                color: "#fff",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Order ID:</strong> {order._id}
                </div>
                <div
                  style={{
                    backgroundColor: getStatusColor(order.status),
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                  }}
                >
                  {order.status || "Order Placed"}
                </div>
              </div>
            </div>

            <div className="card-body">
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p>
                <strong>Ordered On:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <h5 className="mt-3 mb-2">🍽️ Ordered Items</h5>
              <table
                className="table table-sm table-dark table-bordered mb-0"
                style={{ backgroundColor: "#2a2a2a" }}
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Size</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cartItems?.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>{item.size}</td>
                      <td>₹{item.price * item.qty}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: "bold" }}>
                    <td colSpan="3" style={{ textAlign: "right" }}>
                      Total:
                    </td>
                    <td>₹{getTotalPrice(order.cartItems)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/loginuser" element={<Login />} />
          <Route exact path="/createuser" element={<Signup />} />
          <Route exact path="/mycart" element={<MyCart />} />

          {/* ✅ MyOrders logic lives here now */}
          <Route exact path="/myorders" element={<MyOrdersInline />} />

          <Route exact path="/track-order/:orderId" element={<OrderTrackingWrapper />} />
          <Route exact path="/google-login-success" element={<GoogleLoginSuccess />} />
        </Routes>

        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
