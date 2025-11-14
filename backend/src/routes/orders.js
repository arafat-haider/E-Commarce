const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  updateOrderToPaid,
  getAllOrders,
  cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('paymentMethod')
    .isIn(['stripe', 'paypal', 'cod'])
    .withMessage('Invalid payment method')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('trackingNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tracking number cannot be empty')
];

// All routes require authentication
router.use(protect);

// Routes
router.post('/', createOrderValidation, createOrder);
router.get('/', getMyOrders);
router.get('/admin/all', admin, getAllOrders);
router.get('/:id', getOrder);
router.put('/:id/status', admin, updateStatusValidation, updateOrderStatus);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/cancel', cancelOrder);

module.exports = router;