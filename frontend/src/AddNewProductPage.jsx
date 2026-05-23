import { API_URL } from './config';
import logoImg from "./assets/img/logo.svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Search,
  ChevronDown,
  X,
  Plus
} from "lucide-react";
import axios from "axios";

export default function AddNewProductPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    productName: "",
    productType: "Foods",
    quantityStock: "",
    mrp: "",
    sellingPrice: "",
    brandName: "",
    returnEligibility: "Yes",
    images: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    })).then(imagesBase64 => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imagesBase64]
      }));
    });
  };

  const handleCreate = async () => {
    let newErrors = {};
    if (!formData.productName) newErrors.productName = true;
    if (!formData.productType) newErrors.productType = true;
    if (!formData.quantityStock) newErrors.quantityStock = true;
    if (!formData.mrp) newErrors.mrp = true;
    if (!formData.sellingPrice) newErrors.sellingPrice = true;
    if (!formData.brandName) newErrors.brandName = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fill in all required fields: " + Object.keys(newErrors).map(k => {
        if (k === "productName") return "Product Name";
        if (k === "productType") return "Product Type";
        if (k === "quantityStock") return "Quantity Stock";
        if (k === "mrp") return "MRP";
        if (k === "sellingPrice") return "Selling Price";
        if (k === "brandName") return "Brand Name";
        return k;
      }).join(", "));
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/products`, {
        ...formData,
        quantityStock: Number(formData.quantityStock),
        mrp: Number(formData.mrp),
        sellingPrice: Number(formData.sellingPrice)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      navigate("/products", { state: { showSuccessToast: true } });
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Failed to add product: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *{ margin:0; padding:0; box-sizing:border-box; font-family:Arial, Helvetica, sans-serif; }
        html, body, #root{ width:100%; min-height:100vh; background:#FFFFFF; overflow-x: hidden; }
        .homepage{ width:100%; min-height:100vh; display:grid; grid-template-columns: minmax(220px, 240px) 1fr; background:#FFFFFF; }
        .sidebar{ background:#1D222B; color:#fff; border-right:1px solid #2a3447; display:flex; flex-direction:column; }
        .logo-box{ height:64px; padding:20px 24px; border-bottom:1px solid #2a3447; display:flex; align-items:center; }
        .logo-img{ height:24px; }
        .search-wrapper{ padding:16px; }
        .search-box{ width:100%; height:44px; background:#2a3243; border-radius:10px; display:flex; align-items:center; gap:10px; padding:0 14px; color:#9aa4b2; }
        .search-box input{ width:100%; border:none; outline:none; background:transparent; color:#fff; font-size:14px; }
        .nav-links{ padding:10px; display:flex; flex-direction:column; gap:6px; }
        .nav-btn{ width:100%; height:48px; border:none; border-radius:10px; background:transparent; color:#9aa4b2; display:flex; align-items:center; gap:12px; padding:0 16px; font-size:15px; cursor:pointer; transition:0.3s; }
        .nav-btn:hover{ background:#2a3243; color:#fff; }
        .nav-btn.active{ background:#2a3243; color:#fff; }
        .main-content{ width:100%; display:flex; flex-direction:column; position:relative; height: 100vh; overflow-y: auto; }
        .topbar{ width:100%; height:64px; border-bottom:1px solid #E5E7EB; display:flex; justify-content:space-between; align-items:center; padding:0 30px; flex-shrink: 0; }
        .profile-box{ display:flex; align-items:center; gap:10px; cursor:pointer; }
        .profile-img{ width:38px; height:38px; border-radius:50%; object-fit:cover; }
        .empty-state{ flex:1; display:flex; justify-content:center; align-items:center; padding:40px; }
        .empty-content{ text-align:center; }
        .icon-wrapper{ width:90px; height:90px; margin:0 auto 30px; position:relative; }
        .square{ width:28px; height:28px; border:5px solid #101b8c; border-radius:6px; position:absolute; }
        .top-left{ top:0; left:0; }
        .top-right{ top:0; right:0; }
        .bottom-left{ bottom:0; left:0; }
        .plus-icon{ position:absolute; right:0; bottom:0; color:#101b8c; }
        .empty-content h2{ font-size:clamp(28px,4vw,42px); color:#374151; margin-bottom:18px; font-weight:700; }
        .empty-content p{ color:#b0b7c3; font-size:clamp(15px,2vw,18px); line-height:1.7; }
        .add-product-btn { margin-top: 30px; padding: 14px 40px; background: #101b8c; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; transition: 0.2s; }
        .add-product-btn:hover { background: #0a1366; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(141, 150, 173, 0.7); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .modal-content { width: 470px; background: white; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
        .modal-header h2 { font-size: 24px; font-weight: 500; color: #374151; }
        .modal-body { padding: 24px; max-height: 75vh; overflow-y: auto; }
        .form-group-modal { margin-bottom: 20px; }
        .form-group-modal label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #374151; }
        .form-group-modal input, .form-group-modal select { width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; outline: none; }
        .form-group-modal input:focus, .form-group-modal select:focus { border-color: #3b82f6; }
        .upload-box { border: 1px dashed #d1d5db; border-radius: 8px; padding: 32px; text-align: center; color: #6b7280; position: relative; }
        .modal-footer { border-top: 1px solid #e5e7eb; padding: 20px 24px; display: flex; justify-content: flex-end; }
        .btn-create { background: #2438F5; color: white; padding: 12px 32px; border-radius: 8px; font-weight: 500; border: none; cursor: pointer; }
        .btn-create:hover { background: #1828d9; }
        @media(max-width:992px){ .homepage{ grid-template-columns:1fr; } .sidebar{ width:100%; flex-direction:row; align-items:center; justify-content:space-between; padding:10px 20px; } .logo-box{ border:none; padding:0; height:auto; } .search-wrapper{ flex:1; max-width:300px; } .nav-links{ flex-direction:row; } }
        @media(max-width:768px){ .sidebar{ flex-wrap:wrap; gap:14px; } .search-wrapper{ width:100%; max-width:100%; } .topbar{ padding:0 16px; } .empty-state{ padding:20px; } .empty-content h2{ font-size:28px; } }
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', fontWeight: '500' }}>
              <ShoppingBag size={18} />
              <span>Products</span>
            </div>
            <div className="profile-box" onClick={() => navigate('/profile')}>
              <img src={localStorage.getItem("profileImage") || "https://i.pravatar.cc/40"} alt="profile" className="profile-img" />
              <ChevronDown size={18} />
            </div>
          </header>

          {!showModal && (
            <section className="empty-state">
              <div className="empty-content">
                <div className="icon-wrapper">
                  <div className="square top-left"></div>
                  <div className="square top-right"></div>
                  <div className="square bottom-left"></div>
                  <div className="plus-icon"><Plus size={34} strokeWidth={3.5} /></div>
                </div>
                <h2>Feels a little empty over here...</h2>
                <p>You can create products without connecting store<br />you can add products to store anytime</p>
                <button className="add-product-btn" onClick={() => setShowModal(true)}>Add your Products</button>
              </div>
            </section>
          )}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Add Product</h2>
                  <button onClick={() => { setShowModal(false); navigate('/products'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <X size={24} color="#4b5563" />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group-modal">
                    <label>Product Name</label>
                    <input name="productName" value={formData.productName} onChange={handleChange} placeholder={errors.productName ? "Please enter product name" : "CakeZone Walnut Brownie"} style={{ borderColor: errors.productName ? 'red' : '#e5e7eb' }} />
                  </div>
                  <div className="form-group-modal">
                    <label>Product Type</label>
                    <select name="productType" value={formData.productType} onChange={handleChange}>
                      <option value="Foods">Foods</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group-modal">
                    <label>Quantity Stock</label>
                    <input name="quantityStock" type="number" value={formData.quantityStock} onChange={handleChange} placeholder="Total numbers of Stock available" style={{ borderColor: errors.quantityStock ? 'red' : '#e5e7eb' }} />
                  </div>
                  <div className="form-group-modal">
                    <label>MRP</label>
                    <input name="mrp" type="number" value={formData.mrp} onChange={handleChange} placeholder="0" style={{ borderColor: errors.mrp ? 'red' : '#e5e7eb' }} />
                  </div>
                  <div className="form-group-modal">
                    <label>Selling Price</label>
                    <input name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleChange} placeholder="0" style={{ borderColor: errors.sellingPrice ? 'red' : '#e5e7eb' }} />
                  </div>
                  <div className="form-group-modal">
                    <label>Brand Name</label>
                    <input name="brandName" value={formData.brandName} onChange={handleChange} placeholder="Brand" style={{ borderColor: errors.brandName ? 'red' : '#e5e7eb' }} />
                  </div>
                  <div className="form-group-modal">
                    <label>Upload Product Images</label>
                    <div className="upload-box">
                      {formData.images.length > 0 ? (
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '10px' }}>
                          {formData.images.map((img, i) => (
                            <img key={i} src={img} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} alt="product" />
                          ))}
                        </div>
                      ) : (
                        <p style={{ marginBottom: '10px' }}>No images uploaded</p>
                      )}
                      <label style={{ background: 'transparent', border: '1px solid #2563EB', color: '#2563EB', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                        Browse
                        <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                  <div className="form-group-modal">
                    <label>Exchange or return eligibility</label>
                    <select name="returnEligibility" value={formData.returnEligibility} onChange={handleChange}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-create" onClick={handleCreate} disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
