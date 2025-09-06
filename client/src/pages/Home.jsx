import { useState } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import SearchBar from "../components/SearchBar"
import "../assets/styles/index.css"

// Mock data
const mockProducts = [
  { id: 1, title: "Vintage Leather Jacket", price: 45, category: "Clothing", image: null },
  { id: 2, title: "iPhone 12 Pro", price: 650, category: "Electronics", image: null },
  { id: 3, title: "Wooden Coffee Table", price: 120, category: "Furniture", image: null },
  { id: 4, title: "Programming Books Set", price: 30, category: "Books", image: null },
  { id: 5, title: "Mountain Bike", price: 280, category: "Sports", image: null },
  { id: 6, title: "Garden Tools Set", price: 55, category: "Home & Garden", image: null },
  { id: 7, title: "Gaming Headset", price: 85, category: "Electronics", image: null },
  { id: 8, title: "Designer Handbag", price: 95, category: "Clothing", image: null },
]

const Home = () => {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProducts(products)
      return
    }
    const filtered = products.filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredProducts(filtered)
  }

  const handleFilter = (category) => {
    if (!category || category === "All Categories") {
      setFilteredProducts(products)
      return
    }
    const filtered = products.filter((product) => product.category === category)
    setFilteredProducts(filtered)
  }

  return (
    <div className="container">
      <div style={{ padding: "2rem 0" }}>
        <div className="text-center mb-2">
          <h1>Welcome to EcoFinds</h1>
          <p className="text-muted">Discover amazing second-hand treasures and give items a new life</p>
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
  )
}

export default Home
