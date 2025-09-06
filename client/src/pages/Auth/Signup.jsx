import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/styles/index.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Store token and user data in localStorage
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.data.id,
          username: response.data.data.username,
          email: response.data.data.email,
        })
      );

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during signup"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Join EcoFinds</h2>
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="auth-link">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;