import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './LoginPage';
import SignupPage from './SignupPage';
import OtpLogin from './OtpLogin';
import HomePage from './HomePage';
import AddNewProductPage from './AddNewProductPage';
import Profilepage from './Profilepage';
import Productspage from './Productspage';
import ProductDetails from './ProductDetails';
import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", background: "#fee2e2", color: "#991b1b", fontFamily: "monospace", minHeight: "100vh" }}>
          <h2>React Rendering Error Caught:</h2>
          <pre style={{ fontSize: "16px", margin: "20px 0", whiteSpace: "pre-wrap" }}>{this.state.error?.toString()}</pre>
          <pre style={{ fontSize: "12px", whiteSpace: "pre-wrap", color: "#7f1d1d" }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp" element={<OtpLogin />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<Productspage />} />
          <Route path="/add-product" element={<AddNewProductPage />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/product-details" element={<ProductDetails />} />
        </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
