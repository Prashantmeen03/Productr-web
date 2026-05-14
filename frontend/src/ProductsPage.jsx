import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  ShoppingBag,
  ChevronDown,
  Plus,
} from "lucide-react";

export default function ProductsPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial, Helvetica, sans-serif;
        }

        body{
          background:#F5F5F5;
        }

        .app{
          width:100%;
          min-height:100vh;
          display:flex;
          background:#F5F5F5;
        }

        /* SIDEBAR */

        .sidebar{
          width:240px;
          min-height:100vh;

          background:linear-gradient(
            180deg,
            #1F2430 0%,
            #131926 100%
          );

          border-right:1px solid #2D3340;

          display:flex;
          flex-direction:column;
        }

        /* LOGO */

        .logo{
          height:64px;

          padding:0 18px;

          display:flex;
          align-items:center;

          border-bottom:1px solid #2D3340;
        }

        .logo img{
          height:30px;
        }

        /* SEARCH */

        .search-wrapper{
          padding:14px 10px;
        }

        .search-box{
          height:36px;

          background:#2A303C;

          border-radius:6px;

          display:flex;
          align-items:center;

          gap:10px;

          padding:0 12px;

          color:#8E97A7;
        }

        .search-box input{
          width:100%;

          border:none;
          outline:none;

          background:transparent;

          color:#fff;

          font-size:14px;
        }

        /* NAVIGATION */

        .nav{
          margin-top:14px;

          display:flex;
          flex-direction:column;

          gap:6px;

          padding:0 10px;
        }

        .nav-btn{
          height:42px;

          border:none;

          background:transparent;

          color:#8E97A7;

          display:flex;
          align-items:center;

          gap:12px;

          padding:0 8px;

          border-radius:8px;

          cursor:pointer;

          font-size:16px;

          transition:0.3s;
        }

        .nav-btn:hover{
          background:#2A303C;
          color:#fff;
        }

        .nav-btn.active{
          color:#fff;
        }

        /* MAIN */

        .main{
          flex:1;

          display:flex;
          flex-direction:column;
        }

        /* TOPBAR */

        .topbar{
          height:64px;

          background:#fff;

          border-bottom:1px solid #E5E7EB;

          display:flex;
          align-items:center;
          justify-content:space-between;

          padding:0 24px;
        }

        .top-left{
          display:flex;
          align-items:center;

          gap:10px;

          color:#374151;

          font-size:16px;
        }

        .top-right{
          display:flex;
          align-items:center;

          gap:8px;
        }

        .profile{
          width:28px;
          height:28px;

          border-radius:50%;
        }

        /* CONTENT */

        .content{
          flex:1;

          display:flex;
          justify-content:center;
          align-items:center;

          padding:20px;
        }

        .empty-box{
          text-align:center;
        }

        /* ICON */

        .icon-wrapper{
          width:80px;
          height:80px;

          margin:0 auto 24px;

          position:relative;
        }

        .square{
          width:26px;
          height:26px;

          border:5px solid #121B8F;

          border-radius:6px;

          position:absolute;
        }

        .top-left-square{
          top:0;
          left:0;
        }

        .top-right-square{
          top:0;
          right:0;
        }

        .bottom-left-square{
          bottom:0;
          left:0;
        }

        .plus-icon{
          position:absolute;

          right:0;
          bottom:0;

          color:#121B8F;
        }

        /* TEXT */

        .empty-box h2{
          font-size:18px;

          color:#374151;

          margin-bottom:12px;

          font-weight:700;
        }

        .empty-box p{
          color:#9CA3AF;

          font-size:14px;

          line-height:1.7;

          margin-bottom:24px;
        }

        /* BUTTON */

        .add-btn{
          width:315px;
          max-width:100%;

          height:40px;

          border:none;

          border-radius:8px;

          background:#1F2BFF;

          color:#fff;

          font-size:16px;

          font-weight:600;

          cursor:pointer;

          transition:0.3s;
        }

        .add-btn:hover{
          background:#1120d4;
        }

        /* -------------------------------- */
        /* CSS GRID RESPONSIVE EXAMPLE */
        /* -------------------------------- */

        .responsive-grid{
          width:100%;

          display:grid;

          gap:12px;

          grid-template-columns:
          repeat(auto-fit, minmax(175px, 1fr));

          margin-top:40px;
        }

        .grid-item{
          aspect-ratio:1;

          background:#D1D5DB;

          border-radius:12px;

          display:grid;

          place-content:center;

          font-size:24px;

          font-weight:bold;

          color:#374151;
        }

        /* TABLET */

        @media(max-width:992px){

          .sidebar{
            width:200px;
          }
        }

        /* MOBILE */

        @media(max-width:768px){

          .app{
            flex-direction:column;
          }

          .sidebar{
            width:100%;
            min-height:auto;
          }

          .nav{
            flex-direction:row;
            padding-bottom:10px;
          }

          .topbar{
            padding:0 16px;
          }

          .empty-box h2{
            font-size:24px;
          }
        }
      `}</style>

      <div className="app">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <div className="logo">
            <img
              src="/img/logo.png"
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

              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="profile"
              />

              <ChevronDown size={16} />

            </div>

          </div>

          {/* CONTENT */}
          <div className="content">

            <div className="empty-box">

              {/* ICON */}
              <div className="icon-wrapper">

                <div className="square top-left-square"></div>

                <div className="square top-right-square"></div>

                <div className="square bottom-left-square"></div>

                <div className="plus-icon">
                  <Plus size={34} strokeWidth={4} />
                </div>

              </div>

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

              {/* RESPONSIVE GRID EXAMPLE */}
              <div className="responsive-grid">

                <div className="grid-item">1</div>

                <div className="grid-item">2</div>

                <div className="grid-item">3</div>

                <div className="grid-item">4</div>

                <div className="grid-item">5</div>

                <div className="grid-item">6</div>

              </div>

            </div>

          </div>

        </main>

      </div>
    </>
  );
}