import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products', message: error.message });
  }
});

// POST a new product or update existing
router.post('/', async (req, res) => {
  const { name, displayName, price, badge, features } = req.body;
  try {
    const product = await Product.findOneAndUpdate(
      { name },
      { displayName, price, badge, features },
      { new: true, upsert: true }
    );
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create or update product', message: error.message });
  }
});

export default router;
