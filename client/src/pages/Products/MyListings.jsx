import { useState } from "react"
import { Link } from "react-router-dom"
import "../../assets/styles/index.css"

// Mock user listings
const mockListings = [
  { id: 1, title: "Vintage Leather Jacket", price: 45, category: "Clothing", status: "Active", views: 23 },
  { id: 2, title: "iPhone 12 Pro", price: 650, category: "Electronics", status: "Sold", views: 45 },
  { id: 3, title: "Wooden Coffee Table", price: 120, category: "Furniture", status: "Active", views: 12 },
  { id: 4, title: "Programming Books Set", price: 30, category: "Books", status: "Active", views: 8 },
]

const MyListings = () => {
  const [listings, setListings] = useState(mockListings)

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setListings(listings.filter((listing) => listing.id !== id))
    }
  }

  const handleEdit = (id) => {
    // In real app, this would navigate to edit form
    alert(`Edit functionality for product ${id} would be implemented here`)
  }

  return (
    <div className="container">
      <div style={{ padding: "2rem 0" }}>
        <div className="flex-between mb-2">
          <div>
            <h1>My Listings</h1>
            <p className="text-muted">Manage your products on EcoFinds</p>
          </div>
          <Link to="/add-product">
            <button className="primary">Add New Product</button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center mt-2">
            <h3>No listings yet</h3>
            <p className="text-muted">Start selling by adding your first product!</p>
            <Link to="/add-product">
              <button className="primary">Add Product</button>
            </Link>
          </div>
        ) : (
          <div className="grid" style={{ gap: "var(--spacing)" }}>
            {listings.map((listing) => (
              <div key={listing.id} className="card">
                <div className="flex-between">
                  <div style={{ flex: 1 }}>
                    <h3>{listing.title}</h3>
                    <div className="flex gap-2" style={{ alignItems: "center", marginBottom: "0.5rem" }}>
                      <span className="product-price">${listing.price}</span>
                      <span className="product-category">{listing.category}</span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          background: listing.status === "Active" ? "var(--success)" : "var(--secondary)",
                          color: "white",
                        }}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <div className="text-muted">{listing.views} views</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(listing.id)}
                      className="secondary"
                      style={{ padding: "8px 12px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      style={{
                        padding: "8px 12px",
                        background: "#e74c3c",
                        color: "white",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyListings
