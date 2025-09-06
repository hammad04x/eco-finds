import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/index.css";

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        const fetchedCategories = [{ id: "", name: "All Categories" }, ...response.data.data];
        console.log("Fetched categories:", fetchedCategories);
        setCategories(fetchedCategories);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch categories");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    onFilter(selectedCategory);
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-bar-input-container flex gap-2" style={{ flex: 1 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="primary">
          Search
        </button>
      </form>
      <select value={category} onChange={handleCategoryChange} className="search-bar-select-container">
        {categories.map((cat) => (
          <option key={cat.id || "all"} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;