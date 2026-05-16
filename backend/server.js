require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

// Import Auth Routes
const loginRoute = require('./Loginpage');
const otpRoute = require('./Otppage');
const signupRoute = require('./Signuppage');
const addNewProductRoute = require('./AddNewProduct');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/add-product', addNewProductRoute);
app.use('/api/login', loginRoute);
app.use('/api/otp', otpRoute);
app.use('/api/signup', signupRoute);
app.use('/api/profile', require('./Profilepage'));

// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/productr')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
