import { useParams, useNavigate } from "react-router-dom"
import "../../assets/styles/index.css"

// Mock data - in real app, this would come from API
const mockProduct = {
  id: 1,
  title: "Vintage Leather Jacket",
  description:
    "Beautiful vintage leather jacket in excellent condition. Perfect for fall and winter. Size M. Genuine leather with soft lining.",
  category: "Clothing",
  price: 45,
  image: null,
  seller: "John Doe",
  condition: "Excellent",
  location: "New York, NY",
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // In real app, you'd fetch product by ID
  const product = mockProduct

  const handleAddToCart = () => {
    // Mock add to cart - in real app, this would update cart state/API
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      alert("Item already in cart!")
    } else {
      cart.push(product)
      localStorage.setItem("cart", JSON.stringify(cart))
      alert("Added to cart!")
    }
  }

  return (
    <div className="container">
      <div style={{ padding: "2rem 0" }}>
        <button onClick={() => navigate(-1)} className="secondary mb-2">
          ← Back
        </button>

        <div className="grid grid-2" style={{ gap: "3rem" }}>
          <div>
            <div className="product-image" style={{ height: "400px", borderRadius: "var(--radius)" }}>
              {product.image ? (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>No Image Available</span>
              )}
            </div>
          </div>

          <div>
            <h1>{product.title}</h1>
            <div className="product-price" style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              ${product.price}
            </div>
            <span className="product-category">{product.category}</span>

            <div style={{ margin: "2rem 0" }}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="card">
              <h4>Product Details</h4>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <div>
                  <strong>Condition:</strong> {product.condition}
                </div>
                <div>
                  <strong>Seller:</strong> {product.seller}
                </div>
                <div>
                  <strong>Location:</strong> {product.location}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={handleAddToCart} className="primary" style={{ flex: 1 }}>
                Add to Cart
              </button>
              <button className="accent">Contact Seller</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
