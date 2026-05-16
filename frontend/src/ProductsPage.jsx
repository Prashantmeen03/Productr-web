import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  ShoppingBag,
  ChevronDown,
  Plus,
} from "lucide-react";

import "./ProductsPage.css";

export default function ProductsPage() {
  const navigate = useNavigate();
  const profileImage = localStorage.getItem("profileImage") || "https://i.pravatar.cc/150";

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <img
            src="/img/logo.svg"
            alt="logo"
          />
        </div>

        {/* SEARCH */}
        <div className="search-wrapper">

          <div className="search-box">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search"
            />
          </div>

        </div>

        {/* NAV */}
        <div className="nav">

          <button
            className="nav-btn"
            onClick={() => navigate("/home")}
          >
            <Home size={18} />
            Home
          </button>

          <button className="nav-btn active">
            <ShoppingBag size={18} />
            Products
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
        <div className="topbar">

          <div className="top-left">
            <ShoppingBag size={16} />
            <span>Products</span>
          </div>

          <div className="top-right">
            <div className="profile-box" onClick={() => navigate('/profile')}>
              <img
                src={profileImage}
                alt="profile"
                className="profile-img"
              />
              <ChevronDown size={18} />
            </div>
          </div>

        </div>

        {/* CONTENT */}
        <div className="content">

          <div className="empty-box">

            {/* ICON */}
            
            {/* TEXT */}
            <h2>Feels a little empty over here...</h2>

            <p>
              You can create products without connecting store
              <br />
              you can add products to store anytime
            </p>

            {/* BUTTON */}
            <button
              className="add-btn"
              onClick={() => navigate("/add-product")}
            >
              Add your Products
            </button>

          
            </div>

          </div>

        </main>
    </div>
  );
}
