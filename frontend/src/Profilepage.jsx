import logoImg from "./assets/img/logo.svg";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ShoppingBag, Search, ChevronDown, Camera, LogOut, User } from "lucide-react";
import "./Profilepage.css";
import { getCurrentUser, saveProfile, logout } from "./store";

export default function Profilepage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || localStorage.getItem("profileImage") || "https://i.pravatar.cc/150"
  );
  const [saved, setSaved] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileImage(ev.target.result);
      localStorage.setItem("profileImage", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveProfile({ name, email, mobile, profileImage });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-page-app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-box">
          <img src={logoImg} alt="logo" className="logo-img" />
        </div>
        <div className="search-wrapper">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <nav className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/home")}>
            <Home size={18} /> Home
          </button>
          <button className="nav-btn" onClick={() => navigate("/product-details")}>
            <ShoppingBag size={18} /> Products
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="topbar">
          <div className="top-left">
            <User size={18} />
            <span>Profile</span>
          </div>
          <div className="top-right">
            <div className="profile-box">
              <img src={profileImage} alt="profile" className="profile-img" />
              <ChevronDown size={18} />
            </div>
          </div>
        </header>

        <div className="profile-content-area">
          <div className="profile-card">
            <div className="profile-header">
              <div className="image-upload-wrapper">
                <img src={profileImage} alt="Profile" className="large-profile-img" />
                <label htmlFor="file-upload" className="upload-btn">
                  <Camera size={18} color="#fff" />
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </div>
              <h2 className="profile-name">{name || "Your Name"}</h2>
              <p className="profile-subtitle">Manage your personal information</p>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>
              <div className="profile-actions">
                <button className="save-btn" onClick={handleSave}>
                  {saved ? "✓ Saved!" : "Save Changes"}
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
