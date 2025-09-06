import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "../../assets/styles/pages/mylisting.css"

const MyListings = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setListings(response.data.data.products)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch listings")
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setListings(listings.filter((listing) => listing.id !== id))
      } catch (err) {
        alert("Failed to delete product")
      }
    }
  }

  const handleEdit = (id) => {
    window.location.href = `/edit-product/${id}`
  }

  if (loading) {
    return (
      <div className="mylisting-container">
        <div className="text-center mt-2">
          <h3>Loading...</h3>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mylisting-container">
        <div className="text-center mt-2">
          <h3>{error}</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="mylisting-container">
      <div className="mylisting-header">
        <h1>My Listings</h1>
        <p className="description">Manage your products on EcoFinds</p>
        <Link to="/add-product">
          <button className="btn btn-primary">Add New Product</button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="no-listings">
          <h3>No listings yet</h3>
          <p className="description">Start selling by adding your first product!</p>
          <Link to="/add-product">
            <button className="btn btn-primary">Add Product</button>
          </Link>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => {
            const status = listing.status ? listing.status : "Active"
            return (
              <div key={listing.id} className="listing-card">
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <div className="details-row">
                    <span className="price">${listing.price}</span>
                    <span className="category">{listing.category_name}</span>
                    <span className={`status ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>
                </div>
                <div className="listing-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(listing.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(listing.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyListings
