import db from '../../config/firebase.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { updateDocument, deleteDocument } from '../../services/firestoreService.js';

export const getAdminReviews = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const snapshot = await db.collection('reviews').get();
    let reviews = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (status && status !== 'all') {
      reviews = reviews.filter((r) => r.status === status);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      reviews = reviews.filter(
        (r) =>
          r.author?.toLowerCase().includes(q) ||
          r.productName?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q) ||
          r.title?.toLowerCase().includes(q)
      );
    }

    reviews.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));

    const total = reviews.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const paginatedItems = reviews.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return paginatedResponse(res, paginatedItems, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'pending', 'hidden', 'rejected'].includes(status)) {
      return errorResponse(res, 'Invalid review status', 400);
    }

    const updated = await updateDocument('reviews', id, { status });
    if (!updated) {
      return errorResponse(res, 'Review not found', 404);
    }

    return successResponse(res, updated, `Review status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteDocument('reviews', id);

    if (!success) {
      return errorResponse(res, 'Review not found', 404);
    }

    return successResponse(res, { id }, 'Review deleted');
  } catch (error) {
    next(error);
  }
};
