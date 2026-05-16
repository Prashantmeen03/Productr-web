import loginBg from "./assets/img/login.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = () => {
  const [otp, setOtp] = useState(["1", "8", "6", "5", "2", "9"]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="error-page">
      <div className="container">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <img src={loginBg} alt="background" className="left-panel-bg" />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          <div className="error-box">
            <h1>Login to your Productr Account</h1>

            <div className="form-group">
              <label>Enter OTP</label>

              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="error-input"
                  />
                ))}
              </div>
            </div>

            <p className="error-msg">Please enter a valid OTP</p>

            <button
              className="otp-btn"
              onClick={() => navigate("/home")}
            >
              Enter your OTP
            </button>

            <div className="resend-text">
              Didnt recive OTP ?{" "}
              <span onClick={() => alert("Resent!")}>Resend</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ErrorPage;
