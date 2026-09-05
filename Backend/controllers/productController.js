import db from '../config/firebase.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { getDocumentById, getDocumentByField } from '../services/firestoreService.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sortBy = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const snapshot = await db.collection('products').get();
    let products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // In-memory filtering & sorting for flexible queries without requiring composite index combinations
    if (category && category !== 'all') {
      products = products.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.origin?.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (minPrice !== undefined && minPrice !== '') {
      products = products.filter((p) => p.price >= parseFloat(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      products = products.filter((p) => p.price <= parseFloat(maxPrice));
    }

    if (minRating !== undefined && minRating !== '') {
      products = products.filter((p) => (p.rating || 0) >= parseFloat(minRating));
    }

    if (inStock === 'true') {
      products = products.filter((p) => p.inStock === true && (p.stock || 0) > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    const total = products.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = products.slice(startIndex, startIndex + limitNum);

    return paginatedResponse(res, paginatedItems, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Look up by slug
    let product = await getDocumentByField('products', 'slug', slug);

    // Fallback: look up by ID
    if (!product) {
      product = await getDocumentById('products', slug);
    }

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, product, 'Product found');
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const snapshot = await db.collection('products').where('featured', '==', true).get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return successResponse(res, products, 'Featured products');
  } catch (error) {
    next(error);
  }
};
