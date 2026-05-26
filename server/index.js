const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PI_HORIZON = 'https://api.mainnet.minepi.com';
const PI_API_KEY = process.env.PI_API_KEY || '';
const WHALE_THRESHOLD = 500;

// Approve payment
app.post('/api/payments/approve', async (req, res) => {
  const { paymentId } = req.body;
  try {
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Approve error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Complete payment
app.post('/api/payments/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  try {
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      { txid },
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Complete error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get whale transactions
app.get('/api/whales', async (req, res) => {
  try {
    const response = await axios.get(`${PI_HORIZON}/payments?order=desc&limit=200`);
    const payments = response.data._embedded.records;
    const whales = payments
      .filter(p => p.type === 'payment' && parseFloat(p.amount) >= WHALE_THRESHOLD)
      .map(p => ({
        id: p.id, from: p.from, to: p.to,
        amount: parseFloat(p.amount),
        date: p.created_at, txHash: p.transaction_hash
      }));
    res.json({ whales });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get wallet transactions
app.get('/api/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const response = await axios.get(
      `${PI_HORIZON}/accounts/${address}/payments?limit=50&order=desc`,
      { timeout: 10000 }
    );
    res.json(response.data._embedded.records);
  } catch (error) {
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Wallet not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
