const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price images isActive'
      });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          items: []
        }
      });
    }

    // Filter out inactive products
    wishlist.items = wishlist.items.filter(item => item.product && item.product.isActive);
    
    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }

    // Check if item already exists in wishlist
    const existingItemIndex = wishlist.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      return res.status(400).json({
        success: false,
        message: 'Item already in wishlist'
      });
    } else {
      // Add new item
      wishlist.items.push({
        product: productId
      });
    }

    await wishlist.save();
    await wishlist.populate({
        path: 'items.product',
        select: 'name price images isActive'
      });

    res.status(200).json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/remove
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Remove item from wishlist
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate({
        path: 'items.product',
        select: 'name price images isActive'
      });

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};