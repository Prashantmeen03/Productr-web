import loginBg from "./assets/img/login.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Camera } from "lucide-react";
import { signupUser, sendOtp } from "./store";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSignup = () => {
    if (!name || !email || !password) {
      setError("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      signupUser({ name, email, password, profileImage });
      localStorage.setItem("profileImage", profileImage);
      const mockOtp = sendOtp(email);
      navigate("/otp", { state: { email, mockOtp } });
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="left-panel">
          <img src={loginBg} alt="background" className="left-panel-bg" />
        </div>
        <div className="right-panel" style={{ overflowY: "auto" }}>
          <div className="login-box" style={{ marginTop: "50px" }}>
            <h1>Create your Productr Account</h1>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <div style={{ position: "relative", width: "80px", height: "80px" }}>
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "3px solid #eee" }}
                />
                <label
                  htmlFor="signup-file"
                  style={{ position: "absolute", bottom: 0, right: 0, background: "#2563EB", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
                >
                  <Camera size={14} />
                </label>
                <input id="signup-file" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
              {error && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{error}</p>}
            </div>

            <button className="login-btn" onClick={handleSignup} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
          <div className="signup-box">
            <p>Already have a Productr Account?</p>
            <a href="#/">Login Here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
