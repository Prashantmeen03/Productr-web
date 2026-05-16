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

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/productr')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Serve Static Files (Frontend)
const path = require('path');
const fs = require('fs');
const frontendPath = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Productr API is running...');
  });
}

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

