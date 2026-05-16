import { API_URL } from './config';
import logoImg from "./assets/img/logo.svg";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Home, ShoppingBag, ChevronDown, Plus, Trash2, X } from "lucide-react";
import axios from "axios";

export default function Productpage() {
  const navigate = useNavigate();
  const profileImage = localStorage.getItem("profileImage") || "https://i.pravatar.cc/150";

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const displayedProducts = products.filter(p => 
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="productr-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: '#fff' }}>
      <style>{`
        .sidebar { background: #1D222B; color: #9aa4b2; padding: 20px; display: flex; flex-direction: column; gap: 30px; }
        .logo-box img { height: 28px; }
        .search-box { background: #2a3243; border-radius: 8px; display: flex; align-items: center; padding: 8px 12px; gap: 8px; }
        .search-box input { background: transparent; border: none; color: #fff; outline: none; width: 100%; font-size: 14px; }
        .nav-list { display: flex; flex-direction: column; gap: 10px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.2s; }
        .nav-item:hover { background: #2a3243; color: #fff; }
        .nav-item.active { background: #2a3243; color: #fff; font-weight: 500; }
        
        .main-view { display: flex; flex-direction: column; }
        .top-nav { height: 64px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .page-indicator { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151; font-weight: 500; }
        
        .empty-view { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding-bottom: 100px; }
        .icon-grid { width: 80px; height: 80px; position: relative; margin-bottom: 24px; }
        .box { width: 24px; height: 24px; border: 4px solid #101b8c; border-radius: 4px; position: absolute; }
        .tl { top: 0; left: 0; }
        .tr { top: 0; right: 0; }
        .bl { bottom: 0; left: 0; }
        .plus { position: absolute; bottom: 0; right: 0; color: #101b8c; }
        
        .empty-title { font-size: 32px; font-weight: 700; color: #374151; margin-bottom: 12px; }
        .empty-desc { color: #9ca3af; font-size: 16px; line-height: 1.5; margin-bottom: 32px; }
        .add-btn { background: #101b8c; color: #fff; padding: 14px 48px; border-radius: 10px; border: none; font-weight: 600; font-size: 16px; cursor: pointer; transition: 0.2s; }
        .add-btn:hover { background: #0a126b; transform: scale(1.02); }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; padding: 32px; }
        .product-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
        .p-img { width: 100%; height: 200px; object-fit: contain; border-radius: 8px; background: #f9fafb; margin-bottom: 16px; }
        .p-name { font-weight: 600; font-size: 18px; margin-bottom: 12px; }
        .p-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; }
        .p-label { color: #6b7280; }
        .p-val { color: #111827; font-weight: 500; }
      `}</style>

      <aside className="sidebar">
        <div className="logo-box"><img src={logoImg} alt="Productr" /></div>
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <nav className="nav-list">
          <div className="nav-item" onClick={() => navigate('/home')}><Home size={20} /> Home</div>
          <div className="nav-item active"><ShoppingBag size={20} /> Products</div>
        </nav>
      </aside>

      <main className="main-view">
        <header className="top-nav">
          <div className="page-indicator"><ShoppingBag size={18} /> Products</div>
          <div className="user-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <img src={profileImage} alt="user" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          </div>
        </header>

        <div className="content-area" style={{ flex: 1, overflowY: 'auto' }}>
          {displayedProducts.length > 0 ? (
            <div className="products-grid">
              {displayedProducts.map(p => (
                <div key={p._id} className="product-card">
                  <img className="p-img" src={p.images?.[0] || "https://via.placeholder.com/150"} alt={p.productName} />
                  <div className="p-name">{p.productName}</div>
                  <div className="p-row"><span className="p-label">Type</span><span className="p-val">{p.productType}</span></div>
                  <div className="p-row"><span className="p-label">Brand</span><span className="p-val">{p.brandName}</span></div>
                  <div className="p-row"><span className="p-label">Price</span><span className="p-val">₹{p.sellingPrice}</span></div>
                  <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                    <button onClick={() => togglePublish(p)} style={{ flex: 1, padding: 8, borderRadius: 6, border: 'none', background: p.isPublished ? '#22c55e' : '#101b8c', color: '#fff', cursor: 'pointer' }}>{p.isPublished ? 'Unpublish' : 'Publish'}</button>
                    <button onClick={() => handleEditClick(p)} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteClick(p)} style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-view">
              <div className="icon-grid">
                <div className="box tl"></div>
                <div className="box tr"></div>
                <div className="box bl"></div>
                <div className="plus"><Plus size={36} strokeWidth={3} /></div>
              </div>
              <h1 className="empty-title">Feels a little empty over here...</h1>
              <p className="empty-desc">
                You can create products without connecting store<br />
                you can add products to store anytime
              </p>
              <button className="add-btn" onClick={() => navigate('/add-product')}>Add your Products</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
