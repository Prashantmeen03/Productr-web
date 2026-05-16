import { API_URL } from './config';
import loginBg from "./assets/img/login.png";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OtpLogin.css";
import axios from "axios";

const OtpLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "Acme@gmail.com";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [resendTimer, setResendTimer] = useState(20);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("${API_URL}/api/login", { email });
      setResendTimer(20);
      
      if (res.data && res.data.mockOtp) {
         location.state.mockOtp = res.data.mockOtp;
         setShowNotification(false);
         setTimeout(() => setShowNotification(true), 1000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.mockOtp) {
      // Simulate network delay for receiving message
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

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
      const res = await axios.post("${API_URL}/api/otp", { email, otp: otpValue });
      
      // Save JWT token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      // Success, go straight to home!
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("This is not a valid OTP");
      setOtp(["", "", "", "", "", ""]); // Clear OTP on fail so user can re-type
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="container">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <img src={loginBg} alt="background" className="left-panel-bg" />
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
              Didnt receive OTP ?
              <span 
                onClick={handleResend} 
                style={{ cursor: resendTimer === 0 ? "pointer" : "default", opacity: resendTimer === 0 ? 1 : 0.6 }}
              >
                {resendTimer > 0 ? ` Resend in ${resendTimer}s` : " Resend Now"}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* NOTIFICATION TOAST */}
      {showNotification && location.state?.mockOtp && (
        <div className="otp-notification slide-in">
          <div className="notification-icon">💬</div>
          <div className="notification-content">
            <h4>New Message</h4>
            <p>Your Productr OTP is: <strong>{location.state.mockOtp}</strong></p>
          </div>
          <button className="close-notification" onClick={() => setShowNotification(false)}>×</button>
        </div>
      )}

    </div>
  );
};

export default OtpLogin;
