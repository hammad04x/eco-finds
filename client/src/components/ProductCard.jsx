import { Link } from "react-router-dom"
import "../assets/styles/index.css"

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        {product.image ? <img src={product.image || "/placeholder.svg"} alt={product.title} /> : <span>No Image</span>}
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <div className="product-price">${product.price}</div>
        <span className="product-category">{product.category}</span>
      </div>
    </Link>
  )
}

export default ProductCard
