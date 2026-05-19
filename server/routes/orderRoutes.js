import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// GET all orders (newest first)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders', message: error.message });
  }
});

// POST submit a new order
router.post('/', async (req, res) => {
  const { customer, items, totalAmount, paymentMethod } = req.body;

  if (!customer || !items || items.length === 0 || !totalAmount) {
    return res.status(400).json({ error: 'Invalid order data. Missing customer details, items, or total.' });
  }

  try {
    // Generate order ID (e.g. JAL + timestamp + random suffix)
    const orderId = 'JAL' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

    const newOrder = new Order({
      orderId,
      customer,
      items,
      totalAmount,
      paymentMethod
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: 'Failed to place order in MongoDB', message: error.message });
  }
});

// PATCH update order status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['Pending', 'Out for Delivery', 'Delivered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status flag' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found in database' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order status', message: error.message });
  }
});

export default router;
