import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config({ override: true });

const initialProducts = [
  {
    name: '500ml',
    displayName: '500ml Bottle',
    price: 10,
    badge: '🔥 Popular',
    features: ['✓ Pure RO', '✓ BPA Free', '✓ Mineral Rich']
  },
  {
    name: '1L',
    displayName: '1L Bottle',
    price: 20,
    badge: '⭐ Best Value',
    features: ['✓ Pure RO', '✓ BPA Free', '✓ Balanced pH']
  },
  {
    name: '5L',
    displayName: '5L Can',
    price: 40,
    badge: '🏠 Family Pack',
    features: ['✓ Pure RO', '✓ Easy Pour', '✓ Eco Friendly']
  },
  {
    name: '20L',
    displayName: '20L Jar',
    price: 110,
    badge: '💼 Office Special',
    features: ['✓ Pure RO', '✓ Jar Compatible', '✓ Best Price']
  }
];

const seedDatabase = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jalzi';
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB!');

    // 1. Clear existing products & seed
    await Product.deleteMany({});
    console.log('Cleared existing products.');
    await Product.insertMany(initialProducts);
    console.log('Initial products seeded successfully! 💧🌱');

    // 2. Clear existing admin & seed new default admin
    await User.deleteMany({ role: 'admin' });
    console.log('Cleared existing admin accounts.');

    const adminPasswordHash = await bcrypt.hash('Admin@Jalzi123', 10);
    const adminUser = new User({
      fullName: 'Jalzi Administrator',
      email: 'admin@jalzi.com',
      phone: '9999999999',
      password: adminPasswordHash,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Default Admin Account seeded successfully! 👑🔑 (ID: admin@jalzi.com / PW: Admin@Jalzi123)');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding 🛑:', error);
    process.exit(1);
  }
};

seedDatabase();
