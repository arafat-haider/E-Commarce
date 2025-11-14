const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const addToCartValidation = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('size')
    .notEmpty()
    .withMessage('Size is required')
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'])
    .withMessage('Invalid size'),
  body('color')
    .trim()
    .notEmpty()
    .withMessage('Color is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

const updateCartValidation = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('size')
    .notEmpty()
    .withMessage('Size is required'),
  body('color')
    .trim()
    .notEmpty()
    .withMessage('Color is required'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be at least 0')
];

// All routes require authentication
router.use(protect);

// Routes
router.get('/count', getCartCount);
router.get('/', getCart);
router.post('/add', addToCartValidation, addToCart);
router.put('/update', updateCartValidation, updateCartItem);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;