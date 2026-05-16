import loginBg from "./assets/img/login.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { sendOtp } from "./store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const mockOtp = sendOtp(email.trim());
      navigate("/otp", { state: { email: email.trim(), mockOtp } });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="left-panel">
          <img src={loginBg} alt="background" className="left-panel-bg" />
        </div>
        <div className="right-panel">
          <div className="login-box">
            <h1>Login to your Productr Account</h1>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Acme@gmail.com"
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
            <a href="#/signup">SignUp Here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;