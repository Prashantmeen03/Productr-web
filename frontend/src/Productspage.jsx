import { API_URL } from "./config";
import logoImg from "./assets/img/logo.svg";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Home,
  ShoppingBag,
  Plus,
  Trash2,
  X,
  ChevronDown
} from "lucide-react";
import axios from "axios";

export default function Productspage() {
  const navigate = useNavigate();
  const profileImage = localStorage.getItem("profileImage") || "https://i.pravatar.cc/150";

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Published");
  const [carouselIndices, setCarouselIndices] = useState({});

  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.state?.showSuccessToast) {
      setShowToast(true);
      // Clear location state so the toast doesn't show again on manual reload
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (p) => {
    setDeleteData(p);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/products/${deleteData._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditClick = (p) => {
    setEditData(p);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const confirmEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/products/${editData._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update product: " + (err.response?.data?.message || err.message));
    }
  };

  const togglePublish = async (p) => {
    try {
      const token = localStorage.getItem("token");
      const isCurrentlyPublished = String(p.isPublished) === "true";
      await axios.put(`${API_URL}/api/products/${p._id}`, { ...p, isPublished: !isCurrentlyPublished }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    })).then(imagesBase64 => {
      setEditData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...imagesBase64]
      }));
    });
  };

  const removeEditImage = (indexToRemove) => {
    setEditData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const filteredProducts = products.filter(p =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const publishedProducts = filteredProducts.filter(p => String(p.isPublished) === "true");
  const unpublishedProducts = filteredProducts.filter(p => String(p.isPublished) !== "true");
  const displayedProducts = activeTab === "Published" ? publishedProducts : unpublishedProducts;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Outfit', sans-serif; }
        .dashboard-container { display: flex; width: 100vw; height: 100vh; overflow: hidden; background: #f9fafb; }
        
        /* SIDEBAR */
        .sidebar { width: 240px; height: 100vh; background: #111827; border-right: 0.5px solid rgba(255,255,255,0.15); display: flex; flex-direction: column; flex-shrink: 0; }
        .logo-box { height: 64px; padding: 20px 24px; display: flex; align-items: center; border-bottom: 0.5px solid rgba(255,255,255,0.15); }
        .logo-img { height: 28px; }
        
        .search-wrapper { padding: 16px; }
        .search-box { width: 100%; height: 44px; background: #1f2937; border-radius: 10px; display: flex; align-items: center; gap: 10px; padding: 0 14px; color: #9ca3af; }
        .search-box input { width: 100%; border: none; outline: none; background: transparent; color: #fff; font-size: 14px; }
        .search-box input::placeholder { color: #9ca3af; }

        .nav-links { display: flex; flex-direction: column; gap: 8px; padding: 10px 16px; flex: 1; }
        .nav-btn { width: 100%; height: 48px; border: none; border-radius: 10px; background: transparent; color: #9ca3af; display: flex; align-items: center; gap: 12px; padding: 0 16px; font-size: 15px; cursor: pointer; transition: 0.2s ease; }
        .nav-btn:hover { background: #1f2937; color: #fff; }
        .nav-btn.active { background: #1f2937; color: #fff; font-weight: 600; }

        /* MAIN CONTENT */
        .main-view { flex: 1; display: flex; flex-direction: column; overflow: hidden; height: 100vh; }
        
        /* TOPBAR */
        .top-nav { height: 64px; background: #fff; border-bottom: 0.5px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; flex-shrink: 0; }
        .page-indicator { display: flex; align-items: center; gap: 8px; color: #4b5563; font-weight: 600; font-size: 16px; }
        
        .profile-box { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .profile-img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #e5e7eb; }

        /* BODY AREA */
        .content-area { flex: 1; display: flex; flex-direction: column; overflow-y: auto; padding: 32px; }

        /* TAB SPLITTERS */
        .tabs-header-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .tabs { display: flex; gap: 8px; background: #f3f4f6; padding: 4px; border-radius: 8px; }
        .tab-btn { border: none; background: transparent; padding: 8px 16px; border-radius: 6px; font-weight: 500; font-size: 14px; color: #4b5563; cursor: pointer; transition: 0.15s ease; }
        .tab-btn.tab-active { background: #fff; color: #111827; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

        /* PRODUCTS GRID */
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; width: 100%; }
        .product-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #e5e7eb;
          padding: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05);
        }
        .product-image-container {
          width: 100%;
          aspect-ratio: 16/10;
          overflow: hidden;
          border-radius: 12px;
          margin-bottom: 16px;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .product-image-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .carousel-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          background: rgba(255, 255, 255, 0.7);
          padding: 4px 8px;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .carousel-dots .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d1d5db;
          cursor: pointer;
          transition: background 0.2s;
        }
        .carousel-dots .dot.active {
          background: #ff6b00;
        }
        .product-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
        }
        .product-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .product-detail-label {
          color: #8a94a6;
        }
        .product-detail-val {
          color: #374151;
          font-weight: 600;
        }
        .product-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        .btn-publish {
          flex: 1.2;
          height: 40px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          font-size: 14px;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-publish.unpublished {
          background: #2438F5;
        }
        .btn-publish.published {
          background: #4ece0c;
        }
        .btn-edit {
          flex: 1.2;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background: #fff;
          color: #374151;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-edit:hover {
          background: #f9fafb;
        }
        .btn-delete {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background: #fff;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-delete:hover {
          background: #f9fafb;
          color: #ef4444;
          border-color: #fca5a5;
        }

        /* TOAST STYLES */
        .toast-container {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          z-index: 2000;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .toast-icon {
          width: 24px;
          height: 24px;
          background: #10b981;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .toast-text {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }
        .toast-close {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 4px;
        }
        .toast-close:hover {
          color: #4b5563;
          background: #f3f4f6;
        }
        
        /* MODAL OVERLAYS */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: #fff; border-radius: 12px; width: 480px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
        .modal-body { padding: 24px; overflow-y: auto; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid #e5e7eb; }
        .form-group-modal { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .form-group-modal label { font-size: 14px; font-weight: 500; color: #374151; }
        .form-group-modal input, .form-group-modal select { height: 40px; border-radius: 8px; border: 1px solid #d1d5db; padding: 0 12px; font-size: 14px; outline: none; }
        
        /* EMPTY STATE STYLE */
        .empty-state { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px; text-align: center; margin-top: 60px; }
        .empty-content { text-align: center; }
        .icon-wrapper { width: 90px; height: 90px; margin: 0 auto 30px; position: relative; }
        .square { width: 28px; height: 28px; border: 5px solid #101b8c; border-radius: 6px; position: absolute; }
        .square.top-left { top: 0; left: 0; }
        .square.top-right { top: 0; right: 0; }
        .square.bottom-left { bottom: 0; left: 0; }
        .plus-icon { position: absolute; right: 0; bottom: 0; color: #101b8c; }
        .empty-content h2 { font-size: clamp(28px,4vw,42px); color: #374151; margin-bottom: 18px; font-weight: 700; }
        .empty-content p { color: #b0b7c3; font-size: clamp(15px,2vw,18px); line-height: 1.7; margin-bottom: 30px; }
        .add-product-btn { padding: 14px 40px; background: #101b8c; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; transition: 0.2s; }
        .add-product-btn:hover { background: #0c1466; }
      `}</style>

      <div className="dashboard-container">
        {/* SIDEBAR */}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <nav className="nav-links">
            <button className="nav-btn" onClick={() => navigate("/home")}>
              <Home size={18} /> Home
            </button>
            <button className="nav-btn active">
              <ShoppingBag size={18} /> Products
            </button>
          </nav>
        </aside>

        {/* MAIN VIEW */}
        <main className="main-view">
          {/* HEADER */}
          <header className="top-nav">
            <div className="page-indicator">
              <ShoppingBag size={18} />
              Products
            </div>
            <div className="profile-box" onClick={() => navigate("/profile")}>
              <img src={profileImage} alt="profile" className="profile-img" />
              <ChevronDown size={18} color="#4b5563" />
            </div>
          </header>

          {/* CONTENT CANVAS */}
          <div className="content-area">
            {products.length === 0 ? (
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
                  <h2>Feels a little empty over here...</h2>
                  <p>
                    You can create products without connecting store
                    <br />
                    you can add products to store anytime
                  </p>
                  <button className="add-product-btn" onClick={() => navigate("/add-product")}>
                    Add your Products
                  </button>
                </div>
              </section>
            ) : (
              <>
                <div className="tabs-header-container">
                  {/* PUBLISHED / UNPUBLISHED SPLITTER */}
                  <div className="tabs">
                    <button
                      className={`tab-btn ${activeTab === "Published" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("Published")}
                    >
                      Published
                    </button>
                    <button
                      className={`tab-btn ${activeTab === "Unpublished" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("Unpublished")}
                    >
                      Unpublished
                    </button>
                  </div>

                  <button
                    onClick={() => navigate("/add-product")}
                    style={{
                      background: "#101b8c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer"
                    }}
                  >
                    <Plus size={18} /> Add Product
                  </button>
                </div>

                {displayedProducts.length > 0 ? (
                  <div className="products-grid">
                    {displayedProducts.map((p) => {
                      const images = p.images && p.images.length > 0 ? p.images : ["https://via.placeholder.com/150"];
                      const activeImg = carouselIndices[p._id] || 0;
                      return (
                        <div key={p._id} className="product-card">
                          <div
                            className="product-image-container"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/product-details", { state: { product: p } })}
                          >
                            <img src={images[activeImg]} alt="product" />
                            {images.length > 1 && (
                              <div className="carousel-dots">
                                {images.map((_, idx) => (
                                  <span
                                    key={idx}
                                    className={`dot ${idx === activeImg ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCarouselIndices(prev => ({ ...prev, [p._id]: idx }));
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <div
                            className="product-title"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/product-details", { state: { product: p } })}
                          >
                            {p.productName}
                          </div>
                          <div className="product-detail-row">
                            <span className="product-detail-label">Product type -</span>
                            <span className="product-detail-val">{p.productType}</span>
                          </div>
                          <div className="product-detail-row">
                            <span className="product-detail-label">Quantity Stock -</span>
                            <span className="product-detail-val">{p.quantityStock}</span>
                          </div>
                          <div className="product-detail-row">
                            <span className="product-detail-label">MRP -</span>
                            <span className="product-detail-val">₹ {p.mrp}</span>
                          </div>
                          <div className="product-detail-row">
                            <span className="product-detail-label">Selling Price -</span>
                            <span className="product-detail-val">₹ {p.sellingPrice}</span>
                          </div>
                          <div className="product-detail-row">
                            <span className="product-detail-label">Brand Name -</span>
                            <span className="product-detail-val">{p.brandName}</span>
                          </div>
                          <div className="product-detail-row">
                            <span className="product-detail-label">Total Number of images -</span>
                            <span className="product-detail-val">{p.images?.length || 0}</span>
                          </div>
                          <div className="product-detail-row">
                            <span className="product-detail-label">Exchange Eligibility -</span>
                            <span className="product-detail-val">
                              .{p.returnEligibility ? p.returnEligibility.toUpperCase() : "YES"}
                            </span>
                          </div>

                          <div className="product-actions">
                            <button
                              className={`btn-publish ${String(p.isPublished) === "true" ? 'published' : 'unpublished'}`}
                              onClick={() => togglePublish(p)}
                            >
                              {String(p.isPublished) === "true" ? "Unpublish" : "Publish"}
                            </button>
                            <button className="btn-edit" onClick={() => handleEditClick(p)}>
                              Edit
                            </button>
                            <button className="btn-delete" onClick={() => handleDeleteClick(p)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p style={{ color: "#9ca3af", fontSize: "16px" }}>No {activeTab.toLowerCase()} products found.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && editData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                <X size={24} color="#4b5563" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group-modal"><label>Product Name</label><input name="productName" value={editData.productName} onChange={handleEditChange} /></div>
              <div className="form-group-modal">
                <label>Product Type</label>
                <select name="productType" value={editData.productType} onChange={handleEditChange}>
                  <option value="Foods">Foods</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group-modal"><label>Quantity Stock</label><input name="quantityStock" type="number" value={editData.quantityStock} onChange={handleEditChange} /></div>
              <div className="form-group-modal"><label>MRP</label><input name="mrp" type="number" value={editData.mrp} onChange={handleEditChange} /></div>
              <div className="form-group-modal"><label>Selling Price</label><input name="sellingPrice" type="number" value={editData.sellingPrice} onChange={handleEditChange} /></div>
              <div className="form-group-modal"><label>Brand Name</label><input name="brandName" value={editData.brandName} onChange={handleEditChange} /></div>

              <div className="form-group-modal">
                <label>Upload Product Images</label>
                <div style={{ border: "1px dashed #d1d5db", borderRadius: "8px", padding: "32px", textAlign: "center", color: "#6b7280", position: "relative" }}>
                  {editData.images && editData.images.length > 0 ? (
                    <div style={{ display: "flex", gap: "10px", overflowX: "auto", marginBottom: "10px", padding: "5px" }}>
                      {editData.images.map((img, i) => (
                        <div key={i} style={{ position: "relative", width: "60px", height: "60px", flexShrink: 0 }}>
                          <img src={img} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px", border: "1px solid #e5e7eb" }} />
                          <button
                            type="button"
                            onClick={() => removeEditImage(i)}
                            style={{
                              position: "absolute",
                              top: "-6px",
                              right: "-6px",
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              width: "18px",
                              height: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              fontSize: "10px",
                              fontWeight: "bold",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ marginBottom: "10px" }}>No images uploaded</p>
                  )}
                  <label style={{ background: "transparent", border: "1px solid #2563EB", color: "#2563EB", fontWeight: "600", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "inline-block" }}>
                    Browse
                    <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleEditImageUpload} />
                  </label>
                </div>
              </div>

              <div className="form-group-modal">
                <label>Exchange or return eligibility</label>
                <select name="returnEligibility" value={editData.returnEligibility} onChange={handleEditChange}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ padding: "20px 24px" }}>
              <button className="btn-edit" onClick={() => setShowEditModal(false)} style={{ marginRight: "8px" }}>Cancel</button>
              <button
                onClick={confirmEdit}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0 24px",
                  height: "40px",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && deleteData && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: "400px" }}>
            <div className="modal-header">
              <h2>Delete Product</h2>
              <button onClick={() => setShowDeleteModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                <X size={24} color="#4b5563" />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: "#4b5563", lineHeight: "1.5" }}>
                Are you sure you really want to delete this Product <br />
                <strong style={{ color: "#111827" }}>"{deleteData.productName}"</strong> ?
              </p>
            </div>
            <div className="modal-footer" style={{ display: "flex", gap: "12px", width: "100%", padding: "20px 24px" }}>
              <button
                className="btn-edit"
                onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, height: "44px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fff", color: "#374151", cursor: "pointer", fontWeight: "500" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{ flex: 1, height: "44px", borderRadius: "8px", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontWeight: "500" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="toast-container">
          <div className="toast-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="toast-text">Product added Successfully</span>
          <button className="toast-close" onClick={() => setShowToast(false)}>
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
