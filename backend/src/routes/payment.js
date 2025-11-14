const express = require('express');
const {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  getStripeConfig
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/config', getStripeConfig);
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;