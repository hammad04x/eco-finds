import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/styles/index.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    price: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const [productResponse, categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/categories"),
        ]);
        const productData = productResponse.data.data;
        setFormData({
          title: productData.title,
          description: productData.description,
          category_id: productData.category_id,
          price: productData.price,
          image: null, // New image will replace existing
        });
        setCategories(categoriesResponse.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product or categories");
        setLoading(false);
      }
    };
    fetchProductAndCategories();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category_id", formData.category_id);
    data.append("price", formData.price);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product updated successfully!");
      navigate("/my-listings");
    } catch (err) {
      alert("Failed to update product: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div style={{ padding: "2rem 0", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Edit Product</h1>
        <p className="text-muted">Update your item on EcoFinds marketplace</p>

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
              <label htmlFor="category_id">Category *</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
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
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />
              <small className="text-muted">Upload a new photo to replace the existing one</small>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="primary">
                Update Product
              </button>
              <button type="button" className="secondary" onClick={() => navigate("/my-listings")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;