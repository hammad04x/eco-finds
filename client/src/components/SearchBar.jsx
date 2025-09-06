import { useState } from "react"
import "../assets/styles/index.css"

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")

  const categories = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Furniture",
    "Books",
    "Sports",
    "Home & Garden",
    "Toys",
    "Other",
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value
    setCategory(selectedCategory)
    onFilter(selectedCategory)
  }

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
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SearchBar
