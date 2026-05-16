import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './LoginPage';
import SignupPage from './SignupPage';
import OtpLogin from './OtpLogin';
import HomePage from './HomePage';
import AddNewProductPage from './AddNewProductPage';
import Profilepage from './Profilepage';
import Productpage from './Productpage';
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
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<Productpage />} />
          <Route path="/add-product" element={<AddNewProductPage />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/product-details" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
