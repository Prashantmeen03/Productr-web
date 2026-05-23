// 🟢 ONE PLACE TO CHANGE BACKEND URL
// For Local Development: "http://localhost:5000"
// For Render (Unified): ""
// For Render (Separate): "https://productr-web.onrender.com"

export const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000" 
  : "https://productr-web.onrender.com";






