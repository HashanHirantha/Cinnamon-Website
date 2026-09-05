import db from '../../config/firebase.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { getDocumentById, createDocument, updateDocument, deleteDocument } from '../../services/firestoreService.js';

export const getAdminCategories = async (req, res, next) => {
  try {
    const snapshot = await db.collection('categories').get();
    const categories = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Count products per category
    const productsSnap = await db.collection('products').get();
    const products = productsSnap.docs.map((d) => d.data());

    const enriched = categories.map((cat) => ({
      ...cat,
      productCount: products.filter((p) => p.category?.toLowerCase() === cat.slug?.toLowerCase()).length,
    }));

    return successResponse(res, enriched, 'Categories retrieved');
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image } = req.body;

    if (!name) {
      return errorResponse(res, 'Category name is required', 400);
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newCat = await createDocument('categories', {
      name: name.trim(),
      slug: cleanSlug,
      description: description ? description.trim() : '',
      image: image || '',
      productCount: 0,
    }, cleanSlug);

    return successResponse(res, newCat, 'Category created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateDocument('categories', id, req.body);

    if (!updated) {
      return errorResponse(res, 'Category not found', 404);
    }

    return successResponse(res, updated, 'Category updated');
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteDocument('categories', id);

    if (!success) {
      return errorResponse(res, 'Category not found', 404);
    }

    return successResponse(res, { id }, 'Category deleted');
  } catch (error) {
    next(error);
  }
};
