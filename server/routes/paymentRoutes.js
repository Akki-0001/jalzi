import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

router.post('/orders', async (req, res) => {
  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Razorpay payment gateway is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env.' });
  }

  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid payment amount' });
  }

  try {
    const requestBody = {
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.description || 'Failed to create Razorpay order', details: data });
    }

    res.status(201).json({ ...data, keyId });
  } catch (error) {
    res.status(500).json({ error: 'Payment gateway request failed', message: error.message });
  }
});

export default router;
