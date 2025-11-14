const express = require('express');
const { body } = require('express-validator');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const wishlistValidation = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID')
];

// All routes require authentication
router.use(protect);

// Routes
router.get('/', getWishlist);
router.post('/add', wishlistValidation, addToWishlist);
router.delete('/remove', wishlistValidation, removeFromWishlist);

module.exports = router;