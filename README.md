# Productr E-Commerce Platform

🌐 **Live Demo (Frontend):** [https://prashantmeen03.github.io/Productr-web/](https://prashantmeen03.github.io/Productr-web/)

*(Note: The GitHub Pages demo hosts the frontend only. For full functionality, you will need to run the Node.js backend locally alongside it).*

A full-stack e-commerce dashboard featuring a dynamic Vite + React frontend and a Node.js + Express backend using MongoDB.

## 🛠️ Required Environment Variables

Before starting the backend server, create a `.env` file in the `backend/` directory with the following variables.

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/productr

# Authentication Secret
JWT_SECRET=your_jwt_secret_here

# (Optional) Email Configuration for Email OTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# (Optional) Twilio Configuration for SMS OTP
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```
*(Note: If email or SMS variables are missing, the backend will log the mock OTP in the terminal for testing purposes).*

---

## 🚀 How to Run the Backend

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Node.js server:
   ```bash
   node server.js
   ```
   *The backend should now be running on `http://localhost:5000/` and successfully connected to MongoDB.*

---

## 💻 How to Run the Frontend

1. Open a new, separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will launch (usually on `http://localhost:5173/` or `http://localhost:5174/`). You can open the provided link in your browser to start using the app.*

---

## ✨ Key Features
- **OTP Authentication**: Generate and verify OTP via SMS or Email using JWTs for persistent sessions.
- **Product Management (CRUD)**: Create, read, edit, publish, unpublish, and delete products dynamically.
- **Interactive UI**: Fully synchronized Home and Products dashboard that updates intuitively without full page reloads.
- **Profile Management**: Base64 local profile image uploading and profile detail updating.
