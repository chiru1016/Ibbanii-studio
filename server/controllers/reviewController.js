const Review = require('../models/Review');
const Order  = require('../models/Order');

// GET /api/products/:id/reviews — public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, avgRating: parseFloat(avgRating.toFixed(1)), count: reviews.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/products/:id/reviews — auth required; must have purchased the product
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId    = req.user._id;

    // Check if user has a non-cancelled order that contains this product
    const hasPurchased = await Order.findOne({
      userId,
      orderStatus: { $nin: ['Cancelled'] },
      'cartItems.productId': productId,
    });

    if (!hasPurchased) {
      return res.status(403).json({ error: 'You can only review products you have purchased.' });
    }

    // Upsert: if they already reviewed, update it
    const review = await Review.findOneAndUpdate(
      { userId, productId },
      { rating, comment },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Populate name for the response
    await review.populate('userId', 'name');
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/reviews/:reviewId — own review or admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    const isOwner = review.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getReviews, addReview, deleteReview };
