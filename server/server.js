const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Connect Database
connectDB();

// Mount Modules
app.use('/api/auth',     require('./modules/auth/auth.routes'));
app.use('/api/services', require('./modules/services/services.routes'));
app.use('/api/bookings', require('./modules/bookings/bookings.routes'));
app.use('/api/payment',  require('./modules/payment/payment.routes'));
app.use('/api/admin',    require('./modules/admin/admin.routes'));
app.use('/api/products', require('./modules/products/products.routes'));
app.use('/api/queries',  require('./modules/queries/queries.routes'));

// Health check
app.get('/', (req, res) => res.json({ message: '✅ Your Helper API Running', version: '2.0', architecture: 'Modular Monolith' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
