const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

// Routes
router.get('/admin/stats', getDashboardStats);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;