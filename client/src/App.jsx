import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./assets/styles/index.css"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/Signup"
import Dashboard from "./pages/Dashboard"
import AddProduct from "./pages/Products/AddProduct"
import ProductDetail from "./pages/Products/ProductDetail"
import MyListings from "./pages/Products/MyListings"
import Cart from "./pages/Cart"
import PreviousPurchases from "./pages/PreviousPurchases"
import EditProduct from "./pages/Products/EditProduct"

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/purchases" element={<PreviousPurchases />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
