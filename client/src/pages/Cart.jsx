import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../assets/styles/index.css"

const Cart = () => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
  }, [])

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }

    // Mock checkout process
    alert(`Checkout successful! Total: $${getTotalPrice()}`)

    // Add to purchase history
    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]")
    const newPurchases = cartItems.map((item) => ({
      ...item,
      purchaseDate: new Date().toISOString(),
      orderId: Math.random().toString(36).substr(2, 9),
    }))
    localStorage.setItem("purchases", JSON.stringify([...purchases, ...newPurchases]))

    // Clear cart
    setCartItems([])
    localStorage.setItem("cart", JSON.stringify([]))
  }

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
                      <img src={item.image || "/placeholder.svg"} alt={item.title} />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <div className="cart-item-price">${item.price}</div>
                    <span className="product-category">{item.category}</span>
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
  )
}

export default Cart
