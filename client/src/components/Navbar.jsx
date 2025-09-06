import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiHome,
  FiBarChart,
  FiList,
  FiLogIn,
  FiUser,
  FiChevronRight,
  FiLogOut
} from "react-icons/fi";
import "../assets/styles/components/navbar.css";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openDrawer = () => {
    setDrawerOpen(true);
    document.body.classList.add('drawer-open');
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    document.body.classList.remove('drawer-open');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    closeDrawer();
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && drawerOpen) {
        closeDrawer();
      }
    };
    if (drawerOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('drawer-open');
    };
  }, [drawerOpen]);

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <NavLink to="/" className="navbar-brand">EcoFinds</NavLink>

        <ul className="navbar-nav">
          <li>
            <NavLink to="/" end className="nav-link"><span>Home</span></NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className="nav-link"><span>Dashboard</span></NavLink>
          </li>
          <li>
            <NavLink to="/my-listings" className="nav-link"><span>My Listings</span></NavLink>
          </li>
          <li>
            <NavLink to="/cart" className="nav-link icon-link" aria-label="Cart">
              <FiShoppingCart size={20} />
              <span className="cart-text">Cart</span>
            </NavLink>
          </li>

          {/* Conditionally show Login or Logout/Signup */}
          {!user ? (
            <>
              <li>
                <NavLink to="/login" className="nav-link login-btn"><span>Login</span></NavLink>
              </li>
              <li>
                <NavLink to="/signup" className="nav-link login-btn"><span>Signup</span></NavLink>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout} className="nav-link login-btn">
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>

        <button
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={drawerOpen}
          onClick={openDrawer}
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Drawer */}
      <div className={`navbar-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <h2 id="drawer-title" className="brand-name">EcoFinds</h2>
            <p className="brand-tagline">Sustainable Marketplace</p>
          </div>
          <button
            className="drawer-close"
            aria-label="Close navigation menu"
            onClick={closeDrawer}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="drawer-nav">
          <ul>
            <li>
              <NavLink to="/" end className="drawer-link" onClick={closeDrawer}><FiHome size={20} /><span>Home</span><FiChevronRight size={16} /></NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className="drawer-link" onClick={closeDrawer}><FiBarChart size={20} /><span>Dashboard</span><FiChevronRight size={16} /></NavLink>
            </li>
            <li>
              <NavLink to="/my-listings" className="drawer-link" onClick={closeDrawer}><FiList size={20} /><span>My Listings</span><FiChevronRight size={16} /></NavLink>
            </li>
            <li>
              <NavLink to="/cart" className="drawer-link" onClick={closeDrawer}><FiShoppingCart size={20} /><span>Cart</span><FiChevronRight size={16} /></NavLink>
            </li>
          </ul>
        </div>

        <div className="drawer-footer">
          <div className="user-section">
            <div className="user-avatar" role="img" aria-label="User avatar"><FiUser size={24} /></div>
            <div className="user-info">
              <span className="user-name">{user ? user.username : "Guest User"}</span>
              <span className="user-email">{user ? user.email : "Not signed in"}</span>
            </div>
          </div>
          {!user ? (
            <NavLink to="/login" className="drawer-login-btn" onClick={closeDrawer}>
              <FiLogIn size={18} /><span>Sign In</span>
            </NavLink>
          ) : (
            <button onClick={handleLogout} className="drawer-login-btn">
              <FiLogOut size={18} /><span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {drawerOpen && <div className="navbar-overlay" onClick={closeDrawer} />}
    </nav>
  );
};

export default Navbar;