import db from '../config/firebase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getDocumentById, getDocumentByField } from '../services/firestoreService.js';

export const getCategories = async (req, res, next) => {
  try {
    const snapshot = await db.collection('categories').get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return successResponse(res, categories, 'Categories retrieved');
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let category = await getDocumentByField('categories', 'slug', slug);

    if (!category) {
      category = await getDocumentById('categories', slug);
    }

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    return successResponse(res, category, 'Category retrieved');
  } catch (error) {
    next(error);
  }
};
