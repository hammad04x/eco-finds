import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/index.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.data);
        setFormData({
          username: response.data.data.username,
          email: response.data.data.email,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setProfileImage(null); // Reset profile image on edit toggle
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // Limit to 5MB
      setError("Profile image must be less than 5MB");
      return;
    }
    setProfileImage(file);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate username
    if (formData.username && !validateUsername(formData.username)) {
      setError("Username must be 3-20 characters long and contain only letters, numbers, or underscores");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Update username and email only if changed
      if (formData.username !== user.username || formData.email !== user.email) {
        const response = await axios.patch(
          "http://localhost:5000/api/users/me",
          {
            username: formData.username,
            email: formData.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }

      // Update profile image
      if (profileImage) {
        const formDataToSend = new FormData();
        formDataToSend.append("avatar", profileImage);

        const response = await axios.patch(
          "http://localhost:5000/api/users/me/avatar",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err.response || err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Fallback for broken image
  const handleImageError = (e) => {
    e.target.style.display = "none"; // Hide broken image
  };

  if (loading && !user) {
    return (
      <div className="container">
        <div className="text-center mt-2">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

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
    );
  }

  return (
    <div className="container">
      <div style={{ padding: "2rem 0" }}>
        <h1>Welcome back, {user.username}!</h1>
        <p className="text-muted">Manage your EcoFinds account and listings</p>

        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

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
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    placeholder="Enter username"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label>Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                </div>
                {user.profile_image && (
                  <div className="form-group">
                    <img
                      src={`/uploads/${user.profile_image}`}
                      alt="Profile"
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                      onError={handleImageError}
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="primary"
                  style={{ marginRight: "1rem" }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={handleEditToggle}
                  disabled={loading}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" value={user.username} readOnly />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user.email} readOnly />
                </div>
                {user.profile_image && (
                  <div className="form-group">
                    <label>Profile Image</label>
                    <img
                      src={`/uploads/${user.profile_image}`}
                      alt="Profile"
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                      onError={handleImageError}
                    />
                  </div>
                )}
                <button className="secondary" onClick={handleEditToggle}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;