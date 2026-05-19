import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set request timeout
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(408).json({ error: 'Request timeout' });
  });
  next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Jalzi MERN Server is running smoothly! 🚀💧' });
});

// Connect to MongoDB asynchronously
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jalzi';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Database! 🍃🔌');
  })
  .catch((err) => {
    console.error('MongoDB database connection error 🛑:', err.message);
    console.log('Ensure local MongoDB is running, or paste a custom cloud Atlas MONGO_URI in server/.env');
  });

// Listen Immediately
app.listen(PORT, () => {
  console.log(`Jalzi MERN Server listening on: http://localhost:${PORT} 📡✅`);
});
