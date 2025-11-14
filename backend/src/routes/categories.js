const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent category ID')
];

// Routes
router.get('/', getCategories);
router.get('/:id', getCategory);

router.post(
  '/',
  protect,
  admin,
  upload.single('categoryImage'),
  handleMulterError,
  categoryValidation,
  createCategory
);

router.put(
  '/:id',
  protect,
  admin,
  upload.single('categoryImage'),
  handleMulterError,
  updateCategory
);

router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;