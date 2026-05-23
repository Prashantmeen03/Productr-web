import { API_URL } from './config';
import logoImg from "./assets/img/logo.svg";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Home, ShoppingBag, ChevronDown, Plus, Trash2, X, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function ProductDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProduct = location.state?.product;
  const profileImage = localStorage.getItem("profileImage") || "https://i.pravatar.cc/150";

  const [activeProduct, setActiveProduct] = useState(null);
  const [carouselIndices, setCarouselIndices] = useState({});
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

  useEffect(() => {
    if (selectedProduct) {
      setActiveProduct(selectedProduct);
      localStorage.setItem("lastActiveProductId", selectedProduct._id);
    } else {
      const lastId = localStorage.getItem("lastActiveProductId");
      if (lastId && products && products.length > 0) {
        const found = products.find(p => p._id === lastId);
        if (found) {
          setActiveProduct(found);
        }
      }
    }
  }, [selectedProduct, products]);

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      console.error(err);
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
      localStorage.removeItem("lastActiveProductId");
      fetchProducts();
      if (activeProduct && activeProduct._id === deleteData._id) {
        setActiveProduct(null);
        navigate('/products');
      }
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
      const res = await axios.put(`${API_URL}/api/products/${editData._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditModal(false);
      fetchProducts();
      if (activeProduct && activeProduct._id === editData._id) {
        setActiveProduct(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (p) => {
    try {
      const token = localStorage.getItem("token");
      const isCurrentlyPublished = String(p.isPublished) === "true";
      const res = await axios.put(`${API_URL}/api/products/${p._id}`, { ...p, isPublished: !isCurrentlyPublished }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      if (activeProduct && activeProduct._id === p._id) {
        setActiveProduct(res.data.data);
      }
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

  const displayedProducts = products.filter(p =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }
        body {
          background: #f9fafb;
          color: #111827;
          overflow: hidden;
        }
        .app {
          display: grid;
          grid-template-columns: 240px 1fr;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar {
          width: 240px;
          height: 1024px;
          min-height: 100vh;
          background: #111827;
          color: #9ca3af;
          padding: 24px;
          display: flex;
          flex-direction: column;
          border-right: 0.5px solid rgba(255, 255, 255, 0.1);
          border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
          box-sizing: border-box;
          flex-shrink: 0;
        }
        .logo {
          margin-bottom: 32px;
        }
        .logo img {
          height: 32px;
        }
        .search-wrapper {
          margin-bottom: 24px;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1f2937;
          padding: 10px 14px;
          border-radius: 8px;
          color: #9ca3af;
        }
        .search-box input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
          font-size: 14px;
        }
        .nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .nav-btn {
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .nav-btn:hover {
          background: #1f2937;
          color: #fff;
        }
        .nav-btn.active {
          background: #2563eb;
          color: #fff;
          font-weight: 600;
        }
        .main {
          display: flex;
          flex-direction: column;
          height: 100vh;
          min-width: 0;
          overflow: hidden;
          background: #f9fafb;
        }
        .topbar {
          height: 64px;
          width: 1200px;
          background: #fff;
          border-bottom: 0.5px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
          flex-shrink: 0;
          box-sizing: border-box;
          left: 240px;
        }
        .topbar .top-left {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #111827;
          font-weight: 600;
          font-size: 16px;
        }
        .topbar .top-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .profile-box {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .profile-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #e5e7eb;
        }
        .content {
          flex: 1;
          width: 1200px;
          height: 919px;
          overflow-y: auto;
          padding: 40px;
          box-sizing: border-box;
          position: absolute;
          top: 66px;
          left: 240px;
          background: #f9fafb;
        }

        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 24px;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: .75rem;
          width: 100%;
        }
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
        .btn-delete {
          width: 40px;
          height: 40px;
          background: white;
          color: #9ca3af;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(141, 150, 173, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .modal-content {
          width: 470px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        .modal-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }
        .modal-body {
          padding: 24px;
          max-height: 75vh;
          overflow-y: auto;
        }
        .form-group-modal { margin-bottom: 20px; }
        .form-group-modal label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #374151; }
        .form-group-modal input, .form-group-modal select { width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 16px; outline: none; }
        .modal-footer { border-top: 1px solid #e5e7eb; padding: 20px 24px; display: flex; justify-content: flex-end; }
        .btn-blue { background: #2563EB; color: white; padding: 10px 24px; border-radius: 8px; font-weight: 500; border: none; cursor: pointer; }
        
        .details-container {
          max-width: 1000px;
          margin: 0 auto;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
          padding: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        @media(max-width: 768px) {
          .details-container {
            grid-template-columns: 1fr;
            padding: 20px;
            gap: 20px;
          }
        }
        .details-image-sec {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #f3f4f6;
          padding: 0;
          aspect-ratio: 1;
          overflow: hidden;
        }
        .details-image-sec img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }
        .details-info-sec {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .brand-badge {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .product-name-title {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .type-pill {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 20px;
        }
        .price-section {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid #f3f4f6;
        }
        .price-row-details {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 8px;
        }
        .mrp-detail {
          font-size: 16px;
          color: #9ca3af;
          text-decoration: line-through;
        }
        .selling-detail {
          font-size: 28px;
          font-weight: 800;
          color: #10b981;
        }
        .saving-tag {
          font-size: 13px;
          color: #2563eb;
          font-weight: 600;
        }
        .detail-meta-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 30px;
          border-top: 1px solid #f3f4f6;
          padding-top: 20px;
        }
        .meta-item {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
        }
        .meta-label {
          color: #6b7280;
        }
        .meta-val {
          color: #111827;
          font-weight: 600;
        }
        .back-btn-details {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: #4b5563;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 24px;
          transition: 0.2s;
        }
        .back-btn-details:hover {
          color: #111827;
        }
      `}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <img src={logoImg} alt="logo" />
          </div>
          <div className="search-wrapper">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search" />
            </div>
          </div>
          <div className="nav">
            <button className="nav-btn" onClick={() => navigate("/home")}>
              <Home size={18} /> Home
            </button>
            <button className="nav-btn active" onClick={() => navigate("/products")}>
              <ShoppingBag size={18} /> Products
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="top-left">
              <ShoppingBag size={16} />
              <span>Products</span>
            </div>
            <div className="top-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={16} color="#6b7280" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', width: '250px', color: '#111827' }}
                />
              </div>
              <div className="profile-box" onClick={() => navigate('/profile')}>
                <img src={profileImage} alt="profile" className="profile-img" />
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          <div className="content">
            {activeProduct ? (
              <div style={{ padding: '20px 0' }}>
                <button className="back-btn-details" onClick={() => navigate('/products')}>
                  <ArrowLeft size={20} /> Back to Products
                </button>
                
                <div className="details-container">
                  <div className="details-image-sec" style={{ position: 'relative' }}>
                    <img 
                      src={activeProduct.images && activeProduct.images.length > 0 ? activeProduct.images[carouselIndices[activeProduct._id] || 0] : "https://via.placeholder.com/500"} 
                      alt={activeProduct.productName} 
                    />
                    {activeProduct.images && activeProduct.images.length > 1 && (
                      <div className="carousel-dots">
                        {activeProduct.images.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`dot ${idx === (carouselIndices[activeProduct._id] || 0) ? 'active' : ''}`}
                            onClick={() => setCarouselIndices(prev => ({ ...prev, [activeProduct._id]: idx }))}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="details-info-sec">
                    <div className="brand-badge">{activeProduct.brandName}</div>
                    <h1 className="product-name-title">{activeProduct.productName}</h1>
                    <div>
                      <span className="type-pill">{activeProduct.productType}</span>
                    </div>
                    
                    <div className="price-section">
                      <div className="price-row-details">
                        <span className="selling-detail">₹ {activeProduct.sellingPrice}</span>
                        <span className="mrp-detail">MRP ₹ {activeProduct.mrp}</span>
                      </div>
                      {activeProduct.mrp > activeProduct.sellingPrice && (
                        <div className="saving-tag">
                          Save ₹ {activeProduct.mrp - activeProduct.sellingPrice} ({Math.round(((activeProduct.mrp - activeProduct.sellingPrice) / activeProduct.mrp) * 100)}% Off)
                        </div>
                      )}
                    </div>
                    
                    <div className="detail-meta-list">
                      <div className="meta-item">
                        <span className="meta-label">Quantity in Stock</span>
                        <span className="meta-val" style={{ color: activeProduct.quantityStock > 0 ? '#10b981' : '#ef4444' }}>
                          {activeProduct.quantityStock > 0 ? `${activeProduct.quantityStock} units available` : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Exchange / Return Eligibility</span>
                        <span className="meta-val">{activeProduct.returnEligibility || 'Yes'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Status</span>
                        <span className="meta-val" style={{ color: String(activeProduct.isPublished) === "true" ? '#10b981' : '#3b82f6' }}>
                          {String(activeProduct.isPublished) === "true" ? 'Published' : 'Draft (Unpublished)'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="product-actions" style={{ marginTop: 0 }}>
                      <button
                        className="btn-publish"
                        style={{ background: String(activeProduct.isPublished) === "true" ? '#10b981' : '#2563EB', height: '48px', borderRadius: '8px', fontSize: '15px' }}
                        onClick={() => togglePublish(activeProduct)}
                      >
                        {String(activeProduct.isPublished) === "true" ? "Unpublish Product" : "Publish Product"}
                      </button>
                      <button 
                        className="btn-edit" 
                        style={{ height: '48px', borderRadius: '8px', fontSize: '15px' }} 
                        onClick={() => handleEditClick(activeProduct)}
                      >
                        Edit Product
                      </button>
                      <button 
                        className="btn-delete" 
                        style={{ height: '48px', width: '48px', borderRadius: '8px' }} 
                        onClick={() => handleDeleteClick(activeProduct)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="products-header">
                  <h2 style={{ fontSize: '24px', color: '#1f2937', fontWeight: '600' }}>Products</h2>
                  <button onClick={() => navigate('/add-product')} style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Plus size={20} /> Add Products
                  </button>
                </div>

                {products.length > 0 ? (
                  <div className="products-grid">
                    {products.map(p => {
                      const images = p.images && p.images.length > 0 ? p.images : ["https://via.placeholder.com/150"];
                      const activeImg = carouselIndices[p._id] || 0;
                      return (
                        <div key={p._id} className="product-card">
                          <div 
                            className="product-image-container" 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => setActiveProduct(p)}
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
                            style={{ cursor: 'pointer' }} 
                            onClick={() => setActiveProduct(p)}
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
                            <button className="btn-edit" onClick={() => handleEditClick(p)}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDeleteClick(p)}><Trash2 size={18} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <section className="empty-state" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', marginTop: '60px' }}>
                    <div className="empty-content" style={{ textAlign: 'center' }}>
                      <div className="icon-wrapper" style={{ width: '90px', height: '90px', margin: '0 auto 30px', position: 'relative' }}>
                        <div className="square top-left" style={{ width: '28px', height: '28px', border: '5px solid #101b8c', borderRadius: '6px', position: 'absolute', top: 0, left: 0 }}></div>
                        <div className="square top-right" style={{ width: '28px', height: '28px', border: '5px solid #101b8c', borderRadius: '6px', position: 'absolute', top: 0, right: 0 }}></div>
                        <div className="square bottom-left" style={{ width: '28px', height: '28px', border: '5px solid #101b8c', borderRadius: '6px', position: 'absolute', bottom: 0, left: 0 }}></div>
                        <div className="plus-icon" style={{ position: 'absolute', right: 0, bottom: 0, color: '#101b8c' }}><Plus size={34} strokeWidth={3.5} /></div>
                      </div>
                      <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', color: '#374151', marginBottom: '18px', fontWeight: 700 }}>Feels a little empty over here...</h2>
                      <p style={{ color: '#b0b7c3', fontSize: 'clamp(15px,2vw,18px)', lineHeight: 1.7 }}>You can create products without connecting store<br />you can add products to store anytime</p>
                      <button className="add-product-btn" onClick={() => navigate('/add-product')} style={{ marginTop: '30px', padding: '14px 40px', background: '#101b8c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '16px', cursor: 'pointer', transition: '0.2s' }}>Add your Products</button>
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {showEditModal && editData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#4b5563" /></button>
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
                <div style={{ border: '1px dashed #d1d5db', borderRadius: '8px', padding: '32px', textAlign: 'center', color: '#6b7280', position: 'relative' }}>
                  {editData.images && editData.images.length > 0 ? (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '10px', padding: '5px' }}>
                      {editData.images.map((img, i) => (
                        <div key={i} style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0 }}>
                          <img src={img} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
                          <button 
                            type="button" 
                            onClick={() => removeEditImage(i)} 
                            style={{ 
                              position: 'absolute', 
                              top: '-6px', 
                              right: '-6px', 
                              background: '#ef4444', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: '50%', 
                              width: '18px', 
                              height: '18px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              cursor: 'pointer', 
                              fontSize: '10px',
                              fontWeight: 'bold',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ marginBottom: '10px' }}>No images uploaded</p>
                  )}
                  <label style={{ background: 'transparent', border: '1px solid #2563EB', color: '#2563EB', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'inline-block' }}>
                    Browse
                    <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleEditImageUpload} />
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
            <div className="modal-footer">
              <button className="btn-blue" onClick={confirmEdit}>Update</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && deleteData && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '400px' }}>
            <div className="modal-header">
              <h2>Delete Product</h2>
              <button onClick={() => setShowDeleteModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#4b5563" /></button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#4b5563', lineHeight: '1.5' }}>
                Are you sure you really want to delete this Product <br />
                <strong style={{ color: '#111827' }}>"{deleteData.productName}"</strong> ?
              </p>
            </div>
            <div className="modal-footer" style={{ display: 'flex', gap: '12px', width: '100%', padding: '20px 24px' }}>
              <button 
                className="btn-edit" 
                onClick={() => setShowDeleteModal(false)} 
                style={{ flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', cursor: 'pointer', fontWeight: '500' }}
              >
                Cancel
              </button>
              <button 
                className="btn-blue" 
                onClick={confirmDelete} 
                style={{ flex: 1, height: '44px', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '500' }}
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
