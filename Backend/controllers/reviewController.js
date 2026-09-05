import db from '../config/firebase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { createDocument, getDocumentById, updateDocument } from '../services/firestoreService.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const snapshot = await db.collection('reviews')
      .where('productId', '==', productId)
      .where('status', '==', 'approved')
      .get();

    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    reviews.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

    return successResponse(res, reviews, 'Reviews retrieved');
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return errorResponse(res, 'Product ID, rating, and comment are required', 400);
    }

    const product = await getDocumentById('products', productId);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const review = await createDocument('reviews', {
      productId,
      productName: product.name,
      userId: req.user ? req.user.id : null,
      author: req.user ? req.user.name : (req.body.author || 'Anonymous Guest'),
      location: req.user ? req.user.country : (req.body.location || 'Verified Buyer'),
      rating: Number(rating),
      title: title ? title.trim() : '',
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: !!req.user,
      status: 'approved',
    });

    // Update product average rating & review count
    const allReviewsSnap = await db.collection('reviews')
      .where('productId', '==', productId)
      .where('status', '==', 'approved')
      .get();

    const allReviews = allReviewsSnap.docs.map((d) => d.data());
    const count = allReviews.length;
    const avgRating = count > 0 
      ? Number((allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / count).toFixed(1))
      : Number(rating);

    await updateDocument('products', productId, {
      rating: avgRating,
      reviewCount: count,
    });

    return successResponse(res, review, 'Review submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};
