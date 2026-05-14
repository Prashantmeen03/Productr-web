import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OtpLogin.css";
import axios from "axios";

const OtpLogin = () => {
  const [otp, setOtp] = useState(["1", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "Acme@gmail.com";

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      
      // Auto-focus logic can be added here
      if (value && index < 5) {
         const nextSibling = document.getElementById(`otp-input-${index + 1}`);
         if (nextSibling !== null) {
           nextSibling.focus();
         }
      }
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send OTP to backend verification API
      const res = await axios.post("http://localhost:5000/api/otp", { email, otp: otpValue });
      
      // Save JWT token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      // Success, go straight to home!
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Invalid OTP. Please try again.");
      navigate("/otp-entered"); // The original flow goes here on fail/success mock
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="container">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <img src="img/login.png" alt="background" className="left-panel-bg" />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          <div className="otp-box">

            <h1>Login to your Productr Account</h1>

            <div className="form-group">
              <label>Enter OTP</label>

              <div className="otp-inputs">

                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) =>
                      handleChange(e.target.value, index)
                    }
                    style={{ borderColor: error ? "red" : undefined }}
                  />
                ))}

              </div>
              {error && <p style={{ color: "red", fontSize: "14px", marginTop: "10px", textAlign: "center" }}>{error}</p>}
            </div>

            <button
              className="otp-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Verifying..." : "Enter your OTP"}
            </button>

            <div className="resend-text">
              Didnt recive OTP ?
              <span> Resend in 20s</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default OtpLogin;
