import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpEntered.css";

const OtpEntered = () => {
  const [otp, setOtp] = useState([" ", " ", " ", " ", " ", " "]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
    }
  };

  const handleSubmit = () => {
    navigate("/error");
  };

  const handleResend = () => {
    alert("OTP Resent");
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
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) =>
                      handleChange(e.target.value, index)
                    }
                  />
                ))}

              </div>
            </div>

            <button
              className="otp-btn"
              onClick={handleSubmit}
            >
              Enter your OTP
            </button>

            <div className="resend-text">
              Didnt recive OTP ?
              <span onClick={handleResend}>
                {" "}Resend
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default OtpEntered;
