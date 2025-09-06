import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/styles/index.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login response:", response.data); // Log full response
      if (!response.data.data || !response.data.data.token) {
        throw new Error("Invalid response structure from server");
      }

      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.data.id,
          username: response.data.data.username,
          email: response.data.data.email,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      const errorMessage = err.response?.data?.message ||
        (err.code === "ERR_NETWORK" ? "Cannot connect to the server. Please check if the backend is running." :
          "An error occurred during login");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
        <div className="auth-link">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;