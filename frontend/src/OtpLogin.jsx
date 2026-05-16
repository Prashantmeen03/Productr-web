import loginBg from "./assets/img/login.png";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OtpLogin.css";
import { verifyOtp, sendOtp } from "./store";

const OtpLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const mockOtp = location.state?.mockOtp || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [currentMockOtp, setCurrentMockOtp] = useState(mockOtp);
  const inputsRef = useRef([]);

  // Show OTP notification after 1 second
  useEffect(() => {
    const t = setTimeout(() => setShowNotification(true), 1000);
    return () => clearTimeout(t);
  }, [currentMockOtp]);

  // Countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
    }
    e.preventDefault();
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    const newOtp = sendOtp(email);
    setCurrentMockOtp(newOtp);
    setResendTimer(30);
    setShowNotification(false);
    setTimeout(() => setShowNotification(true), 500);
  };

  const handleSubmit = () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      verifyOtp(email, otpValue);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="container">
        <div className="left-panel">
          <img src={loginBg} alt="background" className="left-panel-bg" />
        </div>
        <div className="right-panel">
          <div className="otp-box">
            <h1>Login to your Productr Account</h1>
            <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
              OTP sent to <strong>{email}</strong>
            </p>
            <div className="form-group">
              <label>Enter OTP</label>
              <div className="otp-inputs" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    id={`otp-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    style={{ borderColor: error ? "red" : undefined }}
                  />
                ))}
              </div>
              {error && (
                <p style={{ color: "red", fontSize: "14px", marginTop: "10px", textAlign: "center" }}>{error}</p>
              )}
            </div>
            <button
              className="otp-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="resend-text">
              Didn't receive OTP?{" "}
              <span
                onClick={handleResend}
                style={{ cursor: resendTimer === 0 ? "pointer" : "default", opacity: resendTimer === 0 ? 1 : 0.5 }}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Now"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Notification Toast */}
      {showNotification && currentMockOtp && (
        <div className="otp-notification slide-in">
          <div className="notification-icon">💬</div>
          <div className="notification-content">
            <h4>Demo OTP</h4>
            <p>
              Your Productr OTP is: <strong style={{ letterSpacing: "3px" }}>{currentMockOtp}</strong>
            </p>
          </div>
          <button className="close-notification" onClick={() => setShowNotification(false)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default OtpLogin;
