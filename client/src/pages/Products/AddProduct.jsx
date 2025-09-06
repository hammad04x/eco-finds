import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../assets/styles/index.css"

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: null,
  })
  const navigate = useNavigate()

  const categories = ["Electronics", "Clothing", "Furniture", "Books", "Sports", "Home & Garden", "Toys", "Other"]

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({
        ...formData,
        image: e.target.files[0],
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock product creation - in real app, this would call an API
    console.log("New product:", formData)
    alert("Product added successfully!")
    navigate("/")
  }

  return (
    <div className="container">
      <div style={{ padding: "2rem 0", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Add New Product</h1>
        <p className="text-muted">List your item on EcoFinds marketplace</p>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Product Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter product title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe your product..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <input type="file" id="image" name="image" onChange={handleChange} accept="image/*" />
              <small className="text-muted">Upload a clear photo of your product</small>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="primary">
                Add Product
              </button>
              <button type="button" className="secondary" onClick={() => navigate("/")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
