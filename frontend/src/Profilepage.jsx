import { API_URL } from './config';
import logoImg from "./assets/img/logo.svg";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Search,
  ChevronDown,
  Camera,
  LogOut,
  User
} from "lucide-react";
import "./Profilepage.css";
import axios from "axios";

export default function Profilepage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "https://i.pravatar.cc/150");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          if (res.data.name) setName(res.data.name);
          if (res.data.email) setEmail(res.data.email);
          if (res.data.mobile) setMobile(res.data.mobile);
          if (res.data.profileImage) {
            setProfileImage(res.data.profileImage);
            localStorage.setItem("profileImage", res.data.profileImage);
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setProfileImage(base64);
        localStorage.setItem("profileImage", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/profile`, {
        name, email, mobile, profileImage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="profile-page-app">
      <aside className="sidebar">
        <div className="logo-box">
          <img src={logoImg} alt="logo" className="logo-img" />
        </div>
        <div className="search-wrapper">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate('/products', { state: { search: e.target.value.trim() } });
                }
              }}
            />
          </div>
        </div>
        <nav className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/home")}>
            <Home size={18} /> Home
          </button>
          <button className="nav-btn" onClick={() => navigate("/products")}>
            <ShoppingBag size={18} /> Products
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="top-left">
            <User size={18} />
            <span>Profile</span>
          </div>
          <div className="top-right">
            <div className="profile-box" onClick={() => navigate('/profile')}>
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
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>
              <h2 className="profile-name">{name || "User Name"}</h2>
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
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
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
