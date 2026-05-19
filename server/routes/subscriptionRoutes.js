import express from 'express';
import Subscription from '../models/Subscription.js';

const router = express.Router();

// POST / - Create a customer subscription
router.post('/', async (req, res) => {
  const { customer, plan, price } = req.body;

  if (!customer || !plan || !price) {
    return res.status(400).json({ error: 'Customer billing details, plan name, and price are required.' });
  }

  try {
    // Generate unique Subscription ID (e.g. SUB928371)
    const subscriptionId = 'SUB' + Math.floor(100000 + Math.random() * 900000);

    const newSubscription = new Subscription({
      subscriptionId,
      customer,
      plan,
      price,
      status: 'Active'
    });

    const savedSubscription = await newSubscription.save();
    res.status(201).json(savedSubscription);

  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription', message: error.message });
  }
});

// GET / - Retrieve all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions', message: error.message });
  }
});

// PATCH /:id/status - Update subscription status (Active, Paused, Cancelled)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Active', 'Paused', 'Cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid subscription status value.' });
  }

  try {
    const updatedSub = await Subscription.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return updated doc
    );

    if (!updatedSub) {
      return res.status(404).json({ error: 'Subscription not found.' });
    }

    res.json(updatedSub);

  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscription status', message: error.message });
  }
});

export default router;
