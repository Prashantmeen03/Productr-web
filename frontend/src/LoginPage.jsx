import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";



import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("Acme@gmail.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email) {
      setError("Please enter your email or phone number");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Call our newly built backend API
      await axios.post("http://localhost:5000/api/login", { email });
      
      // Navigate to OTP page, passing the email in state so we can verify it
      navigate("/otp", { state: { email } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <img src="img/login.png" alt="background" className="left-panel-bg" />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          <div className="login-box">
            <h1>Login to your Productr Account</h1>

            <div className="form-group">
              <label>Email or Phone number</label>

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or phone number"
                style={{ borderColor: error ? "red" : undefined }}
              />
              {error && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{error}</p>}
            </div>

            <button
              className="login-btn"
              onClick={handleLogin}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>
          </div>

          <div className="signup-box">
            <p>Don't have a Productr Account</p>
            <a href="/">SignUp Here</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;