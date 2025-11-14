const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required'),
  body('variants')
    .isArray({ min: 1 })
    .withMessage('At least one variant is required'),
  body('variants.*.size')
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'])
    .withMessage('Invalid size'),
  body('variants.*.color')
    .trim()
    .notEmpty()
    .withMessage('Color is required'),
  body('variants.*.stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('variants.*.sku')
    .trim()
    .notEmpty()
    .withMessage('Variant SKU is required')
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
];

// Routes
router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);

router.post(
  '/',
  protect,
  admin,
  upload.array('productImages', 10),
  handleMulterError,
  productValidation,
  createProduct
);

router.put(
  '/:id',
  protect,
  admin,
  upload.array('productImages', 10),
  handleMulterError,
  updateProduct
);

router.delete('/:id', protect, admin, deleteProduct);

router.post('/:id/reviews', protect, reviewValidation, addReview);

module.exports = router;