const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PI_HORIZON = 'https://api.mainnet.minepi.com';
const WHALE_THRESHOLD = 500; // minimum Pi to be a whale

// Get recent large transactions
app.get('/api/whales', async (req, res) => {
  try {
    const response = await axios.get(
      `${PI_HORIZON}/payments?order=desc&limit=200`
    );

    const payments = response.data._embedded.records;

    // Filter only whale-sized transactions
    const whales = payments
      .filter(p => p.type === 'payment' && 
                   parseFloat(p.amount) >= WHALE_THRESHOLD)
      .map(p => ({
        id: p.id,
        from: p.from,
        to: p.to,
        amount: parseFloat(p.amount),
        date: p.created_at,
        txHash: p.transaction_hash
      }));

    res.json({ whales });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get specific wallet activity
app.get('/api/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const response = await axios.get(
      `${PI_HORIZON}/accounts/${address}/payments?limit=50&order=desc`
    );
    res.json(response.data._embedded.records);
  } catch (error) {
    res.status(500).json({ error: 'Wallet not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));