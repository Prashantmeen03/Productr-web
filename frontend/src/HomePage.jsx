import { API_URL } from './config';
import logoImg from "./assets/img/logo.svg";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Search,
  ChevronDown,
  Plus,
  Trash2,
  X
} from "lucide-react";
import axios from "axios";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Published");
  const profileImage = localStorage.getItem("profileImage") || "https://i.pravatar.cc/150";

  const [products, setProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
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
      await axios.delete(`${API_URL}/api/products/${deleteData._id}`);
      setShowDeleteModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
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
      await axios.put(`${API_URL}/api/products/${editData._id}`, editData);
      setShowEditModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (p) => {
    try {
      await axios.put(`${API_URL}/api/products/${p._id}`, { ...p, isPublished: !p.isPublished });
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

  const publishedProducts = products.filter(p => p.isPublished);
  const unpublishedProducts = products.filter(p => !p.isPublished);

  const displayedProducts = activeTab === "Published" ? publishedProducts : unpublishedProducts;

  return (
    <>
      <style>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
          padding: 24px;
        }
        .product-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .product-image-container {
          width: 100%;
          height: 200px;
          border-radius: 8px;
          border: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .product-image-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .product-title {
          font-weight: 600;
          font-size: 16px;
          color: #111827;
          margin-bottom: 16px;
        }
        .product-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .product-detail-label {
          color: #6b7280;
        }
        .product-detail-val {
          color: #111827;
          font-weight: 500;
        }
        .product-actions {
          display: flex;
          gap: 12px;
          margin-top: auto;
          padding-top: 16px;
        }
        .btn-publish {
          flex: 1;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          height: 40px;
        }
        .btn-edit {
          flex: 1;
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          height: 40px;
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
      `}</style>
      <div className="homepage">
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
            <button className="nav-btn active">
              <Home size={18} /> Home
            </button>
            <button className="nav-btn" onClick={() => navigate("/product-details")}>
              <ShoppingBag size={18} /> Products
            </button>
          </nav>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div className="top-left">
              <Home size={18} />
              <span>Home</span>
            </div>
            <div className="top-right">
              <div className="profile-box" onClick={() => navigate('/profile')}>
                <img src={profileImage} alt="profile" className="profile-img" />
                <ChevronDown size={18} />
              </div>
            </div>
          </header>

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

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {displayedProducts.length > 0 ? (
              <div className="products-grid">
                {displayedProducts.map((p) => (
                  <div key={p._id} className="product-card">
                    <div className="product-image-container">
                      <img src={p.images && p.images.length > 0 ? p.images[0] : "https://via.placeholder.com/150"} alt="product" />
                    </div>
                    <div className="product-title">{p.productName}</div>
                    <div className="product-detail-row"><span className="product-detail-label">Product type</span><span className="product-detail-val">{p.productType}</span></div>
                    <div className="product-detail-row"><span className="product-detail-label">Quantity Stock</span><span className="product-detail-val">{p.quantityStock}</span></div>
                    <div className="product-detail-row"><span className="product-detail-label">MRP</span><span className="product-detail-val">₹ {p.mrp}</span></div>
                    <div className="product-detail-row"><span className="product-detail-label">Selling Price</span><span className="product-detail-val">₹ {p.sellingPrice}</span></div>
                    <div className="product-detail-row"><span className="product-detail-label">Brand Name</span><span className="product-detail-val">{p.brandName}</span></div>
                    <div className="product-detail-row"><span className="product-detail-label">Total Number of images</span><span className="product-detail-val">{p.images?.length || 0}</span></div>
                    <div className="product-detail-row"><span className="product-detail-label">Exchange Eligibility</span><span className="product-detail-val">{p.returnEligibility?.toUpperCase() || 'YES'}</span></div>

                    <div className="product-actions">
                      <button 
                        className="btn-publish" 
                        style={{ background: p.isPublished ? '#22c55e' : '#2563EB' }} 
                        onClick={() => togglePublish(p)}
                      >
                        {p.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button className="btn-edit" onClick={() => handleEditClick(p)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteClick(p)}><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <section className="empty-state">
                <div className="empty-content">
                  <div className="icon-wrapper">
                    <div className="square top-left"></div>
                    <div className="square top-right"></div>
                    <div className="square bottom-left"></div>
                    <div className="plus-icon"><Plus size={34} strokeWidth={3.5} /></div>
                  </div>
                  <h2>{activeTab === "Published" ? "No Published Products" : "No Unpublished Products"}</h2>
                  <p>Your {activeTab} Products will appear here<br />Create your first product to publish</p>
                </div>
              </section>
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
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '10px' }}>
                      {editData.images.map((img, i) => (
                        <img key={i} src={img} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
                      ))}
                    </div>
                  ) : (
                    <p style={{marginBottom: '10px'}}>Enter Description</p>
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
                <strong style={{color:'#111827'}}>"{deleteData.productName}"</strong> ?
              </p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-blue" onClick={confirmDelete} style={{ width: '100%', background: '#2563EB' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}