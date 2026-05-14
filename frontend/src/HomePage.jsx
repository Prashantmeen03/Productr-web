import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Search,
  ChevronDown,
  Plus,
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Unpublished");

  const publishedProducts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const unpublishedProducts = [];

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial, Helvetica, sans-serif;
        }

        html,
        body,
        #root{
          width:100%;
          min-height:100vh;
          background:#FFFFFF;
        }

        .homepage{
          width:100%;
          min-height:100vh;

          display:grid;

          grid-template-columns:
          minmax(220px, 240px)
          1fr;

          background:#FFFFFF;
        }

        /* SIDEBAR */

        .sidebar{
          background:#1D222B;

          color:#fff;

          border-right:1px solid #2a3447;

          display:flex;
          flex-direction:column;
        }

        .logo-box{
          height:64px;

          padding:20px 24px;

          border-bottom:1px solid #2a3447;

          display:flex;
          align-items:center;
        }

        .logo-img{
          height:24px;
        }

        /* SEARCH */

        .search-wrapper{
          padding:16px;
        }

        .search-box{
          width:100%;

          height:44px;

          background:#2a3243;

          border-radius:10px;

          display:flex;
          align-items:center;

          gap:10px;

          padding:0 14px;

          color:#9aa4b2;
        }

        .search-box input{
          width:100%;

          border:none;

          outline:none;

          background:transparent;

          color:#fff;

          font-size:14px;
        }

        /* NAV */

        .nav-links{
          padding:10px;

          display:flex;
          flex-direction:column;

          gap:6px;
        }

        .nav-btn{
          width:100%;

          height:48px;

          border:none;

          border-radius:10px;

          background:transparent;

          color:#9aa4b2;

          display:flex;
          align-items:center;

          gap:12px;

          padding:0 16px;

          font-size:15px;

          cursor:pointer;

          transition:0.3s;
        }

        .nav-btn:hover{
          background:#2a3243;
          color:#fff;
        }

        .nav-btn.active{
          background:#2a3243;
          color:#fff;
        }

        /* MAIN CONTENT */

        .main-content{
          width:100%;

          display:flex;
          flex-direction:column;
        }

        /* TOPBAR */

        .topbar{
          width:100%;

          height:64px;

          border-bottom:1px solid #E5E7EB;

          display:flex;
          justify-content:flex-end;
          align-items:center;

          padding:0 30px;
        }

        .profile-box{
          display:flex;
          align-items:center;

          gap:10px;

          cursor:pointer;
        }

        .profile-img{
          width:38px;
          height:38px;

          border-radius:50%;
        }

        /* TABS */

        .tabs{
          width:100%;

          height:64px;

          border-bottom:1px solid #E5E7EB;

          display:flex;
          align-items:center;

          gap:40px;

          padding:0 30px;
        }

        .tab-btn{
          height:64px;

          border:none;

          background:transparent;

          color:#9CA3AF;

          font-size:15px;

          font-weight:500;

          cursor:pointer;
        }

        .tab-active{
          color:#111827;

          border-bottom:2px solid #2563EB;

          font-weight:700;
        }

        /* EMPTY STATE */

        .empty-state{
          flex:1;

          display:flex;
          justify-content:center;
          align-items:center;

          padding:40px;
        }

        .empty-content{
          text-align:center;
        }

        /* ICON */

        .icon-wrapper{
          width:90px;
          height:90px;

          margin:0 auto 30px;

          position:relative;
        }

        .square{
          width:28px;
          height:28px;

          border:5px solid #101b8c;

          border-radius:6px;

          position:absolute;
        }

        .top-left{
          top:0;
          left:0;
        }

        .top-right{
          top:0;
          right:0;
        }

        .bottom-left{
          bottom:0;
          left:0;
        }

        .plus-icon{
          position:absolute;

          right:0;
          bottom:0;

          color:#101b8c;
        }

        /* TEXT */

        .empty-content h2{
          font-size:clamp(28px,4vw,42px);

          color:#374151;

          margin-bottom:18px;

          font-weight:700;
        }

        .empty-content p{
          color:#b0b7c3;

          font-size:clamp(15px,2vw,18px);

          line-height:1.7;
        }

        /* TABLET */

        @media(max-width:992px){

          .homepage{
            grid-template-columns:1fr;
          }

          .sidebar{
            width:100%;

            flex-direction:row;

            align-items:center;

            justify-content:space-between;

            padding:10px 20px;
          }

          .logo-box{
            border:none;

            padding:0;

            height:auto;
          }

          .search-wrapper{
            flex:1;

            max-width:300px;
          }

          .nav-links{
            flex-direction:row;
          }
        }

        /* MOBILE */

        @media(max-width:768px){

          .sidebar{
            flex-wrap:wrap;

            gap:14px;
          }

          .search-wrapper{
            width:100%;

            max-width:100%;
          }

          .topbar{
            padding:0 16px;
          }

          .tabs{
            gap:24px;

            padding:0 16px;
          }

          .empty-state{
            padding:20px;
          }

          .empty-content h2{
            font-size:28px;
          }
        }

        .product-grid-container {
          display: grid;
          grid-gap: .75rem;
          grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
          padding: 30px;
          width: 100%;
          align-content: start;
        }

        .product-item {
          aspect-ratio: 1;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          display: grid;
          font: bold 1.5rem sans-serif;
          place-content: center;
          width: 100%;
          color: #374151;
        }
      `}</style>

      <div className="homepage">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <div className="logo-box">
            <img
              src="/img/logo.png"
              alt="logo"
              className="logo-img"
            />
          </div>

          <div className="search-wrapper">
            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search"
              />
            </div>
          </div>

          <nav className="nav-links">

            <button className="nav-btn active">
              <Home size={18} />
              Home
            </button>

            <button
              className="nav-btn"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag size={18} />
              Products
            </button>

          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">

          <header className="topbar">

            <div className="profile-box">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="profile-img"
              />

              <ChevronDown size={18} />
            </div>

          </header>

          {/* TABS */}
          <div className="tabs">

            <button
              className={`tab-btn ${
                activeTab === "Published"
                  ? "tab-active"
                  : ""
              }`}
              onClick={() => setActiveTab("Published")}
            >
              Published
            </button>

            <button
              className={`tab-btn ${
                activeTab === "Unpublished"
                  ? "tab-active"
                  : ""
              }`}
              onClick={() => setActiveTab("Unpublished")}
            >
              Unpublished
            </button>

          </div>

          {/* CONTENT AREA */}
          {activeTab === "Published" && publishedProducts.length > 0 ? (
            <section className="product-grid-container">
              {publishedProducts.map((prod) => (
                <div key={prod} className="product-item">
                  Product {prod}
                </div>
              ))}
            </section>
          ) : activeTab === "Unpublished" && unpublishedProducts.length > 0 ? (
            <section className="product-grid-container">
              {unpublishedProducts.map((prod) => (
                <div key={prod} className="product-item">
                  Draft {prod}
                </div>
              ))}
            </section>
          ) : (
            <section className="empty-state">

              <div className="empty-content">

                <div className="icon-wrapper">

                  <div className="square top-left"></div>

                  <div className="square top-right"></div>

                  <div className="square bottom-left"></div>

                  <div className="plus-icon">
                    <Plus size={34} strokeWidth={3.5} />
                  </div>

                </div>

                <h2>
                  {activeTab === "Published"
                    ? "No Published Products"
                    : "No Unpublished Products"}
                </h2>

                <p>
                  Your {activeTab} Products will appear here
                  <br />
                  Create your first product to publish
                </p>

              </div>

            </section>
          )}

        </main>

      </div>
    </>
  );
}