const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ============================================================================
// MONGOOSE SCHEMAS AND MODELS - CATEGORY-SPECIFIC
// ============================================================================

// Universal Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// [CATEGORY-SPECIFIC SCHEMAS - ADD BASED ON BUSINESS TYPE]

// Coffee Shop: Order Schema
const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  items: [{ name: String, quantity: Number, price: Number }],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'received' }
});
const Order = mongoose.model('Order', orderSchema);

// ============================================================================
// API ROUTES
// ============================================================================

// Universal Contact Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) {
    console.error('Contact API Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Get all contacts (admin route)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ submittedAt: -1 })
      .limit(50);
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
  }
});

// Coffee Shop: Orders
app.post('/api/orders', async (req, res) => {
  try {
    const { name, email, phone, items } = req.body;
    if (!name || !email || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }
    let total = 0;
    items.forEach(it => {
      const price = parseFloat(it.price) || 0;
      const qty = parseInt(it.quantity, 10) || 1;
      total += price * qty;
    });
    const order = new Order({ name, email, phone, items, total });
    await order.save();
    res.status(201).json({ success: true, message: 'Order placed! We will contact you shortly.' });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

// ============================================================================
// SERVE STATIC FILES FROM PUBLIC DIRECTORY
// ============================================================================
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all route for SPA-style routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ============================================================================
// MONGODB CONNECTION AND SERVER START
// ============================================================================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });