const express = require('express');
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router({ mergeParams: true }); // so :id from productRoutes is available

// Nested under /api/products/:id/reviews
router.get('/',    getReviews);
router.post('/',   auth, addReview);

// Standalone delete (review ID)
router.delete('/:reviewId', auth, deleteReview);

module.exports = router;
