import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './LoginPage';
import SignupPage from './SignupPage';
import OtpLogin from './OtpLogin';
import ErrorPage from './ErrorPage';
import HomePage from './HomePage';
import ProductsPage from './ProductsPage';
import AddNewProductPage from './AddNewProductPage';
import Profilepage from './Profilepage';
import ProductDetails from './ProductDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp" element={<OtpLogin />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductDetails />} />
          <Route path="/add-product" element={<AddNewProductPage />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/product-details" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
