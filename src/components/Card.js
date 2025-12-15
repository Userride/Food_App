// Card.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';  // context hooks import
import { useNavigate } from 'react-router-dom';

const ADD = "ADD"; // ➜ same action type

export default function Card(props) {

  // ⭐ dispatch → reducer ko action bhejne ke liye
  const dispatch = useDispatchCart();

  // ⭐ data → global cart ka pura data
  const data = useCart();

  const navigate = useNavigate();

  const priceRef = useRef();

  let options = props.options;
  let priceOptions = Object.keys(options);

  const [qty, setQty] = useState("1");
  const [size, setSize] = useState("");

  // ⭐ Ye function tab chalega jab user "Add to Cart" press kare
  const handleAddToCart = () => {

    // Check login
    if (!localStorage.getItem("authToken")) {
      alert("Please log in to add items to your cart.");
      navigate("/loginuser");
      return;
    }

    // Final price calculate
    let finalPrice = qty * parseInt(options[size]);

    // Item object create
    const cartItem = {
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: finalPrice,
      qty: qty,
      size: size,
    };

    // ⭐ localStorage se purana cart uthaya
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // ⭐ Check karo same id + same size already exist to nahi
    const itemExists = existingCart.find(
      (item) => item.id === cartItem.id && item.size === cartItem.size
    );

    if (itemExists) {
      alert("Item already added in cart!");
      return; 
    }

    // ⭐ localStorage me item daal diya
    existingCart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // ⭐ context/cart reducer ko bhi update kara diya
    dispatch({
      type: ADD,
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: finalPrice,
      qty: qty,
      size: size,
    });

    alert("Item added to cart!");
  };

  // ⭐ Component load hote hi default size set karega
  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);

  return (
    <div>
      <div className="card mt-3" style={{ width: '19rem', maxHeight: '400px' }}>

        {/* 👇 Food image */}
        <img
          src={props.foodItem.img}
          className="card-img-top"
          style={{ height: '175px', objectFit: 'fill' }}
          alt="Food"
        />

        <div className="card-body">
          <h5 className="card-title">{props.foodItem.name}</h5>

          {/* Qty + Size Select */}
          <div className="container w-100">

            {/* ⭐ Quantity select kare */}
            <select className="m-2 h-100 bg-success rounded" 
              onChange={(e) => setQty(e.target.value)}>
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            {/* ⭐ Size Select */}
            <select
              className="m-2 h-100 bg-success rounded"
              ref={priceRef}
              onChange={(e) => setSize(e.target.value)}
            >
              {priceOptions.map((data) => (
                <option key={data} value={data}>{data}</option>
              ))}
            </select>

            {/* ⭐ Price Show */}
            <div className="d-inline h-100 fs-5">
              Rs {qty * parseInt(options[size])}/-
            </div>
          </div>

          <hr />

          {/* ⭐ Cart me add button */}
          <button className="btn btn-success justify-center ms-2" onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>

      </div>
    </div>
  );
}

