import logoImg from "./assets/img/logo.svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Package, Search, ChevronDown, X, Plus } from "lucide-react";
import { addProduct } from "./store";

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
    images: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: false });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    ).then((imagesBase64) => {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...imagesBase64] }));
    });
  };

  const handleCreate = () => {
    const newErrors = {};
    if (!formData.productName) newErrors.productName = true;
    if (!formData.quantityStock) newErrors.quantityStock = true;
    if (!formData.mrp) newErrors.mrp = true;
    if (!formData.sellingPrice) newErrors.sellingPrice = true;
    if (!formData.brandName) newErrors.brandName = true;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      addProduct({
        ...formData,
        quantityStock: Number(formData.quantityStock),
        mrp: Number(formData.mrp),
        sellingPrice: Number(formData.sellingPrice),
      });
      navigate("/product-details");
    } catch (err) {
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *{ margin:0; padding:0; box-sizing:border-box; font-family:Arial, Helvetica, sans-serif; }
        html, body, #root{ width:100%; min-height:100vh; background:#FFFFFF; }
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
        .main-content{ width:100%; display:flex; flex-direction:column; position:relative; }
        .topbar{ width:100%; height:64px; border-bottom:1px solid #E5E7EB; display:flex; justify-content:space-between; align-items:center; padding:0 30px; }
        .profile-box{ display:flex; align-items:center; gap:10px; cursor:pointer; }
        .profile-img{ width:38px; height:38px; border-radius:50%; object-fit:cover; }
        .empty-state{ flex:1; display:flex; justify-content:center; align-items:center; padding:40px; }
        .empty-content{ text-align:center; }
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
            <button className="nav-btn" onClick={() => navigate("/home")}><Home size={18} /> Home</button>
            <button className="nav-btn active" onClick={() => navigate("/product-details")}><Package size={18} /> Products</button>
          </nav>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4b5563", fontWeight: "500" }}>
              <Package size={18} /><span>Products</span>
            </div>
            <div className="profile-box" onClick={() => navigate("/profile")}>
              <img src={localStorage.getItem("profileImage") || "https://i.pravatar.cc/40"} alt="profile" className="profile-img" />
              <ChevronDown size={18} />
            </div>
          </header>

          {!showModal && (
            <section className="empty-state">
              <div className="empty-content">
                <h2>Feels a little empty over here...</h2>
                <p>You can create products and add them to store anytime</p>
                <button style={{ marginTop: "24px", padding: "14px 40px", background: "#101b8c", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "16px", cursor: "pointer" }} onClick={() => setShowModal(true)}>
                  Add your Products
                </button>
              </div>
            </section>
          )}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Add Product</h2>
                  <button onClick={() => { setShowModal(false); navigate("/product-details"); }} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                    <X size={24} color="#4b5563" />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group-modal">
                    <label>Product Name</label>
                    <input name="productName" value={formData.productName} onChange={handleChange} placeholder={errors.productName ? "Please enter product name" : "CakeZone Walnut Brownie"} style={{ borderColor: errors.productName ? "red" : "#e5e7eb" }} />
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
                    <input name="quantityStock" type="number" value={formData.quantityStock} onChange={handleChange} placeholder={errors.quantityStock ? "Required" : "Total Stock"} style={{ borderColor: errors.quantityStock ? "red" : "#e5e7eb" }} />
                  </div>
                  <div className="form-group-modal">
                    <label>MRP</label>
                    <input name="mrp" type="number" value={formData.mrp} onChange={handleChange} placeholder={errors.mrp ? "Required" : "0"} style={{ borderColor: errors.mrp ? "red" : "#e5e7eb" }} />
                  </div>
                  <div className="form-group-modal">
                    <label>Selling Price</label>
                    <input name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleChange} placeholder={errors.sellingPrice ? "Required" : "0"} style={{ borderColor: errors.sellingPrice ? "red" : "#e5e7eb" }} />
                  </div>
                  <div className="form-group-modal">
                    <label>Brand Name</label>
                    <input name="brandName" value={formData.brandName} onChange={handleChange} placeholder={errors.brandName ? "Required" : "Brand"} style={{ borderColor: errors.brandName ? "red" : "#e5e7eb" }} />
                  </div>
                  <div className="form-group-modal">
                    <label>Upload Product Images</label>
                    <div className="upload-box" style={{ padding: "20px" }}>
                      {formData.images.length > 0 ? (
                        <div style={{ display: "flex", gap: "10px", overflowX: "auto", marginBottom: "10px" }}>
                          {formData.images.map((img, i) => (
                            <img key={i} src={img} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px", border: "1px solid #e5e7eb" }} alt="" />
                          ))}
                        </div>
                      ) : (
                        <p style={{ marginBottom: "10px" }}>Upload product photos</p>
                      )}
                      <label style={{ background: "transparent", border: "1px solid #2563EB", color: "#2563EB", fontWeight: "600", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "inline-block" }}>
                        Browse
                        <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
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
                  <button className="btn-create" onClick={handleCreate} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
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
