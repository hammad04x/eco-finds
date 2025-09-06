import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/styles/index.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored after login
      if (!token) {
        alert("Please log in to add items to your cart");
        navigate("/login"); // Redirect to login page
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/cart",
        { product_id: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token
          },
        }
      );

      if (response.data.success) {
        alert("Item added to cart!");
      } else {
        alert(response.data.message || "Failed to add item to cart");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Failed to add item to cart");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

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
                  src={`/uploads/${product.image}`}
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
            <span className="product-category">{product.category_name}</span>

            <div style={{ margin: "2rem 0" }}>
              <h3>Description</h3>
              <p>{product.description || "No description available"}</p>
            </div>

            <div className="card">
              <h4>Product Details</h4>
              <div style={{ display: "grid", gap: "0.5rem" }}>
              
                <div>
                  <strong>Seller:</strong> {product.seller_username}
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
  );
};

export default ProductDetail;