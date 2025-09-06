import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "../assets/styles/index.css"

const Dashboard = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) {
    return (
      <div className="container">
        <div className="text-center mt-2">
          <h2>Please log in to access your dashboard</h2>
          <Link to="/login" className="primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ padding: "2rem 0" }}>
        <h1>Welcome back, {user.name}!</h1>
        <p className="text-muted">Manage your EcoFinds account and listings</p>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-number">12</div>
            <div className="stat-label">Active Listings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">8</div>
            <div className="stat-label">Items Sold</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">$340</div>
            <div className="stat-label">Total Earnings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">25</div>
            <div className="stat-label">Items Purchased</div>
          </div>
        </div>

        <div className="grid grid-2 mt-2">
          <div className="card">
            <h3>Quick Actions</h3>
            <div className="flex" style={{ flexDirection: "column", gap: "1rem" }}>
              <Link to="/add-product">
                <button className="primary" style={{ width: "100%" }}>
                  Add New Product
                </button>
              </Link>
              <Link to="/my-listings">
                <button className="secondary" style={{ width: "100%" }}>
                  Manage My Listings
                </button>
              </Link>
              <Link to="/purchases">
                <button className="accent" style={{ width: "100%" }}>
                  View Purchase History
                </button>
              </Link>
            </div>
          </div>

          <div className="card">
            <h3>Account Information</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={user.name} readOnly />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user.email} readOnly />
            </div>
            <button className="secondary">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
