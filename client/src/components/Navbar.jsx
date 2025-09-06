import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiHome,
  FiBarChart,
  FiList,
  FiLogIn,
  FiUser,
  FiChevronRight
} from "react-icons/fi";
import "../assets/styles/components/navbar.css";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => {
    setDrawerOpen(true);
    document.body.classList.add('drawer-open');
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    document.body.classList.remove('drawer-open');
  };

  // Close drawer on escape key
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

  // Close drawer on route change
  useEffect(() => {
    closeDrawer();
  }, []);

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <NavLink to="/" className="navbar-brand">EcoFinds</NavLink>

        <ul className="navbar-nav">
          <li>
            <NavLink to="/" end className="nav-link">
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className="nav-link">
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-listings" className="nav-link">
              <span>My Listings</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className="nav-link icon-link" aria-label="Cart">
              <FiShoppingCart size={20} />
              <span className="cart-text">Cart</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" className="nav-link login-btn">
              <span>Login</span>
            </NavLink>
          </li>
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
      <div 
        className={`navbar-drawer ${drawerOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <h2 id="drawer-title" className="brand-name">EcoFinds</h2>
            <p className="brand-tagline">Sustainable Marketplace</p>
          </div>
          <button
            className="drawer-close"
            aria-label="Close navigation menu"
            onClick={closeDrawer}
            type="button"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Drawer Navigation */}
        <div className="drawer-nav" role="navigation" aria-label="Main navigation">
          <ul>
            <li>
              <NavLink 
                to="/" 
                end 
                className="drawer-link" 
                onClick={closeDrawer}
                aria-label="Go to Home page"
              >
                <FiHome size={20} />
                <span>Home</span>
                <FiChevronRight size={16} className="drawer-arrow" />
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/dashboard" 
                className="drawer-link" 
                onClick={closeDrawer}
                aria-label="Go to Dashboard"
              >
                <FiBarChart size={20} />
                <span>Dashboard</span>
                <FiChevronRight size={16} className="drawer-arrow" />
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/my-listings" 
                className="drawer-link" 
                onClick={closeDrawer}
                aria-label="Go to My Listings"
              >
                <FiList size={20} />
                <span>My Listings</span>
                <FiChevronRight size={16} className="drawer-arrow" />
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/cart" 
                className="drawer-link" 
                onClick={closeDrawer}
                aria-label="Go to Cart"
              >
                <FiShoppingCart size={20} />
                <span>Cart</span>
                <FiChevronRight size={16} className="drawer-arrow" />
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="user-section">
            <div className="user-avatar" role="img" aria-label="User avatar">
              <FiUser size={24} />
            </div>
            <div className="user-info">
              <span className="user-name">Guest User</span>
              <span className="user-email">Not signed in</span>
            </div>
          </div>
          <NavLink 
            to="/login" 
            className="drawer-login-btn" 
            onClick={closeDrawer}
            aria-label="Sign in to your account"
          >
            <FiLogIn size={18} />
            <span>Sign In</span>
          </NavLink>
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div 
          className="navbar-overlay" 
          onClick={closeDrawer}
          role="presentation"
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Navbar;