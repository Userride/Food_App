// ContextReducer.js
import React, { createContext, useContext, useReducer } from 'react';

// 👉 Cart ke liye do context banaye:
// 1) CartStateContext = global cart data store karega
// 2) CartDispatchContext = reducer ko actions bhejne ke liye dispatch function store karega
const CartStateContext = createContext();
const CartDispatchContext = createContext();

// 👉 Cart me add karne wala action type define kiya
const ADD = "ADD";

// 👉 Reducer function: ye decide karega ki cart state kaise update hogi
const reducer = (state, action) => {
    switch (action.type) {

        // ⭐ ADD Item case: jab koi item cart me add karna ho
        case ADD:
            return [
                ...state, // purana cart copy
                {
                    id: action.id,
                    name: action.name,
                    qty: action.qty,
                    size: action.size,
                    price: action.price,
                    img: action.img
                }
            ];

        default:
            console.log("Reducer me error aya, action type nahi mila");
            return state;
    }
};

// 👉 CartProvider: ye poori app ko wrap karta hai,
// jisse sab components cart ko access kar sake
export const CartProvider = ({ children }) => {

    // ⭐ useReducer: cart ka global state yahan ban raha hai
    const [state, dispatch] = useReducer(reducer, []); // initial cart empty []

    return (
        // 👇 dispatch global provide
        <CartDispatchContext.Provider value={dispatch}>

            {/* 👇 actual cart data global provide */}
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>

        </CartDispatchContext.Provider>
    );
};

// 👉 Cart ka data lene ke liye hook
export const useCart = () => useContext(CartStateContext);

// 👉 dispatch function lene ke liye hook
export const useDispatchCart = () => useContext(CartDispatchContext);
