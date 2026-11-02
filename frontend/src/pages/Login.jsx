
import { useState } from "react";
import hospitalLogo from "../assets/logo.png";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      onLoginSuccess(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Welcome Section */}
        <div className="login-welcome">

          <img
            src={hospitalLogo}
            alt="King Abdullah University Hospital"
            className="login-hospital-logo"
          />

          <h1>KAUH RequestHub</h1>

          <h3>Smart Hospital Request Management</h3>

          <p>
            A centralized platform to manage hospital
            requests and medical equipment efficiently.
          </p>

          <div className="login-welcome-footer">
            KING ABDULLAH UNIVERSITY HOSPITAL
          </div>

        </div>

        {/* Login Form */}
        <div className="login-form-section">
          <div className="login-form-content">

            <div className="login-heading">
              <h2>Welcome Back</h2>
              <p>Sign in to access your account</p>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>

              <div className="mb-4">
                <label className="form-label">
                  Email Address
                </label>

                <input
                  type="email"
                  className="form-control login-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>

            <p className="login-footer">
              © 2026 KAUH Request Management System
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
