import React, { createContext, useContext, useReducer } from "react";
import "../styles/App.css"
const CartContext = createContext();

const initialState = {
  cart: [
    {
      id: 1,
      title: "Product 1",
      price: 100,
      amount: 1,
    },
    {
      id: 2,
      title: "Product 2",
      price: 200,
      amount: 2,
    },
    {
      id: 3,
      title: "Product 3",
      price: 300,
      amount: 1,
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, amount: item.amount + 1 }
            : item
        ),
      };

    case "DECREMENT":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.payload
              ? { ...item, amount: item.amount - 1 }
              : item
          )
          .filter((item) => item.amount > 0),
      };



    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

function Navbar() {
  const { state } = useContext(CartContext);

  const totalItems = state.cart.reduce(
    (total, item) => total + item.amount,
    0
  );

  return (
    <nav>
      <h2>Cart</h2>
      <span id="nav-cart-item-count">{totalItems}</span>
    </nav>
  );
}

function CartItems() {
  const { state, dispatch } = useContext(CartContext);

  if (state.cart.length === 0) {
    return <h3>Cart is currently empty</h3>;
  }

  return (
    <div id="cart-items-list">
      {state.cart.map((item) => (
        <div key={item.id}>
          <h4>{item.title}</h4>

          <p id={`cart-item-price-${item.id}`}>${item.price}</p>

          <p id={`cart-amount-${item.id}`}>{item.amount}</p>

          <button
            id={`increment-btn-${item.id}`}
            onClick={() =>
              dispatch({
                type: "INCREMENT",
                payload: item.id,
              })
            }
          >
            +
          </button>

          <button
            id={`decrement-btn-${item.id}`}
            onClick={() =>
              dispatch({
                type: "DECREMENT",
                payload: item.id,
              })
            }
          >
            -
          </button>

    
        </div>
      ))}
    </div>
  );
}

function CartTotal() {
  const { state } = useContext(CartContext);

  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0
  );

  return <h3 id="cart-total-amount">{total}</h3>;
}

function CartApp() {
  const { dispatch } = useContext(CartContext);

  return (
    <div id="main">
      <Navbar />

      <CartItems />

      <button
        id="clear-all-cart"
        onClick={() => dispatch({ type: "CLEAR_CART" })}
      >
        Clear Cart
      </button>

      <CartTotal />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <CartApp />
    </CartProvider>
  );
}