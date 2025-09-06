import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/index.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your cart");
          setLoading(false);
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCartItems(response.data.data);
          setLoading(false);
        } else {
          setError(response.data.message || "Failed to fetch cart");
          setLoading(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cart");
        setLoading(false);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchCart();
  }, [navigate]);

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCartItems(cartItems.filter((item) => item.id !== cartItemId));
        alert("Item removed from cart!");
      } else {
        alert(response.data.message || "Failed to remove item");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:5000/api/cart/${cartItemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCartItems(
          cartItems.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          )
        );
      } else {
        alert(response.data.message || "Failed to update quantity");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to proceed with checkout");
        navigate("/login");
        return;
      }

      // Mock checkout process (replace with actual order creation API if available)
      alert(`Checkout successful! Total: $${getTotalPrice()}`);

      // Add to purchase history (client-side, replace with backend order API if needed)
      const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
      const newPurchases = cartItems.map((item) => ({
        ...item,
        purchaseDate: new Date().toISOString(),
        orderId: Math.random().toString(36).substr(2, 9),
      }));
      localStorage.setItem("purchases", JSON.stringify([...purchases, ...newPurchases]));

      // Clear cart via backend
      const response = await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCartItems([]);
      } else {
        alert(response.data.message || "Failed to clear cart");
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data, err.response?.status);
      alert(err.response?.data?.message || "Checkout failed");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div style={{ padding: "2rem 0" }}>
        <h1>Shopping Cart</h1>
        <p className="text-muted">Review your selected items</p>

        {cartItems.length === 0 ? (
          <div className="text-center mt-2">
            <h3>Your cart is empty</h3>
            <p className="text-muted">Browse our marketplace to find amazing second-hand items!</p>
            <Link to="/">
              <button className="primary">Continue Shopping</button>
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginTop: "2rem" }}>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={`/uploads/${item.image}`} alt={item.title} />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <div className="cart-item-price">${item.price}</div>
                    <span className="product-category">{item.category_name || "Unknown"}</span>
                    <div>
                      <strong>Quantity:</strong>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        style={{ width: "60px", marginLeft: "10px" }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: "#e74c3c",
                      color: "white",
                      padding: "8px 16px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="card mt-2">
              <div className="flex-between">
                <h3>Total: ${getTotalPrice()}</h3>
                <div className="flex gap-2">
                  <Link to="/">
                    <button className="secondary">Continue Shopping</button>
                  </Link>
                  <button onClick={handleCheckout} className="success">
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;  