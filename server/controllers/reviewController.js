const mongoose = require('mongoose');
const Review = require('../models/Review');
const Order = require('../models/Order');

const getReviews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const reviews = await Review.find({ productId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      avgRating: parseFloat(avgRating.toFixed(1)),
      count: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    if (comment && comment.length > 500) {
      return res.status(400).json({ error: 'Comment cannot be more than 500 characters.' });
    }

    const hasPurchased = await Order.findOne({
      userId,
      paymentStatus: 'Paid',
      orderStatus: { $ne: 'Cancelled' },
      'cartItems.productId': productId,
    });

    if (!hasPurchased) {
      return res.status(403).json({ error: 'You can review only products you have paid for.' });
    }

    const review = await Review.findOneAndUpdate(
      { userId, productId },
      {
        rating: numericRating,
        comment: comment?.trim() || '',
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    await review.populate('userId', 'name');

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID.' });
    }

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    const isOwner = review.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this review.' });
    }

    await review.deleteOne();

    res.json({ message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getReviews, addReview, deleteReview };