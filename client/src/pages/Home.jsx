import { useState, useEffect } from "react"; // Added useEffect for data fetching
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import axios from "axios"; // Added Axios for API calls
import "../assets/styles/index.css";
import "../assets/styles/pages/home.css";

// Removed mockProducts as we'll fetch real data
const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          params: {
            page: 1,
            limit: 10, // Adjust limit as needed
          },
        });
        // Adjust based on your API response structure
        const fetchedProducts = response.data.data.products || response.data.data;
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = (category) => {
    if (!category || category === "All Categories") {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((product) => product.category === category);
    setFilteredProducts(filtered);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">{error}</div>;

  return (
    <>
      <div className="banner">
        <div className="banner-content">
          <h1>EcoFinds</h1>
          <p>Find unique second-hand treasures and help the planet by reusing items</p>
        </div>
      </div>
      <div className="container">
        <div style={{ padding: "2rem 0" }}>
          <div className="text-center mb-2">
            <h2>Discover Amazing Finds</h2>
            <p className="text-muted">Explore our curated collection of pre-loved items</p>
          </div>

          <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

          <div className="grid grid-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center mt-2">
              <p className="text-muted">No products found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        <Link to="/add-product" className="fab">
          +
        </Link>
      </div>
    </>
  );
};

export default Home;


