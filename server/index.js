const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PI_HORIZON = 'https://api.mainnet.minepi.com';
const WHALE_THRESHOLD = 500;

// Get whale transactions
app.get('/api/whales', async (req, res) => {
  try {
    const response = await axios.get(
      `${PI_HORIZON}/payments?order=desc&limit=200`
    );
    const payments = response.data._embedded.records;
    const whales = payments
      .filter(p => p.type === 'payment' && parseFloat(p.amount) >= WHALE_THRESHOLD)
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
    console.error('Whales error:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get wallet transactions
app.get('/api/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    console.log('Looking up wallet:', address);
    
    const response = await axios.get(
      `${PI_HORIZON}/accounts/${address}/payments?limit=50&order=desc`,
      { timeout: 10000 }
    );
    
    const records = response.data._embedded.records;
    console.log('Found records:', records.length);
    res.json(records);
  } catch (error) {
    console.error('Wallet error:', error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Wallet not found on Pi blockchain' });
    } else {
      res.status(500).json({ error: 'Failed to fetch wallet: ' + error.message });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
