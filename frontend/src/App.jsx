import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './LoginPage';
import OtpLogin from './OtpLogin';
import OtpEntered from './OtpEntered';
import ErrorPage from './ErrorPage';
import HomePage from './HomePage';
import ProductsPage from './ProductsPage';
import AddNewProductPage from './AddNewProductPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/otp" element={<OtpLogin />} />
          <Route path="/otp-entered" element={<OtpEntered />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/add-product" element={<AddNewProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
