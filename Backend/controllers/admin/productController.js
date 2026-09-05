import db from '../../config/firebase.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getDocumentById, createDocument, updateDocument, deleteDocument } from '../../services/firestoreService.js';

export const getAdminProducts = async (req, res, next) => {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query;

    const snapshot = await db.collection('products').get();
    let products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (category && category !== 'all') {
      products = products.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.origin?.toLowerCase().includes(q)
      );
    }

    if (status === 'in_stock') {
      products = products.filter((p) => (p.stock || 0) > 0);
    } else if (status === 'out_of_stock') {
      products = products.filter((p) => (p.stock || 0) === 0);
    } else if (status === 'low_stock') {
      products = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 15);
    }

    products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = products.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const paginatedItems = products.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return paginatedResponse(res, paginatedItems, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

export const getAdminProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getDocumentById('products', id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, product, 'Product retrieved');
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      shortDescription,
      description,
      category,
      price,
      originalPrice,
      weight,
      origin,
      image,
      images = [],
      ingredients,
      processing,
      shipping,
      stock = 0,
      badge,
      featured = false,
      tags = [],
    } = req.body;

    if (!name || !price || !category) {
      return errorResponse(res, 'Product name, price, and category are required', 400);
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const stockNum = parseInt(stock, 10) || 0;

    const newProduct = await createDocument('products', {
      name: name.trim(),
      slug: generatedSlug,
      shortDescription: shortDescription ? shortDescription.trim() : '',
      description: description ? description.trim() : '',
      category: category.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      weight: weight || '100g',
      origin: origin || 'Southern Sri Lanka',
      image: image || '',
      images: Array.isArray(images) ? images : [image].filter(Boolean),
      ingredients: ingredients || '100% Pure Ceylon Cinnamon',
      processing: processing || 'Traditional hand-crafted',
      shipping: shipping || 'Standard shipping applies',
      rating: 5.0,
      reviewCount: 0,
      stock: stockNum,
      inStock: stockNum > 0,
      badge: badge || '',
      featured: !!featured,
      tags: Array.isArray(tags) ? tags : [],
    }, generatedSlug);

    return successResponse(res, newProduct, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getDocumentById('products', id);

    if (!existing) {
      return errorResponse(res, 'Product not found', 404);
    }

    const updates = { ...req.body };
    if (updates.stock !== undefined) {
      updates.stock = parseInt(updates.stock, 10) || 0;
      updates.inStock = updates.stock > 0;
    }
    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }
    if (updates.originalPrice !== undefined) {
      updates.originalPrice = updates.originalPrice ? Number(updates.originalPrice) : null;
    }

    const updated = await updateDocument('products', id, updates);
    return successResponse(res, updated, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteDocument('products', id);

    if (!success) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, { id }, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return errorResponse(res, 'Stock quantity is required', 400);
    }

    const stockNum = Math.max(0, parseInt(quantity, 10));
    const updated = await updateDocument('products', id, {
      stock: stockNum,
      inStock: stockNum > 0,
    });

    if (!updated) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, updated, 'Stock updated successfully');
  } catch (error) {
    next(error);
  }
};
