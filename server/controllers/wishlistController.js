const User = require('../models/User');

// GET /api/wishlist — returns full product objects for the user's wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/wishlist/:productId — add product to wishlist (idempotent)
const addToWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: req.params.productId } },
      { new: true }
    ).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/wishlist/:productId — remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: req.params.productId } },
      { new: true }
    ).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
